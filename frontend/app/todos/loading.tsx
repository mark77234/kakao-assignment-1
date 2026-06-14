export default function TodosLoading() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
      <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
      <div className="h-20 animate-pulse rounded bg-gray-100" />
      <div className="h-20 animate-pulse rounded bg-gray-100" />
      <div className="h-20 animate-pulse rounded bg-gray-100" />
    </main>
  );
}
