import { Gender, ScanningMode } from "../../../../generated/prisma/enums";

export interface IAuthPayload {
  name: string;
  email: string;
  avatar: string;
}

export interface IOnboardingRequest {
  gender: Gender;
  age: number;
  preferredMode: ScanningMode;
}

export interface IUpdateProfileRequest {
  gender?: Gender;
  age?: number;
  height?: number;
  weight?: number;
  dob?: Date;
  preferredMode?: ScanningMode;
  metadata?: Record<string, any>;
}

export interface IUserResponse {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  gender?: Gender | null;
  age?: number | null;
  preferredMode: ScanningMode;
  isEmailVerified: boolean;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}
