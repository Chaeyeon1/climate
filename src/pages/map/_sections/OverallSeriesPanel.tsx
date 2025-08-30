'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EnvIndicatorFilterParams } from '@/types';
import { CHART_HEIGHT } from '../_related/const';

type OverallResp = {
  indicator: string;
  period: string;
  unit?: string;
  range?: { start: string; end: string; step: 'day' | 'week' | 'month' };
  overall: {
    name: string;
    observed: [string, number][];
    predicted: [string, number][];
  };
};

export default function OverallSeriesPanel({
  filters,
  height = CHART_HEIGHT,
  title = '전체 지역 온도 시계열 변화',
  width = '100%',
}: {
  filters: EnvIndicatorFilterParams;
  height?: number;
  width?: number | string;
  title?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { indicator, period } = filters;

  useEffect(() => {
    const dom = ref.current;
    if (!dom) return;

    const chart = echarts.getInstanceByDom(dom) ?? echarts.init(dom);
    let alive = true;

    const renderEmpty = (msg: string) => {
      chart.clear();
      chart.setOption(
        {
          title: { text: title, left: 'center' },
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
      // 목업은 monthly만 대응하지만 period 그대로 넘겨도 무방
      const qs = new URLSearchParams({
        indicator,
        period: 'monthly',
      }).toString();

      const res = await fetch(`/series/overall?${qs}`);
      const json: OverallResp = await res.json();
      if (!alive) return;

      if (!json?.overall?.observed?.length) {
        renderEmpty('표시할 데이터가 없습니다.');
        return;
      }

      const x = json.overall.observed.map(([ts]) => ts);
      const observed = json.overall.observed.map(([, v]) => v);
      const predicted = json.overall.predicted?.map(([, v]) => v) ?? [];

      const unit = json.unit ?? '°C';
      const legend = ['Observed', 'Predicted'].filter((_, i) => (i === 0 ? true : predicted.length > 0));

      chart.setOption(
        {
          title: { text: title, left: 'center' },
          tooltip: { trigger: 'axis' },
          legend: { data: legend, top: 8 },
          grid: { left: 64, right: 24, top: 48, bottom: 40, containLabel: true },
          xAxis: {
            type: 'category',
            data: x,
            boundaryGap: false,
            axisLabel: { hideOverlap: true },
          },
          yAxis: { type: 'value', name: unit },
          dataZoom: [
            { type: 'inside', xAxisIndex: 0 },
            { type: 'slider', xAxisIndex: 0, height: 18 },
          ],
          series: [
            {
              type: 'line',
              name: 'Observed',
              data: observed,
              showSymbol: false,
              smooth: false,
              emphasis: { focus: 'series' },
              animationDurationUpdate: 180,
              animationEasingUpdate: 'quartOut',
            },
            ...(predicted.length
              ? [
                  {
                    type: 'line',
                    name: 'Predicted',
                    data: predicted,
                    showSymbol: false,
                    smooth: false,
                    lineStyle: { type: 'dashed' },
                    emphasis: { focus: 'series' },
                    animationDurationUpdate: 180,
                    animationEasingUpdate: 'quarticOut',
                  } as echarts.SeriesOption,
                ]
              : []),
          ],
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
  }, [indicator, period, title]);

  return <div ref={ref} style={{ width, height }} />;
}
