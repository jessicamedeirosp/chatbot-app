import React from 'react';
import style from '../styles/join.module.css';

interface JoinModel {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  handleLogin: () => void;
}

export function JoinView({
  username,
  setUsername,
  handleLogin,
}: Readonly<JoinModel>) {
  return (
    <div className={style['join-container']}>
      <div className={style['join-box']}>
        <h1 className={style['join-title']}>Entrar</h1>
        <input
          type="text"
          className={style['join-input']}
          placeholder="Digite seu username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className={style['join-button']} onClick={handleLogin}>
          Entrar
        </button>
      </div>
    </div>
  );
}
