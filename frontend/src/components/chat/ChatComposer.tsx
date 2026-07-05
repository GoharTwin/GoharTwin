import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ChatAttachment } from "../../types";

interface Props {
  disabled: boolean;
  onSend: (message: string, attachments: ChatAttachment[]) => void;
}

export default function ChatComposer({ disabled, onSend }: Props) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed, attachments);
    setText("");
    setAttachments([]);
  };

  const addAttachments = (files: FileList | null, kind: "file" | "image") => {
    if (!files) return;
    const next = Array.from(files).map((file) => ({ name: file.name, kind }));
    setAttachments((prev) => [...prev, ...next]);
  };

  return (
    <div className="chat-composer">
      {attachments.length > 0 && (
        <div className="attachment-chips">
          {attachments.map((attachment, index) => (
            <span key={index} className="attachment-chip">
              {attachment.kind === "image" ? "🖼" : "📎"} {attachment.name}
              <button
                onClick={() =>
                  setAttachments((prev) => prev.filter((_, i) => i !== index))
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="composer-row">
        <input
          ref={fileInputRef}
          type="file"
          hidden
          multiple
          onChange={(event) => addAttachments(event.target.files, "file")}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          hidden
          multiple
          onChange={(event) => addAttachments(event.target.files, "image")}
        />
        <button
          className="composer-icon-btn"
          title={t("ai.attachFile")}
          onClick={() => fileInputRef.current?.click()}
        >
          📎
        </button>
        <button
          className="composer-icon-btn"
          title={t("ai.attachImage")}
          onClick={() => imageInputRef.current?.click()}
        >
          🖼
        </button>
        <textarea
          className="composer-input"
          rows={1}
          placeholder={t("ai.placeholder")}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send();
            }
          }}
        />
        <button
          className="btn btn-primary composer-send"
          disabled={disabled || !text.trim()}
          onClick={send}
        >
          {t("ai.send")}
        </button>
      </div>
    </div>
  );
}
