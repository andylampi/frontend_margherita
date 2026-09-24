import type { ChatMessageItem, ChatRecord, ChatSummary } from "../types";

export const SPECIAL_WORD_SUFFIX = "_special_word";

// identificativo della chat: viene anteposto solo al testo inviato al server, mai mostrato
export function createSpecialWord() {
  return `${crypto.randomUUID().replaceAll("-", "")}${SPECIAL_WORD_SUFFIX}`;
}

export function splitQuery(query: string) {
  const [first, ...rest] = query.split(" ");

  if (first.endsWith(SPECIAL_WORD_SUFFIX)) {
    return { specialWord: first, text: rest.join(" ") };
  }

  return { specialWord: null, text: query };
}

// raggruppa i messaggi per special word: ogni gruppo è una chat
export function groupChats(records: ChatRecord[]): ChatSummary[] {
  const groups = new Map<string, ChatRecord[]>();

  records.forEach((record) => {
    // i messaggi senza special word diventano chat a sé
    const key = splitQuery(record.query).specialWord ?? record.id;
    groups.set(key, [...(groups.get(key) ?? []), record]);
  });

  return Array.from(groups, ([specialWord, group]) => {
    const sorted = [...group].sort((a, b) =>
      a.created_at.localeCompare(b.created_at),
    );

    return {
      specialWord,
      title: splitQuery(sorted[0].query).text,
      created_at: sorted[0].created_at,
      records: sorted,
    };
  }).sort((a, b) =>
    b.records[b.records.length - 1].created_at.localeCompare(
      a.records[a.records.length - 1].created_at,
    ),
  );
}

// trasforma i messaggi salvati in bolle della chat, senza special word
export function toChatMessages(records: ChatRecord[]): ChatMessageItem[] {
  return records.flatMap((record) => [
    {
      id: `${record.id}-query`,
      role: "user" as const,
      content: splitQuery(record.query).text,
    },
    {
      id: `${record.id}-response`,
      role: "assistant" as const,
      content: record.response,
      citations: record.citations,
    },
  ]);
}
