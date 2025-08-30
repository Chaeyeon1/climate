'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EnvIndicatorFilterParams, Level } from '@/types';
import { CHART_HEIGHT } from '../_related/const';

type SeriesItem = { id: string; name: string; points: [string, number][] };
type SeriesResp = {
  indicator: string;
  period: string;
  level: Level; // 'sido' | 'sigungu'
  unit?: string;
  range?: { start: string; end: string; step: 'day' | 'month' };
  series: SeriesItem[];
};

export default function SeriesPanel({
  level,
  ids,
  filters,
  height = CHART_HEIGHT,
}: {
  level: Level;
  ids: string[]; // level이 'sido'면 GID_1[], 'sigungu'면 GID_2[]
  filters: EnvIndicatorFilterParams;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { indicator, period } = filters;

  useEffect(() => {
    const dom = ref.current!;
    const chart = echarts.getInstanceByDom(dom) ?? echarts.init(dom);
    let alive = true;

    const renderEmpty = (msg: string) => {
      chart.clear();
      chart.setOption(
        {
          title: { text: '시계열', left: 'center' },
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

    (async () => {
      if (!ids.length) {
        renderEmpty('선택된 항목이 없습니다.');
        return;
      }

      const qs = new URLSearchParams({
        indicator,
        period: 'monthly', // 목업 핸들러는 monthly만 대응
        level,
        ids: ids.join(','),
      }).toString();

      const res = await fetch(`/series?${qs}`);
      const json: SeriesResp = await res.json();
      if (!alive) return;

      if (!json.series?.length) {
        renderEmpty('표시할 데이터가 없습니다.');
        return;
      }

      const xLabels = json.series[0].points.map(([ts]) => ts);
      const unit = json.unit ?? '';

      const legend = json.series.map((s) => s.name);
      const eSeries = json.series.map((s) => ({
        type: 'line',
        name: s.name,
        data: s.points.map(([, v]) => v),
        showSymbol: false,
        smooth: false,
        emphasis: { focus: 'series' },
        animationDurationUpdate: 180,
        animationEasingUpdate: 'quartOut',
      }));

      chart.setOption(
        {
          tooltip: { trigger: 'axis' },
          legend: { data: legend, top: 8 },
          grid: { left: 64, right: 24, top: 48, bottom: 40, containLabel: true },
          xAxis: {
            type: 'category',
            data: xLabels,
            boundaryGap: false,
            axisLabel: { hideOverlap: true },
          },
          yAxis: { type: 'value', name: unit },
          dataZoom: [
            { type: 'inside', xAxisIndex: 0 },
            { type: 'slider', xAxisIndex: 0, height: 18 },
          ],
          series: eSeries,
        } as echarts.EChartsOption,
        { notMerge: true }
      );
    })();

    const ro = new ResizeObserver(() => {
      if (!chart.isDisposed()) chart.resize();
    });
    ro.observe(dom);

    return () => {
      alive = false;
      ro.disconnect();
      if (!chart.isDisposed()) chart.dispose();
    };
  }, [indicator, period, level, ids.join(',')]);

  return <div ref={ref} style={{ width: '100%', height }} />;
}
