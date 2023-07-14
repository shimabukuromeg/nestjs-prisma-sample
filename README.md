## Installation

```bash
$ pnpm install
```

# DB 起動

```bash
$ docker compose up
```

## アプリ起動

```bash
$ pnpm prisma migrate reset
$ pnpm start:dev
```

# 動作確認

```bash
$ curl http://localhost:3000/posts
```

jager UI

```
$ open http://localhost:16686/search
```
