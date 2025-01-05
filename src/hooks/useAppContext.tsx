'use client';
import React, { createContext, useReducer, useContext, ReactNode } from 'react';

interface User {
  username: string;
  status: 'online' | 'offline';
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  userId: string;
}

interface LastRead {
  messageId: string | null;
  readBy: string | null;
}

export interface Chat {
  chat_id: string;
  participants: string[];
}

interface State {
  user: User;
  messages: Message[];
  lastRead: LastRead;
  chats: Chat[];
  currentChat: Chat | null;
}

interface EventPayload {
  event: string;
  data: Record<string, any>;
}

interface Action {
  type: string;
  payload?: any;
}

interface AppContextType {
  state: State;
  handleEvent: (event: EventPayload) => void;
  loginUser: (username: string) => void;
  fetchChats: (username: string) => void;
  setCurrentChat: (chat: Chat) => void;
}

const initialState: State = {
  user: {
    username: '',
    status: 'offline',
  },
  messages: [],
  lastRead: {
    messageId: null,
    readBy: null,
  },
  chats: [],
  currentChat: null,
};

const ACTIONS = {
  MESSAGE_RECEIVED: 'MESSAGE_RECEIVED',
  PRESENCE_UPDATED: 'PRESENCE_UPDATED',
  CHAT_READ: 'CHAT_READ',
  USER_LOGGED_IN: 'USER_LOGGED_IN',
  SET_CHATS: 'SET_CHATS',
  SET_CURRENT_CHAT: 'SET_CURRENT_CHAT',
};

const API_URL = 'http://localhost:8000';

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ACTIONS.MESSAGE_RECEIVED:
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
      };

    case ACTIONS.PRESENCE_UPDATED:
      return {
        ...state,
        user: {
          ...state.user,
          status: action.payload.status,
        },
      };

    case ACTIONS.CHAT_READ:
      return {
        ...state,
        lastRead: {
          messageId: action.payload.messageId,
          readBy: action.payload.readBy,
        },
      };

    case ACTIONS.USER_LOGGED_IN:
      return {
        ...state,
        user: {
          username: action.payload.username,
          status: 'online',
        },
      };

    case ACTIONS.SET_CHATS:
      console.log('action.payload.chats:', action.payload.chats);
      return {
        ...state,
        chats: action.payload.chats,
      };
    case ACTIONS.SET_CURRENT_CHAT:
      console.log('action.payload.currentChat:', action.payload.chat);
      return {
        ...state,
        currentChat: action.payload.chat,
      };

    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchChats = async (username: string) => {
    try {
      const response = await fetch(`${API_URL}/chats`);
      const chats: Chat[] = await response.json();
      console.log('Resposta da API:', chats, 'user: ', username);

      const userChats = chats.filter((chat) =>
        chat.participants.includes(username)
      );

      console.log('Resposta da API 2:', userChats);
      dispatch({
        type: ACTIONS.SET_CHATS,
        payload: { chats: userChats },
      });
    } catch (error) {
      console.error('Erro ao buscar chats:', error);
      return [];
    }
  };

  const handleEvent = (event: EventPayload) => {
    switch (event.event) {
      case 'message_received':
        dispatch({
          type: ACTIONS.MESSAGE_RECEIVED,
          payload: {
            message: {
              id: event.data.id,
              content: event.data.content,
              timestamp: event.data.timestamp,
              userId: event.data.user_id,
            },
          },
        });
        break;

      case 'presence_updated':
        dispatch({
          type: ACTIONS.PRESENCE_UPDATED,
          payload: { status: event.data.status },
        });
        break;

      case 'chat_read':
        dispatch({
          type: ACTIONS.CHAT_READ,
          payload: {
            messageId: event.data.last_read_message_id,
            readBy: event.data.user_id,
          },
        });
        break;

      default:
        console.warn('Unhandled event', event);
    }
  };

  const setCurrentChat = (chat: Chat) => {
    dispatch({
      type: ACTIONS.SET_CURRENT_CHAT,
      payload: { chat },
    });
  };
  const loginUser = async (username: string) => {
    dispatch({
      type: ACTIONS.USER_LOGGED_IN,
      payload: { username },
    });

    await fetchChats(username);
  };

  return (
    <AppContext.Provider
      value={{ state, handleEvent, loginUser, fetchChats, setCurrentChat }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
