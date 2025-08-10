import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import Sido from '../_related/gadm41_KOR_1.json';
import Sigungu from '../_related/gadm41_KOR_2.json';
import { EnvIndicatorFilterParams, Indicator, Level, Period } from '@/types';
import { SelectedSido } from '../_related/types';
import { CHART_HEIGHT, LEVEL_SIDO, LEVEL_SIGUNGU } from '../_related/const';

echarts.registerMap('KOREA_SIDO', Sido as any);
echarts.registerMap('KOREA_SIGUNGU', Sigungu as any);

type ApiItem = { gid: string; value: number | null };
type ApiResp = {
  indicator: Indicator;
  period: Period;
  level: Level;
  domain?: { min: number; max: number };
  items: ApiItem[];
};

const USE_TRANSITION = false;
const ANIM_UPDATE_MS = 180;
const GEO_DEBOUNCE_MS = 140;
const SERIES_PROGRESSIVE = 400;
const SERIES_PROGRESSIVE_TH = 3000;

const ko = (s?: string) =>
  s ? (s.split('|')[0].split('(')[0] === 'NA' ? undefined : s.split('|')[0].split('(')[0]) : undefined;

// 라벨 사전
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

export function MapChart({
  level, // 🔸토글로 제어되는 레벨
  filters,
  selectedSido,
  onSelect,
}: {
  level: Level;
  filters: EnvIndicatorFilterParams;
  selectedSido?: SelectedSido;
  onSelect?: Dispatch<SetStateAction<SelectedSido>>;
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  // ---- 내부 상태(ref) ----
  const instRef = useRef<echarts.ECharts | null>(null);
  const lastZoomRef = useRef<number>(selectedSido?.zoom ?? 1);
  const lastCenterRef = useRef<number[] | undefined>(undefined);
  const visualMapDirtyRef = useRef(true);

  const selectedSidoRef = useRef<SelectedSido>(selectedSido ?? null);
  useEffect(() => {
    selectedSidoRef.current = selectedSido ?? null;
    if (typeof selectedSido?.zoom === 'number') lastZoomRef.current = selectedSido.zoom!;
  }, [selectedSido?.gid1, selectedSido?.zoom]);

  // 레벨별 domain (sigungu는 갱신 금지)
  const domainByLevelRef = useRef({
    sido: { min: 0, max: 100 },
    sigungu: { min: 0, max: 100 },
  });

  // 데이터 캐시
  const sidoDataRef = useRef<Array<{ gid: string; value: number }>>([]);
  const sigunguDataRef = useRef<Array<{ gid: string; value: number }>>([]);

  // ---------- 차트 인스턴스 ----------
  useEffect(() => {
    const dom = chartRef.current!;
    const chart = echarts.init(dom);
    instRef.current = chart;

    const ro = new ResizeObserver(() => {
      if (!chart.isDisposed()) chart.resize();
    });
    ro.observe(dom);

    let debounceId: number | null = null;
    const onGeoRoam = () => {
      const opt = chart.getOption() as any;
      const s = opt?.series?.[0];
      const currentZoom: number = s?.zoom ?? lastZoomRef.current;
      const currentCenter: number[] | undefined = s?.center ?? lastCenterRef.current;

      lastZoomRef.current = currentZoom;
      lastCenterRef.current = currentCenter;

      // 부모 zoom 반영은 디바운스
      if (onSelect && selectedSidoRef.current) {
        if (debounceId) window.clearTimeout(debounceId);
        debounceId = window.setTimeout(() => {
          onSelect((prev) => (prev ? { ...prev, zoom: lastZoomRef.current } : prev));
        }, GEO_DEBOUNCE_MS);
      }
    };

    const onClick = (p: any) => {
      if (!onSelect) return;
      if (level === 'sido') {
        const gid1 = p.name as string;
        const name = SIDO_LABEL_BY_GID[gid1] || gid1;
        onSelect({ gid1, name, level: LEVEL_SIDO, zoom: lastZoomRef.current });
      } else {
        const gid2 = p.name as string;
        const gid1 = PARENT_BY_GID2[gid2];
        if (gid1) {
          const name = SIDO_LABEL_BY_GID[gid1] || gid1;
          onSelect({ gid1, name, level: LEVEL_SIGUNGU, zoom: lastZoomRef.current });
        }
      }
    };

    chart.on('georoam', onGeoRoam);
    chart.on('click', onClick);

    return () => {
      chart.off('georoam', onGeoRoam);
      chart.off('click', onClick);
      ro.disconnect();
      chart.dispose();
      instRef.current = null;
    };
  }, [level, onSelect]); // level이 바뀌어도 인스턴스는 유지되지만 핸들러는 최신 level을 써야 하므로 deps에 포함

  // ---------- 데이터→시리즈 ----------
  const buildSeriesData = (currLevel: Level) => {
    const sidoData = sidoDataRef.current;
    const sigData = sigunguDataRef.current;

    if (currLevel === 'sido') {
      return sidoData.map((d) => ({
        name: d.gid,
        value: d.value,
        selected: selectedSidoRef.current?.gid1 === d.gid,
      }));
    }

    const bySido = new Map(sidoData.map((d) => [d.gid, d.value]));
    const bySig = new Map(sigData.map((d) => [d.gid, d.value]));
    const features = (Sigungu as any).features as Array<any>;

    return features.map((f) => {
      const gid2 = f.properties.GID_2 as string;
      const gid1 = f.properties.GID_1 as string;
      const v = bySig.get(gid2) ?? bySido.get(gid1) ?? 0;
      return {
        name: gid2,
        value: v,
        selected: selectedSidoRef.current?.gid1 ? selectedSidoRef.current!.gid1 === gid1 : false,
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

  const makeSeries = (currLevel: Level): any => {
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
      animationEasingUpdate: 'quartOut',
      zoom: lastZoomRef.current,
      center: lastCenterRef.current,
      selectedMode: isSido ? 'single' : 'multiple',
      select: { itemStyle: { borderWidth: 1.2 } },
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

    chart.setOption(option, {
      notMerge: false,
      lazyUpdate: true,
      replaceMerge: ['series'], // visualMap은 필요 시에만 교체
    });
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
      // sigungu일 때 parentGid가 있으면 좁혀서, 없으면 전국 기준
      if (lv === 'sigungu' && selectedSidoRef.current?.gid1) {
        params.parentGid = selectedSidoRef.current.gid1;
      }

      const res = await fetch(`/map?${new URLSearchParams(params).toString()}`);
      const json: ApiResp = await res.json();

      // ★ 시군구라면 domain 갱신 금지
      if (json.domain && lv === LEVEL_SIDO) {
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
      // indicator/period 변경 시 visualMap 변동 가능 → 플래그
      visualMapDirtyRef.current = true;

      // 항상 sido는 로드 (sigungu fallback 용)
      const sidoItems = await fetchMap('sido');
      if (cancelled) return;
      sidoDataRef.current = (sidoItems ?? []).map((d) => ({ gid: d.gid, value: Number(d.value) }));

      // sigungu는 현재 보기 레벨이 sigungu일 때만 로드
      if (level === 'sigungu') {
        const sigItems = await fetchMap('sigungu');
        if (cancelled) return;
        sigunguDataRef.current = (sigItems ?? []).map((d) => ({ gid: d.gid, value: Number(d.value) }));
      } else {
        sigunguDataRef.current = []; // 메모리 정리(원치 않으면 제거)
      }

      applyOption();
    })();

    return () => {
      cancelled = true;
    };
  }, [filters.indicator, filters.period, selectedSido?.gid1, level]); // 🔸level 포함

  return <div ref={chartRef} style={{ width: selectedSido?.gid1 ? '50%' : '100%', height: CHART_HEIGHT }} />;
}
