'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@Context/AuthContext/AuthContext';
import { useCRUD } from '@hooks/owner/useCRUD';
import { useHotelStats } from '@hooks/owner/useHotelStats';
import StatCard from '@components/owner/component/dashboard/StatCard';
import CRUDTable from '@components/owner/component/dashboard/CRUDTable';
import CRUDModal from '@components/owner/component/dashboard/CRUDModal';
import SearchFilter from '@components/owner/component/dashboard/SearchFilter';
import ConfirmDialog from '@components/owner/component/dashboard/ConfirmDialog';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  ArrowLeftIcon,
  HomeIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Room table columns configuration
const roomColumns = [
  { key: 'room_number', label: 'Room #', sortable: true },
  { 
    key: 'room_type', 
    label: 'Type', 
    sortable: true,
    render: (room) => room.room_type?.name || room.type || 'N/A'
  },
  { 
    key: 'capacity', 
    label: 'Capacity', 
    sortable: true,
    render: (room) => room.room_type?.capacity || room.capacity || 'N/A'
  },
  { 
    key: 'pricePerNight', 
    label: 'Price/Night', 
    sortable: true,
    render: (room) => `$${room.pricePerNight || room.price_per_night || room.room_type?.base_price || 0}`
  },
  { 
    key: 'status', 
    label: 'Status', 
    sortable: false,
    render: (room) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        room.status === 'available' ? 'bg-green-100 text-green-800' :
        room.status === 'occupied' ? 'bg-yellow-100 text-yellow-800' :
        room.status === 'maintenance' ? 'bg-red-100 text-red-800' :
        room.status === 'out_of_order' ? 'bg-gray-100 text-gray-800' :
        'bg-blue-100 text-blue-800'
      }`}>
        {room.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
      </span>
    )
  },
  { 
    key: 'floor', 
    label: 'Floor', 
    sortable: true,
    render: (room) => room.floor || 'N/A'
  }
];

// Room Types table columns configuration
const roomTypeColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'description', label: 'Description', sortable: false },
  { 
    key: 'base_price', 
    label: 'Base Price', 
    sortable: true,
    render: (roomType) => `$${roomType.base_price || 0}`
  },
  { key: 'capacity', label: 'Capacity', sortable: true },
  { key: 'size', label: 'Size (sqm)', sortable: true },
  { 
    key: 'status', 
    label: 'Status', 
    sortable: false,
    render: (roomType) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        roomType.status === 'active' ? 'bg-green-100 text-green-800' :
        'bg-red-100 text-red-800'
      }`}>
        {roomType.status?.toUpperCase() || 'UNKNOWN'}
      </span>
    )
  },
  {
    key: 'rooms_count',
    label: 'Rooms',
    sortable: true,
    render: (roomType) => {
      const count = roomType.rooms?.length || 0;
      return (
        <span className="flex items-center">
          <span className="mr-2">{count}</span>
          {count > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // This will be handled by the parent component
              }}
              className="text-blue-600 hover:text-blue-800 text-xs underline"
            >
              View
            </button>
          )}
        </span>
      );
    }
  }
];

