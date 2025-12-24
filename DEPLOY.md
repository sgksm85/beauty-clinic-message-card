# Web出力とデプロイ手順書

このアプリをWebアプリとしてデプロイし、カスタムドメインで公開する手順です。

---

## 方法1: Manusの標準デプロイ（推奨）

### 手順

1. **Publishボタンをクリック**
   - Management UIの右上「Publish」ボタンをクリック
   - 自動的にビルドとデプロイが実行されます

2. **デプロイ完了**
   - `https://your-app.manus.app` 形式のURLが発行されます
   - このURLでWebアプリとしてアクセス可能になります

3. **カスタムドメイン設定**
   - Settings → Domain からカスタムドメインを追加
   - 例: `card.beauty-clinic.jp`
   - 表示されるCNAMEターゲットをDNSに設定

### メリット
- ワンクリックでデプロイ完了
- SSL証明書自動発行
- データベース接続も自動設定
- 最も簡単で推奨

---

## 方法2: Vercel/Netlifyへのデプロイ

Expo Webアプリを外部サービスにデプロイする場合の手順です。

### 事前準備

1. **GitHubリポジトリを作成**
   ```bash
   cd /home/ubuntu/beauty-clinic-message-card
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

2. **環境変数の準備**
   - `DATABASE_URL`: PostgreSQLの接続URL
   - その他必要な環境変数

### Vercelへのデプロイ

1. **Vercelアカウントでプロジェクトをインポート**
   - https://vercel.com にアクセス
   - 「New Project」→ GitHubリポジトリを選択

2. **ビルド設定**
   - Framework Preset: `Other`
   - Build Command: `pnpm run export:web`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

3. **環境変数を設定**
   - Settings → Environment Variables
   - `DATABASE_URL` などを追加

4. **デプロイ実行**
   - 「Deploy」ボタンをクリック
   - 数分でデプロイ完了

5. **カスタムドメイン設定**
   - Settings → Domains
   - カスタムドメインを追加
   - DNSにCNAMEレコードを設定

### Netlifyへのデプロイ

1. **Netlifyアカウントでプロジェクトをインポート**
   - https://netlify.com にアクセス
   - 「Add new site」→ GitHubリポジトリを選択

2. **ビルド設定**
   - Build command: `pnpm run export:web`
   - Publish directory: `dist`

3. **環境変数を設定**
   - Site settings → Environment variables
   - `DATABASE_URL` などを追加

4. **デプロイ実行**
   - 自動的にデプロイが開始されます

5. **カスタムドメイン設定**
   - Domain settings → Add custom domain
   - DNSにCNAMEレコードを設定

---

## Web出力用のビルドコマンド

ローカルでWeb出力をテストする場合:

```bash
# Web用にビルド
pnpm run export:web

# ビルド結果を確認
cd dist
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

---

## DNS設定例

カスタムドメイン `card.beauty-clinic.jp` を設定する場合:

### Vercelの場合

| タイプ | ホスト名 | 値 | TTL |
|--------|----------|-----|-----|
| CNAME | card | cname.vercel-dns.com | 3600 |

### Netlifyの場合

| タイプ | ホスト名 | 値 | TTL |
|--------|----------|-----|-----|
| CNAME | card | your-site.netlify.app | 3600 |

### Manusの場合

| タイプ | ホスト名 | 値 | TTL |
|--------|----------|-----|-----|
| CNAME | card | your-app.manus.app | 3600 |

---

## トラブルシューティング

### ビルドエラーが出る場合

```bash
# 依存関係を再インストール
rm -rf node_modules
pnpm install

# キャッシュをクリア
pnpm store prune
```

### データベース接続エラー

- 環境変数 `DATABASE_URL` が正しく設定されているか確認
- データベースが外部からアクセス可能か確認
- SSL接続が必要な場合は `?sslmode=require` を追加

### LINE共有URLが正しく動作しない

- `complete.tsx` の URL生成ロジックがカスタムドメインを使用しているか確認
- OGP画像が正しく生成されているか確認

---

## 推奨デプロイ方法

**初めての方**: Manusの標準デプロイ（方法1）が最も簡単です

**カスタマイズが必要な方**: Vercel/Netlify（方法2）を選択してください

どちらの方法でも、カスタムドメインの設定とSSL証明書の自動発行が可能です。
