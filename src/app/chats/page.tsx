'use client';
import React from 'react';
import { ChatModel } from './chats.model';
import { ChatsView } from './chats.view';

export default function ChatsPage() {
  const { chats } = ChatModel();

  return <ChatsView chats={chats} />;
}
