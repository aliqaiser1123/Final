import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Environment variables
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;

// Initialize OAuth2Client
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Generate Google Auth URL
export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/documents',
    ],
  });
};

// Exchange authorization code for tokens
export const getTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

// Google Docs API: Create a document
export const createDocument = async (title) => {
  const docs = google.docs({ version: 'v1', auth: oauth2Client });
  const res = await docs.documents.create({ requestBody: { title } });
  return res.data;
};

// Gmail API: Send an email
export const sendEmail = async (to, subject, body) => {
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    '',
    body,
  ].join('\n');

  const encodedEmail = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encodedEmail },
  });
};

// Google Calendar API: Create an event
export const createCalendarEvent = async (summary, startTime, endTime) => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const event = {
    summary,
    start: { dateTime: startTime, timeZone: 'UTC' },
    end: { dateTime: endTime, timeZone: 'UTC' },
  };

  const res = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
  });

  return res.data;
};