"use client";

import { useState, useEffect } from "react";

export type Table = {
  id: number;
  name: string;
  entryTime: string | null;
};

type Props = {
  initialTables: Table[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function TableTimer({ initialTables }: Props) {
  // ① 서버에서 받아온 초기 상태
  const [tables, setTables] = useState<Table[]>(initialTables);

  // ② 실시간 시계
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // ③ API 호출 후 상태 업데이트
  const handleEnter = async (id: number) => {
    await fetch(`${API_BASE}/tables/${id}/enter`, {
      method: "POST",
    });
    setTables((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, entryTime: new Date().toISOString() }
          : t
      )
    );
  };

  const handleReset = async (id: number) => {
    await fetch(`${API_BASE}/tables/${id}/reset`, {
      method: "POST",
    });
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, entryTime: null } : t))
    );
  };

  const formatElapsed = (start: Date) => {
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return [h, m, s]
      .map((v) => v.toString().padStart(2, "0"))
      .join(":");
  };

  return (
    <table className="w-full table-auto border">
      <thead>
        <tr className="bg-gray-100">
          {["테이블", "입장 시간", "경과 시간", "액션"].map((h) => (
            <th key={h} className="border px-4 py-2">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tables.map((t) => {
          const entered = !!t.entryTime;
          const start = entered ? new Date(t.entryTime!) : null;
          return (
            <tr key={t.id}>
              <td className="border px-4 py-2">{t.name}</td>
              <td className="border px-4 py-2">
                {entered ? start!.toLocaleTimeString() : "–"}
              </td>
              <td className="border px-4 py-2">
                {entered && start ? formatElapsed(start) : "–"}
              </td>
              <td className="border px-4 py-2">
                {entered ? (
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleReset(t.id)}
                  >
                    리셋
                  </button>
                ) : (
                  <button
                    className="px-2 py-1 bg-green-500 text-white rounded"
                    onClick={() => handleEnter(t.id)}
                  >
                    입장
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}