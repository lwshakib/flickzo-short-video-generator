# <img src="public/logo.svg" width="32" height="32" align="center" /> Contributing to Flickzo

Thank you for considering a contribution. This document is a practical path from zero to an opened pull request (PR). If anything here is unclear, open an issue and we can improve this guide.

## Table of contents

- [Code of conduct](#code-of-conduct)
- [Fork, clone, and remotes](#fork-clone-and-remotes)
- [Install and local setup](#install-and-local-setup)
- [Day-to-day development](#day-to-day-development)
- [Branches](#branches)
- [Commits](#commits)
- [Open a pull request](#open-a-pull-request)
- [PR checklist](#pr-checklist)
- [Reporting bugs](#reporting-bugs)
- [Suggesting enhancements](#suggesting-enhancements)
- [Styleguides](#styleguides)

## Code of conduct

Everyone participating is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md). Report problems to the maintainers as described there.

## Fork, clone, and remotes

1. **Fork** the repository on GitHub (button “Fork” on the upstream repo page). This creates a copy under your account.

2. **Clone your fork** (replace `YOUR_GITHUB_USERNAME`):

   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/flickzo-short-video-generator.git
   cd flickzo-short-video-generator
   ```

3. **Add the upstream remote** so you can sync `main` from the original project:

   ```bash
   git remote add upstream https://github.com/lwshakib/flickzo-short-video-generator.git
   git fetch upstream
   ```

4. **Keep `main` updated** before starting new work:

   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

## Install and local setup

Detailed environment and run instructions live in [README.md](README.md). Short version:

1. Install [Bun](https://bun.sh/) and PostgreSQL (or use a hosted database).

2. Install dependencies:

   ```bash
   bun install
   ```

3. Copy environment template and fill in secrets:

   ```bash
   cp .env.example .env
   ```

   You need working values for database, Better Auth + Google OAuth, Google API key (`GOOGLE_API_KEY`), S3-compatible storage, Resend, and Inngest as described in the README and `.env.example`.

4. Apply database migrations:

   ```bash
   bun x prisma migrate dev
   ```

5. Run the app and Inngest (two terminals):

   ```bash
   bun dev
   ```

   ```bash
   bun x inngest-cli@latest dev
   ```

6. Optionally run lint/format before pushing:

   ```bash
   bun run lint
   bun run format
   ```

## Day-to-day development

- Prefer small, focused changes that match existing patterns (imports, naming, file layout).
- If you change behavior visible to users or operators, update [README.md](README.md) or this file when appropriate.
- Do not commit real secrets; only use your local `.env` (gitignored).

## Branches

Never commit directly to `main` on your fork for work you intend to contribute. Create a **topic branch** off updated `main`:

```bash
git checkout main
git pull upstream main
git checkout -b <type>/<short-description>
```

Examples:

- `fix/credits-api-off-by-one`
- `feat/sidebar-credits-label`
- `chore/readme-inngest-note`

Use lowercase, hyphens, and a prefix that hints at the change type (`fix`, `feat`, `chore`, `docs`, etc.).

## Commits

- Use the **imperative mood** in the subject line: “Add validation” not “Added validation”.
- Keep the **first line around 72 characters** or less.
- **Explain why** in the body when the change is not obvious.
- Reference issues/PRs when relevant: `Fixes #12`.

We use Prettier and ESLint; run `bun run lint` and format before opening a PR.

## Open a pull request

A **pull request** is how you propose merging your branch into the upstream repository.

1. **Push your branch** to your fork:

   ```bash
   git push -u origin <type>/<short-description>
   ```

2. On GitHub, open your fork. You should see a banner to **“Compare & pull request”** against the upstream repo. Choose **base**: `lwshakib/flickzo-short-video-generator` → `main`, and **compare**: your branch.

3. **Write a clear title** and description:
   - What changed and **why** (not only how).
   - How to **test** it locally.
   - Screenshots for UI changes.

4. **Link related issues** (“Closes #10”, “Related to #8”).

5. **Respond to review feedback** with additional commits on the same branch (or amend if the project asks for a clean history—default is small follow-up commits).

6. After merge, you can delete the branch on your fork and sync `main` again.

If the upstream `main` moved while you were working, **rebase or merge** upstream into your branch and resolve conflicts before the final review:

```bash
git fetch upstream
git checkout <type>/<short-description>
git merge upstream/main
# or: git rebase upstream/main
git push origin <type>/<short-description>
```

## PR checklist

- [ ] Builds locally (`bun run build`) when your change touches build-critical code.
- [ ] `bun run lint` passes.
- [ ] Prettier-applied formatting for touched files (`bun run format` or editor on save).
- [ ] No secrets or machine-specific paths committed.
- [ ] User-facing or setup changes reflected in README / CONTRIBUTING if needed.

## Reporting bugs

- Use a **clear title** and **numbered steps** to reproduce.
- State **expected vs actual** behavior.
- Include **environment** (OS, Node/Bun version, browser if relevant).
- Add **screenshots or logs** when they help.

## Suggesting enhancements

- Describe the **problem** and proposed **solution**.
- Explain **who benefits** and any **tradeoffs** you see.

## Styleguides

### Git commit messages

- Present tense, imperative mood.
- First line ~72 characters; more detail after a blank line.

### TypeScript / React

- **TypeScript** for new code; prefer explicit types at boundaries.
- **Functional components** and hooks for React.
- Match existing **import and file** conventions.
- Run **ESLint** and **Prettier** before submitting.

## Community

Maintainer GitHub: [@lwshakib](https://github.com/lwshakib)
