'use client';
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../hooks/useAppContext';
import { useRouter } from 'next/navigation';
import './styles.css';
import { FaPaperPlane } from 'react-icons/fa'; // Para o ícone de envio de mensagem
import { FaUserCircle } from 'react-icons/fa'; // Para o ícone do usuário

export default function ChatsDetailPage() {
  const { state, handleEvent } = useAppContext();
  const router = useRouter();

  const currentChat = state.currentChat;
  const [message, setMessage] = useState('');
  const [isMessageSent, setIsMessageSent] = useState(false);

  useEffect(() => {
    if (!currentChat) {
      router.push('/');
    }
  }, [currentChat, router]);

  const sendMessage = () => {
    if (message.trim()) {
      handleEvent({
        event: 'message_received',
        data: {
          id: Date.now().toString(),
          content: message,
          timestamp: new Date().toISOString(),
          user_id: state.user.username,
        },
      });
      setMessage('');
      setIsMessageSent(true);
    }
  };

  const messageList = state.messages
    .filter((msg) => currentChat?.participants.includes(msg.userId))
    .map((msg) => (
      <div
        key={msg.id}
        className={`message ${msg.userId === state.user.username ? 'sent' : 'received'}`}
      >
        <div className="message-content">
          <p>{msg.content}</p>
          <small>{new Date(msg.timestamp).toLocaleString()}</small>
          {msg.id === state.lastRead.messageId &&
            msg.userId !== state.user.username && (
              <span className="read-status"> - Lida</span>
            )}
        </div>
      </div>
    ));

  const onlineUsers = state.chats
    .filter((chat) => chat.chat_id === currentChat?.chat_id)
    .flatMap((chat) => chat.participants)
    .filter(
      (participant) =>
        participant !== state.user.username && state.user.status === 'online'
    );

  return (
    <div className="chat-container">
      <div className="user-menu">
        <div className="user-info">
          <h3>{state.user.username}</h3>
        </div>
        <div className="online-users">
          <h3>Usuários online:</h3>
          <ul>
            {onlineUsers.length > 0 ? (
              onlineUsers.map((user, index) => <li key={index}>{user}</li>)
            ) : (
              <li>Nenhum usuário online</li>
            )}
          </ul>
        </div>
      </div>

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
          <button onClick={sendMessage}>
            <FaPaperPlane size={20} />
          </button>
        </div>

        {isMessageSent && <p>Mensagem enviada!</p>}
      </div>
    </div>
  );
}
