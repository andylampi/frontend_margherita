import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { dictionary } from "./i18n";

export type RequestOptions = {
  url: string;
  headers?: HeadersInit;
  params?: Record<string, string | number | boolean>;
  body?: FormData;
};

export type DocumentItem = {
  id: string;
  filename: string;
  content_type: string;
  upload_date: string;
  status: string;
  page_count: number;
};

export type UploadDocumentsResponse = {
  message: string;
  documents: DocumentItem[];
};

export type ErrorKey = keyof typeof dictionary.errors;

export type PopupStatus = "dangerous" | "warn" | "success";

export type PopupProps = {
  status: PopupStatus;
  text?: string;
  onClose?: () => void;
};

export type PopupState = {
  status: PopupStatus;
  text?: string;
};

export type PopupContextValue = {
  showPopup: (status: PopupStatus, text?: string) => void;
};

export type AuthContextValue = {
  isLogged: boolean;
  setIsLogged: (value: boolean) => void;
};

export type AppContainerProps = {
  children: ReactNode;
};

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export type ChatRole = "user" | "assistant";

export type Citation = {
  document_id: string;
  filename: string;
  page_number: number;
  text_quote?: string;
  bounding_regions: unknown[];
};

export type ChatMessageItem = {
  id: string;
  role: ChatRole;
  content: string;
  citations?: Citation[];
};

export type ChatMessageProps = {
  role: ChatRole;
  content?: string;
  loading?: boolean;
  citations?: Citation[];
};

export type CitationsAccordionProps = {
  citations: Citation[];
};

export type ChatRecord = {
  id: string;
  user_id: string;
  created_at: string;
  query: string;
  response: string;
  citations?: Citation[];
};

export type ChatSummary = {
  specialWord: string;
  title: string;
  created_at: string;
  records: ChatRecord[];
};

export type ChatCardProps = {
  title: string;
  created_at: string;
  onClick?: () => void;
  disabled?: boolean;
};
