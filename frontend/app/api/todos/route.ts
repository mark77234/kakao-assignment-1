const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function GET() {
  const response = await fetch(`${BACKEND_API_URL}/todos`, {
    cache: "no-store", // 캐시 설정 안함(매번 데이터가 바뀜)
  });
  const data = await response.json();

  return Response.json(data, {
    status: response.status,
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(`${BACKEND_API_URL}/todos`, {
    method: "POST",
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
