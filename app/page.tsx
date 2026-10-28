import TopicForm from "./topic-form";

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

export default function Home() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-lg">
        <h1 className="text-2xl font-semibold tracking-tight">GitHub Topic Adder</h1>
        <p className="mt-2 mb-8 text-sm text-zinc-600 dark:text-zinc-400">
          Add topics to a GitHub repository in one go using the{" "}
          <ExternalLink href="https://docs.github.com/en/rest/repos/repos#replace-all-repository-topics">
            repository topics API
          </ExternalLink>
          .
        </p>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <TopicForm />
        </div>

        <section
          id="token-help"
          className="mt-8 scroll-mt-8 rounded-lg border border-zinc-200 bg-white p-6 text-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <h2 className="text-base font-semibold">Creating a personal access token</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            You need the <strong className="font-medium">Maintain</strong> or{" "}
            <strong className="font-medium">Admin</strong> role on the repository. Write access is
            not enough to change topics.
          </p>

          <h3 className="mt-5 font-medium">
            <ExternalLink href={FINE_GRAINED_URL}>Create a fine-grained token</ExternalLink>{" "}
            <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-normal text-green-800 dark:bg-green-900 dark:text-green-100">
              recommended
            </span>
          </h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-zinc-600 dark:text-zinc-400">
            <li>
              Set <strong className="font-medium">Resource owner</strong> to the account or
              organization that owns the repo.
            </li>
            <li>
              Under <strong className="font-medium">Repository access</strong>, choose{" "}
              <em>Only select repositories</em> and pick the repo.
            </li>
            <li>
              Under <strong className="font-medium">Repository permissions</strong>, set{" "}
              <strong className="font-medium">Administration</strong> to{" "}
              <strong className="font-medium">Read and write</strong>. This is the only permission
              needed.
            </li>
          </ol>

          <h3 className="mt-5 font-medium">
            <ExternalLink href={CLASSIC_URL}>Create a classic token</ExternalLink>
          </h3>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            That link preselects the <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">repo</code>{" "}
            scope, which is what you need. For public repositories,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">public_repo</code>{" "}
            alone is enough.
          </p>

          <h3 className="mt-5 font-medium">Organization repositories</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-600 dark:text-zinc-400">
            <li>
              For a fine-grained token, the resource owner must be the organization. If it is not
              listed, the organization does not allow fine-grained tokens, so use a classic token.
            </li>
            <li>
              Many organizations require an owner to approve fine-grained tokens. Until that
              happens the token stays pending and requests fail with a 404.
            </li>
            <li>
              If the organization uses SAML single sign-on, open the token on its settings page and
              click <strong className="font-medium">Configure SSO</strong> →{" "}
              <strong className="font-medium">Authorize</strong>. Without this you get a 403 that
              mentions SAML.
            </li>
          </ul>

          <p className="mt-5 text-xs text-zinc-500">
            Your token is sent only from your browser to api.github.com. It is never stored, and it
            is gone when you reload the page.
          </p>
        </section>
      </main>
    </div>
  );
}
