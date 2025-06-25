"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { useAuthHook } from "@hooks/authHook";
import { useDashboard } from "@/hooks/useDashboard";
import CRUDModal from "@components/owner/component/dashboard/CRUDModal";
import {
  Calendar,
  Building,
  BarChart3,
  DollarSign,
  BedDouble,
  Eye,
  Edit,
  XCircle,
  TrendingUp,
  Plus,
} from "lucide-react";
import axios from "axios";
import Loading from "@app/loading";

const getStatusColor = (status) => {
  switch (status) {
    case "active":
    case "confirmed":
      return "text-green-600 bg-green-100";
    case "inactive":
    case "cancelled":
      return "text-red-600 bg-red-100";
    case "maintenance":
    case "pending":
      return "text-yellow-600 bg-yellow-100";
    case "checked_in":
      return "text-blue-600 bg-blue-100";
    case "checked_out":
      return "text-gray-600 bg-gray-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://127.0.0.1:8000";

const Page = () => {
  const { user, loading: authLoading, token } = useAuthHook();
  const {
    hotels,
    stats,
    loading: dashboardLoading,
    fetchOwnerData,
    reservations,
  } = useDashboard();

  //console.log("reservations:" , reservations)

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Initialize API client
  const apiClient = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Fetch data when user and token are available
  useEffect(() => {
    if (user?.id && token && isInitialLoad) {
      const fetchData = async () => {
        try {
          await fetchOwnerData(user.id);
          setIsInitialLoad(false);
        } catch (error) {
          console.error("Initial data fetch error:", error);
          setFetchError(error.message);
        }
      };
      fetchData();
    }
  }, [user, token, fetchOwnerData, isInitialLoad]);

  // Handle modal operations
  const handleCreateNew = (type) => {
    setModalType(type);
    setModalMode("create");
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (type, item) => {
    setModalType(type);
    setModalMode("edit");
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (type, item) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const endpoint =
        type === "hotel"
          ? `/owner/hotels/${item.id}`
          : `/reservations/${item.id}`;

      await apiClient.delete(endpoint);
      alert(`${type} deleted successfully!`);
      fetchOwnerData(user.id);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Failed to delete ${type}. Error: ${errorMessage}`);
    }
  };

  // 1. Fix the handleSaveModal function in your main component
const handleSaveModal = async (formData) => {
  try {
    console.log('Form data received:', formData); // Debug log
    
    const isHotel = modalType === "hotel";
    const endpoint = isHotel
      ? modalMode === "create"
        ? "/owner/hotels"
        : `/owner/hotels/${selectedItem.id}`
      : modalMode === "create"
      ? "/reservations"
      : `/reservations/${selectedItem.id}`;

    const method = modalMode === "create" ? "post" : "put";

    let dataToSend;
    
    // Check if formData is FormData (for file uploads)
    if (formData instanceof FormData) {
      dataToSend = formData;
      
      // Set appropriate headers for FormData
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token ? `Bearer ${token}` : "",
        }
      };
      
      console.log('Sending FormData for file upload');
      await apiClient[method](endpoint, dataToSend, config);
    } else {
      // Regular JSON data
      dataToSend = { ...formData };
      
      if (isHotel) {
        // Process hotel-specific data
        if (dataToSend.latitude) {
          dataToSend.latitude = parseFloat(dataToSend.latitude);
        }
        if (dataToSend.longitude) {
          dataToSend.longitude = parseFloat(dataToSend.longitude);
        }
        
        // Ensure amenities is properly formatted
        if (dataToSend.amenities && Array.isArray(dataToSend.amenities)) {
          dataToSend.amenities = JSON.stringify(dataToSend.amenities);
        }
      } else {
        // Reservation data processing
        dataToSend.check_in = new Date(dataToSend.check_in).toISOString();
        dataToSend.check_out = new Date(dataToSend.check_out).toISOString();
        dataToSend.total_amount = parseFloat(dataToSend.total_amount);
      }
      
      console.log('Sending JSON data:', dataToSend); // Debug log
      await apiClient[method](endpoint, dataToSend);
    }

    alert(`${modalType} ${modalMode}d successfully!`);
    setIsModalOpen(false);
    fetchOwnerData(user.id);
  } catch (error) {
    console.error('Save error:', error);
    
    // Better error handling
    if (error.response?.status === 422) {
      const validationErrors = error.response.data?.errors || error.response.data?.message;
      console.error('Validation errors:', validationErrors);
      
      if (typeof validationErrors === 'object') {
        const errorMessages = Object.values(validationErrors).flat().join('\n');
        alert(`Validation failed:\n${errorMessages}`);
      } else {
        alert(`Validation failed: ${validationErrors}`);
      }
    } else {
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Failed to ${modalMode} ${modalType}. Error: ${errorMessage}`);
    }
  }
};

  const loading = authLoading || dashboardLoading;

  if (loading) {
  return <Loading/>;
}

  // Check if user is authorized (Owner role)
  /* if (!user || user.role !== 'Owner') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Access Denied. Owner privileges required.</div>
      </div>
    );
  } */

  // 2. Updated hotelFields with proper validation
const hotelFields = [
  { name: "name", label: "Hotel Name", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "address", label: "Address", type: "text", required: true },
  { name: "city", label: "City", type: "text", required: true },
  { name: "state", label: "State", type: "text", required: true },
  { name: "country", label: "Country", type: "text", required: true },
  { name: "postal_code", label: "Postal Code", type: "text", required: true },
  { name: "latitude", label: "Latitude", type: "number", required: false, step: "any" },
  { name: "longitude", label: "Longitude", type: "number", required: false, step: "any" },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "website", label: "Website", type: "url", required: false },
  { 
    name: "amenities", 
    label: "Amenities", 
    type: "multiselect",
    options: ["Pool", "Gym", "Spa", "Restaurant", "WiFi", "Parking"],
    required: false
  },
  { 
    name: "images", 
    label: "Hotel Images", 
    type: "file", 
    required: true,
    multiple: true,
    accept: "image/*"
  },
  { 
    name: "status", 
    label: "Status", 
    type: "select",
    options: ["active", "inactive", "under_review"],
    required: true
  }
];

  const reservationFields = [
    { name: "guest_name", label: "Guest Name", type: "text", required: true },
    {
      name: "hotel_id",
      label: "Hotel",
      type: "select",
      options: Array.isArray(hotels)
        ? hotels.map((hotel) => ({ value: hotel.id, label: hotel.name }))
        : [],
      required: true,
    },
    { name: "room_number", label: "Room Number", type: "text", required: true },
    { name: "check_in", label: "Check-in Date", type: "date", required: true },
    {
      name: "check_out",
      label: "Check-out Date",
      type: "date",
      required: true,
    },
    {
      name: "total_amount",
      label: "Total Amount",
      type: "number",
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        "pending",
        "confirmed",
        "checked_in",
        "checked_out",
        "cancelled",
      ],
      required: true,
    },
    {
      name: "guest_email",
      label: "Guest Email",
      type: "email",
      required: false,
    },
    {
      name: "guest_phone",
      label: "Guest Phone",
      type: "text",
      required: false,
    },
  ];

  const currentFields = modalType === "hotel" ? hotelFields : reservationFields;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Hotel Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome, {user?.name}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {user?.role || "Owner"}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "dashboard"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("hotels")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "hotels"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Building className="w-4 h-4 inline mr-2" />
            Hotels
          </button>
          <button
            onClick={() => setActiveTab("reservations")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "reservations"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Reservations
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "reports"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Reports
          </button>
        </div>

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${stats?.monthlyRevenue || 0}
                    </p>
                    <p className="text-xs text-gray-500">This Month</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Occupancy Rate
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.avgOccupancy || 0}%
                    </p>
                    <p className="text-xs text-gray-500">Average</p>
                  </div>
                  <BedDouble className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Hotels
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.totalHotels || 0}
                    </p>
                    <p className="text-xs text-gray-500">Active</p>
                  </div>
                  <Building className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Reservations
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.activeReservations || 0}
                    </p>
                    <p className="text-xs text-gray-500">
                      Total: {stats?.totalReservations || 0}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Recent Hotels Table */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  Your Hotels (Recent 1)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Hotel Name
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Location
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Rooms
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Occupancy
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.isArray(hotels) &&
                      hotels.slice(0, 5).map((hotel) => (
                        <tr key={hotel.id}>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-900">
                            {hotel.name}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                            {hotel.country} / {hotel.city} / {hotel.address}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                            {stats.hotelStats?.find(h => h.hotelId === hotel.id)?.totalRooms || stats.hotelSummary?.[hotel.id]?.rooms || 0}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                            {stats.hotelStats?.find(h => h.hotelId === hotel.id)?.occupancyRate || 0}%
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                hotel.status
                              )}`}
                            >
                              {hotel.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex justify-center text-center whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  (window.location.href = `/dashboard/owner/hotels/${hotel.id}`)
                                }
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEdit("hotel", hotel)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete("hotel", hotel)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Reservations Table */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Reservations (Recent 5)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Guest
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Hotel
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Room
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.isArray(reservations) &&
                      reservations.slice(0, 5).map((reservation) => (
                        <tr key={reservation.id}>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-900">
                            {reservation.user.name}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                            {hotels.find(
                              (hotel) => hotel.id === reservation.hotel_id
                            )?.name || reservation.property_name}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                            {reservation.room?.room_number}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                            {format(
                              parseISO(reservation.check_in_date),
                              "MMM d, yyyy"
                            )}{" "}
                            -{" "}
                            {format(
                              parseISO(reservation.check_out_date),
                              "MMM d, yyyy"
                            )}
                          </td>

                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                            ${reservation.total_amount}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                reservation.status
                              )}`}
                            >
                              {reservation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex justify-center whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleEdit("reservation", reservation)
                                }
                                className="text-green-600 hover:text-green-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete("reservation", reservation)
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Hotels Content */}
        {activeTab === "hotels" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Hotels Management
              </h2>
              <button
                onClick={() => handleCreateNew("hotel")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Hotel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(hotels) &&
                hotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="bg-white rounded-lg shadow-sm border overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {hotel.name}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            hotel.status
                          )}`}
                        >
                          {hotel.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{hotel.country} / {hotel.city} / {hotel.address}</p>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Total Rooms:
                          </span>
                          <span className="text-sm font-medium">
                            {stats.hotelStats?.find(h => h.hotelId === hotel.id)?.totalRooms || hotel.total_rooms || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Occupancy Rate:
                          </span>
                          <span className="text-sm font-medium">
                            {stats.hotelStats?.find(h => h.hotelId === hotel.id)?.occupancyRate || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Monthly Revenue:
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            ${stats.hotelStats?.find(h => h.hotelId === hotel.id)?.monthlyRevenue || 0}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t flex justify-between">
                        <button
                          onClick={() =>
                            (window.location.href = `/dashboard/owner/hotels/${hotel.id}`)
                          }
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleEdit("hotel", hotel)}
                          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete("hotel", hotel)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Reservations Content */}
        {activeTab === "reservations" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Reservations Management
              </h2>
              <button
                onClick={() => handleCreateNew("reservation")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Reservation
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        ID
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Guest
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Hotel
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Room
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Check-in
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Check-out
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.isArray(reservations) &&
                      reservations.map((reservation) => (
                        <tr key={reservation.id}>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                            #{reservation.id}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-900">
                            {reservation.user.name}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                            {hotels.find(
                              (hotel) => hotel.id === reservation.hotel_id
                            )?.name || reservation.property_name}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                            {reservation.room?.room_number}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                            {format(parseISO(reservation.check_in_date),"MMM d, yyyy")}{" "}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                            {format(parseISO(reservation.check_out_date),"MMM d, yyyy")}{" "}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                            ${reservation.total_amount}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                reservation.status
                              )}`}
                            >
                              {reservation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex justify-center whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleEdit("reservation", reservation)
                                }
                                className="text-green-600 hover:text-green-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete("reservation", reservation)
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reports Content */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Reports & Analytics
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Revenue Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Revenue:</span>
                    <span className="font-semibold">
                      ${stats.monthlyRevenue || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quarterly Projection:</span>
                    <span className="font-semibold">
                      ${(stats.monthlyRevenue || 0) * 3}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Projection:</span>
                    <span className="font-semibold">
                      ${(stats.monthlyRevenue || 0) * 12}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Occupancy Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Occupancy:</span>
                    <span className="font-semibold">
                      {stats.avgOccupancy || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Rooms:</span>
                    <span className="font-semibold">
                      {stats.totalRooms || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Hotels:</span>
                    <span className="font-semibold">
                      {stats.totalHotels || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border col-span-full">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Reservation Trends
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Reservations:</span>
                    <span className="font-semibold">
                      {stats.totalReservations || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Confirmed Reservations:
                    </span>
                    <span className="font-semibold">
                      {Array.isArray(reservations)
                        ? reservations.filter((r) => r.status === "confirmed")
                            .length
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Checked-in Today:</span>
                    <span className="font-semibold">
                      {Array.isArray(reservations)
                        ? reservations.filter(
                            (r) =>
                              r.status === "checked_in" &&
                              new Date(r.check_in)
                                .toISOString()
                                .slice(0, 10) ===
                                new Date().toISOString().slice(0, 10)
                          ).length
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Reservations:</span>
                    <span className="font-semibold">
                      {Array.isArray(reservations)
                        ? reservations.filter((r) => r.status === "pending")
                            .length
                        : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {isModalOpen && (
        <CRUDModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode={modalMode}
          type={modalType}
          data={selectedItem}
          onSave={handleSaveModal}
          fields={currentFields}
          // Pass hotels for the reservation dropdown
          hotels={
            modalType === "reservation"
              ? Array.isArray(hotels)
                ? hotels
                : []
              : []
          }
        />
      )}
    </div>
  );
};

export default Page;
