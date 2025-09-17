// Date and time utilities - inconsistent across services
// TODO: Each service handles dates differently!

// JavaScript version - basic date handling
function getCurrentTimestamp() {
    return new Date().toISOString();
}

function formatDate(date) {
    // Inconsistent format across services
    return new Date(date).toLocaleDateString('en-US');
}

function formatDateTime(date) {
    return new Date(date).toLocaleString('en-US');
}

// Age calculation - missing from other services
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

module.exports = {
    getCurrentTimestamp,
    formatDate,
    formatDateTime,
    calculateAge
};