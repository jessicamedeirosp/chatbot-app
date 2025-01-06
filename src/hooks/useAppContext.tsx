'use client';
import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
} from 'react';
import { api, API_URL } from '../utils/api';

interface User {
  user_id: string;
  status: 'online' | 'offline';
}

export interface Message {
  id: string;
  content: string;
  type: 'text' | 'audio' | 'image';
  timestamp: string;
  user_id: string;
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
  loginUser: (user_id: string) => void;
  fetchChats: (user_id: string) => void;
  setCurrentChat: (chat: Chat) => void;
  sendMessage: (message: Message) => Promise<void>;
}

const initialState: State = {
  user: {
    user_id: '',
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
  SET_MESSAGES: 'SET_MESSAGES',
};

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
          user_id: action.payload.user_id,
          status: 'online',
        },
      };

    case ACTIONS.SET_CHATS:
      return {
        ...state,
        chats: action.payload.chats,
      };

    case ACTIONS.SET_CURRENT_CHAT:
      return {
        ...state,
        currentChat: action.payload.chat,
      };

    case ACTIONS.SET_MESSAGES:
      return {
        ...state,
        messages: action.payload.messages,
      };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: Readonly<AppProviderProps>) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:8000/ws/${state.currentChat?.chat_id}`
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Event Type:', data.event);
      handleEvent(data);
    };

    socket.onopen = () => console.log('WebSocket connection opened.');
    socket.onerror = (error) => console.error('WebSocket error:', error);
    socket.onclose = () => console.log('WebSocket connection closed.');

    const fetchMessages = async () => {
      try {
        if (!state.currentChat?.chat_id) return;
        const { data: messages } = await api.get(
          `/chats/${state.currentChat?.chat_id}/messages`
        );
        setMessagesChat(messages);
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
      }
    };

    fetchMessages();

    return () => {
      socket.close();
    };
  }, [state.currentChat?.chat_id]);

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
              user_id: event.data.user_id,
              type: event.data.type,
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

  const fetchChats = async (user_id: string) => {
    try {
      const response = await fetch(`${API_URL}/chats`);
      const chats: Chat[] = await response.json();
      const userChats = chats.filter((chat) =>
        chat.participants.includes(user_id)
      );
      dispatch({
        type: ACTIONS.SET_CHATS,
        payload: { chats: userChats },
      });
    } catch (error) {
      console.error('Erro ao buscar chats:', error);
      return [];
    }
  };

  const setCurrentChat = (chat: Chat) => {
    dispatch({
      type: ACTIONS.SET_CURRENT_CHAT,
      payload: { chat },
    });
  };
  const setMessagesChat = (messages: Message) => {
    dispatch({
      type: ACTIONS.SET_MESSAGES,
      payload: { messages },
    });
  };

  const loginUser = async (user_id: string) => {
    dispatch({
      type: ACTIONS.USER_LOGGED_IN,
      payload: { user_id },
    });

    await fetchChats(user_id);
  };

  const contextValue = useMemo(() => {
    const sendMessage = async (message: Message) => {
      await api.post(`/chats/${state.currentChat?.chat_id}/messages`, {
        user_id: message.user_id,
        type: message.type,
        content: message.content,
      });
    };

    return {
      state,
      handleEvent,
      loginUser,
      fetchChats,
      setCurrentChat,
      sendMessage,
    };
  }, [state, loginUser, fetchChats, setCurrentChat]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
