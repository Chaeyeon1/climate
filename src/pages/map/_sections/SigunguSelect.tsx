'use client';

import { useEffect, useMemo } from 'react';
import Sigungu from '../_related/gadm41_KOR_2.json';
import type { SelectedSido, SelectedSidos } from '@/types';

type Option = { value: string; label: string };

const ko = (s?: string) =>
  s ? (s.split('|')[0].split('(')[0] === 'NA' ? undefined : s.split('|')[0].split('(')[0]) : undefined;

// --- 인덱스 구축: GID_2 → 라벨, GID_1 → GID_2[]
const SIG_LABEL_BY_GID: Record<string, string> = {};
const SIG2_BY_SIDO1: Record<string, string[]> = {};

(Sigungu as any).features.forEach((f: any) => {
  const gid1 = f.properties.GID_1 as string;
  const gid2 = f.properties.GID_2 as string;
  SIG_LABEL_BY_GID[gid2] = ko(f.properties.NL_NAME_2) || f.properties.NAME_2 || gid2;
  (SIG2_BY_SIDO1[gid1] ??= []).push(gid2);
});

// 시/도별 시군구 옵션 미리 준비(라벨 정렬)
const PREPARED_OPTIONS_BY_SIDO1: Record<string, Option[]> = {};
for (const gid1 of Object.keys(SIG2_BY_SIDO1)) {
  PREPARED_OPTIONS_BY_SIDO1[gid1] = SIG2_BY_SIDO1[gid1]
    .map((gid2) => ({ value: gid2, label: SIG_LABEL_BY_GID[gid2] || gid2 }))
    .sort((a, b) => a.label.localeCompare(b.label, 'ko-KR'));
}

function useSigunguOptionsByGid1(gid1?: string) {
  return useMemo<Option[]>(() => {
    if (!gid1) return [];
    return PREPARED_OPTIONS_BY_SIDO1[gid1] ?? [];
  }, [gid1]);
}

export function SigunguSelect({
  selectedSidos,
  activeSidoId, // ✔️ 활성 시/도(GID_1) 외부 제어(옵션)
  onChangeActiveSidoId, // ✔️ 활성 시/도 변경 콜백(있으면 상단 셀렉트 표시)
  value, // 선택된 시군구(GID_2)
  onChange, // 시군구 변경 콜백
  label = '시/군/구',
  placeholder,
  width = 260,
}: {
  selectedSidos?: SelectedSidos; // [{ gid1, name? }, ...]
  activeSidoId?: string; // 없으면 첫 번째 항목을 활성 시/도로 사용
  onChangeActiveSidoId?: (gid1: string) => void;
  value?: string;
  onChange?: (gid2: string) => void;
  label?: string;
  placeholder?: string;
  width?: number;
}) {
  // 유효한 활성 시/도 결정
  const effectiveActiveSidoId =
    activeSidoId ?? (selectedSidos && selectedSidos.length > 0 ? selectedSidos[0].gid1 : undefined);

  const effectiveActiveSidoName = selectedSidos?.find((s) => s.gid1 === effectiveActiveSidoId)?.name;

  const options = useSigunguOptionsByGid1(effectiveActiveSidoId);

  // 활성 시/도가 바뀌면 시군구 선택 초기화
  useEffect(() => {
    if (!onChange) return;
    onChange('');
  }, [effectiveActiveSidoId, onChange]);

  const disabled = !effectiveActiveSidoId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width }}>
      {/* 활성 시/도 선택 드롭다운 (다중 선택 + onChangeActiveSidoId 제공 시 노출) */}
      {selectedSidos && selectedSidos.length > 1 && onChangeActiveSidoId && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: '#6b7280' }}>시/도</label>
          <select
            value={effectiveActiveSidoId ?? ''}
            onChange={(e) => onChangeActiveSidoId(e.target.value)}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              fontSize: 14,
              background: '#fff',
              color: '#111827',
            }}
          >
            {selectedSidos.map((s) => (
              <option key={s.gid1} value={s.gid1}>
                {s.name ?? s.gid1}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 시군구 선택 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 12, color: '#6b7280' }}>{label}</label>
        <select
          disabled={disabled}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          style={{
            padding: '8px 10px',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            fontSize: 14,
            background: disabled ? '#f3f4f6' : '#fff',
            color: '#111827',
          }}
        >
          <option value="" disabled>
            {placeholder ??
              (disabled
                ? '먼저 시/도를 선택하세요'
                : effectiveActiveSidoName
                ? `${effectiveActiveSidoName}의 시/군/구 선택`
                : '시/군/구 선택')}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
