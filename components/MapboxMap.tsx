
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface MapboxMapProps {
  accessToken: string;
  center: [number, number]; // [lng, lat]
  zoom: number;
  markerLngLat: [number, number] | null; // [lng, lat]
}

const MapboxMap: React.FC<MapboxMapProps> = ({ accessToken, center, zoom, markerLngLat }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    const currentMapContainer = mapContainerRef.current;
    if (!currentMapContainer) return;

    if (typeof mapboxgl === 'undefined' || !mapboxgl || typeof mapboxgl.Map !== 'function') {
      console.error('Mapbox GL JS not loaded, or mapboxgl.Map is not a constructor.');
      currentMapContainer.innerHTML = `<div style="padding:20px; text-align:center; color:red;">Map library failed to load.</div>`;
      return;
    }

    mapboxgl.accessToken = accessToken;

    // If a map instance already exists, remove it to prevent conflicts (e.g., HMR)
    if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
    }
    
    try {
      const map = new mapboxgl.Map({
        container: currentMapContainer,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom,
      });
      
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      mapRef.current = map;

    } catch (error: any) {
      console.error("Failed to initialize Mapbox map:", error);
      currentMapContainer.innerHTML = `<div style="padding:20px; text-align:center; color:red;">Failed to initialize map: ${error.message}</div>`;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
       if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (currentMapContainer && currentMapContainer.innerHTML.includes("Map library failed to load") || currentMapContainer.innerHTML.includes("Failed to initialize map")) {
         currentMapContainer.innerHTML = ''; 
      }
    };
  }, [accessToken]); // Only re-initialize if accessToken changes (which is rare)

  // Effect to update map view (center/zoom)
  useEffect(() => {
    if (mapRef.current && center && typeof zoom === 'number') {
      // Check if current map center/zoom are significantly different to avoid jitter
      const currentMapCenter = mapRef.current.getCenter();
      const currentZoom = mapRef.current.getZoom();
      const distance = Math.sqrt(
        Math.pow(currentMapCenter.lng - center[0], 2) +
        Math.pow(currentMapCenter.lat - center[1], 2)
      );
      const zoomDiff = Math.abs(currentZoom - zoom);

      // Only flyTo if there's a noticeable change
      if (distance > 0.0001 || zoomDiff > 0.1) {
         mapRef.current.flyTo({
          center: center,
          zoom: zoom,
          speed: 1.2, // Adjust speed as desired
        });
      }
    }
  }, [center, zoom]);

  // Effect to manage marker
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing marker if it exists
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    // Add new marker if markerLngLat is provided
    if (markerLngLat) {
      markerRef.current = new mapboxgl.Marker()
        .setLngLat(markerLngLat)
        .addTo(mapRef.current);
    }
  }, [markerLngLat]);

  return <div ref={mapContainerRef} className="w-full h-full bg-gray-100" aria-label="Map view" role="application" />;
};

export default MapboxMap;
