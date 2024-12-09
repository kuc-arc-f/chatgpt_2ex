# svelte_todo11

 Version: 0.9.1

 Author :
 
 date : 2024/12/09

 update :

***

Svelte + sqlite, Gemini-exp-1206 generate

***
### Setup

* .env

```
DB_FILE_NAME=file:local.db
```
***
* drizzle setting

https://orm.drizzle.team/docs/get-started/sqlite-new

***
* migrate

```
npx drizzle-kit generate
npx drizzle-kit migrate
```

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
データベース、Sqlite 連携してほしい。
ORMは、 drizzleを使用したい。

・バックエンドのみ、生成して欲しい。

・TODOの追加機能を、ダイアログで編集したいです。
・TODOの編集機能を、ダイアログで編集したいです。
・TODOの削除機能を、追加したいです。
・TODOの検索機能を、追加したいです。

```

***
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
