import { MessageList } from '../../../components/messageList';
import { FormMessage } from '../../../components/formMessage';
import { Chat } from '../../../hooks/useAppContext';
import style from '../../../styles/chatDetail.module.css';

interface FormMessageProps {
  currentChat: Chat | null;
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
}
export function ChatDetailView({
  currentChat,
  message,
  setMessage,
  handleSendMessage,
}: Readonly<FormMessageProps>) {
  return (
    <div className={style['chat-container']}>
      <div className={style['chat-detail']}>
        <div className={style['chat-header']}>
          <h2>Chat com {currentChat?.participants?.join(', ')}</h2>
        </div>

        <MessageList />

        <FormMessage
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}
