import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useOutletContext } from "react-router-dom";
import Button from "../../components/atoms/Button";
import Input from "../../components/atoms/Input";
import ChatCard from "../../components/molecules/ChatCard";
import ChatMessage from "../../components/molecules/ChatMessage";
import PdfViewer from "../../components/molecules/PdfViewer";
import Welcome from "../../components/molecules/Welcome";
import { BASE_URL } from "../../constants";
import { useApi } from "../../hooks/useApi";
import { dictionary } from "../../i18n";
import type {
  ChatMessageItem,
  ChatRecord,
  ChatStreamChunk,
  ChatSummary,
  Citation,
  LayoutContext,
} from "../../types";
import {
  createSpecialWord,
  groupChats,
  toChatMessages,
} from "../../utilities/chats";
import { ApiError } from "../../utilities/api";
import { usePopup } from "../../utilities/Container";
import "./index.css";

const CHAT_URL = `${BASE_URL}/chat/`;
const PAGE_SIZE = 100;

function Chat() {
  const { GET, POST_STREAM } = useApi();
  const { showPopup } = usePopup();
  const { setBusy } = useOutletContext<LayoutContext>();
  const [collapsed, setCollapsed] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [specialWord, setSpecialWord] = useState(createSpecialWord);
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [citation, setCitation] = useState<Citation | null>(null);

  const fetchChats = useCallback(async () => {
    const records: ChatRecord[] = [];
    let page: ChatRecord[];

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

  // mentre arriva la risposta si blocca anche la top bar (navigazione e logout)
  useEffect(() => {
    setBusy(sending);
    return () => setBusy(false);
  }, [sending, setBusy]);

  useEffect(() => {
    fetchChats().then(setChats).catch(handleChatsError);
  }, [fetchChats, handleChatsError]);

  async function handleOpenChat(chatSpecialWord: string) {
    setMessage("");
    setCitation(null);
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
    setCitation(null);
    setMessage("");
  }

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = message.trim();

    if (!query) {
      return;
    }

    const userMessageId = crypto.randomUUID();
    const assistantMessageId = crypto.randomUUID();
    // la bolla dell'assistente parte vuota (mostra il loader) e si riempie con lo stream
    setMessages((current) => [
      ...current,
      { id: userMessageId, role: "user", content: query },
      { id: assistantMessageId, role: "assistant", content: "" },
    ]);
    setMessage("");
    setSending(true);

    function updateAssistant(
      update: (item: ChatMessageItem) => ChatMessageItem,
    ) {
      setMessages((current) =>
        current.map((item) =>
          item.id === assistantMessageId ? update(item) : item,
        ),
      );
    }

    try {
      await POST_STREAM<ChatStreamChunk>({
        url: CHAT_URL,
        params: { query: `${specialWord} ${query}` },
        headers: { "content-type": "application/json" },
        onChunk: (chunk) => {
          if (chunk.type === "content") {
            updateAssistant((item) => ({
              ...item,
              content: item.content + chunk.delta,
            }));
          } else if (chunk.type === "citations") {
            updateAssistant((item) => ({
              ...item,
              citations: chunk.references,
            }));
          } else {
            // errore dentro lo stream: lo status è 200, va gestito a mano
            throw new ApiError(dictionary.errors.server);
          }
        },
      });
      // la risposta è già a schermo: la lista si aggiorna in background solo per la sidebar
      fetchChats().then(setChats).catch(handleChatsError);
    } catch (error) {
      // l'invio è fallito: domanda e risposta parziale non restano nella chat
      setMessages((current) =>
        current.filter(
          (item) =>
            item.id !== userMessageId && item.id !== assistantMessageId,
        ),
      );
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
                active={chat.specialWord === specialWord}
              />
            ))}
          </nav>
        )}
      </aside>
      <main className="chat-main">
        <div className="chat-messages">
          {messages.length === 0 && !sending && <Welcome />}
          {messages.map(({ id, role, content, citations }) => (
            <ChatMessage
              key={id}
              role={role}
              content={content}
              citations={citations}
              onCitationClick={setCitation}
              loading={role === "assistant" && !content}
            />
          ))}
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
      {citation && (
        <aside className="chat-viewer">
          <div className="chat-viewer-header">
            <span className="chat-viewer-title" title={citation.filename}>
              {citation.filename}
            </span>
            <button
              type="button"
              className="chat-viewer-close"
              onClick={() => setCitation(null)}
              aria-label={dictionary.pdf.close}
            >
              ×
            </button>
          </div>
          <PdfViewer
            // key: a ogni nuova citazione il viewer riparte dalla pagina citata
            key={`${citation.document_id}-${citation.page_number}`}
            url={`${BASE_URL}/documents/${citation.document_id}/file`}
            pageNumber={citation.page_number}
            highlights={citation.bounding_regions}
          />
        </aside>
      )}
    </div>
  );
}

export default Chat;
