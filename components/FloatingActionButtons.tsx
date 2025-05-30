
import React from 'react';
import { NavigationItem } from '../types';
// AiIcon is now imported by App.tsx through constants if needed by a navItem

interface FloatingActionButtonsProps {
  navItems: NavigationItem[];
  activeViewId: string;
  isContentDrawerOpen: boolean;
  // isChatDrawerOpen: boolean; // Removed
  contentDrawerPendingOpenId?: string | null; 
  onNavFabClick: (id: string) => void;
  // onAiFabClick: () => void; // Removed
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  navItems,
  activeViewId,
  isContentDrawerOpen,
  // isChatDrawerOpen, // Removed
  contentDrawerPendingOpenId, 
  onNavFabClick,
  // onAiFabClick, // Removed
}) => {
  const getButtonClasses = (itemId: string, isActive: boolean) => {
    let base = `p-3 rounded-full shadow-lg focus:outline-none transition-all duration-300 ease-in-out transform hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 flex items-center justify-center`;
    let color = '';
    if (isActive) {
      if (itemId === 'ai-chat') { // Special active style for ai-chat
        color = ' bg-gradient-to-br from-orange-500 to-red-600 text-white focus:ring-orange-500';
      } else if (itemId === 'favorites') {
        color = ' bg-red-500 hover:bg-red-600 text-white focus:ring-red-500';
      } else {
        color = ' bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500';
      }
    } else {
      color = ' bg-white text-gray-600 hover:bg-gray-100 hover:text-orange-500 focus:ring-orange-400';
    }
    return `${base}${color}`;
  };

  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col space-y-3 items-end">
      {navItems.map((item) => {
        let isActive;
        if (item.id === 'map') {
          // Map FAB is active if no content drawer is open AND no content drawer is pending to open.
          isActive = !isContentDrawerOpen && !contentDrawerPendingOpenId;
        } else {
          // Content FABs (Search, Favorites, Profile, AI Chat) are active if their content is shown,
          // and the content drawer is open.
          isActive = isContentDrawerOpen && activeViewId === item.id;
        }
        const IconComponent = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onNavFabClick(item.id)}
            className={getButtonClasses(item.id, isActive)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            title={item.label}
          >
            <IconComponent className="w-5 h-5" />
          </button>
        );
      })}

      {/* Dedicated AI Button removed, now part of navItems */}
    </div>
  );
};

export default FloatingActionButtons;
