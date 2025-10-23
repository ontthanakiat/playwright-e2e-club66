import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  password: string;
}

export class UserApiClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async getUser(userId: string): Promise<User> {
    return this.safeApiCall(
      () => this.request.get(`/api/users/${userId}`),
      `getUser(${userId})`
    );
  }

  async createUser(userData: CreateUserData): Promise<User> {
    return this.safeApiCall(
      () => this.request.post('/api/users', { data: userData }),
      'createUser'
    );
  }

  async updateUser(userId: string, userData: Partial<CreateUserData>): Promise<User> {
    return this.safeApiCall(
      () => this.request.put(`/api/users/${userId}`, { data: userData }),
      `updateUser(${userId})`
    );
  }

  async deleteUser(userId: string): Promise<void> {
    await this.safeApiCall(
      () => this.request.delete(`/api/users/${userId}`),
      `deleteUser(${userId})`
    );
  }

  async authenticateUser(email: string, password: string): Promise<{ token: string; user: User }> {
    return this.safeApiCall(
      () => this.request.post('/api/auth/login', {
        data: { email, password }
      }),
      'authenticateUser'
    );
  }

  async verifyOTP(email: string, otp: string): Promise<{ token: string; user: User }> {
    return this.safeApiCall(
      () => this.request.post('/api/auth/verify-otp', {
        data: { email, otp }
      }),
      'verifyOTP'
    );
  }
}
