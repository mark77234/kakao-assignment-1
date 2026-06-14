import Link from "next/link";
import { getTodos, updateTodo } from "../../actions";

type Props = {
  params: Promise<{
    todoId: string;
  }>;
};

export default async function TodoEditPage({ params }: Props) {
  const { todoId } = await params;
  const todos = await getTodos();

  const todo = todos.find((item) => item.id === Number(todoId));

  if (!todo) {
    throw new Error("Todo를 찾을 수 없습니다.");
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 p-6">
      <header>
        <Link href="/todos" className="text-sm text-gray-500">
          목록으로
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Todo 수정</h1>
      </header>

      <form
        action={updateTodo.bind(null, todo.id)}
        className="flex flex-col gap-4"
      >
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">할 일</span>
          <input
            name="title"
            type="text"
            required
            defaultValue={todo.title}
            className="rounded-md border px-3 py-2"
          />
        </label>

        <label className="flex items-center gap-2">
          <input
            name="completed"
            type="checkbox"
            defaultChecked={todo.completed}
          />
          <span>완료</span>
        </label>

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          저장
        </button>
      </form>
    </main>
  );
}
