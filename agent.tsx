import React, { useState } from 'react';
import { Agent } from 'react-agents';
import { createDocument, sendEmail, createCalendarEvent } from './api';

export default function MyAgent() {
  const [response, setResponse] = useState('');

  const handleAction = async (action: string) => {
    try {
      if (action === 'createDocument') {
        const result = await createDocument('New Document');
        setResponse(`Document created: ${result}`);
      } else if (action === 'sendEmail') {
        const result = await sendEmail('example@example.com', 'Subject', 'Body text');
        setResponse(`Email sent: ${result}`);
      } else if (action === 'createCalendarEvent') {
        const result = await createCalendarEvent('Meeting', '2024-11-20T10:00:00', '2024-11-20T11:00:00');
        setResponse(`Event created: ${result}`);
      }
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
  };

  return (
    <Agent
      name="Legal Assistant"
      actions={[
        { label: 'Create Document', action: () => handleAction('createDocument') },
        { label: 'Send Email', action: () => handleAction('sendEmail') },
        { label: 'Create Calendar Event', action: () => handleAction('createCalendarEvent') },
      ]}
    >
      <div>{response}</div>
    </Agent>
  );
}