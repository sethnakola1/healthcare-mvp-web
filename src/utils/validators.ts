// utils/validators.ts
import { BusinessRole, VALIDATION_RULES } from '../types/business.types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface PasswordValidationResult {
  isValid: boolean;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
  errors: string[];
}

export class BusinessUserValidator {
  /**
   * Validate first name
   */
  static validateFirstName(firstName: string): { isValid: boolean; error?: string } {
    const rules = VALIDATION_RULES.firstName;

    if (rules.required && !firstName?.trim()) {
      return { isValid: false, error: 'First name is required' };
    }

    if (firstName && firstName.length < rules.minLength) {
      return { isValid: false, error: `First name must be at least ${rules.minLength} characters` };
    }

    if (firstName && firstName.length > rules.maxLength) {
      return { isValid: false, error: `First name must not exceed ${rules.maxLength} characters` };
    }

    if (firstName && !rules.pattern.test(firstName)) {
      return { isValid: false, error: 'First name can only contain letters, spaces, hyphens, and apostrophes' };
    }

    return { isValid: true };
  }

  /**
   * Validate last name
   */
  static validateLastName(lastName: string): { isValid: boolean; error?: string } {
    const rules = VALIDATION_RULES.lastName;

    if (rules.required && !lastName?.trim()) {
      return { isValid: false, error: 'Last name is required' };
    }

    if (lastName && lastName.length < rules.minLength) {
      return { isValid: false, error: `Last name must be at least ${rules.minLength} characters` };
    }

    if (lastName && lastName.length > rules.maxLength) {
      return { isValid: false, error: `Last name must not exceed ${rules.maxLength} characters` };
    }

    if (lastName && !rules.pattern.test(lastName)) {
      return { isValid: false, error: 'Last name can only contain letters, spaces, hyphens, and apostrophes' };
    }

    return { isValid: true };
  }

  /**
   * Validate email
   */
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    const rules = VALIDATION_RULES.email;

    if (rules.required && !email?.trim()) {
      return { isValid: false, error: 'Email is required' };
    }

    if (email && email.length > rules.maxLength) {
      return { isValid: false, error: `Email must not exceed ${rules.maxLength} characters` };
    }

    if (email && !rules.pattern.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }

