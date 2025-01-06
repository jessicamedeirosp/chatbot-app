import { useAppContext } from '../hooks/useAppContext';
import style from '../styles/messageList.module.css';
export function MessageList() {
  const { state } = useAppContext();
  return (
    <div className={style['message-list']}>
      {state.messages.map((msg) => (
        <div
          key={msg.id}
          className={`${style['message']} ${msg.user_id === state.user.user_id ? style['sent'] : style['received']}`}
        >
          <div className={style['message-content']}>
            <small>{msg.user_id}</small>

            {msg.type === 'text' && <p>{msg.content}</p>}
            {msg.type === 'audio' && (
              <audio controls src={msg.content}>
                <source src={msg.content} type="audio/mpeg" />
              </audio>
            )}
            {msg.type === 'image' && (
              <img src={msg.content} alt={msg.content} />
            )}
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
            {msg.id === state.lastRead.messageId &&
              msg.user_id !== state.user.user_id && (
                <span className={style['read-status']}> - Lida</span>
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
