import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../hooks/useAppContext';

interface ChatItemProps {
  chatId: string;
  participants: string[];
}

const ChatItem: React.FC<ChatItemProps> = ({ chatId, participants }) => {
  const router = useRouter();
  const { state, setCurrentChat } = useAppContext();
  const handleEnterChat = () => {
    const chat = state.chats.find((c) => c.chat_id === chatId);
    if (!chat) return;
    setCurrentChat(chat);
    router.push(`/chats/${chatId}`);
  };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.1)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      }}
    >
      <h3 style={{ margin: '0', fontSize: '1.2rem', color: '#333' }}>
        {`Chat ID: ${chatId}`}
      </h3>
      <p style={{ margin: '10px 0 20px', fontSize: '1rem', color: '#666' }}>
        {`Participantes: ${participants.join(', ')}`}
      </p>
      <button
        onClick={handleEnterChat}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          fontSize: '16px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease, transform 0.2s ease',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#45a049')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4CAF50')}
        onFocus={(e) => (e.currentTarget.style.outline = 'none')}
      >
        Entrar
      </button>
    </div>
  );
};

export default ChatItem;
