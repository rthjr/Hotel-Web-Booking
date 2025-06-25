// HotelSwitcher Component
const HotelSwitcher = ({ hotels, selectedHotel, onHotelChange }) => {
  return (
    <div className="relative">
      <select
        value={selectedHotel?.id || ''}
        onChange={(e) => {
          const hotel = hotels.find(h => h.id === e.target.value);
          onHotelChange(hotel);
        }}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="">All Hotels</option>
        {hotels.map((hotel) => (
          <option key={hotel.id} value={hotel.id}>
            {hotel.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default HotelSwitcher;