// API client utilities - different implementations across services
// TODO: Each service handles API calls differently!

// Express backend version (if it had one)
const express_api_config = {
    baseURL: 'http://localhost:3001/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
};

// Simple request wrapper - missing error handling
function makeRequest(endpoint, options = {}) {
    const url = `${express_api_config.baseURL}${endpoint}`;
    
    return fetch(url, {
        method: options.method || 'GET',
        headers: {
            ...express_api_config.headers,
            ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
    }).then(response => response.json());
}

module.exports = { makeRequest, express_api_config };