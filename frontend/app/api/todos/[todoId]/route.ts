const BACKEND_API_URL = process.env.BACKEND_API_URL;

type Props = {
  params: Promise<{
    todoId: string;
  }>;
};

export async function PUT(request: Request, { params }: Props) {
  const { todoId } = await params;
  const body = await request.json();

  const response = await fetch(`${BACKEND_API_URL}/todos/${todoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
  });
}

export async function DELETE(_request: Request, { params }: Props) {
  const { todoId } = await params;

  const response = await fetch(`${BACKEND_API_URL}/todos/${todoId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
  });
}
