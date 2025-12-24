# バックエンド・フロントエンド分離デプロイ手順書

このガイドでは、バックエンドAPIをRender.comに、フロントエンドをVercelにデプロイする手順を説明します。

---

## 前提条件

- GitHubアカウント
- Render.comアカウント（無料）
- Vercelアカウント（無料）
- プロジェクトをGitHubにプッシュ済み

---

## ステップ1: GitHubにプロジェクトをプッシュ

Management UIの「Code」パネルから「Download All Files」でプロジェクトをダウンロードし、GitHubにアップロードします。

\`\`\`bash
# ダウンロードしたプロジェクトディレクトリで実行
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git
git push -u origin main
\`\`\`

---

## ステップ2: バックエンドをRender.comにデプロイ

### 2-1. Render.comでプロジェクトを作成

1. https://render.com にアクセスしてログイン
2. 「New +」→「Web Service」をクリック
3. GitHubリポジトリを接続して選択
4. 以下の設定を入力:

| 項目 | 値 |
|------|-----|
| Name | beauty-message-card-api（任意） |
| Region | Singapore または Oregon（近い方） |
| Branch | main |
| Runtime | Node |
| Build Command | pnpm install && pnpm run build |
| Start Command | pnpm start |
| Instance Type | Free |

### 2-2. 環境変数を設定

「Environment」タブで以下を追加:

| Key | Value |
|-----|-------|
| NODE_ENV | production |
| DATABASE_URL | postgresql://...（ManusのDatabaseパネルから取得） |
| PORT | 3000 |

### 2-3. デプロイ実行

「Create Web Service」をクリックすると、自動的にデプロイが開始されます。

### 2-4. バックエンドURLを確認

デプロイ完了後、以下のようなURLが発行されます:

\`\`\`
https://beauty-message-card-api.onrender.com
\`\`\`

このURLをメモしてください（次のステップで使用します）。

---

## ステップ3: フロントエンドをVercelにデプロイ

### 3-1. Vercelでプロジェクトを作成

1. https://vercel.com にアクセスしてログイン
2. 「Add New Project」をクリック
3. GitHubリポジトリを選択
4. 以下のビルド設定を入力:

| 項目 | 値 |
|------|-----|
| Framework Preset | Other |
| Build Command | pnpm run export:web |
| Output Directory | dist |
| Install Command | pnpm install |

### 3-2. 環境変数を設定

「Environment Variables」で以下を追加:

| Key | Value | 説明 |
|-----|-------|------|
| EXPO_PUBLIC_API_BASE_URL | https://beauty-message-card-api.onrender.com | ステップ2-4で取得したURL |

**重要**: \`DATABASE_URL\` はフロントエンドには設定しないでください（セキュリティ上の理由）。

### 3-3. デプロイ実行

「Deploy」をクリックすると、自動的にデプロイが開始されます。

### 3-4. フロントエンドURLを確認

デプロイ完了後、以下のようなURLが発行されます:

\`\`\`
https://your-project.vercel.app
\`\`\`

---

## ステップ4: 動作確認

1. VercelのURLにアクセス
2. テンプレートを選択
3. メッセージを入力
4. 「カードを作成」をクリック
5. カードが正常に作成されることを確認

---

## ステップ5: カスタムドメイン設定（オプション）

### Vercel（フロントエンド）

1. Vercel Settings → Domains
2. カスタムドメインを追加（例: card.beauty-clinic.jp）
3. DNSにCNAMEレコードを設定:

| タイプ | ホスト名 | 値 | TTL |
|--------|----------|-----|-----|
| CNAME | card | cname.vercel-dns.com | 3600 |

### Render.com（バックエンド）

1. Render Settings → Custom Domain
2. カスタムドメインを追加（例: api.beauty-clinic.jp）
3. DNSにCNAMEレコードを設定:

| タイプ | ホスト名 | 値 | TTL |
|--------|----------|-----|-----|
| CNAME | api | your-app.onrender.com | 3600 |

4. Vercelの環境変数 \`EXPO_PUBLIC_API_BASE_URL\` を更新:
   - \`https://api.beauty-clinic.jp\`

---

## トラブルシューティング

### カード作成が失敗する

**原因**: バックエンドURLが正しく設定されていない

**解決策**:
1. Vercelの環境変数 \`EXPO_PUBLIC_API_BASE_URL\` が正しいか確認
2. Render.comのバックエンドが正常に起動しているか確認
3. ブラウザの開発者ツール（F12）でネットワークタブを確認

### CORS エラーが出る

**原因**: バックエンドのCORS設定が不足

**解決策**: バックエンドの \`server/_core/index.ts\` でCORS設定が有効になっているか確認（既に設定済みのはずです）

### データベース接続エラー

**原因**: Render.comの環境変数 \`DATABASE_URL\` が正しくない

**解決策**:
1. ManusのDatabaseパネルで接続文字列を確認
2. Render.comの環境変数を更新
3. Render.comでサービスを再デプロイ

---

## コスト

- Render.com Free Tier: 月750時間無料（1つのサービスで十分）
- Vercel Free Tier: 月100GBまで無料

どちらも無料プランで十分に運用可能です。

---

## 更新方法

GitHubにプッシュすると、Render.comとVercelが自動的に再デプロイします:

\`\`\`bash
git add .
git commit -m "Update message"
git push
\`\`\`

---

## サポート

デプロイでお困りの場合は、以下の情報をお知らせください:

- どのステップでつまずいているか
- エラーメッセージ（あれば）
- ブラウザの開発者ツールのコンソールログ
