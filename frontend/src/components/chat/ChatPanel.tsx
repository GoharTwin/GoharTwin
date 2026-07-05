import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAIStatus, streamChat } from "../../api/client";
import { useConversations } from "../../hooks/useConversations";
import ChatSidebar from "./ChatSidebar";
import ChatMessageBubble from "./ChatMessageBubble";
import ChatComposer from "./ChatComposer";
import type { AIStatus, ChatAttachment, ChatMessage } from "../../types";

interface Props {
  /** Scope the assistant (and conversation storage) to one equipment item. */
  equipmentId?: string;
  /** Embedded mode hides the conversation sidebar (used inside the passport). */
  embedded?: boolean;
}

export default function ChatPanel({ equipmentId, embedded }: Props) {
  const { t, i18n } = useTranslation();
  const {
    conversations,
    active,
    activeId,
    setActiveId,
    create,
    rename,
    remove,
    appendMessage,
    updateMessage,
  } = useConversations(equipmentId);
  const [status, setStatus] = useState<AIStatus | null>(null);
  const [thinking, setThinking] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAIStatus()
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight });
  }, [active?.messages, thinking]);

  const send = async (text: string, attachments: ChatAttachment[]) => {
    const conversationId =
      activeId && active ? activeId : create(text.slice(0, 40) || t("ai.defaultTitle"));

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      attachments: attachments.length ? attachments : undefined,
      timestamp: Date.now(),
    };
    appendMessage(conversationId, userMessage);

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };

    setThinking(true);
    let buffer = "";
    let started = false;
    try {
      await streamChat(text, i18n.language, equipmentId ?? null, (chunk) => {
        if (!started) {
          started = true;
          setThinking(false);
          appendMessage(conversationId, assistantMessage);
          setStreamingId(assistantMessage.id);
        }
        buffer += chunk;
        updateMessage(conversationId, assistantMessage.id, buffer);
      });
    } catch {
      if (!started) appendMessage(conversationId, assistantMessage);
      updateMessage(conversationId, assistantMessage.id, t("common.backendOffline"));
    } finally {
      setThinking(false);
      setStreamingId(null);
    }
  };

  return (
    <div className={`chat-shell${embedded ? " embedded" : ""}`}>
      {!embedded && (
        <ChatSidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          onCreate={() => create(t("ai.defaultTitle"))}
          onRename={rename}
          onDelete={remove}
        />
      )}

      <section className="panel chat-main">
        <div className="chat-header">
          <span className="chat-title">
            {active?.title ?? t("ai.title")}
            {equipmentId && (
              <span className="mono" style={{ color: "var(--gold)", marginInlineStart: "0.5rem" }}>
                [{equipmentId.toUpperCase()}]
              </span>
            )}
          </span>
          <span className={`ai-status-dot${status?.online ? "" : " offline"}`}>
            {status?.online ? t("ai.online") : t("ai.offline")}
            {status && ` · ${t("ai.provider")}: ${status.provider}`}
          </span>
        </div>

        <div className="chat-messages" ref={messagesRef}>
          {!active || active.messages.length === 0 ? (
            <div className="empty-state">
              <h3 style={{ marginBottom: "0.5rem" }}>{t("ai.emptyTitle")}</h3>
              <p>{equipmentId ? t("equipment.aiScoped") : t("ai.emptyDesc")}</p>
            </div>
          ) : (
            active.messages.map((message) => (
              <ChatMessageBubble
                key={message.id}
                message={message}
                streaming={message.id === streamingId}
              />
            ))
          )}
          {thinking && (
            <div className="typing-indicator">
              <span className="typing-dots">
                <span />
                <span />
                <span />
              </span>
              {t("ai.thinking")}
            </div>
          )}
        </div>

        <ChatComposer disabled={thinking || streamingId !== null} onSend={send} />
      </section>
    </div>
  );
}
