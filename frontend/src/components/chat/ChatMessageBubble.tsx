import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { useTranslation } from "react-i18next";
import type { ChatMessage } from "../../types";

interface Props {
  message: ChatMessage;
  streaming?: boolean;
}

export default function ChatMessageBubble({ message, streaming }: Props) {
  const { t } = useTranslation();
  const isUser = message.role === "user";

  return (
    <div className={`chat-bubble ${message.role}`}>
      <div className="bubble-role">{isUser ? t("ai.you") : t("ai.assistant")}</div>
      {isUser ? (
        <div>{message.content}</div>
      ) : (
        <div className="markdown">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {message.content}
          </ReactMarkdown>
          {streaming && <span className="stream-caret" />}
        </div>
      )}
      {message.attachments && message.attachments.length > 0 && (
        <div className="attachment-chips">
          {message.attachments.map((attachment, index) => (
            <span key={index} className="attachment-chip">
              {attachment.kind === "image" ? "🖼" : "📎"} {attachment.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
