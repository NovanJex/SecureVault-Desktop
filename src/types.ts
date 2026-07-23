/**
 * Password Manager & PRD Hub Types
 */

export type ItemType = "login" | "card" | "note" | "identity";

export interface VaultItem {
  id: string;
  type: ItemType;
  title: string;
  folder: string;
  username?: string;
  password?: string;
  url?: string;
  cardName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  identityName?: string;
  identityEmail?: string;
  identityPhone?: string;
  identityAddress?: string;
  notes?: string;
  updatedAt: string;
  strength: "weak" | "medium" | "strong";
  isFavorite?: boolean;
  ignoreSecurityWarning?: boolean;
}

export interface VaultFolder {
  id: string;
  name: string;
  icon: string;
}

export interface PasswordConfig {
  length: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  excludeConfuse: boolean;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: string;
}
