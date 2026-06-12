const API_BASE_URL = 'https://examos-backend-lxa4.onrender.com';

/**
 * 🛡️ THE INTERCEPTOR
 * This master function attaches your JWT "ID Badge" to every request.
 */
async function apiCall(endpoint, method = 'GET', body = null, isFileUpload = false) {
  try {
    // 1. Grab the token from the browser's secure local storage
    const token = localStorage.getItem('token'); 
    
    // 2. Set up the default headers
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`; // 📎 Staple the ID badge to the request
    }

    // 3. Handle JSON vs. File Uploads
    const options = { method, headers };
    
    if (body) {
      if (isFileUpload) {
        options.body = body; 
      } else {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
      }
    }

    // 4. Send the request
    const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, options);
    
    // 5. Handle Token Expiry / Unauthorized Access
    if (response.status === 401) {
      console.warn("🚨 Unauthorized: Token expired or invalid. Clearing session...");
      localStorage.removeItem('token');
      // Force reload to the landing/login page
      window.location.href = '/'; 
      throw new Error('Session expired. Please log in again.');
    }
    
    // 6. Parse the response
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error(`🚨 API Error [${method} ${endpoint}]:`, data?.error || response.statusText);
      throw new Error(data?.error || 'Network error occurred');
    }

    return data;
  } catch (error) {
    console.error("🚨 Fetch Interceptor caught an error:", error.message);
    throw error;
  }
}

/**
 * 🛠️ EXPORTED HELPER METHODS
 */

// GET data
export const fetchData = (endpoint) => apiCall(endpoint, 'GET');

// POST data
export const postData = (endpoint, body) => apiCall(endpoint, 'POST', body);

// POST files
export const uploadFiles = (endpoint, formData) => apiCall(endpoint, 'POST', formData, true);

// PATCH data
export const patchData = (endpoint, body) => apiCall(endpoint, 'PATCH', body);

// DELETE data
export const deleteData = (endpoint) => apiCall(endpoint, 'DELETE');