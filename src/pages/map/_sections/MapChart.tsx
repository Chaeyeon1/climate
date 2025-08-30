'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import Sido from '../_related/gadm41_KOR_1.json';
import Sigungu from '../_related/gadm41_KOR_2.json';
import { EnvIndicatorFilterParams, Level, SelectedSido } from '@/types';
import { CHART_HEIGHT } from '../_related/const';

echarts.registerMap('KOREA_SIDO', Sido as any);
echarts.registerMap('KOREA_SIGUNGU', Sigungu as any);

type ApiItem = { gid: string; value: number | null };
type ApiResp = {
  indicator: string;
  period: string;
  level: Level;
  domain?: { min: number; max: number };
  items: ApiItem[];
};

const USE_TRANSITION = false;
const ANIM_UPDATE_MS = 180;
const SERIES_PROGRESSIVE = 400;
const SERIES_PROGRESSIVE_TH = 3000;

const ko = (s?: string) =>
  s ? (s.split('|')[0].split('(')[0] === 'NA' ? undefined : s.split('|')[0].split('(')[0]) : undefined;

// --- 라벨 맵
const SIDO_LABEL_BY_GID: Record<string, string> = {};
(Sido as any).features.forEach((f: any) => {
  const gid = f.properties.GID_1 as string;
  SIDO_LABEL_BY_GID[gid] = ko(f.properties.NL_NAME_1) || f.properties.NAME_1 || gid;
});
const SIG_LABEL_BY_GID: Record<string, string> = {};
(Sigungu as any).features.forEach((f: any) => {
  const gid = f.properties.GID_2 as string;
  SIG_LABEL_BY_GID[gid] = ko(f.properties.NL_NAME_2) || f.properties.NAME_2 || gid;
});

// 시군구(GID_2) -> 부모 시/도(GID_1)
const PARENT_BY_GID2: Record<string, string> = Object.fromEntries(
  ((Sigungu as any).features as any[]).map((f) => [f.properties.GID_2 as string, f.properties.GID_1 as string])
);

// 유틸: ids <-> 객체 배열
const toIds = (arr?: SelectedSido[]) => (arr ?? []).map((s) => s.gid1);
const toSelectedSidos = (ids: string[], prev?: SelectedSido[]): SelectedSido[] => {
  const nameById = new Map<string, string | undefined>(
    (prev ?? []).map((p) => [p.gid1, p.name] as [string, string | undefined])
  );
  const uniq = Array.from(new Set(ids));
  return uniq.map((gid1) => ({
    gid1,
    // 기존 이름을 보존하고, 없으면 라벨 맵으로 채움
    name: nameById.get(gid1) ?? SIDO_LABEL_BY_GID[gid1] ?? gid1,
  }));
};

