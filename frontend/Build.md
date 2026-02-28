# 環境構築手順書

## 前提
- Node.js が必要です（本プロジェクトは `pnpm` 前提のロックファイル `pnpm-lock.yaml` を使用）。
- 推奨パッケージマネージャ: `pnpm`
- 必要に応じて Vercel CLI（環境変数取得に使う場合）

## セットアップ手順
1. 依存関係をインストール
   ```bash
   pnpm install
   ```

2. 環境変数を用意
   - `.env.example` を参考に `.env` を作成するか、Vercel から取得します。
   - 例（Vercel から取得する場合）
     ```bash
     npm i -g vercel
     vercel link
     vercel env pull
     ```

3. 開発サーバー起動
   ```bash
   pnpm dev
   ```
   既定で http://localhost:3000 で起動します。

4. 本番ビルド
   ```bash
   pnpm build
   ```

5. 本番起動
   ```bash
   pnpm start
   ```

6. フォーマットチェック（任意）
   ```bash
   pnpm test
   ```

## 今起きていること（エラーの状況）
- `npm` で依存関係を解決しようとした際に、`ERESOLVE unable to resolve dependency tree` が発生しています。
- `next@15.6.0-canary.60` はプレリリース（canary）バージョンのため、`npm` の厳密な peer dependency 解決では、`geist@1.7.0` が要求する `next@">=13.2.0"` の範囲に **プレリリースが含まれない** と判定されることがあります。
- その結果、`npm` は依存関係ツリーを構築できず、インストールが中断されています。

## 原因の推測
- `npm` は peer dependency を厳密に解決します。`next@15.6.0-canary.60` はプレリリースのため、`geist` 側の `next@">=13.2.0"` という範囲条件に一致しないと解釈され、衝突として扱われている可能性が高いです。
- このプロジェクトは `pnpm` 前提で構成されており（`pnpm-lock.yaml` が存在）、`npm` での解決は想定外の挙動を引き起こしやすい構成です。

