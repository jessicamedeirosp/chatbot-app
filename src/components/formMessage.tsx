import { FaPaperPlane } from 'react-icons/fa';
import style from '../styles/formMessage.module.css';

interface FormMessageProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
}

export function FormMessage({
  message,
  setMessage,
  handleSendMessage,
}: Readonly<FormMessageProps>) {
  return (
    <div className={style['send-message']}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite sua mensagem..."
      />
      <button onClick={handleSendMessage}>
        <FaPaperPlane size={20} />
      </button>
    </div>
  );
}
