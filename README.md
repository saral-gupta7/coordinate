# Framework

Framework is a full-stack AI project with a Next.js frontend and a FastAPI-ready Python backend. The repository is organized as a monorepo so the product, API, and project docs can evolve together.

## Project Structure

```txt
.
├── frontend/   # Next.js app
├── backend/    # Python backend
├── flow.md     # Product flow notes
└── revamp.md   # Planning notes
```

## Getting Started

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

The frontend runs at `http://localhost:3000`.

### Backend

```bash
cd backend
uv sync
uv run python main.py
```

## Notes

- Keep frontend-specific ignores in `frontend/.gitignore`.
- Keep backend-specific ignores in `backend/.gitignore`.
- Use the root `.gitignore` for shared production, local, OS, editor, cache, and secret files.
- Commit lockfiles so installs stay reproducible across environments.
