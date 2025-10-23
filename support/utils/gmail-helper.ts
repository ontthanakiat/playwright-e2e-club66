import { expect } from '@playwright/test';
import * as gmailTester from 'gmail-tester';
import * as path from 'path';

export interface ResetPasswordData {
  token: string;
  email: string;
  fullUrl: string;
}

interface GmailSearchOptions {
  to: string;
  waitTimeSec?: number;
  subject?: string;
  from?: string;
}

interface EmailBody {
  html?: string;
  text?: string;
}

interface Email {
  from: string;
  to: string;
  subject: string;
  body?: EmailBody;
}

/**
 * Get OTP from Gmail
 * @param {GmailSearchOptions} options - Gmail search options
 * @returns {Promise<string>} OTP code
 */
export async function getOTPFromGmail(options: GmailSearchOptions): Promise<string> {
  const searchOptions = {
    to: options.to,
    waitTimeSec: options.waitTimeSec || 60,
    ...(options.subject && { subject: options.subject }),
    ...(options.from && { from: options.from })
  };

  console.log('Searching for OTP email with options:', JSON.stringify(searchOptions));

  try {
    const receiveEmail = process.env.TEST_EMAIL;
    if (!receiveEmail) {
      throw new Error('TEST_EMAIL environment variable is required');
    }

    // First try to find any recent emails to debug
    console.log(`First checking for any recent emails to ${receiveEmail}...`);
    const anyEmail = await gmailTester.check_inbox(
      path.resolve(process.env.GMAIL_CREDENTIALS_PATH || './credentials.json'),
      path.resolve(process.env.GMAIL_TOKEN_PATH || './token.json'),
      {
        to: receiveEmail,
        wait_time_sec: 10,
        include_body: true
      }
    );
    
    if (anyEmail) {
      // Commented out to reduce log noise
      // console.log('Found recent emails:', 
      //   JSON.stringify(anyEmail, null, 2)
      // );
    } else {
      console.log('No recent emails found');
    }

    // Now try with the actual receiving email address
    console.log(`Trying to find email in ${receiveEmail} inbox...`);
    const toOnlyEmail = await gmailTester.check_inbox(
      path.resolve(process.env.GMAIL_CREDENTIALS_PATH || './credentials.json'),
      path.resolve(process.env.GMAIL_TOKEN_PATH || './token.json'),
      {
        to: receiveEmail,
        from: searchOptions.from,
        subject: searchOptions.subject,
        wait_time_sec: 20,
        include_body: true
      }
    );

    if (toOnlyEmail) {
      // Commented out to reduce log noise
      // console.log('Found emails to recipient:', 
      //   JSON.stringify(toOnlyEmail, null, 2)
      // );
    } else {
      console.log('No emails found for recipient:', searchOptions.to);
    }

    // Finally, try with all search parameters
    console.log(`Trying with all search parameters on ${receiveEmail}...`);
    const email = await gmailTester.check_inbox(
      path.resolve(process.env.GMAIL_CREDENTIALS_PATH || './credentials.json'),
      path.resolve(process.env.GMAIL_TOKEN_PATH || './token.json'),
      {
        subject: searchOptions.subject,
        from: searchOptions.from,
        to: receiveEmail,  // Use the actual receiving email address
        wait_time_sec: searchOptions.waitTimeSec,
        include_body: true
      }
    );

    if (!email || (Array.isArray(email) && email.length === 0)) {
      throw new Error('No email found');
    }

    // Get the latest email
    const latestEmail = Array.isArray(email) ? email[0] : email;
    //console.log('Latest email:', JSON.stringify(latestEmail, null, 2));
    
    // Verify email metadata if provided
    if (options.from) {
      expect(latestEmail.from.toLowerCase()).toContain(options.from.toLowerCase());
    }
    if (options.subject) {
      expect(latestEmail.subject.toLowerCase()).toContain(options.subject.toLowerCase());
    }

    // Extract email content
    const htmlContent = latestEmail.body?.html || '';
    const textContent = latestEmail.body?.text || '';
    
    // First try HTML content for better structure - specifically look for OTP in h1 tags
    // Use a more flexible pattern that can handle nested HTML
    const htmlPattern = /<h1[^>]*>(\d{4})<\/h1>/;
    const htmlMatch = htmlContent.match(htmlPattern);
    if (htmlMatch) {
      console.log('Found OTP in HTML content:', htmlMatch[1]);
      return htmlMatch[1];
    }

    // Then try looking for 4 digits after standard OTP phrases
    const phrasePattern = /(?:code|OTP|password|verification)[^\d]*(\d{4})/i;
    for (const content of [textContent, htmlContent]) {
      const phraseMatch = content.match(phrasePattern);
      if (phraseMatch) {
        console.log('Found OTP after phrase:', phraseMatch[1]);
        return phraseMatch[1];
      }
    }

    // Last resort - look for standalone 4 digits
    const standalonePattern = /\b(\d{4})\b/;
    for (const content of [textContent, htmlContent]) {
      const digitMatch = content.match(standalonePattern);
      if (digitMatch) {
        console.log('Found standalone OTP:', digitMatch[1]);
        return digitMatch[1];
      }
    }

    console.log('Email content searched:', {
      html: htmlContent,
      text: textContent
    });
    throw new Error('OTP not found in email content');
  } catch (error) {
    console.error('Error retrieving OTP:', error);
    throw error;
  }
}

/**
 * Get Forgot Password reset link from Gmail
 * @returns {Promise<ResetPasswordData>} Reset password data
 */
