import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Conversation } from "../../types";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export default function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: Props) {
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const commitRename = (id: string) => {
    if (draft.trim()) onRename(id, draft.trim());
    setEditingId(null);
  };

  return (
    <aside className="panel chat-sidebar">
      <button className="btn btn-primary" onClick={onCreate}>
        + {t("ai.newChat")}
      </button>
      <h3 className="panel-title" style={{ marginBottom: 0 }}>
        {t("ai.conversations")}
      </h3>
      <div className="chat-conversations">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`conversation-item${conversation.id === activeId ? " active" : ""}`}
            onClick={() => onSelect(conversation.id)}
          >
            {editingId === conversation.id ? (
              <input
                autoFocus
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onBlur={() => commitRename(conversation.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") commitRename(conversation.id);
                  if (event.key === "Escape") setEditingId(null);
                }}
                onClick={(event) => event.stopPropagation()}
              />
            ) : (
              <>
                <span className="conv-title">{conversation.title}</span>
                <button
                  className="conv-action"
                  title={t("ai.rename")}
                  onClick={(event) => {
                    event.stopPropagation();
                    setDraft(conversation.title);
                    setEditingId(conversation.id);
                  }}
                >
                  ✎
                </button>
                <button
                  className="conv-action"
                  title={t("ai.delete")}
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(conversation.id);
                  }}
                >
                  🗑
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
