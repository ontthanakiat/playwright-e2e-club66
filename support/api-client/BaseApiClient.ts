import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseApiClient {
  constructor(protected request: APIRequestContext) {}

  protected async handleApiResponse<T>(response: APIResponse): Promise<T> {
    if (!response.ok()) {
      const errorBody = await response.text().catch(() => 'Unable to parse error response');
      throw new Error(`API Error ${response.status()}: ${errorBody}`);
    }

    try {
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to parse JSON response: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  protected async safeApiCall<T>(
    apiCall: () => Promise<APIResponse>,
    operation: string
  ): Promise<T> {
    try {
      const response = await apiCall();
      return await this.handleApiResponse<T>(response);
    } catch (error) {
      throw new Error(`API ${operation} failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
