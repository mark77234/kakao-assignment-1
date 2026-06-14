"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const FRONTEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

export type TodoFilter = "all" | "active" | "completed";

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export async function getTodos(filter: TodoFilter = "all"): Promise<Todo[]> {
  const queryString = filter === "all" ? "" : `?filter=${filter}`;

  const response = await fetch(`${FRONTEND_API_URL}/todos${queryString}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Todo 목록을 불러오지 못했습니다.");
  }

  return response.json();
}

export async function createTodo(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();

  if (!title) {
    return;
  }

  // app/api/todos/route.ts 요청이 된다.
  await fetch(`${FRONTEND_API_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  revalidatePath("/todos"); // 기존 캐시 무효화
  redirect("/todos"); // 생성 후 Todo 목록으로 보내기
}

export async function updateTodo(todoId: number, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const completed = formData.get("completed") === "on";

  if (!title) {
    return;
  }

  await fetch(`${FRONTEND_API_URL}/todos/${todoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      completed,
    }),
  });

  revalidatePath("/todos");
  redirect("/todos"); // 수정 후 Todo 목록으로 보내기
}

export async function deleteTodo(todoId: number) {
  await fetch(`${FRONTEND_API_URL}/todos/${todoId}`, {
    method: "DELETE",
  });

  revalidatePath("/todos");
}

export async function toggleTodo(
  todoId: number,
  title: string,
  completed: boolean,
) {
  await fetch(`${FRONTEND_API_URL}/todos/${todoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      completed: !completed,
    }),
  });

  revalidatePath("/todos");
}
