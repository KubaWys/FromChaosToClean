// JavaScript/Node.js version of validation utilities
// TODO: This is duplicated in different forms across services!

// Email validation - similar logic exists in Express backend
function validateEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password validation - different rules in each service
function validatePassword(password) {
    if (!password) return { valid: false, message: 'Password is required' };
    if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };
    return { valid: true };
}

// User input validation - inconsistent with backend
function validateUserData(userData) {
    const errors = [];
    
    if (!userData.username || userData.username.trim().length < 3) {
        errors.push('Username must be at least 3 characters');
    }
    
    if (!validateEmail(userData.email)) {
        errors.push('Invalid email format');
    }
    
    const passwordCheck = validatePassword(userData.password);
    if (!passwordCheck.valid) {
        errors.push(passwordCheck.message);
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Product validation - missing from other services
function validateProduct(product) {
    const errors = [];
    
    if (!product.name || product.name.trim().length < 2) {
        errors.push('Product name must be at least 2 characters');
    }
    
    if (!product.price || product.price <= 0) {
        errors.push('Product price must be greater than 0');
    }
    
    if (product.stock === undefined || product.stock < 0) {
        errors.push('Product stock must be 0 or greater');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

module.exports = {
    validateEmail,
    validatePassword,
    validateUserData,
    validateProduct
};