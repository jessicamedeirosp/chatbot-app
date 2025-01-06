'use client';
import React from 'react';

import { ChatDetailModel } from './chatDetail.model';
import { ChatDetailView } from './chatDetail.view';

export default function ChatDetailPage() {
  const { currentChat, message, setMessage, handleSendMessage } =
    ChatDetailModel();

  return (
    <ChatDetailView
      currentChat={currentChat}
      message={message}
      setMessage={setMessage}
      handleSendMessage={handleSendMessage}
    />
  );
}
