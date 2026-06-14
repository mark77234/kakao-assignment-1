import Link from "next/link";
import { deleteTodo, getTodos, toggleTodo, type TodoFilter } from "../actions";

type Props = {
  searchParams: Promise<{
    filter?: string;
  }>;
};

const filters: { label: string; value: TodoFilter; href: string }[] = [
  { label: "전체", value: "all", href: "/todos" },
  { label: "진행 중", value: "active", href: "/todos?filter=active" },
  { label: "완료", value: "completed", href: "/todos?filter=completed" },
];

function getTodoFilter(filter?: string): TodoFilter {
  if (filter === "active" || filter === "completed") {
    return filter;
  }

  return "all";
}

export default async function TodosPage({ searchParams }: Props) {
  const { filter } = await searchParams;
  const currentFilter = getTodoFilter(filter);
  const todos = await getTodos(currentFilter);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Todo 목록</h1>

        <Link
          href="/todos/new"
          className="rounded-md bg-black px-4 py-2 text-sm text-white"
        >
          새 Todo
        </Link>
      </header>

      <nav className="flex gap-2" aria-label="Todo 상태 필터">
        {filters.map((filterItem) => (
          <Link
            key={filterItem.value}
            href={filterItem.href}
            className={`rounded-md border px-3 py-2 text-sm ${
              currentFilter === filterItem.value
                ? "bg-black text-white"
                : "text-gray-700"
            }`}
          >
            {filterItem.label}
          </Link>
        ))}
      </nav>

      {todos.length === 0 ? (
        <p className="text-gray-500">등록된 Todo가 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between rounded-md border p-4"
            >
              <div>
                <p
                  className={todo.completed ? "line-through text-gray-400" : ""}
                >
                  {todo.title}
                </p>
                <p className="text-sm text-gray-500">
                  {todo.completed ? "완료" : "진행 중"}
                </p>
              </div>

              {/* 수정/삭제/완료 버튼 영역 */}
              <div className="flex gap-2">
                <form
                  action={toggleTodo.bind(
                    null,
                    todo.id,
                    todo.title,
                    todo.completed,
                  )}
                >
                  <button className="rounded-md border px-3 py-2 text-sm">
                    {todo.completed ? "복구" : "완료"}
                  </button>
                </form>

                <Link
                  href={`/todos/${todo.id}`}
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  수정
                </Link>

                <form action={deleteTodo.bind(null, todo.id)}>
                  <button className="rounded-md border px-3 py-2 text-sm text-red-600">
                    삭제
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
