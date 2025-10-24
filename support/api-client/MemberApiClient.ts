import { BaseApiClient } from './BaseApiClient';
import { APIRequestContext } from '@playwright/test';
import { Member, MemberResponse } from '../types/member.types';

export class MemberApiClient extends BaseApiClient {
  private authToken: string | null = null;

  constructor(request: APIRequestContext) {
    super(request);
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  async login(email?: string, password?: string): Promise<void> {
    const loginEmail = email || process.env.TEST_EMAIL || 'admin@club66pro.com';
    const loginPassword = password || process.env.TEST_PASSWORD || '0123456789';
    
    console.log(`Attempting login with email: ${loginEmail}`);
    
    const response = await this.request.post('/api/auth/login', {
      data: {
        email: loginEmail,
        password: loginPassword,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Login response status: ${response.status()}`);
    console.log(`Login response headers:`, response.headers());

    if (!response.ok()) {
      const errorText = await response.text();
      throw new Error(`Login failed with status ${response.status()}: ${errorText}`);
    }

    // Check content type to ensure we're getting JSON
    const contentType = response.headers()['content-type'];
    if (!contentType?.includes('application/json')) {
      const responseText = await response.text();
      
      // Try to extract JSON from Symfony debug page
      const jsonMatches = responseText.match(/\{[^}]*"token"[^}]*\}/g);
      if (jsonMatches) {
        for (const match of jsonMatches) {
          try {
            // Clean the JSON by removing HTML entities and tags
            const cleanedMatch = match
              .replace(/&#160;/g, ' ')  // Replace non-breaking space
              .replace(/<[^>]*>/g, '')  // Remove HTML tags
              .replace(/&[^;]+;/g, ''); // Remove other HTML entities
            
            const data = JSON.parse(cleanedMatch);
            if (data.token) {
              console.warn('Warning: API returned HTML debug page but JSON token was extracted successfully');
              this.authToken = data.token;
              return;
            }
          } catch (e) {
            // Continue to next match
          }
        }
      }
      
      throw new Error(`Expected JSON response but got content-type: ${contentType}. This usually indicates a server error or incorrect endpoint. Response preview: ${responseText.substring(0, 200)}...`);
    }

    const data = await response.json();
    this.authToken = data.token;

    if (!this.authToken) {
      throw new Error('Login succeeded but no token was returned in response');
    }
  }

  async getAllMembers(): Promise<Member[]> {
    console.log(`Making GET request to /api/members with token: ${this.authToken ? 'present' : 'missing'}`);
    
    const response = await this.request.get('/api/members', {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });
    
    console.log(`Response status: ${response.status()}`);
    console.log(`Response headers:`, response.headers());
    
    const data = await this.handleApiResponse<MemberResponse>(response);
    return data.member;
  }

  async deleteMembership(membershipId: string) {
    const response = await this.request.delete(`/api/memberships/${membershipId}`, {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });
    await this.handleApiResponse(response);
  }

  async deleteMemberByEmail(email: string): Promise<void> {
    const members = await this.getAllMembers();
    const member = members.find((m) => m.email === email);

    if (!member) {
      console.log(`Member with email ${email} not found - nothing to delete`);
      return;
    }

    console.log(`Found member: ${member.name} (ID: ${member.id})`);
    console.log(`Current plan: ${member.currentPlan}`);

    // Step 1: Delete membership if currentPlan exists
    if (member.currentPlan) {
      // Extract membership ID from the API path (e.g., "/api/memberships/112571" -> "112571")
      const membershipId = member.currentPlan.split('/').pop();
      if (membershipId) {
        console.log(`Deleting membership with ID: ${membershipId}`);
        await this.deleteMembership(membershipId);
      }
    }

    // Step 2: Delete the member
    console.log(`Deleting member with ID: ${member.id}`);
    const response = await this.request.delete(`/api/members/${member.id}`, {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });
    await this.handleApiResponse(response);
    console.log(`Successfully deleted member: ${member.name}`);
  }
}
