import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { dictionary } from "./i18n";

export type RequestOptions = {
  url: string;
  headers?: HeadersInit;
  params?: Record<string, string | number | boolean>;
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
  isLogged: boolean | null;
  setIsLogged: (value: boolean) => void;
};

export type AppContainerProps = {
  children: ReactNode;
};

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
