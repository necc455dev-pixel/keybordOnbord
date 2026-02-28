# プロジェクト開設メモ（commerce）

## 概要
- Next.js App Router 構成。ルートは `app/` 配下。
- 主要レイアウトは `app/layout.tsx` が担当し、全ページで `Navbar` と `CartProvider` が共通表示される。
- 検索画面は `app/search` に集約され、クエリパラメータ（`q`, `sort`）を元に Shopify API へ検索を投げる。

## 画面初期表示から `app/search` までの流れ（順序とデータ受け渡し）

### 1. ルートレイアウトの描画
- `app/layout.tsx`
  - `CartProvider` に `getCart()` の Promise を渡す（データは後から解決される）。
  - `Navbar` を描画。
  - `children` で各ルート（例: `/search`）の内容を差し込む。

### 2. Navbar から検索クエリが作られる
- `components/layout/navbar/index.tsx`
  - `Navbar` はサーバーコンポーネント。
  - `getMenu("next-js-frontend-header-menu")` でメニューを取得し、`Search` を表示（`<Suspense>`）。
- `components/layout/navbar/search.tsx`
  - クライアントコンポーネント。
  - `<Form action="/search">` と `name="q"` の input を持つ。
  - `useSearchParams()` の `q` を `defaultValue` と `key` に使い、検索語が変わったら input の状態が更新される。
  - 送信すると `/search?q=...` の **クエリパラメータ** が付いた遷移になる。

### 3. `/search` のレイアウト（サイドバー/フィルタ）を構築
- `app/search/layout.tsx`
  - 左に `Collections`、右に `FilterList`（ソート）を配置。
  - 中央に `ChildrenWrapper` を挟んで `children`（検索結果のページ）を表示。
  - `ChildrenWrapper` は `Suspense` 内で描画される。
- `app/search/children-wrapper.tsx`
  - `useSearchParams()` の `q` を `key` にして `children` をラップ。
  - **検索語が変わるたびに再レンダリング**させる意図。

### 4. 検索パラメータの受け取りとデータ取得
- `app/search/page.tsx`
  - `searchParams` が Next.js から渡される（`?q=...&sort=...` をここで取得）。
  - `const { sort, q: searchValue } = searchParams` で **q と sort** を分解。
  - `sorting` と `defaultSort`（`lib/constants.ts`）から `sortKey` / `reverse` を決定。
  - `getProducts({ sortKey, reverse, query: searchValue })` で Shopify を検索。

### 5. データの変換と表示
- `lib/shopify/index.ts`
  - `getProducts` は `shopifyFetch` で GraphQL を実行。
  - 取得した `products` を `reshapeProducts()` で UI 向けに整形。
- `app/search/page.tsx`
  - 結果数に応じて「Showing ...」または「There are no products...」を表示。
  - `Grid` と `ProductGridItems` で商品一覧を描画。

### 6. ローディング表示
- `app/search/loading.tsx`
  - `/search` のデータ取得中に表示される skeleton。
  - `Grid` のプレースホルダを 12 件分描画。

## フィルタ UI とクエリの受け渡し

### コレクション切り替え
- `components/layout/search/collections.tsx`
  - `getCollections()` でコレクション一覧を取得。
  - `FilterList` に渡して描画。
- `components/layout/search/filter/item.tsx`
  - コレクションは `path` を持つアイテムとして扱われる。
  - `useSearchParams()` を `URLSearchParams` に変換し、**`q` を削除**してから遷移先 URL を作る。
  - `createUrl()`（`lib/utils.ts`）で `/search` または `/search/{handle}` に遷移。

### ソート切り替え
- `components/layout/search/filter/item.tsx`
  - `sort` は `searchParams.get("sort")` で判定。
  - `q` は保持したまま、`sort` だけ差し替えた URL を生成して遷移。
  - 結果として `/search?q=...&sort=...` が維持される。

## まとめ（データの受け渡しの要点）
- **発生源**: `Navbar` の検索フォームが `q` をクエリとして付与。
- **受け取り**: `app/search/page.tsx` が `searchParams` から `q` と `sort` を抽出。
- **変換**: `sorting/defaultSort` で `sortKey` と `reverse` に変換。
- **取得**: `getProducts({ query, sortKey, reverse })` で Shopify 検索。
- **描画**: `Grid` と `ProductGridItems` で一覧表示。
- **再描画**: `ChildrenWrapper` が `q` 変化に反応して `children` を再生成。

## 補足
- `getCollections()` は `path: "/search/{handle}"` を返すが、現状 `app/search/[collection]` に `page.tsx` が存在しないため、そのパスに遷移すると 404 になる可能性がある（実装状況に注意）。
