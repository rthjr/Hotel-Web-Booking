const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;

export const API_ENDPOINTS = {
    HOTELS: `${API_BASE_URL}/hotels`,
    FACILITIES: `${API_BASE_URL}/facilities`,
    ROOMS: `${API_BASE_URL}/rooms`,
    EXPLORE: `${API_BASE_URL}/explore`,
};

export const LARAVEL_ENDPOINT = {
    HOTELS: `${LARAVEL_API_URL}/api/hotels`,
    ROOMS: `${LARAVEL_API_URL}/api/rooms`,
    RESERVATION: `${LARAVEL_API_URL}/api/reservations`,
}