import { useCallback, useEffect, useState } from 'react';
import { Message, useAppContext } from '../../../hooks/useAppContext';
import { useRouter } from 'next/navigation';

export function ChatDetailModel() {
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
  return {
    handleSendMessage,
    message,
    setMessage,
    currentChat,
  };
}
