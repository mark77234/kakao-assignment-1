import Link from "next/link";
import { createTodo } from "../../actions";

export default function NewTodoPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 p-6">
      <header>
        <Link href="/todos" className="text-sm text-gray-500">
          목록으로
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Todo 생성</h1>
      </header>

      <form action={createTodo} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">할 일</span>
          <input
            name="title"
            type="text"
            required
            placeholder="할 일을 입력하세요"
            className="rounded-md border px-3 py-2"
          />
        </label>

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          생성
        </button>
      </form>
    </main>
  );
}
