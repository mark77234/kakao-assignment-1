"use client";

type Props = {
  error: Error;
  reset: () => void;
};

export default function TodosError({ error, reset }: Props) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">문제가 발생했습니다.</h1>
      <p className="text-gray-600">{error.message}</p>

      <button
        type="button"
        onClick={reset}
        className="w-fit rounded-md bg-black px-4 py-2 text-white"
      >
        다시 시도
      </button>
    </main>
  );
}
