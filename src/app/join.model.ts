import { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useRouter } from 'next/navigation';

export function JoinModel() {
  const { loginUser } = useAppContext();
  const [username, setUsername] = useState('');
  const router = useRouter();
  const handleLogin = () => {
    if (username.trim()) {
      loginUser(username);
      router.push('/chats');
    }
  };
  return {
    username,
    setUsername,
    handleLogin,
  };
}
