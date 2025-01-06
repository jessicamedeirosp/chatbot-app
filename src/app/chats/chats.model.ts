import { useAppContext } from '../../hooks/useAppContext';

export function ChatModel() {
  const { state } = useAppContext();

  return { chats: state.chats };
}
