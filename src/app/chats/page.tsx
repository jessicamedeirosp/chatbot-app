'use client';
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import ChatItem from '../../components/chatItem';

export default function ChatsPage() {
  const { state } = useAppContext();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
      }}
    >
      {state.chats?.map((chat) => (
        <ChatItem
          key={chat.chat_id}
          chatId={chat.chat_id}
          participants={chat.participants}
        />
      ))}
    </div>
  );
}
