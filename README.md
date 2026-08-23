# Coordinate

Coordinate is an adaptive learning workspace that turns a clear goal into a
course you can review, refine, study, and test yourself on.

## Features

- Sign in securely with Google or GitHub.
- Generate a curriculum from your current level, goal, and preferred outcome.
- Reject vague or meaningless requests with a clear, actionable message.
- Review the complete curriculum before anything is saved.
- Request curriculum changes as many times as needed, then approve the version
  that feels right.
- Keep approved courses in a personal learning library.
- Generate chapter lessons with learning outcomes, practice tasks, resources,
  and citations.
- Take chapter quizzes with instant feedback and score tracking.
- Move through a responsive, accessible workspace with light and dark themes.
- Keep every course isolated to the signed-in learner.

## Run locally

### Requirements

- Node.js 20 or newer
- pnpm 11
- Python 3.12 or newer
- [uv](https://docs.astral.sh/uv/)
- A PostgreSQL database
- A Google Gemini API key
- Google and GitHub OAuth credentials

### 1. Create the environment files

Use the committed templates as the source of truth:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Replace every placeholder in those two new `.env` files. Never commit either
file. Use the same `FASTAPI_INTERNAL_TOKEN` in both files; generate a strong
value with:

```bash
openssl rand -base64 32
```

For a hosted PostgreSQL database, use the provider's pooled connection URL when
one is available. Keep TLS verification enabled, as shown in
`frontend/.env.example`.

### 2. Configure OAuth callbacks

Add these exact callback URLs in the Google and GitHub developer consoles:

```text
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/github
```

The origins in `BETTER_AUTH_URL` and `BACKEND_CORS_ORIGINS` must match the URLs
you use locally. Production OAuth callbacks must use the deployed HTTPS origin.

### 3. Install dependencies and prepare the database

```bash
cd frontend
pnpm install
pnpm exec prisma migrate deploy

cd ../backend
uv sync
```

### 4. Start the local services

In one terminal:

```bash
cd backend
uv run fastapi dev main.py
```

In another terminal:

```bash
cd frontend
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify a local setup

```bash
cd frontend
pnpm lint
pnpm typecheck
pnpm build

cd ../backend
PYTHONPATH=. uv run pytest
```

If social sign-in waits and then returns `ETIMEDOUT`, verify that the database
is active and that the current network allows outbound PostgreSQL connections.
Some campus and hostel networks block database ports even when ordinary web
traffic works.
