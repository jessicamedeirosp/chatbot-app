'use client';

import { JoinView } from './join.view';
import { JoinModel } from './join.model';

export default function JoinPage() {
  const { username, setUsername, handleLogin } = JoinModel();
  return (
    <JoinView
      username={username}
      setUsername={setUsername}
      handleLogin={handleLogin}
    />
  );
}
