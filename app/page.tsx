import TopicForm from "./topic-form";

export default function Home() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-lg">
        <h1 className="text-2xl font-semibold tracking-tight">GitHub Topic Adder</h1>
        <p className="mt-2 mb-8 text-sm text-zinc-600 dark:text-zinc-400">
          Add topics to a GitHub repository in one go using the{" "}
          <a
            className="underline"
            href="https://docs.github.com/en/rest/repos/repos#replace-all-repository-topics"
            target="_blank"
            rel="noopener noreferrer"
          >
            repository topics API
          </a>
          .
        </p>
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <TopicForm />
        </div>
      </main>
    </div>
  );
}
