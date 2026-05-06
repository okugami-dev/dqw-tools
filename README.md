# dqw-tools

Nuxt.js で構築されたツール群のリポジトリです。

## 🔗 URL
[https://dqw-tools.pages.dev](https://dqw-tools.pages.dev)

## 🛠 利用サービス・技術スタック
- **ホスティング**: Cloudflare Pages
- **ソース管理**: GitHub
- **フロントエンド**: Nuxt.js
- **パッケージマネージャ**: pnpm
- **データベース**: Google Spreadsheet (CSV公開機能を利用)

---

## 💻 開発環境のセットアップ

### 1. Node.js (nvm-windows)
Windows環境では `nvm-windows` を使用してバージョンを管理します。

```bash
# バージョン確認
nvm-version

# LTSバージョンのインストールと切り替え
nvm install lts
nvm use lts

# 完了確認
node -v
npm -v
```

#### ⚠️ npm実行エラー（スクリプト実行無効）の解決方法
`npm -v` 等で実行エラーが出る場合は、VSCodeを**管理者権限**で開き、以下のコマンドを実行してください。
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. プロジェクトの初期化
```bash
# Git for Windows をインストール済みであること
# pnpmのインストール
npm install -g pnpm

# プロジェクト作成
npx nuxi@latest init dqw-tools
## 途中で pnpm を選択、それ以外はデフォルト

# 依存関係のインストール
pnpm install

# ローカル開発サーバーの起動
pnpm run dev
```

---

## 📊 データベース設定 (Google Spreadsheet)
GoogleスプレッドシートをDBとして公開する手順です。

1. 対象のスプレッドシートを開く。
2. **[ファイル]** ＞ **[共有]** ＞ **[ウェブに公開]** を選択。
3. 形式を **「CSV」** に設定して公開。

---

## 📝 開発ツール (IDE)

### エディタ
- **VSCode (Visual Studio Code)**

### 推奨拡張機能
- **Vue-Official**
- **Prettier**
- **Tailwind CSS IntelliSense**

---

## 🚀 GitHub & デプロイ設定

### GitHub へのプッシュ
1. GitHubで新規リポジトリ `dqw-tools` (Public) を作成。
2. ローカルでユーザー設定を行う。
```bash
git config --global user.name "あなたの名前（英語）"
git config --global user.email "GitHubのメールアドレス"
```

### Cloudflare Pages のデプロイ設定
Cloudflareの管理画面で以下の通り設定します。

| 項目 | 設定値 |
| :--- | :--- |
| **メニュー** | `Workers & Pages` > `Create application` |
| **デプロイ方法** | 下部の `Looking to deploy pages? Get started` を選択 |
| **Framework preset** | `Nuxt` |
| **Build command** | `pnpm run build` |
| **Build output directory** | `dist` |