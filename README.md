# SecureVault 🔐

> 纯本地、跨平台、高安全性的离线密码管理器 · [English](README_EN.md)

[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Tauri](https://img.shields.io/badge/Tauri-v2-FFC131)](https://tauri.app)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev)
[![Rust](https://img.shields.io/badge/Rust-🦀-orange)](https://www.rust-lang.org)

SecureVault 是一款基于 **Tauri v2 + React 19 + Rust** 构建的桌面密码管理器，支持 Windows、macOS 和 Linux。所有加密操作在 Rust 后端完成，数据 100% 本地存储，绝不联网。

---

## 🔒 安全架构

| 层级 | 算法 | 说明 |
| --- | --- | --- |
| 密钥派生 | **Argon2id** (64MB) / **PBKDF2-SHA256** (100K iter) | 双算法可选，防 GPU/ASIC 暴力破解 |
| 数据加密 | **AES-256-GCM** | 随机 Nonce，认证加密，防篡改 |
| 存储位置 | 系统应用数据目录 | Windows `%APPDATA%` / macOS `Application Support` |
| 文件写入 | 原子写入 (write-temp + rename) | 防断电损坏 |
| 完整性 | **SHA-256 校验** | 导入备份时自动验证 |

---

## ✨ 功能

- **四种凭证类型**：登录账号 / 虚拟卡券 / 安全备忘 / 密保资料
- **文件夹分类 + 星标收藏**
- **安全审计**：弱密码检测 / 复用碰撞 / 已知泄露特征匹配
- **密码生成器**：随机字符 + BIP39 助记词短语（2048 词库）
- **加密备份导入导出**：AES-256-GCM 加密 + SHA-256 校验
- **自动锁定**：可配置超时，锁定时内存中的密钥和解密数据立即清除
- **剪贴板防泄漏**：复制后自动清除
- **启动 Splash 动画**：丝滑过渡到密码验证界面

---

## 🛠️ 技术栈

| 层 | 技术 |
| --- | --- |
| 桌面框架 | Tauri v2 |
| 前端 | React 19 + TypeScript |
| 加密后端 | Rust (aes-gcm, pbkdf2, argon2, sha2) |
| UI 组件 | Tailwind CSS v4 + motion + lucide-react |
| 构建 | Vite 6 + Cargo |

---

## 📁 项目结构

```text
src/
├── components/       # 8 个 UI 组件
│   ├── LockScreen.tsx         # 锁屏/创建主密码
│   ├── CredentialDetail.tsx   # 凭证详情
│   ├── PasswordGenerator.tsx  # 密码生成器
│   ├── SecurityAudit.tsx      # 安全审计
│   ├── SplashScreen.tsx       # 启动动画
│   └── FolderModal.tsx, DeleteConfirmModal.tsx, ImportPasswordModal.tsx
├── hooks/            # 3 个业务 Hook
│   ├── useVault.ts            # 加解密 / CRUD / 自动保存
│   ├── usePasswordGenerator.ts
│   └── useSecurityAudit.ts
├── utils/            # 3 个工具模块
│   ├── tauriBridge.ts         # Tauri IPC 桥接
│   ├── vaultStorage.ts        # 加密存储操作
│   └── wordlist.ts            # BIP39 2048 词库
├── App.tsx           # 主组件
├── main.tsx          # 入口
├── types.ts          # 类型定义
└── index.css         # 全局样式 + 动画
src-tauri/
├── src/main.rs       # Rust 加密后端 (7 个 Tauri 命令)
├── Cargo.toml        # Rust 依赖
└── tauri.conf.json   # Tauri 配置
```

---

## 🚀 本地开发

### 环境要求

- [Node.js](https://nodejs.org) 18+
- [Rust](https://www.rust-lang.org/tools/install)
- Windows: Visual Studio C++ 生成工具

### 启动

```bash
# 安装依赖
npm install

# 启动 Tauri 桌面调试模式
npm run tauri dev

# TypeScript 类型检查
npm run typecheck
```

### 打包

```bash
npm run tauri build
```

产物在 `src-tauri/target/release/bundle/nsis/`（Windows NSIS 安装器）。

绿色免安装版：`src-tauri/target/release/secure-vault-desktop.exe` 可直接运行。

---

## ☁️ 自动构建 (GitHub Actions)

本项目已配置 [publish.yml](.github/workflows/publish.yml)，推送版本标签自动构建三端安装包。

> **使用前**：仓库 Settings → Actions → General → Workflow permissions → 勾选 **Read and write permissions**

---

## ⚠️ 安全声明

- **不联网**：无任何网络请求，可完全断网运行
- **主密码不存盘**：仅内存中保留派生密钥，锁定时立即擦除
- **无后门**：主密码遗失后无法恢复数据，需强制重置
- **XOR 加密已移除**：当前版本全部使用 Rust AES-256-GCM 真实加密

---

## 📄 开源许可

[MIT License](LICENSE) — 自由使用、修改、分发。
