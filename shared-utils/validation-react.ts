// TypeScript/React version of validation utilities
// TODO: This should match the backend validation but doesn't!

// Email validation - client-side version with different rules
export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  // Different regex pattern than backend!
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailPattern.test(email);
};

// Password validation - missing server-side complexity rules
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {  // Different from Python version!
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  // Missing uppercase requirement that Python has
  return { isValid: true };
};

// Form validation - React-specific but duplicates backend logic
export interface UserFormData {
  username: string;
  email: string;
  password: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateUserForm = (formData: UserFormData): ValidationResult => {
  const errors: string[] = [];
  
  // Username validation - different rules from backend
  if (!formData.username || formData.username.trim().length < 3) {
    errors.push('Username must be at least 3 characters'); // Different from Python!
  }
  
  // Email validation
  if (!validateEmail(formData.email)) {
    errors.push('Please enter a valid email address');
  }
  
  // Password validation
  const passwordResult = validatePassword(formData.password);
  if (!passwordResult.isValid && passwordResult.message) {
    errors.push(passwordResult.message);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Product form validation - missing from backend
export interface ProductFormData {
  name: string;
  price: number;
  description: string;
  stock: number;
}

export const validateProductForm = (product: ProductFormData): ValidationResult => {
  const errors: string[] = [];
  
  if (!product.name || product.name.trim().length < 2) {
    errors.push('Product name must be at least 2 characters');
  }
  
  if (!product.price || isNaN(product.price) || product.price <= 0) {
    errors.push('Price must be a positive number');
  }
  
  if (product.stock === undefined || isNaN(product.stock) || product.stock < 0) {
    errors.push('Stock must be zero or greater');
  }
  
  if (!product.description || product.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Real-time validation helpers - only exist in frontend
export const validateField = (fieldName: string, value: string): string | null => {
  switch (fieldName) {
    case 'email':
      return validateEmail(value) ? null : 'Invalid email format';
    case 'password':
      const result = validatePassword(value);
      return result.isValid ? null : result.message || 'Invalid password';
    case 'username':
      return value.trim().length >= 3 ? null : 'Username too short';
    default:
      return null;
  }
};

// Form state management - React-specific
export const validateFormState = (formState: Record<string, string>): Record<string, string | null> => {
  const fieldErrors: Record<string, string | null> = {};
  
  Object.keys(formState).forEach(fieldName => {
    fieldErrors[fieldName] = validateField(fieldName, formState[fieldName]);
  });
  
  return fieldErrors;
};