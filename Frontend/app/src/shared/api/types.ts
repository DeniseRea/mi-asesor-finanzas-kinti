export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  verificationToken: string;
  expiresIn: number;
}

export interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  currency?: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
  verificationToken: string;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface ResendVerificationRequest {
  email: string;
  verificationToken: string;
}

export interface ResendVerificationResponse {
  message: string;
  verificationToken: string;
}

export interface LogoutResponse {
  message: string;
}