    return { isValid: true };
  }

  /**
   * Validate username
   */
  static validateUsername(username: string): { isValid: boolean; error?: string } {
    const rules = VALIDATION_RULES.username;

    if (rules.required && !username?.trim()) {
      return { isValid: false, error: 'Username is required' };
    }

    if (username && username.length < rules.minLength) {
      return { isValid: false, error: `Username must be at least ${rules.minLength} characters` };
    }

    if (username && username.length > rules.maxLength) {
      return { isValid: false, error: `Username must not exceed ${rules.maxLength} characters` };
    }

    if (username && !rules.pattern.test(username)) {
      return { isValid: false, error: 'Username can only contain letters, numbers, dots, underscores, and hyphens' };
    }

    return { isValid: true };
  }

  /**
   * Validate password with detailed requirements
   */
  static validatePassword(password: string): PasswordValidationResult {
    const rules = VALIDATION_RULES.password;
    const requirements = {
      length: password.length >= rules.minLength,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*]/.test(password),
    };

    const errors: string[] = [];

    if (!requirements.length) {
      errors.push(`Password must be at least ${rules.minLength} characters long`);
    }
    if (!requirements.uppercase) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!requirements.lowercase) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!requirements.number) {
      errors.push('Password must contain at least one number');
    }
    if (!requirements.special) {
      errors.push('Password must contain at least one special character (!@#$%^&*)');
    }

    return {
      isValid: errors.length === 0,
      requirements,
      errors,
    };
  }

  /**
   * Validate password confirmation
   */
  static validatePasswordConfirmation(password: string, confirmPassword: string): { isValid: boolean; error?: string } {
    if (!confirmPassword) {
      return { isValid: false, error: 'Please confirm your password' };
    }

    if (password !== confirmPassword) {
      return { isValid: false, error: 'Passwords do not match' };
    }

    return { isValid: true };
  }

  /**
   * Validate phone number
   */
  static validatePhoneNumber(phoneNumber: string): { isValid: boolean; error?: string } {
    const rules = VALIDATION_RULES.phoneNumber;

    // Phone number is optional
    if (!phoneNumber?.trim()) {
      return { isValid: true };
    }

    if (!rules.pattern.test(phoneNumber)) {
      return { isValid: false, error: 'Please enter a valid phone number (E.164 format)' };
    }

    return { isValid: true };
  }

  /**
   * Validate territory
   */
  static validateTerritory(territory: string): { isValid: boolean; error?: string } {
    const rules = VALIDATION_RULES.territory;

    if (rules.required && !territory?.trim()) {
      return { isValid: false, error: 'Territory is required' };
    }

    if (territory && territory.length < rules.minLength) {
      return { isValid: false, error: `Territory must be at least ${rules.minLength} characters` };
    }

    if (territory && territory.length > rules.maxLength) {
      return { isValid: false, error: `Territory must not exceed ${rules.maxLength} characters` };
    }

    return { isValid: true };
  }

  /**
   * Validate commission percentage
   */
  static validateCommissionPercentage(commissionPercentage: number, role: BusinessRole): { isValid: boolean; error?: string } {
    const rules = VALIDATION_RULES.commissionPercentage;

    if (role === BusinessRole.SUPER_ADMIN) {
      // Super Admin should have 0% commission
      if (commissionPercentage !== 0) {
        return { isValid: false, error: 'Super Admin commission should be 0%' };
      }
      return { isValid: true };
    }

    if (commissionPercentage < rules.min) {
      return { isValid: false, error: `Commission percentage must be at least ${rules.min}%` };
    }

    if (commissionPercentage > rules.max) {
      return { isValid: false, error: `Commission percentage cannot exceed ${rules.max}%` };
    }

    return { isValid: true };
  }

  /**
   * Validate target hospitals monthly
   */
  static validateTargetHospitalsMonthly(targetHospitals: number, role: BusinessRole): { isValid: boolean; error?: string } {
    const rules = VALIDATION_RULES.targetHospitalsMonthly;

    if (role === BusinessRole.SUPER_ADMIN) {
      // Super Admin should have 0 target hospitals
      if (targetHospitals !== 0) {
        return { isValid: false, error: 'Super Admin target hospitals should be 0' };
      }
      return { isValid: true };
    }

    if (targetHospitals < rules.min) {
      return { isValid: false, error: `Target hospitals must be at least ${rules.min}` };
    }

    if (targetHospitals > rules.max) {
      return { isValid: false, error: `Target hospitals cannot exceed ${rules.max}` };
    }

    return { isValid: true };
  }

  /**
   * Validate entire business user form
   */
  static validateBusinessUserForm(formData: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    territory: string;
    businessRole: BusinessRole;
    commissionPercentage: number;
    targetHospitalsMonthly: number;
  }): ValidationResult {
    const errors: Record<string, string> = {};

    // Validate each field
    const firstNameValidation = this.validateFirstName(formData.firstName);
    if (!firstNameValidation.isValid) {
      errors.firstName = firstNameValidation.error!;
    }

    const lastNameValidation = this.validateLastName(formData.lastName);
    if (!lastNameValidation.isValid) {
      errors.lastName = lastNameValidation.error!;
    }

    const emailValidation = this.validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error!;
    }

    const usernameValidation = this.validateUsername(formData.username);
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.error!;
    }

    const passwordValidation = this.validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0]; // Show first error
    }

    const confirmPasswordValidation = this.validatePasswordConfirmation(formData.password, formData.confirmPassword);
    if (!confirmPasswordValidation.isValid) {
      errors.confirmPassword = confirmPasswordValidation.error!;
    }

    const phoneValidation = this.validatePhoneNumber(formData.phoneNumber);
    if (!phoneValidation.isValid) {
      errors.phoneNumber = phoneValidation.error!;
    }

    const territoryValidation = this.validateTerritory(formData.territory);
    if (!territoryValidation.isValid) {
      errors.territory = territoryValidation.error!;
    }

    const commissionValidation = this.validateCommissionPercentage(formData.commissionPercentage, formData.businessRole);
    if (!commissionValidation.isValid) {
      errors.commissionPercentage = commissionValidation.error!;
    }

    const targetValidation = this.validateTargetHospitalsMonthly(formData.targetHospitalsMonthly, formData.businessRole);
    if (!targetValidation.isValid) {
      errors.targetHospitalsMonthly = targetValidation.error!;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

// Utility functions for common validations
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

export const isStrongPassword = (password: string): boolean => {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 6) return 'weak';
  
  let score = 0;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;
  if (password.length >= 12) score++;

  if (score < 3) return 'weak';
  if (score < 5) return 'medium';
  return 'strong';
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  // For international numbers, just add spaces
  if (cleaned.length > 10) {
    return `+${cleaned.slice(0, -10)} ${cleaned.slice(-10, -7)} ${cleaned.slice(-7, -4)} ${cleaned.slice(-4)}`;
  }

  return phone;
};

export const validateFileUpload = (file: File, maxSize: number = 5 * 1024 * 1024): { isValid: boolean; error?: string } => {
  // Check file size (5MB default)
  if (file.size > maxSize) {
    return { isValid: false, error: `File size must be less than ${maxSize / (1024 * 1024)}MB` };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed' };
  }

  return { isValid: true };
};

// Real-time validation hook
export const useFormValidation = (initialData: any, validationRules: any) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((name: string, value: any) => {
    const rule = validationRules[name];
    if (!rule) return '';

    if (rule.required && (!value || value.toString().trim() === '')) {
      return `${name} is required`;
    }
    
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || `Invalid ${name}`;
    }

    if (rule.minLength && value.length < rule.minLength) {
      return `${name} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return `${name} must not exceed ${rule.maxLength} characters`;
    }

    if (rule.min && Number(value) < rule.min) {
      return `${name} must be at least ${rule.min}`;
    }

    if (rule.max && Number(value) > rule.max) {
      return `${name} must not exceed ${rule.max}`;
    }

    return '';
  }, [validationRules]);

  const handleChange = useCallback((name: string, value: any) => {
    setData((prev: any) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  }, [validateField, touched]);

  const handleBlur = useCallback((name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, data[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, [data, validateField]);

  const validateAll = useCallback(() => {
    const newErrors: Record<string, string> = {};
    Object.keys(validationRules).forEach((name) => {
      const error = validateField(name, data[name]);
      if (error) newErrors[name] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [data, validateField, validationRules]);

  return {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    isValid: Object.keys(errors).length === 0,
  };
};

export default BusinessUserValidator;