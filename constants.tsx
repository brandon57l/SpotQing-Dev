
import React from 'react';
import { NavigationItem, TransportMode } from './types';

// Define prop types for icons explicitly to ensure compatibility
interface IconProps {
  className?: string;
}


export const MapIcon = ({ className = "w-6 h-6" }: IconProps): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);


export const SearchIcon = ({ className = "w-6 h-6" }: IconProps): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

export const HeartIcon = ({ className = "w-6 h-6" }: IconProps): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

export const UserIcon = ({ className = "w-6 h-6" }: IconProps): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

export const CloseIcon = ({ className = "w-6 h-6" }: IconProps): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


export const AiIcon = ({ className = "w-6 h-6" }: IconProps): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h.01M12 12h.01M15 12h.01" />
  </svg>
);

export const ItineraryIcon = ({ className = "w-6 h-6" }: IconProps): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const EditIcon = ({ className = "w-5 h-5" }: IconProps): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

export const DeleteIcon = ({ className = "w-5 h-5" }: IconProps): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.502 0c-.342.052-.682.107-1.022.166m3.743 11.34A2.25 2.25 0 015.626 18H4.5m14.5-12.79l-3.762 3.762M6.25 17.25H4.5" />
  </svg>
);

export const AddIcon = ({ className = "w-6 h-6" }: IconProps): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const WalkIcon = ({ className = "w-5 h-5" }: IconProps): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25L7.5 16.5V3.75m9 0H7.5M12 14.25L16.5 20.25M12 14.25L7.5 20.25m4.5-16.5V1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 7.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
 </svg>
);

export const BicycleIcon = ({ className = "w-5 h-5" }: IconProps): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6A2.25 2.25 0 008.25 8.25V10.5a2.25 2.25 0 004.5 0V8.25A2.25 2.25 0 0010.5 6zm0 0h3m-3 0h-3m0 0V4.5m0 1.5v3m0-3h3m-3 0h-3m3 3.75H9.75m1.5 0H12m1.5 0H12m0 0V12m0-1.5v3M5.25 12a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H5.25zm7.5 0a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75h-.008zm4.5 0a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75h-.008zM10.5 15a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm0 0v3.75m0 0h3.75m-3.75 0H6.75m3.75 0V15m0 .75a.75.75 0 000 1.5h.008a.75.75 0 000-1.5H10.5zm-2.25.75a.75.75 0 000 1.5h.008a.75.75 0 000-1.5H8.25zm4.5.75a.75.75 0 000 1.5h.008a.75.75 0 000-1.5H15V15" />
  </svg>
);

export const CarIcon = ({ className = "w-5 h-5" }: IconProps): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0h-3m3 0V6.75A2.25 2.25 0 017.5 4.5h9A2.25 2.25 0 0118.75 6.75v12m-12.75 0H4.5m12.75 0h1.5m-12.75 0V6.75m12.75 0V18.75m0 0a1.5 1.5 0 01-3 0m3 0h-3m-5.25 0h3.375c.621 0 1.125-.504 1.125-1.125V12.75c0-.621-.504-1.125-1.125-1.125H9.375c-.621 0-1.125.504-1.125 1.125V17.625c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);

export const BusIcon = ({ className = "w-5 h-5" }: IconProps): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m0-15A1.5 1.5 0 0110.5 0h3A1.5 1.5 0 0115 1.5v12A1.5 1.5 0 0113.5 15H12m-1.5-1.5H4.5m6.75-9H19.5M3 12h18M3 12a1.5 1.5 0 00-1.5 1.5v4.5A1.5 1.5 0 003 19.5h18a1.5 1.5 0 001.5-1.5v-4.5A1.5 1.5 0 0021 12m-1.5 7.5H4.5m15-7.5a1.5 1.5 0 011.5 1.5v3A1.5 1.5 0 0121 19.5h-.75M9 21v-1.5M15 21v-1.5" />
    <circle cx="7.5" cy="19.5" r="1.5" />
    <circle cx="16.5" cy="19.5" r="1.5" />
  </svg>
);

export const TrainIcon = ({ className = "w-5 h-5" }: IconProps): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h13.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 12.75V15s0 .75-.75.75S3 15 3 15v-2.25m18 0V15s0 .75.75.75.75-.75.75-.75v-2.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15.75V21M16.5 15.75V21M12 15.75V21" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 11.25h15v1.5h-15zM6 6h12v1.5H6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75h6V6H9z" />
  </svg>
);

export const PlaneIcon = ({ className = "w-5 h-5" }: IconProps): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l4.515 4.515a2.25 2.25 0 01-3.182 3.182L3 12l11.25-11.25a2.25 2.25 0 013.182 3.182L12.75 9H18a2.25 2.25 0 012.25 2.25v1.5M12.75 15l4.5-4.5M12.75 15l-4.5-4.5" />
  </svg>
);

export const BoatIcon = ({ className = "w-5 h-5" }: IconProps): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 17.25h16.5M2.25 17.25L6 7.5h12l3.75 9.75M4.5 21h15M12 14.25V7.5M9 7.5h6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5S9 3 12 3s4.5 4.5 4.5 4.5" />
  </svg>
);

export const OtherIcon = ({ className = "w-5 h-5" }: IconProps): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.956 11.956 0 0112 2.828a11.956 11.956 0 010 21.172A11.956 11.956 0 0112 2.828m9.524 6.648A.75.75 0 1012 9.524M2.476 9.476a.75.75 0 1011.048 0M12 12.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
  </svg>
);

export const TRANSPORT_MODES: { value: TransportMode; label: string; icon: React.FC<IconProps> }[] = [
  { value: 'walk', label: 'Walk', icon: WalkIcon },
  { value: 'bicycle', label: 'Bicycle', icon: BicycleIcon },
  { value: 'car', label: 'Car', icon: CarIcon },
  { value: 'bus', label: 'Bus', icon: BusIcon },
  { value: 'train', label: 'Train', icon: TrainIcon },
  { value: 'plane', label: 'Plane', icon: PlaneIcon },
  { value: 'boat', label: 'Boat', icon: BoatIcon },
  { value: 'other', label: 'Other', icon: OtherIcon },
];

export const TRANSPORT_MODE_VALUES: string = TRANSPORT_MODES.map(tm => tm.value).join(', ');

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'map', label: 'Map', icon: MapIcon },
  { id: 'search', label: 'Search', icon: SearchIcon },
  { id: 'itinerary', label: 'Itinerary', icon: ItineraryIcon },
  { id: 'favorites', label: 'Favorites', icon: HeartIcon },
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'ai-chat', label: 'AI Chat', icon: AiIcon },
];

export const DEFAULT_VIEW_ID = 'map'; 

export const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoiam9yZHltZW93IiwiYSI6ImNqaHc1bXhteTAxa3ozd2xqNzdqNmt6dHkifQ.bZvGWZSA73Vklb3D23fXng';

export const INITIAL_MAP_VIEW = {
  center: [139.6917, 35.6895] as [number, number], 
  zoom: 10,
  marker: null as [number, number] | null,
};

// For Geocoding API
export const GEOCODING_PROXIMITY = [139.6917, 35.6895].join(','); 
export const GEOCODING_COUNTRY = 'JP'; 

export const MIN_DRAWER_HEIGHT = 100;
export const DEFAULT_CONTENT_DRAWER_HEIGHT_VH = 40;
