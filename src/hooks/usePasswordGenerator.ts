// usePasswordGenerator — 密码学安全密码/助记词生成器 Hook（BIP39）

import React, { useState, useCallback, useEffect } from "react";
import { secureRandomIndex } from "../utils/vaultStorage";
import { BIP39_WORD_LIST } from "../utils/wordlist";
import type { PasswordConfig } from "../types";

export interface UsePasswordGeneratorReturn {
  genType: "random" | "passphrase";
  setGenType: React.Dispatch<React.SetStateAction<"random" | "passphrase">>;
  genConfig: PasswordConfig;
  setGenConfig: React.Dispatch<React.SetStateAction<PasswordConfig>>;
  passphraseWords: number;
  setPassphraseWords: React.Dispatch<React.SetStateAction<number>>;
  passphraseSeparator: string;
  setPassphraseSeparator: React.Dispatch<React.SetStateAction<string>>;
  passphraseCapitalize: boolean;
  setPassphraseCapitalize: React.Dispatch<React.SetStateAction<boolean>>;
  passphraseAddNumber: boolean;
  setPassphraseAddNumber: React.Dispatch<React.SetStateAction<boolean>>;
  generatedPass: string;
  generatorHistory: string[];
  generatePassword: () => void;
  saveGeneratedToHistory: () => void;
  clearGeneratorHistory: () => void;
  calculateEntropy: (length: number, config: PasswordConfig) => number;
  calculatePassphraseEntropy: (wordsCount: number) => number;
}

const DEFAULT_CONFIG: PasswordConfig = {
  length: 16,
  useUppercase: true,
  useLowercase: true,
  useNumbers: true,
  useSymbols: true,
  excludeConfuse: true,
};

export function usePasswordGenerator(): UsePasswordGeneratorReturn {
  const [genType, setGenType] = useState<"random" | "passphrase">("random");
  const [genConfig, setGenConfig] = useState<PasswordConfig>(DEFAULT_CONFIG);
  const [passphraseWords, setPassphraseWords] = useState(4);
  const [passphraseSeparator, setPassphraseSeparator] = useState("-");
  const [passphraseCapitalize, setPassphraseCapitalize] = useState(true);
  const [passphraseAddNumber, setPassphraseAddNumber] = useState(true);
  const [generatedPass, setGeneratedPass] = useState("");
  const [generatorHistory, setGeneratorHistory] = useState<string[]>([]);

  /** 熵值计算：随机密码模式 */
  const calculateEntropy = useCallback((length: number, config: PasswordConfig) => {
    let pool = 0;
    if (config.useLowercase) pool += 26;
    if (config.useUppercase) pool += 26;
    if (config.useNumbers) pool += 10;
    if (config.useSymbols) pool += 28;
    if (pool === 0) return 0;
    return Math.round(length * Math.log2(pool));
  }, []);

  /** 熵值计算：助记词短语模式（BIP39: log2(2048) = 11 bits/word） */
  const calculatePassphraseEntropy = useCallback((wordsCount: number) => {
    return Math.round(wordsCount * 11);
  }, []);

  /** 生成密码 — 使用 crypto.getRandomValues() */
  const generatePassword = useCallback(() => {
    if (genType === "passphrase") {
      const words: string[] = [];
      for (let i = 0; i < passphraseWords; i++) {
        let word = BIP39_WORD_LIST[secureRandomIndex(BIP39_WORD_LIST.length)];
        if (passphraseCapitalize) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        words.push(word);
      }
      let passphrase = words.join(passphraseSeparator);
      if (passphraseAddNumber) {
        passphrase += passphraseSeparator + (secureRandomIndex(90) + 10);
      }
      setGeneratedPass(passphrase);
      return;
    }

    let chars = "";
    if (genConfig.useLowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (genConfig.useUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (genConfig.useNumbers) chars += "0123456789";
    if (genConfig.useSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (genConfig.excludeConfuse) {
      chars = chars.replace(/[il1o0O]/g, "");
    }

    if (!chars) { setGeneratedPass(""); return; }

    let password = "";
    for (let i = 0; i < genConfig.length; i++) {
      password += chars[secureRandomIndex(chars.length)];
    }
    setGeneratedPass(password);
  }, [genType, genConfig, passphraseWords, passphraseSeparator, passphraseCapitalize, passphraseAddNumber]);

  /** 保存当前生成的密码到历史缓存 */
  const saveGeneratedToHistory = useCallback(() => {
    if (generatedPass && !generatorHistory.includes(generatedPass)) {
      setGeneratorHistory(prev => [generatedPass, ...prev.slice(0, 19)]);
    }
  }, [generatedPass, generatorHistory]);

  /** 清空生成历史 */
  const clearGeneratorHistory = useCallback(() => {
    setGeneratorHistory([]);
  }, []);

  // 参数变更时自动重新生成
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  return {
    genType, setGenType,
    genConfig, setGenConfig,
    passphraseWords, setPassphraseWords,
    passphraseSeparator, setPassphraseSeparator,
    passphraseCapitalize, setPassphraseCapitalize,
    passphraseAddNumber, setPassphraseAddNumber,
    generatedPass, generatorHistory,
    generatePassword, saveGeneratedToHistory, clearGeneratorHistory,
    calculateEntropy, calculatePassphraseEntropy,
  };
}
