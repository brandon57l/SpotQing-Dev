
import React, { useRef, useEffect, useCallback, useState } from 'react';
import Sortable from 'sortablejs';
import { TravelSpot, TransportMode } from '../types';
import { TRANSPORT_MODES, EditIcon, DeleteIcon, AddIcon, CloseIcon, ItineraryIcon } from '../constants';

interface TravelPlanViewProps {
  spots: TravelSpot[];
  onOrderChange: (oldIndex: number, newIndex: number) => void;
  onAddSpot: (newSpotData: Omit<TravelSpot, 'id'>) => void;
  onUpdateSpot: (updatedSpot: TravelSpot) => void;
  onDeleteSpot: (spotId: string) => void;
}

const DragHandleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-gray-400" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
  </svg>
);

const initialSpotFormData: Omit<TravelSpot, 'id'> = {
  name: '',
  description: '',
  dateTime: new Date().toISOString().substring(0, 16), // Defaults to current date/time
  transportMode: 'walk',
};

const TravelPlanView: React.FC<TravelPlanViewProps> = ({ spots, onOrderChange, onAddSpot, onUpdateSpot, onDeleteSpot }) => {
  const listRef = useRef<HTMLUListElement>(null);
  const sortableInstanceRef = useRef<Sortable | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<TravelSpot | null>(null);
  const [formData, setFormData] = useState<Omit<TravelSpot, 'id'>>(initialSpotFormData);

  const handleSortEnd = useCallback((evt: Sortable.SortableEvent) => {
    if (evt.oldDraggableIndex !== undefined && evt.newDraggableIndex !== undefined) {
      onOrderChange(evt.oldDraggableIndex, evt.newDraggableIndex);
    }
  }, [onOrderChange]);

  useEffect(() => {
    if (listRef.current) {
      if (sortableInstanceRef.current) {
        sortableInstanceRef.current.destroy(); 
      }
      sortableInstanceRef.current = Sortable.create(listRef.current, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        handle: '.drag-handle',
        onEnd: handleSortEnd,
      });
    }
    return () => {
      if (sortableInstanceRef.current) {
        sortableInstanceRef.current.destroy();
        sortableInstanceRef.current = null;
      }
    };
  }, [spots, handleSortEnd]); 

  const openAddModal = () => {
    setEditingSpot(null);
    setFormData(initialSpotFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (spot: TravelSpot) => {
    setEditingSpot(spot);
    setFormData({
      name: spot.name,
      description: spot.description,
      dateTime: spot.dateTime,
      transportMode: spot.transportMode,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSpot(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Spot name cannot be empty.");
      return;
    }
    if (editingSpot) {
      onUpdateSpot({ ...editingSpot, ...formData });
    } else {
      onAddSpot(formData);
    }
    closeModal();
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>, fallbackSpotIdFromArg: string) => {
    event.preventDefault(); 
    event.stopPropagation(); 

    const buttonElement = event.currentTarget;
    const spotIdFromDataset = buttonElement.dataset.spotId;
    const spotIdToUse = spotIdFromDataset || fallbackSpotIdFromArg;
    
    console.log(`[Delete Handler] Clicked. Dataset ID: ${spotIdFromDataset}, Arg ID: ${fallbackSpotIdFromArg}. Using ID: ${spotIdToUse}`);

    if (!spotIdToUse) {
      console.error("[Delete Handler] Error: spotIdToUse is undefined or empty.");
      alert("Cannot delete: Spot ID is missing.");
      return;
    }
    
    // Directly delete without confirmation
    console.log(`[Delete Handler] Proceeding with direct deletion for spot ID: ${spotIdToUse}. Calling onDeleteSpot.`);
    onDeleteSpot(spotIdToUse);
  };

  const formatDateTime = (isoString: string) => {
    if (!isoString) return 'No date';
    try {
      const date = new Date(isoString);
      return date.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="bg-gray-50 h-full flex flex-col p-3 md:p-4">
      <div className="mb-4">
        <button
          onClick={openAddModal}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition duration-150 ease-in-out text-sm"
          aria-label="Add new travel spot"
        >
          <AddIcon className="w-5 h-5" />
          Add New Spot
        </button>
      </div>

      {spots.length === 0 && !isModalOpen && (
        <div className="p-4 text-center text-gray-500 h-full flex flex-col justify-center items-center flex-grow">
          <ItineraryIconBig />
          <p className="mt-3 text-base">Your itinerary is empty.</p>
          <p className="text-sm text-gray-400">Click "Add New Spot" to start planning your trip!</p>
        </div>
      )}

      <ul ref={listRef} className="space-y-2.5 overflow-y-auto flex-grow">
        {spots.map((spot) => (
          <li
            key={spot.id}
            className="bg-white p-3 rounded-lg shadow border border-gray-200 flex items-center group transition-shadow hover:shadow-md"
            data-id={spot.id}
          >
            <span className="drag-handle p-2 -ml-1 text-gray-300 group-hover:text-gray-500 transition-colors cursor-grab active:cursor-grabbing" aria-label="Drag to reorder spot">
              <DragHandleIcon className="w-5 h-5"/>
            </span>
            <div className="flex-grow ml-1.5">
              <div className="flex justify-between items-start">
                 <strong className="text-gray-800 text-sm font-medium mr-2">{spot.name}</strong>
                 <div className="flex items-center text-xs text-gray-500">
                    <span>{TRANSPORT_MODES.find(tm => tm.value === spot.transportMode)?.label}</span>
                 </div>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{spot.description}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDateTime(spot.dateTime)}</p>
            </div>
            <div className="flex flex-col space-y-1.5 ml-2">
              <button
                type="button"
                onClick={() => openEditModal(spot)}
                className="p-1.5 text-gray-400 hover:text-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-md"
                aria-label={`Edit ${spot.name}`}
              >
                <EditIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                data-spot-id={spot.id} 
                onClick={(e) => handleDeleteClick(e, spot.id)} 
                className="p-1.5 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-1 focus:ring-red-500 rounded-md"
                aria-label={`Delete ${spot.name}`}
              >
                <DeleteIcon className="w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="spot-modal-title">
          <div className="bg-white rounded-lg shadow-xl p-5 md:p-6 w-full max-w-md transform transition-all">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
              <h3 id="spot-modal-title" className="text-lg font-semibold text-gray-800">
                {editingSpot ? 'Edit Travel Spot' : 'Add New Travel Spot'}
              </h3>
              <button onClick={closeModal} className="p-1 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400" aria-label="Close modal">
                <CloseIcon className="w-5 h-5"/>
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4 pt-1">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  id="dateTime"
                  value={formData.dateTime}
                  onChange={handleFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="transportMode" className="block text-sm font-medium text-gray-700 mb-1">Transport Mode</label>
                <select
                  name="transportMode"
                  id="transportMode"
                  value={formData.transportMode}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm bg-white"
                >
                  {TRANSPORT_MODES.map(mode => (
                    <option key={mode.value} value={mode.value}>{mode.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500"
                >
                  {editingSpot ? 'Save Changes' : 'Add Spot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ItineraryIconBig: React.FC<{ className?: string }> = ({ className = "w-16 h-16 text-gray-300" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export default TravelPlanView;