export async function getForgotPasswordFromGmail(options?: { waitTimeSec?: number }): Promise<ResetPasswordData> {
  const subject = process.env.EMAIL_SUBJECT || 'OTP';
  const waitTimeSec = options?.waitTimeSec || 30;
  const receiveEmail = process.env.TEST_EMAIL;
  const from = process.env.EMAIL_FROM;
  
  if (!receiveEmail) {
    throw new Error('TEST_EMAIL environment variable is required');
  }
  if (!from) {
    throw new Error('EMAIL_FROM environment variable is required');
  }

  // Step 1: Try to find any recent emails to debug
  console.log(`First checking for any recent emails to ${receiveEmail}...`);
  try {
    const anyEmail = await gmailTester.check_inbox(
      path.resolve(process.env.GMAIL_CREDENTIALS_PATH || './credentials.json'),
      path.resolve(process.env.GMAIL_TOKEN_PATH || './token.json'),
      {
        to: receiveEmail,
        wait_time_sec: 10,
        include_body: true
      }
    );
    if (anyEmail) {
      //console.log('Found recent emails:', JSON.stringify(anyEmail, null, 2));
    } else {
      console.log('No recent emails found');
    }

    // Step 2: Try with recipient only
    console.log(`Trying to find email in ${receiveEmail} inbox...`);
    const toOnlyEmail = await gmailTester.check_inbox(
      path.resolve(process.env.GMAIL_CREDENTIALS_PATH || './credentials.json'),
      path.resolve(process.env.GMAIL_TOKEN_PATH || './token.json'),
      {
        to: receiveEmail,
        from,
        subject,
        wait_time_sec: 20,
        include_body: true
      }
    );
    if (toOnlyEmail) {
      console.log('Found emails to recipient');
    } else {
      console.log('No emails found for recipient:', receiveEmail);
    }

    // Step 3: Try with all search parameters (final, robust search)
    //console.log(`Trying with all search parameters on ${receiveEmail}...`);
    const email = await gmailTester.check_inbox(
      path.resolve(process.env.GMAIL_CREDENTIALS_PATH || './credentials.json'),
      path.resolve(process.env.GMAIL_TOKEN_PATH || './token.json'),
      {
        to: receiveEmail,
        from,
        subject,
        wait_time_sec: waitTimeSec,
        include_body: true
      }
    );

    if (!email || (Array.isArray(email) && email.length === 0)) {
      throw new Error('No Forgot Password email found');
    }

    const latestEmail = Array.isArray(email) ? email[0] : email;
    //console.log('Latest forgot-password email:', JSON.stringify(latestEmail, null, 2));

    // Basic metadata assertions
    expect(latestEmail.from.toLowerCase()).toContain(String(from).toLowerCase());
    expect(latestEmail.subject.toLowerCase()).toContain(String(subject).toLowerCase());

    const htmlContent = latestEmail.body?.html || '';
    const textContent = latestEmail.body?.text || '';

    // Assert body contains expected instructional text
    const requiredPhrase = 'To reset your password, please visit the following link';
    expect((htmlContent + '\n' + textContent).toLowerCase()).toContain(requiredPhrase.toLowerCase());

    // Decode HTML entities and quoted-printable encoding
    const decodeHtml = (str: string): string => {
      return str
        .replace(/=\r?\n/g, '') // Remove soft line breaks
        .replace(/=([0-9A-F]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16))) // Decode =3D etc
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
    };

    const decodedHtml = decodeHtml(htmlContent);
    const decodedText = decodeHtml(textContent);

    // Extract reset link with token (40 chars) and email parameter
    const pathFragment = '/reset-password/reset/';
    
    // Strategy 1: Look for complete URL in decoded HTML with token and email query param
    const fullUrlRegex = new RegExp(
      `(https?://[^\\s"'<>]+${pathFragment}([A-Za-z0-9_-]{40})\\?email=([^\\s"'<>&]+))`,
      'i'
    );
    
    const fullUrlMatch = decodedHtml.match(fullUrlRegex) || decodedText.match(fullUrlRegex);
    if (fullUrlMatch) {
      const fullUrl = fullUrlMatch[1];
      const token = fullUrlMatch[2];
      const email = fullUrlMatch[3];
      
      console.log('[gmail] Extracted reset password data:', { token, email, fullUrl });
      
      return {
        token,
        email,
        fullUrl
      };
    }

    // Strategy 2: Extract token and email separately if full URL not found
    const tokenRegex = new RegExp(`${pathFragment}([A-Za-z0-9_-]{40})`, 'i');
    const tokenMatch = decodedHtml.match(tokenRegex) || decodedText.match(tokenRegex);
    
    if (tokenMatch) {
      const token = tokenMatch[1];
      
      // Try to find email parameter
      const emailParamRegex = /[?&]email=([^&\s"'<>]+)/i;
      const emailMatch = decodedHtml.match(emailParamRegex) || decodedText.match(emailParamRegex);
      
      if (emailMatch) {
        const email = emailMatch[1];
        const fullUrl = `https://dev.club66.pro${pathFragment}${token}?email=${email}`;
        
        console.log('[gmail] Extracted reset password data (separate extraction):', { token, email, fullUrl });
        
        return {
          token,
          email,
          fullUrl
        };
      }
    }

    console.log('Email content searched for reset link:', { 
      html: decodedHtml.substring(0, 500), 
      text: decodedText.substring(0, 500) 
    });
    throw new Error('Reset password token and email not found in email content');
  } catch (error) {
    console.error('Error retrieving Forgot Password email:', error);
    throw error;
  }
}
