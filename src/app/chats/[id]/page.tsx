'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Message, useAppContext } from '../../../hooks/useAppContext';
import { useRouter } from 'next/navigation';
import './styles.css';
import { FaPaperPlane } from 'react-icons/fa'; // Para o ícone de envio de mensagem

export default function ChatsDetailPage() {
  const { state, sendMessage } = useAppContext();
  const router = useRouter();

  const currentChat = state.currentChat;
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!currentChat) {
      router.push('/');
    }
  }, [currentChat, router]);

  const handleSendMessage = useCallback(async () => {
    const data: Message = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date().toISOString(),
      type: 'text',
      user_id: state.user.user_id,
    };
    if (message.trim() && state.currentChat?.chat_id) {
      setMessage('');
      await sendMessage(data);
    }
  }, [message, sendMessage, state.currentChat, state.user.user_id]);

  const messageList = state.messages.map((msg) => (
    <div
      key={msg.id}
      className={`message ${msg.user_id === state.user.user_id ? 'sent' : 'received'}`}
    >
      <div className="message-content">
        <small>{msg.user_id}</small>

        {msg.type === 'text' && <p>{msg.content}</p>}
        {msg.type === 'audio' && (
          <audio controls src={msg.content}>
            <source src={msg.content} type="audio/mpeg" />
          </audio>
        )}
        {msg.type === 'image' && <img src={msg.content} alt={msg.content} />}
        <small>{new Date(msg.timestamp).toLocaleString()}</small>
        {msg.id === state.lastRead.messageId &&
          msg.user_id !== state.user.user_id && (
            <span className="read-status"> - Lida</span>
          )}
      </div>
    </div>
  ));

  return (
    <div className="chat-container">
      <div className="chat-detail">
        <div className="chat-header">
          <h2>Chat com {currentChat?.participants?.join(', ')}</h2>
        </div>

        <div className="message-list">{messageList}</div>

        <div className="send-message">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
          />
          <button onClick={handleSendMessage}>
            <FaPaperPlane size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