export default function HotelManagement() {
  const { id } = useParams();
  const { user } = useAuth();
  
  // CRUD hooks for different data types
  const { 
    item: hotel, 
    loading: hotelLoading, 
    error: hotelError,
    fetchOne: fetchHotel,
    update: updateHotel 
  } = useCRUD('hotels');

  const { 
    data: rooms,
    loading: roomsLoading,
    error: roomsError,
    create: createRoom,
    update: updateRoom,
    delete: deleteRoom,
    fetchAll: fetchRooms,
    hasData: hasRooms,
    isEmpty: roomsEmpty
  } = useCRUD('rooms');

  const { 
    data: roomTypes,
    loading: roomTypesLoading,
    error: roomTypesError,
    create: createRoomType,
    update: updateRoomType,
    delete: deleteRoomType,
    fetchAll: fetchRoomTypes,
    hasData: hasRoomTypes,
    isEmpty: roomTypesEmpty
  } = useCRUD('room-types');
  //console.log("roomTypes", roomTypes);

  // Hotel statistics management
  const { 
    calculateHotelStats, 
    fetchHotelReservations, 
    loading: statsLoading 
  } = useHotelStats();

  // Local state management
  const [activeTab, setActiveTab] = useState('overview');
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [roomModalMode, setRoomModalMode] = useState('create');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState('room'); // 'room' or 'room-type'
  const [reservations, setReservations] = useState([]);
  
  // Room Type management state
  const [showRoomTypeModal, setShowRoomTypeModal] = useState(false);
  const [roomTypeModalMode, setRoomTypeModalMode] = useState('create');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [roomTypeSearchTerm, setRoomTypeSearchTerm] = useState('');
  const [roomTypeFilterStatus, setRoomTypeFilterStatus] = useState('all');
  
  // View state for room type details
  const [viewingRoomType, setViewingRoomType] = useState(null);
  const [showRoomTypeRooms, setShowRoomTypeRooms] = useState(false);

  const [hotelStats, setHotelStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    maintenanceRooms: 0,
    cleaningRooms: 0,
    occupancyRate: 0,
    avgPrice: 0,
    monthlyRevenue: 0,
    activeReservations: 0,
    roomTypeBreakdown: {}
  });

  // Memoized data processing
  const processedRooms = useMemo(() => {
    if (!rooms || !Array.isArray(rooms)) return [];
    return rooms.map(room => ({
      ...room,
      displayPrice: room.pricePerNight || room.price_per_night || room.room_type?.base_price || 0,
      displayType: room.room_type?.name || room.type || 'N/A',
      amenitiesList: typeof room.amenities === 'string' ? 
        JSON.parse(room.amenities || '[]') : (room.amenities || [])
    }));
  }, [rooms]);

  const processedRoomTypes = useMemo(() => {
    if (!roomTypes || !Array.isArray(roomTypes)) return [];
    return roomTypes.map(roomType => ({
      ...roomType,
      rooms: processedRooms.filter(room => 
        room.room_type_id === roomType.id || room.room_type?.id === roomType.id
      )
    }));
  }, [roomTypes, processedRooms]);

  // Data fetching with error handling
  const loadInitialData = useCallback(async () => {
    if (!id) return;

    try {
      // Fetch hotel data first
      await fetchHotel(id);
      
      // Fetch room types (needed for room creation)
      await fetchRoomTypes({ hotel_id: id });

      // Fetch rooms for this hotel
      await fetchRooms({ hotel_id: id });
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }, [id, fetchHotel, fetchRoomTypes, fetchRooms]);

  // Stats calculation
  const calculateStats = useCallback(async () => {
    if (!id || !hotel || !hasRooms) return;

    try {
      const hotelReservations = await fetchHotelReservations(id);
      setReservations(hotelReservations);
      
      const stats = calculateHotelStats(hotel, processedRooms, hotelReservations);
      setHotelStats(stats);
    } catch (error) {
      console.error('Error calculating stats:', error);
      
      // Fallback to basic stats calculation
      const fallbackStats = calculateBasicStats(processedRooms, roomTypes);
      setHotelStats(fallbackStats);
    }
  }, [id, hotel, processedRooms, roomTypes, hasRooms, fetchHotelReservations, calculateHotelStats]);

  // Helper function for basic stats calculation
  const calculateBasicStats = useCallback((rooms, types) => {
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.status === 'available').length;
    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    const maintenanceRooms = rooms.filter(r => ['maintenance', 'out_of_order'].includes(r.status)).length;
    const cleaningRooms = rooms.filter(r => r.status === 'cleaning').length;
    
    return {
      totalRooms,
      availableRooms,
      occupiedRooms,
      maintenanceRooms,
      cleaningRooms,
      occupancyRate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0,
      avgPrice: totalRooms > 0 ? 
        Math.round(rooms.reduce((sum, r) => sum + (r.displayPrice || 0), 0) / totalRooms) : 0,
      monthlyRevenue: 0,
      activeReservations: 0,
      roomTypeBreakdown: types.reduce((acc, type) => {
        acc[type.name] = rooms.filter(r => 
          r.room_type_id === type.id || r.room_type?.id === type.id
        ).length;
        return acc;
      }, {})
    };
  }, []);

  // Room Type form fields
  const getRoomTypeFields = useCallback(() => {
    return [
      { 
        name: 'name', 
        label: 'Room Type Name', 
        type: 'text', 
        required: true,
        placeholder: 'e.g., Executive Suite, Standard Room'
      },
      { 
        name: 'description', 
        label: 'Description', 
        type: 'textarea', 
        required: true,
        rows: 3,
        placeholder: 'Describe the room type features and amenities...'
      },
      { 
        name: 'base_price', 
        label: 'Base Price per Night', 
        type: 'number', 
        required: true,
        min: 0,
        step: 0.01,
        placeholder: 'e.g., 150.00'
      },
      { 
        name: 'capacity', 
        label: 'Maximum Capacity', 
        type: 'number', 
        required: true,
        min: 1,
        placeholder: 'e.g., 2, 4, 6'
      },
      { 
        name: 'size', 
        label: 'Room Size (sqm)', 
        type: 'number', 
        required: false,
        min: 0,
        step: 0.1,
        placeholder: 'e.g., 35.5'
      },
      { 
        name: 'status', 
        label: 'Status', 
        type: 'select', 
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' }
        ],
        required: true,
        defaultValue: 'active'
      },
      // Amenities fields
      { 
        name: 'amenities[0]', 
        label: 'Amenity 1', 
        type: 'text', 
        required: false,
        placeholder: 'e.g., wifi'
      },
      { 
        name: 'amenities[1]', 
        label: 'Amenity 2', 
        type: 'text', 
        required: false,
        placeholder: 'e.g., tv'
      },
      { 
        name: 'amenities[2]', 
        label: 'Amenity 3', 
        type: 'text', 
        required: false,
        placeholder: 'e.g., ac'
      },
      { 
        name: 'amenities[3]', 
        label: 'Amenity 4', 
        type: 'text', 
        required: false,
        placeholder: 'e.g., minibar'
      },
      // Image fields
    { 
      name: 'images', 
      label: 'Room Type Images (Upload 4 images)', 
      type: 'file', 
      required: true,
      multiple: true,  // Enable multiple file selection
      accept: 'image/*',  // Only allow image files
      maxFiles: 4,  // Limit to 4 files
      placeholder: 'Select up to 4 room type images'
    }
    ];
  }, []);

  // Room form fields with proper validation and data handling
  const getRoomFields = useCallback(() => {
    const fields = [
      { 
        name: 'room_number', 
        label: 'Room Number', 
        type: 'text', 
        required: true,
        placeholder: 'e.g., 101, A-205'
      },
      { 
        name: 'room_type_id', 
        label: 'Room Type', 
        type: 'select', 
        options: roomTypes.map(type => ({
          value: type.id,
          label: `${type.name} - $${type.base_price}/night (${type.capacity} guests)`
        })),
        required: true,
        loading: roomTypesLoading,
        placeholder: roomTypesLoading ? 'Loading room types...' : 'Select a room type'
      },
      { 
        name: 'floor', 
        label: 'Floor Number', 
        type: 'number', 
        required: false,
        min: 0,
        placeholder: 'e.g., 1, 2, 3'
      },
      { 
        name: 'status', 
        label: 'Room Status', 
        type: 'select', 
        options: [
          { value: 'available', label: 'Available' },
          { value: 'occupied', label: 'Occupied' },
          { value: 'maintenance', label: 'Under Maintenance' },
          { value: 'out_of_order', label: 'Out of Order' }
        ],
        required: true,
        defaultValue: 'available'
      },
      { 
        name: 'notes', 
        label: 'Internal Notes', 
        type: 'textarea', 
        required: false,
        rows: 3,
        placeholder: 'Any special notes about this room...'
      }
    ];

    return fields;
  }, [roomTypes, roomTypesLoading]);

  // Effects
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  // Room Type management handlers
  const handleCreateRoomType = useCallback(() => {
    setRoomTypeModalMode('create');
    setSelectedRoomType(null);
    setShowRoomTypeModal(true);
  }, []);

  const handleEditRoomType = useCallback((roomType) => {
    setRoomTypeModalMode('edit');
    setSelectedRoomType(roomType);
    setShowRoomTypeModal(true);
  }, []);

  const handleViewRoomType = useCallback((roomType) => {
    setRoomTypeModalMode('view');
    setSelectedRoomType(roomType);
    setShowRoomTypeModal(true);
  }, []);

  const handleDeleteRoomType = useCallback((roomType) => {
    setDeleteTarget(roomType);
    setDeleteType('room-type');
    setShowDeleteDialog(true);
  }, []);

  const handleViewRoomTypeRooms = useCallback((roomType) => {
    setViewingRoomType(roomType);
    setShowRoomTypeRooms(true);
    setActiveTab('rooms');
  }, []);

  // Room Type save handler
 // Enhanced Room Type save handler with better debugging and validation
