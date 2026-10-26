# Workspace UI Template

Vite + React + TypeScript + Tailwind CSS v4 で作った、管理画面向けのフロントエンドテンプレートです。
画面に表示されるデータ・文章はすべて架空のサンプルです。API（Application Programming Interface）やバックエンドは含みません。

## セットアップ

Node.js 22.22.2 以上（22 系）、24.15.0 以上（24 系）、または 26 以上が必要です（`package.json` の `engines`）。推奨は LTS（Long Term Support、長期サポート版）の Node.js 24 で、`.nvmrc` にも指定しています。

```bash
nvm use          # .nvmrc の Node.js 24 に切り替える
npm install
npm run dev      # http://localhost:5173
npm run test     # 操作テスト（Vitest + Testing Library）
npm run check    # 型チェック + lint + テスト
npm run build    # 本番ビルド（dist/）
```

## デプロイ

`npm run build` で `dist/` に静的ファイルを出力します。ルーティングは `BrowserRouter`（ブラウザの URL をそのまま使う方式）のため、ホスティング側で「存在しないパスへのリクエストにも `index.html` を返す」設定（SPA fallback）が必要です。設定しないと、`/documents` などを直接開いたり再読み込みしたりしたときに 404 になります。

- Netlify: `public/_redirects` に `/* /index.html 200` を書く
- Vercel: `vercel.json` の `rewrites` で全パスを `/index.html` に向ける
- Cloudflare Pages: 404.html がなければ自動で SPA として扱われる

## 構成

```
src/
├── app.config.ts            # アプリ名・ロゴ・ナビゲーション・日付表示の既定値
├── routes.tsx               # ナビゲーションの URL ごとの画面
├── main.tsx / App.tsx       # エントリとルーティング（react-router）
├── index.css                # デザイントークン（@theme）
├── components/              # 再利用可能な UI 部品
│   ├── AppLayout.tsx        # ヘッダー + サイドバー + コンテンツ
│   ├── Header.tsx / UserMenu.tsx
│   ├── Sidebar.tsx          # md 以上の常時表示サイドバー
│   ├── MobileNav.tsx        # md 未満のドロワー型ナビゲーション
│   ├── NavMenu.tsx          # Sidebar と MobileNav が共有するメニュー
│   ├── Button.tsx / IconButton.tsx / Card.tsx / PageHeader.tsx / StatCard.tsx
│   ├── Input.tsx / Select.tsx / Textarea.tsx / Checkbox.tsx / RequiredMark.tsx
│   ├── StatusBadge.tsx / EmptyState.tsx
│   ├── Modal.tsx / SideDrawer.tsx / OverflowMenu.tsx
│   ├── ConfirmDialog.tsx    # useConfirm()
│   ├── Toast.tsx            # useToast()
│   └── NotFoundContent.tsx
├── context/
│   └── DisplaySettings.tsx  # 日付の形式とタイムゾーン（useDisplaySettings）
├── hooks/
│   └── useModalBehavior.ts  # ダイアログ共通の振る舞い（フォーカス・Esc・フォーカストラップ）
├── pages/                   # サンプル画面（Dashboard / Settings / 404）
│   └── documents/           # ドキュメント画面
│       ├── DocumentsPage.tsx      # 部品を並べるだけのページ本体
│       ├── useDocumentsPage.ts    # 検索・絞り込み・選択・作成・複製・削除
│       ├── DocumentToolbar.tsx    # 検索とフィルター
│       ├── DocumentTable.tsx      # md 以上の表
│       ├── DocumentMobileList.tsx # md 未満のカード一覧
│       ├── DocumentRowMenu.tsx    # 表とカードで共有する行メニュー
│       ├── DocumentPreview.tsx / DocumentSelectionBar.tsx / CreateDocumentForm.tsx
│       └── options.ts             # 種類と状態の選択肢
├── data/sample.ts           # 架空のサンプルデータ
└── lib/format.ts            # 日付フォーマット（ロケールとタイムゾーンを引数で受け取る）
```

## ライセンス

[MIT License](LICENSE)
