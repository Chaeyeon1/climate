'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { MapChart } from './_sections/MapChart';
import { MapFilter } from './_sections/MapFilter';
import MapTable from './_sections/Table';
import { EnvIndicatorFilterParams, Indicator, Level, Period, SelectedSido } from '@/types';
import { INDICATOR_TEMPERATURE, PERIOD_ALL, LEVEL_SIDO, LEVEL_SIGUNGU } from './_related/const';
import SeriesPanel from './_sections/SeriesPanel';
import OverallSeriesPanel from './_sections/OverallSeriesPanel';

export const Map = () => {
  const [filters, setFilters] = useState<EnvIndicatorFilterParams>({
    indicator: INDICATOR_TEMPERATURE,
    period: PERIOD_ALL,
  });

  // ✔ 시/도 선택(다중)
  const [selectedSidos, setSelectedSidos] = useState<SelectedSido[]>([]);
  // ✔ 시군구 선택(다중, GID_2[])
  const [selectedSigunguIds, setSelectedSigunguIds] = useState<string[]>([]);

  const [viewLevel, setViewLevel] = useState<Level>(LEVEL_SIDO);

  // 레벨 바뀌면 선택 초기화
  useEffect(() => {
    setSelectedSidos([]);
    setSelectedSigunguIds([]);
  }, [viewLevel]);

  const selectedSidoIds = useMemo(() => selectedSidos.map((s) => s.gid1), [selectedSidos]);

  const handlePeriodChange = (period: Period) => setFilters((prev) => ({ ...prev, period }));
  const handleIndicatorChange = (indicator: Indicator) => setFilters((prev) => ({ ...prev, indicator }));

  const btn = (active: boolean): CSSProperties => ({
    padding: '6px 10px',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    background: active ? '#111827' : '#fff',
    color: active ? '#fff' : '#111827',
    fontSize: 12,
    cursor: 'pointer',
  });

  // 우측 패널 노출 조건 + ids/level 준비
  const showRightPanel =
    (viewLevel === LEVEL_SIDO && selectedSidoIds.length > 0) ||
    (viewLevel === LEVEL_SIGUNGU && selectedSigunguIds.length > 0);

  const seriesIds = viewLevel === LEVEL_SIDO ? selectedSidoIds : selectedSigunguIds;

  return (
    <div>
      <MapFilter filters={filters} onPeriodChange={handlePeriodChange} onIndicatorChange={handleIndicatorChange} />

      {/* 레벨 토글 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 12px' }}>
        <span style={{ fontSize: 12, opacity: 0.7 }}>보기</span>
        <button style={btn(viewLevel === LEVEL_SIDO)} onClick={() => setViewLevel(LEVEL_SIDO)}>
          시/도
        </button>
        <button style={btn(viewLevel === LEVEL_SIGUNGU)} onClick={() => setViewLevel(LEVEL_SIGUNGU)}>
          시/군/구
        </button>
      </div>

      <div style={{ display: 'flex', gap: 16, width: '100%' }}>
        <MapChart
          level={viewLevel}
          filters={filters}
          // sido 선택 제어
          selectedSidos={selectedSidos}
          onChangeSelectedSidos={setSelectedSidos}
          // sigungu 선택 제어
          selectedSigunguIds={selectedSigunguIds}
          onChangeSelectedSigunguIds={setSelectedSigunguIds}
        />

        <div style={{ width: '100%' }}>
          <OverallSeriesPanel filters={filters} />
          {showRightPanel && <SeriesPanel level={viewLevel} ids={seriesIds} filters={filters} />}
        </div>
      </div>

      <MapTable filters={filters} />
    </div>
  );
};
