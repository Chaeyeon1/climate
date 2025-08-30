'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { MapChart } from './_sections/MapChart';
import SigunguLineChart from './_sections/SigunguLineChart';
import { MapFilter } from './_sections/MapFilter';
import MapTable from './_sections/Table';
import { EnvIndicatorFilterParams, Indicator, Level, Period, SelectedSido } from '@/types';
import { INDICATOR_TEMPERATURE, PERIOD_ALL, LEVEL_SIDO, LEVEL_SIGUNGU } from './_related/const';

export const Map = () => {
  const [filters, setFilters] = useState<EnvIndicatorFilterParams>({
    indicator: INDICATOR_TEMPERATURE,
    period: PERIOD_ALL,
  });

  const [selectedSidos, setSelectedSidos] = useState<SelectedSido[]>([]);

  const selectedSidoIds = useMemo(() => selectedSidos.map((s) => s.gid1), [selectedSidos]);

  const [viewLevel, setViewLevel] = useState<Level>(LEVEL_SIDO);

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

  return (
    <div>
      <MapFilter filters={filters} onPeriodChange={handlePeriodChange} onIndicatorChange={handleIndicatorChange} />

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
          selectedSidos={selectedSidos}
          onChangeSelected={setSelectedSidos}
        />

        {selectedSidoIds.length > 0 && <SigunguLineChart selectedSidos={selectedSidos} filters={filters} />}
      </div>

      <MapTable filters={filters} />
    </div>
  );
};
