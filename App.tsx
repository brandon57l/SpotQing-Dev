
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import FloatingActionButtons from './components/FloatingActionButtons';
import TabContent from './components/TabContent';
import MapboxMap from './components/MapboxMap';
import ContentDrawer from './components/ContentDrawer';
import {
  NAVIGATION_ITEMS,
  DEFAULT_VIEW_ID,
  MAPBOX_ACCESS_TOKEN,
  INITIAL_MAP_VIEW,
  GEOCODING_PROXIMITY,
  GEOCODING_COUNTRY,
  DEFAULT_CONTENT_DRAWER_HEIGHT_VH,
  MIN_DRAWER_HEIGHT,
  TRANSPORT_MODES,
  TRANSPORT_MODE_VALUES
} from './constants';
import { NavigationItem, MapboxFeature, ChatMessage, TravelSpot, TransportMode } from './types';
import type { Feature, LineString } from 'geojson';


interface MapViewConfig {
  center: [number, number];
  zoom: number;
  marker: [number, number] | null;
}

const App: React.FC = () => {
  const [activeViewId, setActiveViewId] = useState<string>(DEFAULT_VIEW_ID);
  const [mapViewConfig, setMapViewConfig] = useState<MapViewConfig>(INITIAL_MAP_VIEW);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<MapboxFeature[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInputValue, setChatInputValue] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const geminiChatInstance = useRef<Chat | null>(null);

  const [travelSpots, setTravelSpots] = useState<TravelSpot[]>([
    { id: 'spot1', name: 'Tokyo Skytree', description: 'Iconic communications and observation tower.', dateTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString().substring(0, 16), transportMode: 'train', coordinates: [139.8107, 35.7101] },
    { id: 'spot2', name: 'Kinkaku-ji', description: 'Zen Buddhist temple in Kyoto, covered in gold leaf.', dateTime: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().substring(0, 16), transportMode: 'bus', coordinates: [135.7292, 35.0394] },
    { id: 'spot3', name: 'Fushimi Inari Shrine', description: 'Famous for its thousands of vibrant red torii gates.', dateTime: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().substring(0, 16), transportMode: 'walk', coordinates: [135.7727, 34.9671] },
    { id: 'spot4', name: 'Tokyo Station', description: 'Central railway station.', dateTime: new Date(Date.now() + 0.5 * 24 * 3600 * 1000).toISOString().substring(0, 16), transportMode: 'train', coordinates: [139.7671, 35.6812] },
  ]);

  const [routeGeoJson, setRouteGeoJson] = useState<Feature<LineString> | null>(null);


  const [isContentDrawerOpen, setIsContentDrawerOpen] = useState<boolean>(false);
  const [contentDrawerHeight, setContentDrawerHeight] = useState<number>(
    (window.innerHeight * DEFAULT_CONTENT_DRAWER_HEIGHT_VH) / 100
  );
  const [contentDrawerPendingOpenId, setContentDrawerPendingOpenId] = useState<string | null>(null);

  const formatToLocalDateTimeString = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (!process.env.API_KEY) {
      setChatError("API_KEY is not configured for the AI Chat. Please set the API_KEY environment variable.");
      console.error("API_KEY environment variable is not set for AI Chat.");
      setChatMessages([{ id: 'initial-ai-error', text: 'AI Chat is unavailable: API Key not configured.', sender: 'ai' }]);
      return;
    }
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      geminiChatInstance.current = ai.chats.create({
        model: 'gemini-2.5-flash-preview-04-17',
        config: {
          systemInstruction: `You are a helpful and advisory travel assistant specializing in Japan. Provide concise and relevant information, and guide the user in planning their trip.
The user may provide their current travel itinerary prefixed to their message. If an itinerary is provided, use this context to tailor your responses. Render your responses using Markdown where appropriate (e.g., for lists, emphasis).

If the user expresses a desire to add a new spot to their itinerary, or if you think a spot might be a good addition based on the conversation, you should guide them through the following process:
1. Politely inquire or confirm the necessary details for the spot:
    a. Spot Name (required)
    b. Description (optional, a brief note. If not provided, use an empty string for the description value.)
    c. Date and Time (must be in YYYY-MM-DDTHH:MM format. If the user is vague, does not provide a specific time, or if you cannot confidently convert their input to this exact format, use the literal string "DATETIME_UNSPECIFIED" for this value. For example, if they say "tomorrow for dinner", use "DATETIME_UNSPECIFIED" for the dateTime value.)
    d. Transport Mode (must be one of: ${TRANSPORT_MODE_VALUES})
    e. Coordinates: You should NOT ask for coordinates. The app will handle this separately if needed.
2. After gathering these details, confirm them with the user in chat. For example: "I have the following details for the new spot: Name: [Name], Description: [Description], Date/Time: [DateTime], Transport: [TransportMode]. If this looks correct, I can add it to your itinerary. Shall I proceed and add it?"
3. If the user agrees **in the chat** to your proposal to add the spot, then your *next* response must include the following special command string on a new line:
   \`AI_ADD_SPOT::name=[The Name];;description=[The Description];;dateTime=[The Date/Time String, e.g., YYYY-MM-DDTHH:MM or DATETIME_UNSPECIFIED];;transportMode=[The Transport Mode]\`
   Replace the bracketed placeholders with the actual information. Ensure the description value is present even if empty (e.g., description=;;).
   For example: \`AI_ADD_SPOT::name=Tokyo SkyTree;;description=Tall tower with observation deck;;dateTime=2024-07-15T14:30;;transportMode=train\`
   Another example with unspecified date: \`AI_ADD_SPOT::name=Ramen Place;;description=Try shoyu ramen;;dateTime=DATETIME_UNSPECIFIED;;transportMode=walk\`
4. The conversational part of THIS specific response (the one containing the AI_ADD_SPOT command) should be **neutral and clearly state you are instructing the app to add the spot**. For example: "Understood. I'm now instructing the app to add [Spot Name] to your itinerary." or "Okay, I'm telling the app to add [Spot Name] now." The application will then provide its own confirmation in chat after adding the spot.
If the user does not agree to your proposal to add the spot, do not use the AI_ADD_SPOT command.
Keep your general answers brief and to the point unless asked for details. Use Markdown for lists, bolding, etc. if it enhances readability.`,
        }
      });
      setChatMessages([
        { id: 'initial-ai', text: 'Welcome! Ask me anything about your Japan trip. I can also help you add spots to your itinerary!', sender: 'ai' }
      ]);
    } catch (e: any) {
      console.error("Failed to initialize Gemini chat:", e);
      setChatError(`Failed to initialize AI: ${e.message}`);
      setChatMessages([{ id: 'initial-ai-error', text: `AI Chat initialization error: ${e.message}`, sender: 'ai' }]);
    }
  }, [TRANSPORT_MODE_VALUES]);

  const handleNavFabClick = useCallback((id: string) => {
    if (id === DEFAULT_VIEW_ID) {
      if (isContentDrawerOpen) {
        setIsContentDrawerOpen(false);
      }
      setActiveViewId(DEFAULT_VIEW_ID);
      setContentDrawerPendingOpenId(null);
    } else {
      if (isContentDrawerOpen && activeViewId === id) {
        setIsContentDrawerOpen(false);
        setActiveViewId(DEFAULT_VIEW_ID); 
        setContentDrawerPendingOpenId(null);
      } else if (isContentDrawerOpen && activeViewId !== id) {
        setContentDrawerPendingOpenId(id); 
        setIsContentDrawerOpen(false);     
      } else {
        setContentDrawerPendingOpenId(null);
        setActiveViewId(id);
        setIsContentDrawerOpen(true);
        setContentDrawerHeight(prevHeight => Math.max((window.innerHeight * DEFAULT_CONTENT_DRAWER_HEIGHT_VH) / 100, MIN_DRAWER_HEIGHT));
      }
    }
  }, [isContentDrawerOpen, activeViewId]);

  useEffect(() => {
    if (!isContentDrawerOpen && contentDrawerPendingOpenId) {
      const timer = setTimeout(() => {
        setActiveViewId(contentDrawerPendingOpenId);
        setIsContentDrawerOpen(true);
        setContentDrawerHeight(prevHeight => Math.max((window.innerHeight * DEFAULT_CONTENT_DRAWER_HEIGHT_VH) / 100, MIN_DRAWER_HEIGHT));
        setContentDrawerPendingOpenId(null);
      }, 150); 
      return () => clearTimeout(timer);
    }
  }, [isContentDrawerOpen, contentDrawerPendingOpenId]);

  const activeContentDetails: NavigationItem | undefined = NAVIGATION_ITEMS.find(item => item.id === activeViewId);

  const getDrawerTitle = () => {
    if (isContentDrawerOpen && activeContentDetails && activeViewId !== 'map') {
      return activeContentDetails.label;
    }
    return ""; 
  }

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const executeSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?proximity=${GEOCODING_PROXIMITY}&country=${GEOCODING_COUNTRY}&access_token=${MAPBOX_ACCESS_TOKEN}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data.features || []);
    } catch (error: any) {
      console.error("Error during search:", error);
      setSearchError(error.message || "Failed to fetch search results.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleSearchResultClick = useCallback((feature: MapboxFeature) => {
    setMapViewConfig({
      center: feature.center,
      zoom: 14,
      marker: feature.center,
    });
    setIsContentDrawerOpen(false);
    setActiveViewId(DEFAULT_VIEW_ID); 
    setContentDrawerPendingOpenId(null);
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
  }, []);

  const handleChatInputChange = useCallback((value: string) => {
    setChatInputValue(value);
  }, []);

  const handleAddTravelSpot = useCallback((newSpotData: Omit<TravelSpot, 'id'>) => {
    setTravelSpots(prevSpots => [
      ...prevSpots,
      { ...newSpotData, id: Date.now().toString() }
    ]);
  }, []);


  const handleSendChatMessage = useCallback(async () => {
    if (!chatInputValue.trim() || isChatLoading || !geminiChatInstance.current) {
        if(!geminiChatInstance.current && !chatError?.includes("API_KEY")) {
            setChatError("Chat not initialized. Please wait or refresh.");
        }
        return;
    }
    const userMessage: ChatMessage = { id: Date.now().toString(), text: chatInputValue, sender: 'user' };
    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInputValue;
    setChatInputValue('');
    setIsChatLoading(true);
    setChatError(null);

    let messageToSend = currentInput;

    if (travelSpots.length > 0) {
      const itineraryContext = "Context: User's current travel itinerary. Consider this when responding:\n" +
        travelSpots.map(spot => {
          let datePart = 'N/A';
          let timePart = 'N/A';
          try {
            // spot.dateTime is already YYYY-MM-DDTHH:MM
            if (spot.dateTime && spot.dateTime !== 'Invalid Date') {
                const [dateStr, timeStr] = spot.dateTime.split('T');
                if (dateStr && timeStr) {
                    const dateObj = new Date(spot.dateTime);
                     if (!isNaN(dateObj.getTime())) {
                        datePart = dateObj.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
                        timePart = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    }
                }
            }
          } catch (e) { /* ignore date parsing errors for context */ }
          return `- ${spot.name} on ${datePart} at ${timePart} via ${spot.transportMode}. Notes: ${spot.description || 'N/A'}`;
        }).join("\n") +
        "\n\nUser's new message:\n";
      messageToSend = itineraryContext + currentInput;
    }

    let currentAiMessageId: string | null = null; 

    try {
      const stream = await geminiChatInstance.current.sendMessageStream({ message: messageToSend });
      
      currentAiMessageId = `${Date.now().toString()}-ai`; 
      let accumulatedText = "";
      
      setChatMessages(prev => [...prev, { id: currentAiMessageId!, text: '', sender: 'ai', isStreaming: true }]);

      for await (const chunk of stream) {
         accumulatedText += chunk.text;
         setChatMessages(prev => prev.map(msg => msg.id === currentAiMessageId ? { ...msg, text: accumulatedText, isStreaming: true } : msg ));
      }
      
      let finalDisplayAiText = accumulatedText;
      // Regex for AI_ADD_SPOT command, ensuring description can be empty or have content
      const addSpotCommandMatch = accumulatedText.match(/AI_ADD_SPOT::name=(.*?);;description=(.*?);;dateTime=(.*?);;transportMode=(walk|bicycle|car|bus|train|plane|boat|other)(?:;;)?/s);

      let dateWasDefaultedOrAdjusted = false;
      let finalDateTimeForSpot = '';

      if (addSpotCommandMatch) {
        const [, name, description, rawDateTime, transportModeStr] = addSpotCommandMatch;
        const transportMode = transportModeStr as TransportMode;
        
        finalDisplayAiText = accumulatedText.replace(addSpotCommandMatch[0], '').trim();
        if (!finalDisplayAiText) { 
            finalDisplayAiText = `Understood. I'm now instructing the app to add ${name} to your itinerary.`; 
        }

        if (rawDateTime === "DATETIME_UNSPECIFIED" || !rawDateTime.trim()) {
          finalDateTimeForSpot = formatToLocalDateTimeString(new Date());
          dateWasDefaultedOrAdjusted = true;
        } else {
          const parsedDate = new Date(rawDateTime); // Try to parse what AI sent
          if (isNaN(parsedDate.getTime())) { // Invalid date string from AI
            finalDateTimeForSpot = formatToLocalDateTimeString(new Date()); // Default to now
            dateWasDefaultedOrAdjusted = true;
          } else { // Valid date from AI, format it to our standard YYYY-MM-DDTHH:MM local
            finalDateTimeForSpot = formatToLocalDateTimeString(parsedDate);
            // Check if AI's raw string was different from our formatted local string (e.g. due to timezone conversion or format diff)
            if (rawDateTime !== finalDateTimeForSpot) {
                 // Example: AI sent "2024-07-20T10:00Z", we store "2024-07-20T19:00" (if local is JST)
                 // Or AI sent "July 20th 10am", we store "2024-07-20T10:00"
                 dateWasDefaultedOrAdjusted = true; 
            }
          }
        }
        
        const proposedSpot: Omit<TravelSpot, 'id'> = { name, description: description.trim(), dateTime: finalDateTimeForSpot, transportMode };

        setChatMessages(prev => prev.map(msg => msg.id === currentAiMessageId ? { ...msg, text: finalDisplayAiText, isStreaming: false } : msg ));
        
        handleAddTravelSpot(proposedSpot);
        
        let appConfirmationText = `Done! "${name}" has been added to your itinerary.`;
        if (dateWasDefaultedOrAdjusted) {
          const [datePart, timePart] = finalDateTimeForSpot.split('T');
          appConfirmationText += ` (Date/time set to ${datePart} at ${timePart}. Please review and edit if needed.)`;
        }
        appConfirmationText += ` You can view or modify it in the Itinerary tab.`;

        setChatMessages(prev => [...prev, {id: `${Date.now()}-app-confirm-add`, text: appConfirmationText, sender: 'ai'}]);

      } else {
         setChatMessages(prev => prev.map(msg => msg.id === currentAiMessageId ? { ...msg, text: accumulatedText, isStreaming: false } : msg ));
      }

    } catch (e: any) {
      console.error("Gemini API error:", e);
      const errorMessage = `AI Error: ${e.message || "Could not get a response."}`;
      setChatError(errorMessage);
      setChatMessages(prev => {
          const lastMsg = prev[prev.length-1];
          if(currentAiMessageId && lastMsg && lastMsg.id === currentAiMessageId && lastMsg.isStreaming){
              return prev.map(msg => msg.id === currentAiMessageId ? {...msg, text: errorMessage, isStreaming: false, isError: true } : msg);
          }
          return [...prev, {id: `${Date.now()}-error`, text: errorMessage, sender: 'ai', isError: true }];
      });
    } finally {
      setIsChatLoading(false);
    }
  }, [chatInputValue, isChatLoading, chatError, travelSpots, handleAddTravelSpot, formatToLocalDateTimeString]);

  const handleTravelSpotsOrderChange = useCallback((oldIndex: number, newIndex: number) => {
    setTravelSpots(prevSpots => {
      const updatedSpots = [...prevSpots];
      const [movedSpot] = updatedSpots.splice(oldIndex, 1);
      updatedSpots.splice(newIndex, 0, movedSpot);
      return updatedSpots;
    });
  }, []);

  const handleUpdateTravelSpot = useCallback((updatedSpot: TravelSpot) => {
    setTravelSpots(prevSpots => 
      prevSpots.map(spot => spot.id === updatedSpot.id ? updatedSpot : spot)
    );
  }, []);

  const handleDeleteTravelSpot = useCallback((spotId: string) => {
    setTravelSpots(prevSpots => prevSpots.filter(spot => spot.id !== spotId));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setContentDrawerHeight(prevHeight => {
        const maxHeight = window.innerHeight * 0.9; 
        const minAllowedHeight = MIN_DRAWER_HEIGHT;
        let newHeight = prevHeight;
        if (newHeight < minAllowedHeight) newHeight = minAllowedHeight;
        if (newHeight > maxHeight) newHeight = maxHeight;
        return newHeight;
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAndDrawRoute = useCallback(async () => {
    const plottableSpots = travelSpots.filter(spot => spot.coordinates && spot.coordinates.length === 2);
    if (plottableSpots.length < 2) {
      setRouteGeoJson(null); // Clear route if not enough points
      return;
    }

    const coordinatesString = plottableSpots
      .map(spot => `${spot.coordinates![0]},${spot.coordinates![1]}`)
      .join(';');

    const profile = 'mapbox/driving'; // Can be 'mapbox/walking', 'mapbox/cycling'
    const url = `https://api.mapbox.com/directions/v5/${profile}/${coordinatesString}?geometries=geojson&overview=full&access_token=${MAPBOX_ACCESS_TOKEN}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Mapbox Directions API error:', errorData.message || response.status);
        setRouteGeoJson(null);
        return;
      }
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const routeGeometry = data.routes[0].geometry;
        setRouteGeoJson({
          type: 'Feature',
          properties: {},
          geometry: routeGeometry,
        });
      } else {
        setRouteGeoJson(null);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      setRouteGeoJson(null);
    }
  }, [travelSpots]);

  useEffect(() => {
    fetchAndDrawRoute();
  }, [fetchAndDrawRoute]); // travelSpots is a dependency of fetchAndDrawRoute

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <div className="flex-grow relative">
        <MapboxMap
          accessToken={MAPBOX_ACCESS_TOKEN}
          center={mapViewConfig.center}
          zoom={mapViewConfig.zoom}
          markerLngLat={mapViewConfig.marker}
          travelSpots={travelSpots}
          routeGeoJson={routeGeoJson}
        />
      </div>

      <FloatingActionButtons
        navItems={NAVIGATION_ITEMS}
        activeViewId={activeViewId}
        isContentDrawerOpen={isContentDrawerOpen}
        contentDrawerPendingOpenId={contentDrawerPendingOpenId}
        onNavFabClick={handleNavFabClick}
      />

      <ContentDrawer
        isOpen={isContentDrawerOpen}
        onClose={() => {
            setIsContentDrawerOpen(false);
            setActiveViewId(DEFAULT_VIEW_ID); 
            setContentDrawerPendingOpenId(null);
        }}
        title={getDrawerTitle()}
        height={contentDrawerHeight}
        onHeightChange={setContentDrawerHeight}
        minHeight={MIN_DRAWER_HEIGHT}
        defaultHeightVh={DEFAULT_CONTENT_DRAWER_HEIGHT_VH}
      >
        <TabContent
          activeViewId={activeViewId} 
          // Search props
          searchQuery={searchQuery}
          searchResults={searchResults}
          isSearching={isSearching}
          searchError={searchError}
          onSearchQueryChange={handleSearchQueryChange}
          onExecuteSearch={executeSearch}
          onSearchResultClick={handleSearchResultClick}
          // Chat props
          chatMessages={chatMessages}
          chatInputValue={chatInputValue}
          isChatLoading={isChatLoading}
          chatError={chatError}
          onChatInputChange={handleChatInputChange}
          onSendChatMessage={handleSendChatMessage}
          isChatInitialized={!!geminiChatInstance.current}
          // Itinerary props
          travelSpots={travelSpots}
          onTravelSpotsOrderChange={handleTravelSpotsOrderChange}
          onAddTravelSpot={handleAddTravelSpot}
          onUpdateTravelSpot={handleUpdateTravelSpot}
          onDeleteTravelSpot={handleDeleteTravelSpot}
        />
      </ContentDrawer>
    </div>
  );
};

export default App;