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

const ko = (s?: string) =>
  s ? (s.split('|')[0].split('(')[0] === 'NA' ? undefined : s.split('|')[0].split('(')[0]) : undefined;

const SIG_LABEL_BY_GID: Record<string, string> = {};
(Sigungu as any).features.forEach((f: any) => {
  const gid2 = f.properties.GID_2 as string;
  SIG_LABEL_BY_GID[gid2] = ko(f.properties.NL_NAME_2) || f.properties.NAME_2 || gid2;
});

type Props = {
  selectedSidoGid?: SelectedSido;
  filters: EnvIndicatorFilterParams;
  height?: number;
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
        parentGid,
      }).toString();

      const res = await fetch(`/map?${qs}`);
      const json: ApiResp = await res.json();
      if (!alive) return;

      const items = (json.items ?? []).filter((i) => i.gid && i.value != null) as ApiItem[];
      const sorted = items
        .map((i) => ({ name: SIG_LABEL_BY_GID[i.gid] || i.gid, value: Number(i.value) }))
        .sort((a, b) => b.value - a.value);

      const categories = sorted.map((d) => d.name);
      const values = sorted.map((d) => d.value);

      const min = json.domain?.min ?? Math.min(...values, 0);
      const max = json.domain?.max ?? Math.max(...values, 100);

      // --- 겹침 방지: 하단 여백 동적 계산 + containLabel ---
      const sliderHeight = 22; // dataZoom 슬라이더 높이
      const sliderBottom = 10; // 컨테이너 바닥과의 간격
      const estLabel = 20;
      const bottomGrid = estLabel + 8; // 라벨 + 슬라이더 + 여유

      chart.setOption(
        {
          title: { text: selectedSidoGid?.name, left: 'center' },
          tooltip: { trigger: 'axis' },
          grid: {
            left: 64,
            right: 24,
            top: 56,
            bottom: bottomGrid,
            containLabel: true, // 라벨 영역을 그리드에 포함
          },
          xAxis: {
            type: 'category',
            data: categories,
            axisLabel: {
              rotate: 40,
              interval: 0, // 모두 표시
              margin: 10, // 축과 라벨 간격
              hideOverlap: true, // 너무 빽빽할 때 자동 숨김
              // 길면 줄이려면 아래 두 줄을 켜세요
              // width: 100,
              // overflow: 'truncate',
            },
          },
          yAxis: {
            type: 'value',
            min,
            max,
            name: '값',
            nameGap: 14,
          },
          dataZoom: [
            {
              type: 'slider',
              xAxisIndex: 0,
              height: sliderHeight,
              bottom: sliderBottom, // 그리드 하단(bottomGrid) 아래로 배치됨
              // left/right를 grid와 맞추고 싶다면 다음 주석 해제
              // left: 64,
              // right: 24,
            },
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
              markLine: { data: [{ type: 'average', name: '평균' }] },
              emphasis: { focus: 'series' },
              animationDurationUpdate: 180,
              animationEasingUpdate: 'quartOut',
            },
          ],
        },
        { notMerge: true }
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
