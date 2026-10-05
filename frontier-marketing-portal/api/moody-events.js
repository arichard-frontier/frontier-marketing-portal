export async function GET() {
  return new Response(
    JSON.stringify([
      {
        title: "API TEST",
        date: new Date().toISOString(),
      },
    ]),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}