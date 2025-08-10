import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import Sigungu from '../_related/gadm41_KOR_2.json';
import { EnvIndicatorFilterParams } from '@/types';
import { SelectedSido } from '../_related/types';
import { CHART_HEIGHT } from '../_related/const';

type ApiItem = { gid: string; value: number | null };
type ApiResp = {
  indicator: string;
  period: string;
  level: 'sido' | 'sigungu';
  domain?: { min: number; max: number };
  items: ApiItem[];
};

// --- GID → 라벨(시군구 이름) 맵 (한글 우선, 없으면 영문, 그래도 없으면 GID)
const ko = (s?: string) =>
  s ? (s.split('|')[0].split('(')[0] === 'NA' ? undefined : s.split('|')[0].split('(')[0]) : undefined;

const SIG_LABEL_BY_GID: Record<string, string> = {};
(Sigungu as any).features.forEach((f: any) => {
  const gid2 = f.properties.GID_2 as string;
  SIG_LABEL_BY_GID[gid2] = ko(f.properties.NL_NAME_2) || f.properties.NAME_2 || gid2;
});

type Props = {
  selectedSidoGid?: SelectedSido; // 선택된 시/도의 GID_1
  filters: EnvIndicatorFilterParams; // { indicator, period }
  height?: number; // 기본 400
};

export default function SigunguLineChart({ selectedSidoGid, filters }: Props) {
  const { indicator, period } = filters ?? {};
  const ref = useRef<HTMLDivElement>(null);
  const parentGid = selectedSidoGid?.gid1;

  useEffect(() => {
    const dom = ref.current!;
    const chart = echarts.getInstanceByDom(dom) ?? echarts.init(dom);
    let alive = true;

    async function load() {
      if (!parentGid) {
        chart.clear();
        chart.setOption({
          title: { text: '시·군·구 꺾은선', left: 'center' },
          graphic: {
            type: 'text',
            left: 'center',
            top: 'middle',
            style: {
              text: '지도의 시/도를 클릭(선택)하면 시·군·구 값이 표시됩니다.',
              fontSize: 14,
              fill: '#6b7280',
            },
          },
        });
        return;
      }

      const qs = new URLSearchParams({
        indicator,
        period,
        level: 'sigungu',
        parentGid, // ★ 선택된 시/도에 속한 시군구만
      }).toString();

      const res = await fetch(`/map?${qs}`);
      const json: ApiResp = await res.json();
      if (!alive) return;

      const items = (json.items ?? []).filter((i) => i.gid && i.value != null) as ApiItem[];

      // x축(카테고리)와 y값 준비 — 값 기준 내림차순 정렬
      const sorted = items
        .map((i) => ({ name: SIG_LABEL_BY_GID[i.gid] || i.gid, value: Number(i.value) }))
        .sort((a, b) => b.value - a.value);

      const categories = sorted.map((d) => d.name);
      const values = sorted.map((d) => d.value);

      const min = json.domain?.min ?? Math.min(...values, 0);
      const max = json.domain?.max ?? Math.max(...values, 100);

      chart.setOption(
        {
          title: { text: `시·군·구 꺾은선`, left: 'center' },
          tooltip: { trigger: 'axis' },
          grid: { left: 60, right: 24, top: 56, bottom: 60 },
          xAxis: {
            type: 'category',
            data: categories,
            axisLabel: { rotate: 40, interval: 0 }, // 라벨 겹침 방지
          },
          yAxis: {
            type: 'value',
            min,
            max,
            name: '값',
            nameGap: 14,
          },
          dataZoom: [
            { type: 'slider', xAxisIndex: 0, height: 18, bottom: 24 },
            { type: 'inside', xAxisIndex: 0 },
          ],
          series: [
            {
              type: 'line', // ★ 꺾은선
              data: values,
              symbol: 'circle',
              symbolSize: 6,
              smooth: false, // 부드럽게(spline) 하고 싶으면 true
              showSymbol: false, // 데이터 많을 때 심벌 감춤
              markLine: { data: [{ type: 'average', name: '평균' }] },
              emphasis: { focus: 'series' },
            },
          ],
        },
        true
      );
    }

    load();

    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      alive = false;
      window.removeEventListener('resize', onResize);
      if (!chart.isDisposed?.()) echarts.dispose(dom);
    };
  }, [parentGid, indicator, period]);

  return <div ref={ref} style={{ width: '50%', height: CHART_HEIGHT }} />;
}
