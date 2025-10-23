export interface Config {
  email: {
    receiveEmail: string;
    from: string;
    subject: string;
    waitTimeSec: number;
  };
  auth: {
    email: string;
    password: string;
  };
  apiBaseUrl: string;
}

export function getConfig(): Config {
  const testEmail = process.env.TEST_EMAIL;
  const emailFrom = process.env.EMAIL_FROM;
  const emailSubject = process.env.EMAIL_SUBJECT;
  const testPassword = process.env.TEST_PASSWORD;
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!testEmail) {
    throw new Error('TEST_EMAIL environment variable is required');
  }
  if (!emailFrom) {
    throw new Error('EMAIL_FROM environment variable is required');
  }
  if (!emailSubject) {
    throw new Error('EMAIL_SUBJECT environment variable is required');
  }
  if (!testPassword) {
    throw new Error('TEST_PASSWORD environment variable is required');
  }
  if (!apiBaseUrl) {
    throw new Error('API_BASE_URL environment variable is required');
  }

  return {
    email: {
      receiveEmail: testEmail,
      from: emailFrom,
      subject: emailSubject,
      waitTimeSec: 60
    },
    auth: {
      email: testEmail,
      password: testPassword
    },
    apiBaseUrl: apiBaseUrl
  };
}

export class EnvHelper {
  static getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Required environment variable ${key} is not set`);
    }
    return value;
  }

  static getOptionalEnv(key: string, defaultValue: string = ''): string {
    return process.env[key] || defaultValue;
  }

  static validateRequiredEnvs(keys: string[]): void {
    const missing = keys.filter(key => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
}
