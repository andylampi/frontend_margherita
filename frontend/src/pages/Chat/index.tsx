import { useCallback, useEffect, useState, type FormEvent } from "react";
import Button from "../../components/atoms/Button";
import Input from "../../components/atoms/Input";
import ChatCard from "../../components/molecules/ChatCard";
import ChatMessage from "../../components/molecules/ChatMessage";
import { BASE_URL } from "../../constants";
import { useApi } from "../../hooks/useApi";
import { dictionary } from "../../i18n";
import type { ChatMessageItem, ChatRecord, ChatSummary } from "../../types";
import { createSpecialWord, groupChats, toChatMessages } from "../../utilities/chats";
import { usePopup } from "../../utilities/Container";
import "./index.css";

const CHAT_URL = `${BASE_URL}/chat/`;
const PAGE_SIZE = 100;

function Chat() {
  const { GET, POST } = useApi();
  const { showPopup } = usePopup();
  const [collapsed, setCollapsed] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [specialWord, setSpecialWord] = useState(createSpecialWord);
  const [chats, setChats] = useState<ChatSummary[]>([]);

  const fetchChats = useCallback(async () => {
    const records: ChatRecord[] = [];
    let page: ChatRecord[];

    // il backend è paginato: si leggono pagine finché non ne arriva una incompleta
    do {
      page = await GET<ChatRecord[]>({
        url: CHAT_URL,
        params: { limit: PAGE_SIZE, offset: records.length },
      });
      records.push(...page);
    } while (page.length === PAGE_SIZE);

    return groupChats(records);
  }, [GET]);

  const handleChatsError = useCallback(
    (error: unknown) => {
      const text = error instanceof Error ? error.message : undefined;
      showPopup("dangerous", text);
    },
    [showPopup],
  );

  useEffect(() => {
    fetchChats().then(setChats).catch(handleChatsError);
  }, [fetchChats, handleChatsError]);

  async function handleOpenChat(chatSpecialWord: string) {
    setMessage("");
    setSpecialWord(chatSpecialWord);

    try {
      const updated = await fetchChats();
      setChats(updated);
      const chat = updated.find((item) => item.specialWord === chatSpecialWord);
      setMessages(chat ? toChatMessages(chat.records) : []);
    } catch (error) {
      handleChatsError(error);
    }
  }

  function handleNewChat() {
    setSpecialWord(createSpecialWord());
    setMessages([]);
    setMessage("");
  }

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = message.trim();

    if (!query) {
      return;
    }

    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: query },
    ]);
    setMessage("");
    setSending(true);

    try {
      await POST<string>({
        url: CHAT_URL,
        params: { query: `${specialWord} ${query}` },
        headers: { "content-type": "application/json" },
      });
      // ricarica la chat dal server per mostrare anche la risposta
      await handleOpenChat(specialWord);
    } catch (error) {
      const text = error instanceof Error ? error.message : undefined;
      showPopup("dangerous", text);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="chat-page">
      <aside
        className={`chat-menu ${collapsed ? "chat-menu--collapsed" : ""}`.trim()}
      >
        <button
          type="button"
          className="chat-menu-toggle"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Espandi menu" : "Comprimi menu"}
          aria-expanded={!collapsed}
        >
          {!collapsed && <span className="chat-menu-title">ChatBotAI</span>}
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <Button
          className="chat-new-button"
          onClick={handleNewChat}
          disabled={sending}
          aria-label={dictionary.chat.newChat}
          title={dictionary.chat.newChat}
        >
          {collapsed ? "+" : dictionary.chat.newChat}
        </Button>
        {!collapsed && (
          <nav className="chat-menu-nav">
            {chats.length === 0 && <p>{dictionary.chat.empty}</p>}
            {chats.map((chat) => (
              <ChatCard
                key={chat.specialWord}
                title={chat.title}
                created_at={chat.created_at}
                onClick={() => handleOpenChat(chat.specialWord)}
                disabled={sending}
              />
            ))}
          </nav>
        )}
      </aside>
      <main className="chat-main">
        <div className="chat-messages">
          {messages.map(({ id, role, content, citations }) => (
            <ChatMessage
              key={id}
              role={role}
              content={content}
              citations={citations}
            />
          ))}
          {sending && <ChatMessage role="assistant" loading />}
        </div>
        <form className="chat-input-bar" onSubmit={handleSend}>
          <Input
            name="message"
            placeholder={dictionary.chat.placeholder}
            autoComplete="off"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            disabled={sending}
          />
          <Button
            type="submit"
            className="chat-send-button"
            disabled={sending || !message.trim()}
          >
            {dictionary.chat.send}
          </Button>
        </form>
      </main>
    </div>
  );
}

export default Chat;
