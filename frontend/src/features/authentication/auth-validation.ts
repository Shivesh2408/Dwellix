export type PasswordStrength = {
  score: number;
  label: string;
  hint: string;
};

export function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return "Email is required.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) {
    return "Enter a valid email address.";
  }

  return null;
}

export function validatePhoneNumber(phoneNumber: string): string | null {
  if (!phoneNumber.trim()) {
    return "Phone number is required.";
  }

  const phonePattern = /^\+?[1-9]\d{7,14}$/;
  if (!phonePattern.test(phoneNumber.replace(/[\s()-]/g, ""))) {
    return "Enter a valid phone number including country code.";
  }

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return "Password is required.";
  }

  const strength = getPasswordStrength(password);
  if (strength.score < 4) {
    return "Use at least 8 characters with uppercase, lowercase, number, and symbol.";
  }

  return null;
}

export function getPasswordStrength(password: string): PasswordStrength {
  const tests = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  const score = tests.filter(Boolean).length;

  if (score <= 1) {
    return { score, label: "Weak", hint: "Add length and character variety." };
  }

  if (score === 2 || score === 3) {
    return { score, label: "Fair", hint: "Add uppercase letters, numbers, or symbols." };
  }

  if (score === 4) {
    return { score, label: "Strong", hint: "One more layer of complexity would be ideal." };
  }

  return { score, label: "Very strong", hint: "This password meets the recommended policy." };
}

export function passwordsMatch(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) {
    return "Please confirm your password.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return null;
}
