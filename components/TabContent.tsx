
import React from 'react';
import { MapboxFeature, NavigationItem, ChatMessage, TravelSpot } from '../types'; 
import { NAVIGATION_ITEMS } from '../constants'; 
import ChatView from './ChatView'; 
import TravelPlanView from './TravelPlanView'; 

interface TabContentProps {
  activeViewId: string;
  // Props for Search view
  searchQuery: string;
  searchResults: MapboxFeature[];
  isSearching: boolean;
  searchError: string | null;
  onSearchQueryChange: (query: string) => void;
  onExecuteSearch: () => void;
  onSearchResultClick: (feature: MapboxFeature) => void;
  // Props for Chat view
  chatMessages: ChatMessage[];
  chatInputValue: string;
  isChatLoading: boolean;
  chatError: string | null;
  onChatInputChange: (value: string) => void;
  onSendChatMessage: () => void;
  isChatInitialized: boolean;
  // Props for Itinerary view
  travelSpots: TravelSpot[];
  onTravelSpotsOrderChange: (oldIndex: number, newIndex: number) => void;
  onAddTravelSpot: (newSpotData: Omit<TravelSpot, 'id'>) => void;
  onUpdateTravelSpot: (updatedSpot: TravelSpot) => void;
  onDeleteTravelSpot: (spotId: string) => void;
}

const TabContent: React.FC<TabContentProps> = ({
  activeViewId,
  searchQuery,
  searchResults,
  isSearching,
  searchError,
  onSearchQueryChange,
  onExecuteSearch,
  onSearchResultClick,
  chatMessages,
  chatInputValue,
  isChatLoading,
  chatError,
  onChatInputChange,
  onSendChatMessage,
  isChatInitialized,
  travelSpots,
  onTravelSpotsOrderChange,
  onAddTravelSpot,
  onUpdateTravelSpot,
  onDeleteTravelSpot,
}) => {
  let content: React.ReactNode;
  const activeViewDetails = NAVIGATION_ITEMS.find(item => item.id === activeViewId);

  if (!activeViewDetails) { 
    content = (
      <div className="text-center text-gray-500 p-4">
        <p>Content not found.</p>
      </div>
    );
  } else {
    switch (activeViewId) {
      case 'map': 
        content = null; 
        break;
      case 'search':
        content = (
          <div className="bg-gray-50 h-full flex flex-col p-3 md:p-4 overflow-y-auto">
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="E.g., Tokyo Tower"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                className="p-2.5 border border-gray-300 rounded-md shadow-sm w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                aria-label="Search for locations in Japan"
                onKeyDown={(e) => { if (e.key === 'Enter') onExecuteSearch(); }}
              />
              <button
                onClick={onExecuteSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 text-sm"
              >
                {isSearching ? 'Wait...' : 'Go'}
              </button>
            </div>

            {searchError && (
              <div className="mb-3 p-2.5 bg-red-100 border border-red-300 text-red-700 rounded-md text-xs">
                <p><strong>Error:</strong> {searchError}</p>
              </div>
            )}

            {isSearching && !searchError && <p className="text-gray-500 text-center text-sm">Loading results...</p>}
            
            {!isSearching && searchResults.length === 0 && searchQuery.trim() && !searchError && (
                 <p className="text-gray-500 text-center text-sm">No results found for "{searchQuery}".</p>
            )}

            {searchResults.length > 0 && (
              <ul className="list-none space-y-2 flex-grow">
                {searchResults.map(feature => (
                  <li key={feature.id}>
                    <button
                      onClick={() => onSearchResultClick(feature)}
                      className="w-full text-left bg-white p-2.5 rounded-md shadow border border-gray-200 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
                      aria-label={`View ${feature.place_name} on map`}
                    >
                      <strong className="text-gray-700 text-sm">{feature.place_name.split(',')[0]}</strong>
                      <p className="text-xs text-gray-500 truncate">{feature.place_name}</p>
                      <p className="text-xs text-gray-400">Lng: {feature.center[0].toFixed(4)}, Lat: {feature.center[1].toFixed(4)}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
        break;
       case 'itinerary':
        content = (
          <TravelPlanView
            spots={travelSpots}
            onOrderChange={onTravelSpotsOrderChange}
            onAddSpot={onAddTravelSpot}
            onUpdateSpot={onUpdateTravelSpot}
            onDeleteSpot={onDeleteTravelSpot}
          />
        );
        break;
      case 'favorites':
        content = (
          <div className="bg-gray-50 h-full flex flex-col items-center p-4 overflow-y-auto">
            <ul className="list-none text-gray-600 w-full max-w-md space-y-2.5 mt-3">
              {['Tokyo Skytree', 'Kinkaku-ji Temple', 'Fushimi Inari Shrine'].map(place => (
                <li key={place} className="bg-white p-3 rounded-md shadow border border-gray-200 text-sm">{place}</li>
              ))}
            </ul>
             <p className="text-xs text-gray-400 mt-6"> (Sample favorite items) </p>
          </div>
        );
        break;
      case 'profile':
        content = (
          <div className="bg-gray-50 h-full flex flex-col items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xs text-center">
                <img 
                  src="https://picsum.photos/seed/traveler/100/100"
                  alt="User Avatar" 
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-orange-300"
                />
                <p className="text-lg text-gray-700 font-semibold">Yumi Tanaka</p>
                <p className="text-gray-500 text-xs">yumi.tanaka@example.com</p>
            </div>
          </div>
        );
        break;
      case 'ai-chat':
        content = (
          <ChatView
            messages={chatMessages}
            inputValue={chatInputValue}
            isLoading={isChatLoading}
            error={chatError}
            onInputChange={onChatInputChange}
            onSendMessage={onSendChatMessage}
            isChatInitialized={isChatInitialized}
          />
        );
        break;
      default:
        content = <p className="text-gray-700 p-4">Content for {activeViewDetails?.label || 'Unknown View'}</p>;
    }
  }

  if (!content) return null;

  return (
    <div className="w-full h-full overflow-y-auto"> 
      {content}
    </div>
  );
};

export default TabContent;
