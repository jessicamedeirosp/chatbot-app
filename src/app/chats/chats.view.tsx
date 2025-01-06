import ChatItem from '../../components/chatItem';
import { Chat } from '../../hooks/useAppContext';

export function ChatsView({ chats }: Readonly<{ chats: Chat[] }>) {
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
      {chats?.map((chat) => (
        <ChatItem
          key={chat.chat_id}
          chatId={chat.chat_id}
          participants={chat.participants}
        />
      ))}
    </div>
  );
}
