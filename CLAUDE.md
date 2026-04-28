@AGENTS.md

# instyle-goal-sheet

## デプロイ設定（Claude Code 用）

ConoHa VPS 上で本番運用する。本番反映は **「本番にあげて」** の指示で起動する（ワークスペース CLAUDE.md の「ConoHa 本番デプロイ」節を参照）。

| キー | 値 |
|---|---|
| CATEGORY | `app` |
| APP_NAME | `instyle-goal-sheet` |
| PORT | `3001` |
| 公開URL | `https://app.instyle.group/instyle-goal-sheet/` |
| HEALTHCHECK_PATH | `/instyle-goal-sheet/`（ルート判定。`/api/health` は未実装） |
| USE_DB | `false` |
| PM2名 | `app-instyle-goal-sheet` |
| サーバ側パス | `/var/www/app/instyle-goal-sheet/` |
| アプリ固有 env | `/var/www/_shared/apps/app-instyle-goal-sheet.env` |
| プレビュー (Vercel) | `<repo>.vercel.app`（basePath は Vercel 上では無効化） |

## ローカル開発

```bash
npm install
npm run dev
# http://localhost:3000/instyle-goal-sheet/ でアクセス（basePath 込み）
```

## 本番デプロイ

「本番にあげて」と Claude Code に指示すると、`gh workflow run deploy-prod.yml --ref main` で GitHub Actions が走り、ConoHa VPS にデプロイされる。

手動で起動する場合:
```bash
gh workflow run deploy-prod.yml --ref main
gh run watch
```

## ロールバック

GitHub Actions 側のヘルスチェック失敗時は自動で前 release に戻る。手動で戻す場合:

```bash
ssh deploy@160.251.201.115
cd /var/www/app/instyle-goal-sheet/releases
ls -lt   # 直前の release ディレクトリを確認
ln -sfn <previous-sha> ../current.new && mv -T ../current.new ../current
pm2 reload app-instyle-goal-sheet --update-env
```

## デプロイ前提（初回のみ必要）

- ConoHa VPS 初期セットアップ（`~/Workspace/docs/conoha-setup.md`）
- DNS: `app.instyle.group` → `160.251.201.115`
- GitHub 組織 Secrets: `CONOHA_HOST` / `CONOHA_PORT` / `CONOHA_USER` / `CONOHA_SSH_KEY`
- リポジトリ Variables: `CATEGORY=app` / `APP_NAME=instyle-goal-sheet` / `HEALTHCHECK_PATH=/instyle-goal-sheet/` / `USE_DB=false`
- ConoHa 側:
  - `/var/www/app/instyle-goal-sheet/{releases,shared}` 作成（オーナー deploy）
  - `/var/www/_shared/apps/app-instyle-goal-sheet.env` 配置（必要なら）
  - `/etc/nginx/conf.d/proxy-apps/app/instyle-goal-sheet.conf` に以下を作成（exact + `^~` prefix の 2 段で trailing-slash ループ回避）:
    ```nginx
    location = /instyle-goal-sheet {
      include snippets/proxy-next.conf;
      proxy_pass http://127.0.0.1:3001;
    }
    location ^~ /instyle-goal-sheet/ {
      include snippets/proxy-next.conf;
      proxy_pass http://127.0.0.1:3001;
    }
    ```
  - `nginx -t && systemctl reload nginx`
