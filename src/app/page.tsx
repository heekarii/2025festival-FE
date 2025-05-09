import TableTimer, { Table } from "./components/TableTimer";

export const dynamic = "force-dynamic"; // 매 요청마다 새로 SSR
export const revalidate = 0;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;


async function fetchTables(): Promise<Table[]> {
  const res = await fetch('${API_BASE}/tables', {
    cache: "no-store",
  });
  return res.json();
}

export default async function Page() {
  const initialTables = await fetchTables();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">테이블 입장 관리</h1>
      <TableTimer initialTables={initialTables} />
    </div>
  );
}