# svelte_todo1

 Version: 0.9.1

 Author :
 
 date : 2024/12/02

 update :

***

Svelte + sqlite + chatGPT generate

***
### build

* build, dev-start

```
bun run build
bun run dev
```

***
### Prompt

```
コード生成して欲しいです。
CRUD アプリ、
バックエンド: Express.js
フロントエンド : Svelte , tailwindCSS 使用したいです。
データベース、sqlite 連携してほしい。
ORMは、 drizzleを使用したい。

・バックエンドのみ、生成して欲しい。

・TODOの追加機能を、ダイアログで編集したいです。
・TODOの編集機能を、ダイアログで編集したいです。
・TODOの削除機能を、追加したいです。
・TODOの検索機能を、追加したいです。

```

```
上記、
フロントエンドのみ生成して欲しい。
Svelte , tailwindCSS 使用したいです。

・バリデーション追加したい。
npmは zod 使用したい。

検証内容は、下記です。
TODOデータ: 未入力は、エラー
```
***