const handleSaveRoomType = useCallback(async (data) => {
  setIsSubmitting(true);
  
  // Debug: Log the received data
  console.log('Received form data:', data);
  
  try {
    // Handle both form data formats (FormData vs regular object)
    let formValues = {};
    
    if (data instanceof FormData) {
      // If data is FormData, convert to regular object
      for (let [key, value] of data.entries()) {
        formValues[key] = value;
      }
    } else {
      // If data is already an object, use it directly
      formValues = { ...data };
    }
    
    console.log('Processed form values:', formValues);
    
    // Trim all string values
    const trimmedData = {
      name: formValues.name?.toString().trim() || '',
      description: formValues.description?.toString().trim() || '',
      base_price: formValues.base_price?.toString().trim() || '',
      capacity: formValues.capacity?.toString().trim() || '',
      size: formValues.size?.toString().trim() || '',
      status: formValues.status || 'active'
    };
    
    console.log('Trimmed data:', trimmedData);

    // Enhanced validation with specific field checks
    const validationErrors = [];
    
    if (!trimmedData.name) {
      validationErrors.push('Room type name is required');
      console.error('Validation failed: name is empty or undefined');
    }
    
    if (!trimmedData.description) {
      validationErrors.push('Description is required');
      console.error('Validation failed: description is empty or undefined');
    }
    
    // Enhanced price validation
    const basePrice = parseFloat(trimmedData.base_price);
    if (!trimmedData.base_price || isNaN(basePrice) || basePrice <= 0) {
      validationErrors.push('Valid base price is required (must be greater than 0)');
      console.error('Validation failed: base_price is invalid:', trimmedData.base_price, 'parsed as:', basePrice);
    }
    
    // Enhanced capacity validation
    const capacity = parseInt(trimmedData.capacity);
    if (!trimmedData.capacity || isNaN(capacity) || capacity <= 0) {
      validationErrors.push('Valid capacity is required (must be at least 1)');
      console.error('Validation failed: capacity is invalid:', trimmedData.capacity, 'parsed as:', capacity);
    }

    if (validationErrors.length > 0) {
      console.error('Validation errors:', validationErrors);
      throw new Error(validationErrors.join('\n'));
    }

    // Prepare room type data
    const roomTypeData = { 
      hotel_id: parseInt(id),
      name: trimmedData.name,
      description: trimmedData.description,
      base_price: basePrice,
      capacity: capacity,
      size: trimmedData.size ? parseFloat(trimmedData.size) : null,
      status: trimmedData.status || 'active',
      amenities: []
    };

    // Handle amenities (check both array formats)
    for (let i = 0; i < 4; i++) {
      // Check for both formValues and trimmedData
      const amenity = (formValues[`amenities[${i}]`] || trimmedData[`amenities[${i}]`])?.toString().trim();
      if (amenity) {
        roomTypeData.amenities.push(amenity);
      }
    }
    
    console.log('Final room type data:', roomTypeData);

    let savedRoomType;
    if (roomTypeModalMode === 'create') {
      savedRoomType = await createRoomType(roomTypeData);
    } else if (roomTypeModalMode === 'edit') {
      savedRoomType = await updateRoomType(selectedRoomType.id, roomTypeData);
    }
    
    setShowRoomTypeModal(false);
    setSelectedRoomType(null);
    setIsSubmitting(false);
    
    // Show success message
    alert(`Room type ${roomTypeModalMode === 'create' ? 'created' : 'updated'} successfully!`);
    
  } catch (error) {
    console.error('Error saving room type:', error);
    setIsSubmitting(false);
    
    // Show user-friendly error message
    let errorMessage = 'Error saving room type:';
    if (error.response?.data?.message) {
      errorMessage += `\n${error.response.data.message}`;
    } else if (error.response?.data?.errors) {
      // Handle Laravel validation errors
      const validationErrors = Object.values(error.response.data.errors).flat();
      errorMessage += `\n${validationErrors.join('\n')}`;
    } else if (error.message) {
      errorMessage += `\n${error.message}`;
    } else {
      errorMessage += '\nAn unknown error occurred';
    }
    
    alert(errorMessage);
  }
}, [id, roomTypeModalMode, selectedRoomType, createRoomType, updateRoomType]);

  // Room management handlers
  const handleCreateRoom = useCallback(() => {
    if (!hasRoomTypes) {
      alert('Please create room types first before adding rooms.');
      return;
    }
    setRoomModalMode('create');
    setSelectedRoom(null);
    setShowRoomModal(true);
  }, [hasRoomTypes]);

  const handleEditRoom = useCallback((room) => {
    setRoomModalMode('edit');
    setSelectedRoom(room);
    setShowRoomModal(true);
  }, []);

  const handleViewRoom = useCallback((room) => {
    setRoomModalMode('view');
    setSelectedRoom(room);
    setShowRoomModal(true);
  }, []);

  const handleDeleteRoom = useCallback((room) => {
    setDeleteTarget(room);
    setDeleteType('room');
    setShowDeleteDialog(true);
  }, []);

  // Room save handler
  const handleSaveRoom = useCallback(async (data) => {
    try {
      // Validate required fields
      if (!data.room_number?.trim()) {
        throw new Error('Room number is required');
      }
      if (!data.room_type_id) {
        throw new Error('Room type is required');
      }
      if (!data.status) {
        throw new Error('Room status is required');
      }

      // Prepare room data with proper field mapping
      const roomData = { 
        hotel_id: parseInt(id),
        room_type_id: parseInt(data.room_type_id),
        room_number: data.room_number.trim(),
        floor: data.floor ? parseInt(data.floor) : null,
        status: data.status,
        notes: data.notes?.trim() || null
      };

      let savedRoom;
      if (roomModalMode === 'create') {
        savedRoom = await createRoom(roomData);
      } else if (roomModalMode === 'edit') {
        savedRoom = await updateRoom(selectedRoom.id, roomData);
      }
      
      setShowRoomModal(false);
      setSelectedRoom(null);
      
      // Show success message
      alert(`Room ${roomModalMode === 'create' ? 'created' : 'updated'} successfully!`);
      
    } catch (error) {
      console.error('Error saving room:', error);
      
      // Show user-friendly error message
      let errorMessage = 'Error saving room';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle Laravel validation errors
        const validationErrors = Object.values(error.response.data.errors).flat();
        errorMessage = validationErrors.join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    }
  }, [id, roomModalMode, selectedRoom, createRoom, updateRoom]);

  // Delete confirmation handler
  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;

    try {
      if (deleteType === 'room-type') {
        await deleteRoomType(deleteTarget.id);
        alert('Room type deleted successfully!');
      } else {
        await deleteRoom(deleteTarget.id);
        alert('Room deleted successfully!');
      }
      
      setShowDeleteDialog(false);
      setDeleteTarget(null);
      setDeleteType('room');
    } catch (error) {
      console.error('Error deleting:', error);
      
      let errorMessage = `Error deleting ${deleteType === 'room-type' ? 'room type' : 'room'}`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      alert(errorMessage);
    }
  }, [deleteTarget, deleteType, deleteRoom, deleteRoomType]);

  // Enhanced filtering with better performance
  const filteredRooms = useMemo(() => {
    if (!processedRooms.length) return [];
    
    let roomsToFilter = processedRooms;
    
    // If viewing a specific room type's rooms
    if (showRoomTypeRooms && viewingRoomType) {
      roomsToFilter = processedRooms.filter(room => 
        room.room_type_id === viewingRoomType.id || room.room_type?.id === viewingRoomType.id
      );
    }
    
    return roomsToFilter.filter(room => {
      const searchLower = (searchTerm || '').toLowerCase();
      
      const matchesSearch = !searchTerm || 
        room.room_number?.toString().toLowerCase().includes(searchLower) ||
        room.room_type?.name?.toLowerCase().includes(searchLower) ||
        (room.notes || '').toLowerCase().includes(searchLower);
      
      const matchesFilter = filterStatus === 'all' || room.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [processedRooms, searchTerm, filterStatus, showRoomTypeRooms, viewingRoomType]);

  const filteredRoomTypes = useMemo(() => {
    if (!processedRoomTypes.length) return [];
    
    return processedRoomTypes.filter(roomType => {
      const searchLower = (roomTypeSearchTerm || '').toLowerCase();
      
      const matchesSearch = !roomTypeSearchTerm || 
        roomType.name?.toLowerCase().includes(searchLower) ||
        roomType.description?.toLowerCase().includes(searchLower);
      
      const matchesFilter = roomTypeFilterStatus === 'all' || roomType.status === roomTypeFilterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [processedRoomTypes, roomTypeSearchTerm, roomTypeFilterStatus]);

  // Enhanced room type columns with room count click handler
  const enhancedRoomTypeColumns = useMemo(() => {
    return roomTypeColumns.map(col => {
      if (col.key === 'rooms_count') {
        return {
          ...col,
          render: (roomType) => {
            const count = roomType.rooms?.length || 0;
            return (
              <span className="flex items-center">
                <span className="mr-2">{count}</span>
                {count > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewRoomTypeRooms(roomType);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-xs underline"
                  >
                    View
                  </button>
                )}
              </span>
            );
          }
        };
      }
      return col;
    });
  }, [handleViewRoomTypeRooms]);

  // Loading state
  const isLoading = hotelLoading || roomTypesLoading;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (hotelError || roomTypesError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">
            {hotelError || roomTypesError || 'An unexpected error occurred'}
          </p>
          <button 
            onClick={loadInitialData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <HomeIcon className="w-4 h-4 text-gray-400" />
          </li>
          <li className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-2" />
            <span className="text-gray-500">Hotels</span>
          </li>
          <li className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-2" />
            <span className="text-gray-900 font-medium">{hotel?.name || 'Hotel Management'}</span>
          </li>
          {showRoomTypeRooms && viewingRoomType && (
            <li className="flex items-center">
              <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-2" />
              <span className="text-gray-900 font-medium">{viewingRoomType.name} Rooms</span>
            </li>
          )}
        </ol>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => window.history.back()}
            className="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{hotel?.name || 'Hotel'}</h1>
            <p className="text-gray-600">{hotel?.address || 'No location specified'}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Edit Hotel
          </button>
          <button 
            onClick={handleCreateRoom}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!hasRoomTypes}
            title={!hasRoomTypes ? 'Please create room types first' : 'Add new room'}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Room
          </button>
        </div>
      </div>

      {/* No Room Types Warning */}
      {roomTypesEmpty && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                No Room Types Available
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>You need to create room types before adding rooms.</p>
                <button 
                  onClick={handleCreateRoomType}
                  className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                >
                  Create First Room Type
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 gap-4">
        <StatCard
          title="Total Rooms"
          value={hotelStats.totalRooms}
          icon="🛏️"
          className="bg-blue-50 border-blue-200"
        />
        <StatCard
          title="Available"
          value={hotelStats.availableRooms}
          icon="✅"
          className="bg-green-50 border-green-200"
        />
        <StatCard
          title="Occupied"
          value={hotelStats.occupiedRooms}
          icon="👥"
          className="bg-yellow-50 border-yellow-200"
        />
        <StatCard
          title="Maintenance"
          value={hotelStats.maintenanceRooms}
          icon="🔧"
          className="bg-red-50 border-red-200"
        />
        <StatCard
          title="Cleaning"
          value={hotelStats.cleaningRooms}
          icon="🧹"
          className="bg-purple-50 border-purple-200"
        />
        <StatCard
          title="Occupancy"
          value={`${hotelStats.occupancyRate}%`}
          icon="📊"
          className="bg-indigo-50 border-indigo-200"
        />
        <StatCard
          title="Revenue"
          value={`$${hotelStats.monthlyRevenue}`}
          icon="💰"
          className="bg-emerald-50 border-emerald-200"
        />
        <StatCard
          title="Bookings"
          value={hotelStats.activeReservations}
          icon="📅"
          className="bg-orange-50 border-orange-200"
        />
      </div>

      {/* Room Type Breakdown */}
      {Object.keys(hotelStats.roomTypeBreakdown).length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-3">Room Type Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(hotelStats.roomTypeBreakdown).map(([typeName, count]) => (
              <div key={typeName} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{typeName}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'rooms', 'room-types', 'bookings', 'staff'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab !== 'rooms') {
                  setShowRoomTypeRooms(false);
                  setViewingRoomType(null);
                }
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Hotel Information</h3>
            <div className="space-y-3 text-sm">
              <div><span className="font-medium">Address:</span> {hotel?.address || 'N/A'}</div>
              <div><span className="font-medium">Phone:</span> {hotel?.phone || 'N/A'}</div>
              <div><span className="font-medium">Email:</span> {hotel?.email || 'N/A'}</div>
              <div><span className="font-medium">Website:</span> {hotel?.website || 'N/A'}</div>
              <div><span className="font-medium">Total Room Types:</span> {roomTypes.length}</div>
              <div><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  hotel?.status === 'active' ? 'bg-green-100 text-green-800' :
                  hotel?.status === 'inactive' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {hotel?.status || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={handleCreateRoom}
                disabled={!hasRoomTypes}
                className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🛏️ Add New Room
              </button>
              <button 
                onClick={() => setActiveTab('room-types')}
                className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                🏨 Manage Room Types
              </button>
              <button 
                onClick={() => setActiveTab('bookings')}
                className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                📅 View Bookings
              </button>
              <button 
                onClick={() => setActiveTab('staff')}
                className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                👥 Manage Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rooms' && (
        <div className="space-y-4">
          {/* Back button when viewing specific room type's rooms */}
          {showRoomTypeRooms && viewingRoomType && (
            <button 
              onClick={() => {
                setShowRoomTypeRooms(false);
                setViewingRoomType(null);
              }}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Back to all rooms
            </button>
          )}

          {/* Room type header when viewing specific room type's rooms */}
          {showRoomTypeRooms && viewingRoomType && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="text-lg font-medium">{viewingRoomType.name} Rooms</h3>
              <p className="text-gray-600">{viewingRoomType.description}</p>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="text-sm">
                  <span className="font-medium">Base Price:</span> ${viewingRoomType.base_price}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Capacity:</span> {viewingRoomType.capacity} guests
                </div>
                <div className="text-sm">
                  <span className="font-medium">Size:</span> {viewingRoomType.size || 'N/A'} sqm
                </div>
                <div className="text-sm">
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    viewingRoomType.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {viewingRoomType.status?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterValue={filterStatus}
              onFilterChange={setFilterStatus}
              filterOptions={[
                { value: 'all', label: 'All Status' },
                { value: 'available', label: 'Available' },
                { value: 'occupied', label: 'Occupied' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'out_of_order', label: 'Out of Order' }
              ]}
              placeholder="Search rooms by number, type, or notes..."
            />
          </div>

          <CRUDTable
            data={filteredRooms}
            columns={roomColumns}
            loading={roomsLoading}
            actions={[
              {
                label: 'View',
                icon: EyeIcon,
                onClick: handleViewRoom,
                className: 'text-blue-600 hover:text-blue-800'
              },
              {
                label: 'Edit',
                icon: PencilIcon,
                onClick: handleEditRoom,
                className: 'text-yellow-600 hover:text-yellow-800'
              },
              {
                label: 'Delete',
                icon: TrashIcon,
                onClick: handleDeleteRoom,
                className: 'text-red-600 hover:text-red-800'
              }
            ]}
          />
        </div>
      )}

      {/* Room Types Tab */}
      {activeTab === 'room-types' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <SearchFilter
              searchTerm={roomTypeSearchTerm}
              onSearchChange={setRoomTypeSearchTerm}
              filterValue={roomTypeFilterStatus}
              onFilterChange={setRoomTypeFilterStatus}
              filterOptions={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
              placeholder="Search room types by name or description..."
            />
            <button 
              onClick={handleCreateRoomType}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Room Type
            </button>
          </div>

          <CRUDTable
            data={filteredRoomTypes}
            columns={enhancedRoomTypeColumns}
            loading={roomTypesLoading}
            actions={[
              {
                label: 'View',
                icon: EyeIcon,
                onClick: handleViewRoomType,
                className: 'text-blue-600 hover:text-blue-800'
              },
              {
                label: 'Edit',
                icon: PencilIcon,
                onClick: handleEditRoomType,
                className: 'text-yellow-600 hover:text-yellow-800'
              },
              {
                label: 'Delete',
                icon: TrashIcon,
                onClick: handleDeleteRoomType,
                className: 'text-red-600 hover:text-red-800'
              }
            ]}
          />
        </div>
      )}

      {/* Other tabs... */}
      {activeTab === 'bookings' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Bookings Management</h3>
          <p className="text-gray-600">Bookings management functionality will be implemented here.</p>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Staff Management</h3>
          <p className="text-gray-600">Staff management functionality will be implemented here.</p>
        </div>
      )}

      {/* Modals */}
      <CRUDModal
        isOpen={showRoomModal}
        onClose={() => setShowRoomModal(false)}
        mode={roomModalMode}
        type="room"
        data={selectedRoom}
        onSave={handleSaveRoom}
        fields={getRoomFields()}
        title={`${roomModalMode === 'create' ? 'Add New' : roomModalMode === 'edit' ? 'Edit' : 'View'} Room`}
      />

      <CRUDModal
        isOpen={showRoomTypeModal}
        onClose={() => setShowRoomTypeModal(false)}
        mode={roomTypeModalMode}
        type="room-type"
        data={selectedRoomType}
        onSave={handleSaveRoomType}
        fields={getRoomTypeFields()}
        title={`${roomTypeModalMode === 'create' ? 'Add New' : roomTypeModalMode === 'edit' ? 'Edit' : 'View'} Room Type`}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title={`Delete ${deleteType === 'room-type' ? 'Room Type' : 'Room'}`}
        message={`Are you sure you want to delete ${deleteType === 'room-type' ? 
          `room type "${deleteTarget?.name}"` : 
          `room ${deleteTarget?.room_number}`}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}