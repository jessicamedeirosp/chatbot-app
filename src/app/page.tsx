'use client';
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useRouter } from 'next/navigation';

export default function JoinPage() {
  const { loginUser } = useAppContext();
  const [username, setUsername] = useState('');
  const router = useRouter();
  const handleLogin = () => {
    if (username.trim()) {
      loginUser(username);
      router.push('/chats');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h1 style={{ marginBottom: '20px' }}>Join</h1>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            width: '100%',
            marginBottom: '20px',
            borderRadius: '4px',
            border: '1px solid #ddd',
          }}
        />
        <br />
        <button
          onClick={handleLogin}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            width: '100%',
            cursor: 'pointer',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = '#45a049')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = '#4CAF50')
          }
        >
          Join Chat
        </button>
      </div>
    </div>
  );
}
