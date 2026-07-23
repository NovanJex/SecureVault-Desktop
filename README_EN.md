# SecureVault 🔐

> A fully offline, cross-platform, high-security password manager

[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Tauri](https://img.shields.io/badge/Tauri-v2-FFC131)](https://tauri.app)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev)
[![Rust](https://img.shields.io/badge/Rust-🦀-orange)](https://www.rust-lang.org)

SecureVault is a desktop password manager built with **Tauri v2 + React 19 + Rust**. All cryptographic operations run in the Rust backend. Your data stays 100% local — no network, no cloud, ever.

> 📖 [中文文档](README.md)

---

## 🔒 Security Architecture

| Layer | Algorithm | Notes |
| --- | --- | --- |
| Key Derivation | **Argon2id** (64MB) / **PBKDF2-SHA256** (100K iter) | Dual KDF, user-selectable |
| Data Encryption | **AES-256-GCM** | Random nonce, authenticated encryption |
| Storage | OS app data directory | Windows `%APPDATA%` / macOS `Application Support` |
| File I/O | Atomic write (temp + rename) | Prevents corruption on power loss |
| Integrity | **SHA-256 checksum** | Verified on backup import |

---

## ✨ Features

- **4 credential types**: Login / Card / Note / Identity
- **Folder organization + favorites**
- **Security audit**: weak/reused/compromised password detection
- **Password generator**: random characters + BIP39 passphrase (2048 words)
- **Encrypted backup**: AES-256-GCM export/import with SHA-256 verification
- **Auto-lock**: configurable timeout, memory cleared on lock
- **Clipboard protection**: auto-clear after copy
- **Startup splash animation**: smooth transition to lock screen

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| Desktop Framework | Tauri v2 |
| Frontend | React 19 + TypeScript |
| Crypto Backend | Rust (aes-gcm, pbkdf2, argon2, sha2) |
| UI | Tailwind CSS v4 + motion + lucide-react |
| Build | Vite 6 + Cargo |

---

## 📁 Project Structure

```text
src/
├── components/       # 8 UI components
│   ├── LockScreen.tsx
│   ├── CredentialDetail.tsx
│   ├── PasswordGenerator.tsx
│   ├── SecurityAudit.tsx
│   ├── SplashScreen.tsx
│   └── FolderModal.tsx, DeleteConfirmModal.tsx, ImportPasswordModal.tsx
├── hooks/            # 3 custom hooks
│   ├── useVault.ts            # crypto + CRUD + auto-save
│   ├── usePasswordGenerator.ts
│   └── useSecurityAudit.ts
├── utils/            # 3 utility modules
│   ├── tauriBridge.ts         # Tauri IPC wrapper
│   ├── vaultStorage.ts        # encrypted storage operations
│   └── wordlist.ts            # BIP39 2048 word list
├── App.tsx
├── main.tsx
├── types.ts
└── index.css
src-tauri/
├── src/main.rs       # Rust crypto backend (7 Tauri commands)
├── Cargo.toml
└── tauri.conf.json
```

---

## 🚀 Development

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Rust](https://www.rust-lang.org/tools/install)
- Windows: Visual Studio C++ Build Tools

### Quick Start

```bash
# Install dependencies
npm install

# Launch Tauri dev mode
npm run tauri dev

# TypeScript type check
npm run typecheck
```

### Build

```bash
npm run tauri build
```

Output: `src-tauri/target/release/bundle/nsis/` (Windows NSIS installer).

Portable version: `src-tauri/target/release/secure-vault-desktop.exe` can run directly.

---

## ☁️ CI/CD

Push a version tag to trigger automatic builds for Windows, macOS, and Linux:

```bash
git tag v1.0.0
git push origin v1.0.0
```

> **Important**: Enable **Read and write permissions** in repo Settings → Actions → General → Workflow permissions.

---

## ⚠️ Security Notes

- **Zero network**: no requests, works fully offline
- **Master password never stored**: only derived key held in memory, wiped on lock
- **No backdoor**: lost master password = data unrecoverable, must force-reset
- **All XOR encryption removed**: current version uses Rust AES-256-GCM exclusively

---

## 📄 License

[MIT License](LICENSE) — free to use, modify, and distribute.
