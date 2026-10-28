# GitHub Topic Adder

A small web app for adding topics to a GitHub repository in one go, instead of typing them in one at a time on the repo's About settings.

Enter a comma-separated list of topics, the repository URL and a GitHub personal access token (PAT). The app calls the GitHub REST API ([Replace all repository topics](https://docs.github.com/en/rest/repos/repos#replace-all-repository-topics)) for you.

## How it works

- The `PUT /repos/{owner}/{repo}/topics` endpoint **replaces** every topic on a repo. To add topics rather than overwrite them, the app first reads the current topics, then sends the old and new topics together. Tick **Replace existing topics** if you do want to overwrite them.
- Topics are lowercased, spaces become hyphens, and duplicates are removed. GitHub's rules are checked before sending: lowercase letters, numbers and hyphens only, starting with a letter or number, at most 50 characters each, and at most 20 topics per repository.
- Accepted repo formats: `https://github.com/owner/repo`, `github.com/owner/repo`, `owner/repo`.

### Your token stays in your browser

All API calls are made directly from your browser to `api.github.com`. The token is never sent to the server hosting this app, and it is never stored. When you reload the page, it is gone. A Content-Security-Policy header blocks the page from connecting to any origin other than itself and `api.github.com`.

## Creating a token

You need the **Maintain** or **Admin** role on the repository. Write access is not enough to manage topics.

**Fine-grained token (recommended)**

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.
2. Set **Resource owner** to the account or organization that owns the repo.
3. Under **Repository access**, select the repo(s).
4. Under **Repository permissions**, set **Administration** to **Read and write**.

**Classic token**

Use the `repo` scope. For public repos only, `public_repo` is enough.

### Organization repositories

- **Fine-grained tokens:** the resource owner must be the organization. If the organization isn't listed, it doesn't allow fine-grained tokens, so use a classic token. Many organizations require an owner to approve fine-grained tokens. Until they do, the token is "pending" and requests fail with a 404.
- **Classic tokens with SAML SSO:** open the token's page and click **Configure SSO** → **Authorize** for the organization. Otherwise requests fail with a 403 that mentions SAML.
- Some organizations block classic tokens entirely.

### Troubleshooting

| Error | Likely cause |
| --- | --- |
| 401 | Token is wrong, expired or revoked. |
| 403 | SSO not authorized, the organization's token policy, or rate limiting. GitHub's message is shown in the app. |
| 404 | The token can't see the repo: wrong resource owner, repo not selected, missing permission, or pending organization approval. |
| 422 | GitHub rejected a topic name. |

## Running locally

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying

The page is fully static and needs no environment variables or secrets.

```bash
npm run build
npm start
```

It deploys as-is to Vercel or any host that runs Next.js. The security headers are set in [`next.config.ts`](next.config.ts) and are applied by the Next.js server.

**Static-only hosts:** these headers are not applied on a host that only serves static files, such as GitHub Pages or an `output: "export"` build. On those hosts, configure the same headers on the host, or add a `<meta http-equiv="Content-Security-Policy">` tag. Note that `frame-ancestors` and `X-Frame-Options` only work as real headers.

## Project structure

- [`app/page.tsx`](app/page.tsx): page layout
- [`app/topic-form.tsx`](app/topic-form.tsx): the form, validation and GitHub API calls
- [`next.config.ts`](next.config.ts): security headers
