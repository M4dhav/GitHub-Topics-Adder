import TopicForm from "./topic-form";
import { authorUrl, repoUrl } from "./site";

const FINE_GRAINED_URL = "https://github.com/settings/personal-access-tokens/new";
const CLASSIC_URL =
  "https://github.com/settings/tokens/new?scopes=repo&description=GitHub%20Topic%20Adder";

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      className="font-medium underline underline-offset-2"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

const cardClass =
  "rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 px-6 py-8 font-sans dark:bg-black">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">GitHub Topic Adder</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Add topics to a GitHub repository in one go using the{" "}
            <ExternalLink href="https://docs.github.com/en/rest/repos/repos#replace-all-repository-topics">
              repository topics API
            </ExternalLink>
            .
          </p>
        </header>

        <main className={cardClass}>
          <TopicForm />
        </main>

        <section id="token-help" className={`${cardClass} scroll-mt-8 text-sm`}>
          <h2 className="text-base font-semibold">Creating a personal access token</h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            You need the <strong className="font-medium">Maintain</strong> or{" "}
            <strong className="font-medium">Admin</strong> role on the repository. Write access is
            not enough to change topics.
          </p>

          <div className="mt-4 grid gap-5 lg:grid-cols-3">
            <div>
              <h3 className="font-medium">
                <ExternalLink href={FINE_GRAINED_URL}>Fine-grained token</ExternalLink>
                <span className="ml-1.5 rounded-full bg-green-100 px-2 py-0.5 text-xs font-normal text-green-800 dark:bg-green-900 dark:text-green-100">
                  recommended
                </span>
              </h3>
              <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
                <li>
                  Set <strong className="font-medium">Resource owner</strong> to whoever owns the
                  repo.
                </li>
                <li>
                  Under <strong className="font-medium">Repository access</strong>, pick the repo.
                </li>
                <li>
                  Set <strong className="font-medium">Administration</strong> to{" "}
                  <strong className="font-medium">Read and write</strong>. That is the only
                  permission needed.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium">
                <ExternalLink href={CLASSIC_URL}>Classic token</ExternalLink>
              </h3>
              <p className="mt-1.5 text-zinc-600 dark:text-zinc-400">
                That link preselects the{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">
                  repo
                </code>{" "}
                scope, which is what you need. For public repositories,{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">
                  public_repo
                </code>{" "}
                alone is enough.
              </p>
            </div>

            <div>
              <h3 className="font-medium">Organization repositories</h3>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-zinc-600 dark:text-zinc-400">
                <li>
                  A fine-grained token&apos;s resource owner must be the organization. If it is not
                  listed, use a classic token.
                </li>
                <li>
                  Fine-grained tokens often need an owner&apos;s approval. Until then they stay
                  pending and requests fail with a 404.
                </li>
                <li>
                  With SAML SSO, open the token and click{" "}
                  <strong className="font-medium">Configure SSO</strong> →{" "}
                  <strong className="font-medium">Authorize</strong>, or you get a 403 mentioning
                  SAML.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <footer className="mt-auto pt-2 text-center text-sm text-zinc-500">
          Made with{" "}
          <span role="img" aria-label="love">
            ❤️
          </span>{" "}
          by <ExternalLink href={authorUrl}>M4dhav</ExternalLink>
          <span className="mx-2 text-zinc-300 dark:text-zinc-700">·</span>
          <ExternalLink href={repoUrl}>Source on GitHub</ExternalLink>
        </footer>
      </div>
    </div>
  );
}
