import { EnvIndicatorFilterParams, EnvTable, MapTableItem } from '@/types';
import React, { useEffect, useState } from 'react';

export default function MapTable({ filters }: { filters: EnvIndicatorFilterParams }) {
  const { indicator, period } = filters;
  const [rows, setRows] = useState<MapTableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const fetchTable = async () => {
      try {
        setLoading(true);
        setErr(null);
        const qs = new URLSearchParams({ indicator, period });
        const res = await fetch(`/map/table?${qs.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: EnvTable = await res.json();
        if (!alive) return;
        setRows(json.items ?? []);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || '요청 중 오류가 발생했습니다.');
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchTable();
    return () => {
      alive = false;
    };
  }, [indicator, period]);

  const onDownloadCsv = () => {
    const qs = new URLSearchParams({ indicator, period });
    window.location.href = `/map/export?${qs.toString()}`;
  };

  return (
    <div style={{ width: '100%', maxWidth: 1000, margin: '32px auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>환경지표 테이블</h3>
        <div style={{ flex: 1 }} />
        <button onClick={onDownloadCsv}>CSV 다운로드 (시군구)</button>
      </div>

      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <Th>시/도 </Th>
              <Th>예측값</Th>
              <Th>관측값</Th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <Td colSpan={3} style={{ textAlign: 'center', padding: 24 }}>
                  불러오는 중…
                </Td>
              </tr>
            )}
            {err && !loading && (
              <tr>
                <Td colSpan={3} style={{ color: 'crimson', padding: 16 }}>
                  {err}
                </Td>
              </tr>
            )}
            {!loading && !err && rows?.length === 0 && (
              <tr>
                <Td colSpan={3} style={{ padding: 16, color: '#6b7280' }}>
                  데이터가 없습니다.
                </Td>
              </tr>
            )}
            {!loading &&
              !err &&
              rows.map((row) => (
                <tr key={row.region}>
                  <Td colSpan={1}>{row.region}</Td>
                  <Td colSpan={1} style={{ textAlign: 'right' }}>
                    {row.predict.toFixed(1)}
                  </Td>
                  <Td colSpan={1} style={{ textAlign: 'right' }}>
                    {row.value.toFixed(1)}
                  </Td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th(props: React.PropsWithChildren<{ onClick?: () => void }>) {
  return (
    <th
      onClick={props.onClick}
      style={{
        textAlign: 'left',
        padding: '12px 14px',
        fontWeight: 600,
        fontSize: 14,
        color: '#111827',
        borderBottom: '1px solid #e5e7eb',
        userSelect: 'none',
      }}
    >
      {props.children}
    </th>
  );
}

function Td(
  props: React.PropsWithChildren<{
    colSpan?: number;
    style?: React.CSSProperties;
  }>
) {
  return (
    <td
      colSpan={props.colSpan}
      style={{
        padding: '10px 14px',
        fontSize: 14,
        color: '#111827',
        borderBottom: '1px solid #f3f4f6',
        ...props.style,
      }}
    >
      {props.children}
    </td>
  );
}
