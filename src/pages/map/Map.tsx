import { useState } from 'react';
import { MapChart } from './_sections/MapChart';
import { MapFilter } from './_sections/MapFilter';
import { EnvIndicatorFilterParams, Indicator, Level, Period } from '@/types';
import { INDICATOR_TEMPERATURE, PERIOD_ALL, LEVEL_SIDO, LEVEL_SIGUNGU } from './_related/const';
import MapTable from './_sections/Table';
import SigunguLineChart from './_sections/SigunguLineChart';
import { SelectedSido } from './_related/types'; // { gid1: string; name: string; level?: 'sido'|'sigungu'; zoom?: number } | null

export const Map = () => {
  const [filters, setFilters] = useState<EnvIndicatorFilterParams>({
    indicator: INDICATOR_TEMPERATURE,
    period: PERIOD_ALL,
  });
  const [selectedSido, setSelectedSido] = useState<SelectedSido>(null);

  // 보기 레벨 토글 (sido / sigungu)
  const [viewLevel, setViewLevel] = useState<Level>(LEVEL_SIDO);

  const handlePeriodChange = (period: Period) => {
    setFilters((prev) => ({ ...prev, period }));
  };

  const handleIndicatorChange = (indicator: Indicator) => {
    setFilters((prev) => ({ ...prev, indicator }));
  };

  const btn = (active: boolean): React.CSSProperties => ({
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
        <MapChart level={viewLevel} filters={filters} selectedSido={selectedSido} onSelect={setSelectedSido} />

        {/* 오른쪽: 선택된 시/도의 시군구 라인/표 패널 */}
        {selectedSido?.gid1 && <SigunguLineChart selectedSidoGid={selectedSido} filters={filters} />}
      </div>

      <MapTable filters={filters} />
    </div>
  );
};
