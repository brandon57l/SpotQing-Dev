
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CloseIcon, MIN_DRAWER_HEIGHT } from '../constants'; // DEFAULT_CONTENT_DRAWER_HEIGHT_VH removed as it's an initial prop

interface ContentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  height: number;
  onHeightChange: React.Dispatch<React.SetStateAction<number>>;
  minHeight?: number;
  defaultHeightVh?: number; // Used for resetting or initial open if needed
}

const ContentDrawer: React.FC<ContentDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  height,
  onHeightChange,
  minHeight = MIN_DRAWER_HEIGHT,
  defaultHeightVh = 40, // Default from constants if not specified, but prop allows override
}) => {
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const initialDragState = useRef<{ startY: number; initialHeight: number } | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen && !isMounted) {
      setIsMounted(true);
    }
  }, [isOpen, isMounted]);

  useEffect(() => {
    if (isOpen && height < minHeight) {
      onHeightChange((window.innerHeight * defaultHeightVh) / 100);
    }
  }, [isOpen, height, minHeight, defaultHeightVh, onHeightChange]);
  
  useEffect(() => {
    const handleWindowResize = () => {
        onHeightChange(prevHeight => {
            const maxHeight = window.innerHeight * 0.9; // Use 90% of viewport height as max
            return Math.min(Math.max(prevHeight, minHeight), maxHeight);
        });
    };
    window.addEventListener('resize', handleWindowResize);
    // Initial call to ensure height is within bounds
    handleWindowResize(); 
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [minHeight, onHeightChange]); // defaultHeightVh not needed here

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    initialDragState.current = {
      startY: e.clientY,
      initialHeight: height,
    };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsResizing(true);
    initialDragState.current = {
      startY: e.touches[0].clientY,
      initialHeight: height,
    };
  };

  const handleDragMove = useCallback((clientY: number) => {
    if (!isResizing || !initialDragState.current) return;

    const deltaY = clientY - initialDragState.current.startY;
    let newHeight = initialDragState.current.initialHeight - deltaY;
    const maxHeight = window.innerHeight * 0.9; // Consistent max height
    
    newHeight = Math.max(minHeight, newHeight);
    newHeight = Math.min(maxHeight, newHeight);
    onHeightChange(newHeight);
  }, [isResizing, minHeight, onHeightChange]);

  const handleDragEnd = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
    }
  }, [isResizing]);

  useEffect(() => {
    const onMove = (event: MouseEvent | TouchEvent) => {
      if (!isResizing) return;
      if (event.type === 'touchmove') {
        event.preventDefault(); // Prevent page scroll when dragging handle
      }
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
      handleDragMove(clientY);
    };

    const onEnd = () => {
      handleDragEnd();
    };

    if (isResizing) {
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('mouseleave', onEnd);
      window.addEventListener('touchmove', onMove, { passive: false } as any); // Fixed line
      window.addEventListener('touchend', onEnd);
      window.addEventListener('touchcancel', onEnd);
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('mouseleave', onEnd);
      window.removeEventListener('touchmove', onMove, { passive: false } as any); // Fixed line
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    }

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('mouseleave', onEnd);
      window.removeEventListener('touchmove', onMove, { passive: false } as any); // Ensure cleanup also uses the same options structure if needed by removeEventListener
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
  }, [isResizing, handleDragMove, handleDragEnd]);
  
  // Logic to truly unmount after close animation
  const [actuallyRender, setActuallyRender] = useState(isOpen);
  useEffect(() => {
    if (isOpen) {
      setActuallyRender(true);
    } else {
      const timer = setTimeout(() => setActuallyRender(false), 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!actuallyRender && !isMounted) { // Only unmount if not open AND animation time could have passed & never mounted
      return null;
  }


  const drawerTransitionClasses = isResizing
    ? 'transition-none' // No transitions during active resize
    : 'transition-all duration-300 ease-in-out'; // Standard transitions for open/close

  const drawerClasses = `
    fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-xl 
    z-30
    ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-full pointer-events-none'}
    ${drawerTransitionClasses}
  `;
  
  const currentMaxHeight = typeof window !== 'undefined' ? window.innerHeight * 0.9 : 600; 

  return (
    <div
      ref={drawerRef}
      className={drawerClasses}
      style={{ height: `${Math.min(height, currentMaxHeight)}px` }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="content-drawer-title"
      aria-hidden={!isOpen}
    >
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="absolute -top-1 left-0 right-0 h-3 bg-gray-200 hover:bg-gray-300 cursor-ns-resize flex items-center justify-center touch-none"
        style={{ zIndex: 31 }} 
        aria-label="Resize content panel"
        role="separator"
      >
        <div className="w-10 h-1 bg-gray-400 rounded-full pointer-events-none"></div>
      </div>

      <div className="flex flex-col h-full pt-2">
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
          <h2 id="content-drawer-title" className="text-lg font-semibold text-gray-700">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label={`Close ${title} panel`}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto bg-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ContentDrawer;
