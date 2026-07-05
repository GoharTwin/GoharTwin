import { useCallback, useEffect, useState } from "react";
import type { ChatMessage, Conversation } from "../types";

const STORAGE_KEY = "gohartwin.conversations";

function load(storageKey: string): Conversation[] {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as Conversation[]) : [];
  } catch {
    return [];
  }
}

/**
 * Conversation list persisted in localStorage.
 * A scope suffix (e.g. equipment id) keeps embedded chats separate.
 */
export function useConversations(scope?: string) {
  const storageKey = scope ? `${STORAGE_KEY}.${scope}` : STORAGE_KEY;
  const [conversations, setConversations] = useState<Conversation[]>(() => load(storageKey));
  const [activeId, setActiveId] = useState<string | null>(
    () => load(storageKey)[0]?.id ?? null
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(conversations));
  }, [conversations, storageKey]);

  const create = useCallback((title: string) => {
    const conversation: Conversation = {
      id: crypto.randomUUID(),
      title,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations((prev) => [conversation, ...prev]);
    setActiveId(conversation.id);
    return conversation.id;
  }, []);

  const rename = useCallback((id: string, title: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title, updatedAt: Date.now() } : c))
    );
  }, []);

  const remove = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        setActiveId((current) => (current === id ? next[0]?.id ?? null : current));
        return next;
      });
    },
    []
  );

  const appendMessage = useCallback((id: string, message: ChatMessage) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, messages: [...c.messages, message], updatedAt: Date.now() }
          : c
      )
    );
  }, []);

  const updateMessage = useCallback((id: string, messageId: string, content: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, content } : m
              ),
            }
          : c
      )
    );
  }, []);

  const active = conversations.find((c) => c.id === activeId) ?? null;

  return {
    conversations,
    active,
    activeId,
    setActiveId,
    create,
    rename,
    remove,
    appendMessage,
    updateMessage,
  };
}
