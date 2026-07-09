// ============================================
// API Client
// ============================================

export const API_BASE_URL = 'https://civicvoice-api-g6ws.onrender.com/api/v1';

export async function fetchWithAuth(endpoint, options = {}) {
    const authData = JSON.parse(localStorage.getItem('civicvoice_auth') || '{}');
    const token = authData.token;
    
    const isFormData = options.body instanceof FormData;
    const headers = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401 || response.status === 403) {
        // Token is likely expired or invalid
        localStorage.removeItem('civicvoice_auth');
        localStorage.removeItem('civicvoice_user');
        window.location.hash = '#/login';
        throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
        let errorData = {};
        try {
            const rawText = await response.text();
            try {
                errorData = JSON.parse(rawText);
            } catch (e) {
                console.error(`Non-JSON API Error (${response.status}):`, rawText);
                errorData = { message: `Request failed with status ${response.status}` };
            }
        } catch(e) {
            errorData = { message: 'An error occurred reading the error response.' };
        }
        throw new Error(errorData.message || errorData.error || response.statusText);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}