export function MapChart({
  level, // 'sido' | 'sigungu'
  filters,
  selectedSidos = [], // ✔️ 객체 배열
  onChangeSelected, // ✔️ (prevSelected) => nextSelected
}: {
  level: Level;
  filters: EnvIndicatorFilterParams;
  selectedSidos?: SelectedSido[];
  onChangeSelected?: Dispatch<SetStateAction<SelectedSido[]>>;
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  // 내부 ref 상태
  const instRef = useRef<echarts.ECharts | null>(null);
  const lastZoomRef = useRef<number>(1);
  const lastCenterRef = useRef<number[] | undefined>(undefined);
  const visualMapDirtyRef = useRef(true);

  // 선택된 gid1 배열 (파생)
  const selectedIds = useMemo(() => toIds(selectedSidos), [selectedSidos]);
  const selectedIdsRef = useRef<string[]>(selectedIds);
  useEffect(() => {
    selectedIdsRef.current = selectedIds;
  }, [selectedIds]);

  // 레벨별 domain
  const domainByLevelRef = useRef({
    sido: { min: 0, max: 100 },
    sigungu: { min: 0, max: 100 },
  });

  // 데이터 캐시
  const sidoDataRef = useRef<Array<{ gid: string; value: number }>>([]);
  const sigunguDataRef = useRef<Array<{ gid: string; value: number }>>([]);

  // ---------- 차트 인스턴스 ----------
  useEffect(() => {
    const dom = chartRef.current;
    if (!dom) return;

    const chart = echarts.init(dom);
    instRef.current = chart;

    const ro = new ResizeObserver(() => {
      if (!chart.isDisposed()) chart.resize();
    });
    ro.observe(dom);

    const onGeoRoam = () => {
      const opt = chart.getOption() as any;
      const s = opt?.series?.[0];
      lastZoomRef.current = s?.zoom ?? lastZoomRef.current;
      lastCenterRef.current = s?.center ?? lastCenterRef.current;
    };

    const onClick = (p: any) => {
      if (!onChangeSelected) return;

      if (level === 'sido') {
        const gid1 = p.name as string;
        const isSel = selectedIdsRef.current.includes(gid1);
        if (isSel) {
          onChangeSelected((prev) => {
            const nextIds = selectedIdsRef.current.filter((id) => id !== gid1);
            return toSelectedSidos(nextIds, prev);
          });
        } else {
          instRef.current?.dispatchAction({ type: 'select', seriesIndex: 0, name: gid1 });
          onChangeSelected((prev) => {
            const nextIds = Array.from(new Set([...selectedIdsRef.current, gid1]));
            return toSelectedSidos(nextIds, prev);
          });
        }
      } else {
        // sigungu 클릭 시, 부모 시/도를 선택/추가
        const gid2 = p.name as string;
        const gid1 = PARENT_BY_GID2[gid2];
        if (!gid1) return;

        if (selectedIdsRef.current.includes(gid1)) {
          // 이미 선택된 시/도의 시군구를 클릭하면 해제되지 않도록 즉시 재선택
          setTimeout(() => {
            instRef.current?.dispatchAction({ type: 'select', seriesIndex: 0, name: gid2 });
          }, 0);
          return;
        }
        onChangeSelected?.((prev) => {
          const nextIds = Array.from(new Set([...selectedIdsRef.current, gid1]));
          return toSelectedSidos(nextIds, prev);
        });
      }
    };

    chart.on('georoam', onGeoRoam);
    chart.on('click', onClick);

    return () => {
      chart.off('georoam', onGeoRoam);
      chart.off('click', onClick);
      ro.disconnect();
      if (!chart.isDisposed()) chart.dispose();
      instRef.current = null;
    };
  }, [level, onChangeSelected]);

  // ---------- 데이터→시리즈 ----------
  const buildSeriesData = (currLevel: Level) => {
    const sidoData = sidoDataRef.current;
    const sigData = sigunguDataRef.current;
    const selectedSet = new Set(selectedIdsRef.current);

    if (currLevel === 'sido') {
      return sidoData.map((d) => ({
        name: d.gid, // GID_1
        value: d.value,
        selected: selectedSet.has(d.gid),
      }));
    }

    // sigungu
    const bySido = new Map(sidoData.map((d) => [d.gid, d.value]));
    const bySig = new Map(sigData.map((d) => [d.gid, d.value]));
    const features = (Sigungu as any).features as Array<any>;

    return features.map((f) => {
      const gid2 = f.properties.GID_2 as string;
      const gid1 = f.properties.GID_1 as string;
      const v = bySig.get(gid2) ?? bySido.get(gid1) ?? 0;
      return {
        name: gid2, // GID_2
        value: v,
        selected: selectedSet.has(gid1),
      };
    });
  };

  const makeVisualMap = (currLevel: Level): echarts.EChartsOption['visualMap'] => {
    const isSido = currLevel === 'sido';
    const domRange = isSido ? domainByLevelRef.current.sido : domainByLevelRef.current.sigungu;
    return [
      {
        min: domRange.min,
        max: domRange.max,
        text: ['높음', '낮음'],
        realtime: false,
        calculable: true,
        inRange: { color: ['#e0f3db', '#a8ddb5', '#43a2ca', '#0868ac'] },
        left: 'right',
        bottom: 20,
      } as any,
    ];
  };

  const makeSeries = (currLevel: Level): echarts.SeriesOption => {
    const isSido = currLevel === 'sido';
    const labelMap = isSido ? SIDO_LABEL_BY_GID : SIG_LABEL_BY_GID;

    return {
      type: 'map',
      map: isSido ? 'KOREA_SIDO' : 'KOREA_SIGUNGU',
      name: isSido ? '시/도' : '시/군/구',
      nameProperty: isSido ? 'GID_1' : 'GID_2',
      roam: true,
      universalTransition: USE_TRANSITION,
      scaleLimit: { min: 1, max: 8 },
      progressive: SERIES_PROGRESSIVE,
      progressiveThreshold: SERIES_PROGRESSIVE_TH,
      animation: true,
      animationDurationUpdate: ANIM_UPDATE_MS,
      animationEasingUpdate: 'quarticOut',
      zoom: lastZoomRef.current,
      center: lastCenterRef.current,
      selectedMode: 'multiple',
      select: {
        itemStyle: { areaColor: '#F9D84A', borderColor: '#7C6E24', borderWidth: 1.2 },
        label: { show: true },
      },
      label: {
        show: isSido,
        formatter: (p: any) => labelMap[p.name] || p.name,
        fontSize: isSido ? 11 : 9,
      },
      emphasis: { label: { show: true } },
      labelLayout: { hideOverlap: true },
      data: buildSeriesData(currLevel),
    };
  };

  const applyOption = () => {
    const chart = instRef.current;
    if (!chart || chart.isDisposed()) return;

    const currLevel = level;
    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item',
        formatter: (p: any) => {
          const isSido = currLevel === 'sido';
          const labelMap = isSido ? SIDO_LABEL_BY_GID : SIG_LABEL_BY_GID;
          return `${labelMap[p.name] || p.name}<br/>값: ${p.value ?? '-'}`;
        },
      },
      series: [makeSeries(currLevel)],
    };

    if (visualMapDirtyRef.current) {
      option.visualMap = makeVisualMap(currLevel);
      visualMapDirtyRef.current = false;
    }

    chart.setOption(option, { notMerge: false, lazyUpdate: true, replaceMerge: ['series'] });
  };

  // ---------- 데이터 fetch + 옵션 반영 ----------
  useEffect(() => {
    let cancelled = false;

    async function fetchMap(lv: Level) {
      const params: Record<string, string> = {
        indicator: filters.indicator,
        period: filters.period,
        level: lv,
      };
      const res = await fetch(`/map?${new URLSearchParams(params).toString()}`);
      const json: ApiResp = await res.json();

      if (json.domain && lv === 'sido') {
        const prev = domainByLevelRef.current.sido;
        const next = { ...json.domain };
        if (prev.min !== next.min || prev.max !== next.max) {
          domainByLevelRef.current.sido = next;
          visualMapDirtyRef.current = true;
        }
      }

      return (json.items ?? []).filter((i) => i.gid && i.value != null) as ApiItem[];
    }

    (async () => {
      visualMapDirtyRef.current = true;

      const sidoItems = await fetchMap('sido');
      if (cancelled) return;
      sidoDataRef.current = (sidoItems ?? []).map((d) => ({ gid: d.gid, value: Number(d.value) }));

      if (level === 'sigungu') {
        const sigItems = await fetchMap('sigungu');
        if (cancelled) return;
        sigunguDataRef.current = (sigItems ?? []).map((d) => ({ gid: d.gid, value: Number(d.value) }));
      } else {
        sigunguDataRef.current = [];
      }

      applyOption();
    })();

    return () => {
      cancelled = true;
    };
  }, [filters.indicator, filters.period, level]);

  // 선택 갱신 시 반영
  useEffect(() => {
    applyOption();
  }, [level, selectedIds.join(',')]);

  return <div ref={chartRef} style={{ width: selectedIds.length ? '50%' : '100%', height: CHART_HEIGHT }} />;
}
