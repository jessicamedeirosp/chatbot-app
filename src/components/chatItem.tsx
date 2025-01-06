import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../hooks/useAppContext';
import styles from '../styles/chatItem.module.css';

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
      className={styles.chatItem}
      onMouseOver={(e) => {
        e.currentTarget.classList.add(styles.chatItemHover);
      }}
      onMouseOut={(e) => {
        e.currentTarget.classList.remove(styles.chatItemHover);
      }}
    >
      <h3 className={styles.chatItemTitle}>{`Chat ID: ${chatId}`}</h3>
      <p className={styles.chatItemParticipants}>
        {`Participantes: ${participants.join(', ')}`}
      </p>
      <button className={styles.chatItemButton} onClick={handleEnterChat}>
        Entrar
      </button>
    </div>
  );
};

export default ChatItem;
