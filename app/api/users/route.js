import { NextResponse } from "next/server";

export async function GET(req) {
  const token = req.headers.get("authorization");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/users`,
    { headers: { Authorization: token } }
  );
  const data = await res.json();
  return NextResponse.json(data);
}

export async function PATCH(req) {
  const token = req.headers.get("authorization");
  const body = await req.json();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/users`,
    {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json();
  return NextResponse.json(data);
}

