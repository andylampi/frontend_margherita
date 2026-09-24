import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import type { ChatMessageProps } from "../../../types";
import CitationsAccordion from "../CitationsAccordion";
import "./index.css";

// rehype-raw interpreta l'HTML presente nelle risposte, rehype-sanitize lo ripulisce (deve venire dopo)
const REMARK_PLUGINS = [remarkGfm];
const REHYPE_PLUGINS = [rehypeRaw, rehypeSanitize];

function ChatMessage({
  role,
  content = "",
  loading = false,
  citations = [],
}: ChatMessageProps) {
  function renderContent() {
    if (loading) {
      return (
        <span className="chat-message-loader" aria-label="Loading">
          <span />
          <span />
          <span />
        </span>
      );
    }

    // il testo dell'utente resta testo semplice
    if (role === "user") {
      return content;
    }

    return (
      <>
        <div className="chat-message-markdown">
          <Markdown remarkPlugins={REMARK_PLUGINS} rehypePlugins={REHYPE_PLUGINS}>
            {content}
          </Markdown>
        </div>
        {citations.length > 0 && <CitationsAccordion citations={citations} />}
      </>
    );
  }

  return (
    <div className={`chat-message chat-message--${role}`}>
      <div className="chat-message-bubble">{renderContent()}</div>
    </div>
  );
}

export default ChatMessage;
