import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseApiClient {
  constructor(protected request: APIRequestContext) {}

  protected async handleApiResponse<T>(response: APIResponse): Promise<T> {
    if (!response.ok()) {
      const errorBody = await response.text().catch(() => 'Unable to parse error response');
      throw new Error(`API Error ${response.status()}: ${errorBody}`);
    }

    // Check content type to ensure we're getting JSON
    const contentType = response.headers()['content-type'];
    if (!contentType?.includes('application/json')) {
      const responseText = await response.text();
      console.error(`Expected JSON response but got content-type: ${contentType}`);
      console.error(`Response preview: ${responseText.substring(0, 500)}...`);
      throw new Error(`Expected JSON response but got content-type: ${contentType}. This usually indicates a server error or incorrect endpoint.`);
    }

    try {
      return await response.json();
    } catch (error) {
      const responseText = await response.text();
      console.error(`Failed to parse JSON. Response preview: ${responseText.substring(0, 500)}...`);
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
