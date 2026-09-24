import { locale } from "../../../i18n";
import type { ChatCardProps } from "../../../types";
import "./index.css";

function ChatCard({ title, created_at, onClick, disabled }: ChatCardProps) {
  const date = new Date(created_at).toLocaleString(locale, {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <button
      type="button"
      className="chat-card"
      title={title}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="chat-card-title">{title}</span>
      <time className="chat-card-date" dateTime={created_at}>
        {date}
      </time>
    </button>
  );
}

export default ChatCard;
