"use client";

import { useState, type FormEvent } from "react";

// GitHub topic rules: lowercase letters, numbers and hyphens, starting with a
// letter or number, at most 50 characters, and at most 20 topics per repo.
const TOPIC_PATTERN = /^[a-z0-9][a-z0-9-]{0,49}$/;
const MAX_TOPICS = 20;

type Status =
  | { kind: "idle" }
  | { kind: "working" }
  | { kind: "success"; topics: string[]; added: string[] }
  | { kind: "error"; message: string };

function parseRepoUrl(input: string): { owner: string; repo: string } | null {
  const trimmed = input.trim().replace(/\.git$/, "").replace(/\/+$/, "");
  const match =
    trimmed.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s]+)\/([^/\s]+)/i) ??
    trimmed.match(/^([^/\s]+)\/([^/\s]+)$/);
  return match ? { owner: match[1], repo: match[2] } : null;
}

function parseTopics(input: string): string[] {
  const topics = input
    .split(",")
    .map((t) => t.trim().toLowerCase().replace(/\s+/g, "-"))
    .filter(Boolean);
  return [...new Set(topics)];
}

async function githubRequest<T>(
  url: string,
  token: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.message ?? detail;
    } catch {}
    if (res.status === 401) detail = "Bad credentials: check your token.";
    if (res.status === 404)
      detail =
        "Repository not found, or your token cannot access it. A fine-grained token needs 'Administration: write' on this repo; a classic token needs the 'repo' scope (or 'public_repo').";
    throw new Error(`GitHub API ${res.status}: ${detail}`);
  }
  return res.json();
}

export default function TopicForm() {
  const [topicsInput, setTopicsInput] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [token, setToken] = useState("");
  const [replace, setReplace] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const repo = parseRepoUrl(repoUrl);
    if (!repo) {
      setStatus({ kind: "error", message: "Enter a repo URL like https://github.com/owner/repo." });
      return;
    }
    const newTopics = parseTopics(topicsInput);
    if (newTopics.length === 0) {
      setStatus({ kind: "error", message: "Enter at least one topic." });
      return;
    }
    const invalid = newTopics.filter((t) => !TOPIC_PATTERN.test(t));
    if (invalid.length > 0) {
      setStatus({
        kind: "error",
        message: `Invalid topic(s): ${invalid.join(", ")}. Topics may only contain lowercase letters, numbers and hyphens, must start with a letter or number, and be at most 50 characters.`,
      });
      return;
    }
    if (!token.trim()) {
      setStatus({ kind: "error", message: "Enter a GitHub personal access token." });
      return;
    }

    setStatus({ kind: "working" });
    const endpoint = `https://api.github.com/repos/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.repo)}/topics`;

    try {
      // PUT replaces the full topic list, so fetch the existing topics first
      // unless the user explicitly wants to replace them.
      const existing = replace
        ? []
        : (await githubRequest<{ names: string[] }>(endpoint, token.trim())).names;
      const merged = [...new Set([...existing, ...newTopics])];
      if (merged.length > MAX_TOPICS) {
        throw new Error(
          `A repository can have at most ${MAX_TOPICS} topics; this would result in ${merged.length}.`,
        );
      }

      const result = await githubRequest<{ names: string[] }>(endpoint, token.trim(), {
        method: "PUT",
        body: JSON.stringify({ names: merged }),
      });
      setStatus({
        kind: "success",
        topics: result.names,
        added: newTopics.filter((t) => !existing.includes(t)),
      });
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const inputClass =
    "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-800";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Topics (comma separated)</span>
        <input
          className={inputClass}
          value={topicsInput}
          onChange={(e) => setTopicsInput(e.target.value)}
          placeholder="nextjs, typescript, github-api"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">GitHub repo URL</span>
        <input
          className={inputClass}
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/owner/repo"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">GitHub personal access token</span>
        <input
          className={inputClass}
          type="password"
          autoComplete="off"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ghp_... or github_pat_..."
        />
        <span className="text-xs text-zinc-500">
          Sent only from your browser to api.github.com. It is never stored.{" "}
          <a href="#token-help" className="underline underline-offset-2">
            Need a token?
          </a>
        </span>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={replace} onChange={(e) => setReplace(e.target.checked)} />
        Replace existing topics instead of adding to them
      </label>

      <button
        type="submit"
        disabled={status.kind === "working"}
        className="rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {status.kind === "working" ? "Updating topics…" : "Add topics"}
      </button>

      {status.kind === "error" && (
        <p role="alert" className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {status.message}
        </p>
      )}

      {status.kind === "success" && (
        <div className="rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-100">
          <p className="mb-2">
            {status.added.length > 0
              ? `Added ${status.added.length} topic(s). The repo now has:`
              : "No new topics to add. The repo has:"}
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {status.topics.map((t) => (
              <li
                key={t}
                className={`rounded-full px-2.5 py-0.5 text-xs ${
                  status.added.includes(t)
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                }`}
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
