
import React from 'react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: (props: { className?: string }) => React.ReactNode; // Function component for SVG icon
}

export interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude]
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  isStreaming?: boolean; // Optional: to indicate AI message is still being streamed
  isError?: boolean; // Optional: to indicate AI message is an error
}

export type TransportMode = 'walk' | 'bicycle' | 'car' | 'bus' | 'train' | 'plane' | 'boat' | 'other';

export interface TravelSpot {
  id: string;
  name: string;
  description: string;
  dateTime: string; // ISO string for date and time in YYYY-MM-DDTHH:MM local format
  transportMode: TransportMode;
  coordinates?: [number, number] | null; // [longitude, latitude]
}