// _sections/SigunguLineChart.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';
import Sido from '../_related/gadm41_KOR_1.json';
import Sigungu from '../_related/gadm41_KOR_2.json';
import { EnvIndicatorFilterParams, SelectedSidos } from '@/types';
import { CHART_HEIGHT } from '../_related/const';
import { SigunguSelect } from './SigunguSelect';

type ApiItem = { gid: string; value: number | null };
type ApiResp = {
  indicator: string;
  period: string;
  level: 'sido' | 'sigungu';
  domain?: { min: number; max: number };
  items: ApiItem[];
};

const ko = (s?: string) =>
  s ? (s.split('|')[0].split('(')[0] === 'NA' ? undefined : s.split('|')[0].split('(')[0]) : undefined;

const SIDO_LABEL_BY_GID: Record<string, string> = {};
(Sido as any).features.forEach((f: any) => {
  const gid1 = f.properties.GID_1 as string;
  SIDO_LABEL_BY_GID[gid1] = ko(f.properties.NL_NAME_1) || f.properties.NAME_1 || gid1;
});

const SIG_LABEL_BY_GID: Record<string, string> = {};
(Sigungu as any).features.forEach((f: any) => {
  const gid2 = f.properties.GID_2 as string;
  SIG_LABEL_BY_GID[gid2] = ko(f.properties.NL_NAME_2) || f.properties.NAME_2 || gid2;
});

type Props = {
  selectedSidos: SelectedSidos; // ✔️ GID_1 배열
  filters: EnvIndicatorFilterParams;
  height?: number;
};

export default function SigunguLineChart({ selectedSidos, filters, height = CHART_HEIGHT }: Props) {
  const { indicator, period } = filters ?? {};
  const ref = useRef<HTMLDivElement>(null);

  // ✔️ 여러 개 선택 시 “활성 시/도”를 선택해서 보게 함
  const [activeSido, setActiveSido] = useState<string | undefined>(selectedSidos[0]?.gid1);
  useEffect(() => {
    setActiveSido((prev) => (prev && selectedSidos.some((s) => s.gid1 === prev) ? prev : selectedSidos[0]?.gid1));
  }, [selectedSidos]);

  // (옵션) 시군구 필터/선택
  const [selectedSigungu, setSelectedSigungu] = useState<string>('');
  useEffect(() => {
    // 시/도가 바뀌면 시군구 선택 초기화
    setSelectedSigungu('');
  }, [activeSido]);

  const activeSidoName = useMemo(
    () => selectedSidos.find((s) => s.gid1 === activeSido)?.name,
    [selectedSidos, activeSido]
  );

  useEffect(() => {
    const dom = ref.current;
    if (!dom) return;

    const chart = echarts.init(dom);
    let alive = true;

    const renderEmpty = (msg: string) => {
      chart.clear();
      chart.setOption(
        {
          title: { text: '시·군·구 꺾은선', left: 'center' },
          graphic: {
            type: 'text',
            left: 'center',
            top: 'middle',
            style: { text: msg, fontSize: 14, fill: '#6b7280' },
          },
        } as echarts.EChartsOption,
        { notMerge: true }
      );
    };

    async function load() {
      if (!activeSido) {
        renderEmpty('지도의 시/도를 선택하면 시·군·구 값이 표시됩니다.');
        return;
      }

      const qs = new URLSearchParams({
        indicator,
        period,
        level: 'sigungu',
        parentGid: activeSido,
      }).toString();

      const res = await fetch(`/map?${qs}`);
      const json: ApiResp = await res.json();
      if (!alive) return;

      const items = (json.items ?? []).filter((i) => i.gid && i.value != null) as ApiItem[];
      const mapped = items
        // (선택된 시군구만 보고 싶다면 selectedSigungu 사용)
        .filter((i) => (selectedSigungu ? i.gid === selectedSigungu : true))
        .map((i) => ({ name: SIG_LABEL_BY_GID[i.gid] || i.gid, value: Number(i.value) }));

      const sorted = mapped.sort((a, b) => b.value - a.value);
      const categories = sorted.map((d) => d.name);
      const values = sorted.map((d) => d.value);

      const fallbackMin = values.length ? Math.min(...values) : 0;
      const fallbackMax = values.length ? Math.max(...values) : 100;
      const min = json.domain?.min ?? fallbackMin;
      const max = json.domain?.max ?? fallbackMax;

      const sliderHeight = 22;
      const sliderBottom = 10;
      const bottomGrid = 28; // 라벨/슬라이더 여유

      chart.setOption(
        {
          title: { text: activeSidoName, left: 'center' },
          tooltip: { trigger: 'axis' },
          grid: { left: 64, right: 24, top: 56, bottom: bottomGrid, containLabel: true },
          xAxis: {
            type: 'category',
            data: categories,
            axisLabel: {
              rotate: 40,
              interval: 0,
              margin: 10,
              hideOverlap: true,
              // width: 100, overflow: 'truncate',
            },
          },
          yAxis: { type: 'value', min, max, name: '값', nameGap: 14 },
          dataZoom: [
            { type: 'slider', xAxisIndex: 0, height: sliderHeight, bottom: sliderBottom },
            { type: 'inside', xAxisIndex: 0 },
          ],
          series: [
            {
              type: 'line',
              data: values,
              symbol: 'circle',
              symbolSize: 6,
              smooth: false,
              showSymbol: false,
              emphasis: { focus: 'series' },
              animationDurationUpdate: 180,
              animationEasingUpdate: 'quartOut',
            },
          ],
        } as echarts.EChartsOption,
        { notMerge: true }
      );
    }

    load();

    // ResizeObserver로 크기 대응
    const ro = new ResizeObserver(() => {
      if (!chart.isDisposed()) chart.resize();
    });
    ro.observe(dom);

    return () => {
      alive = false;
      ro.disconnect();
      if (!chart.isDisposed()) chart.dispose();
    };
  }, [activeSido, indicator, period, selectedSigungu, activeSidoName]);

  return (
    <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* 활성 시/도 선택 드롭다운 (복수 선택 시 전환용) */}
        {selectedSidos.length > 1 && (
          <select
            value={activeSido ?? ''}
            onChange={(e) => setActiveSido(e.target.value || undefined)}
            style={{ padding: 6, borderRadius: 6, border: '1px solid #e5e7eb' }}
          >
            {selectedSidos.map((sido) => (
              <option key={sido.gid1} value={sido.gid1}>
                {sido.name || sido.gid1}
              </option>
            ))}
          </select>
        )}

        {/* (옵션) 특정 시군구만 보고 싶을 때 필터 */}
        <SigunguSelect
          selectedSidos={selectedSidos}
          activeSidoId={activeSido} // 선택적
          onChangeActiveSidoId={setActiveSido} // 선택적
          value={selectedSigungu}
          onChange={setSelectedSigungu}
        />
      </div>

      <div ref={ref} style={{ width: '100%', height }} />
    </div>
  );
}
