import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import GeoJson from './gadm41_KOR_1.json';
import GeoJson2 from './gadm41_KOR_2.json';

echarts.registerMap('KOREA', GeoJson2 as any);
export const EnvMap = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  // ✅ 1. GeoJSON 불러오기 + ECharts 세팅
  useEffect(() => {
    const chart = echarts.init(chartRef.current!);

    // ✅ 2. Mock 데이터 (영문 명칭 기준)
    const mockData = [
      { name: 'Seoul', value: 92 },
      { name: 'Busan', value: 75 },
      { name: 'Gyeonggi-do', value: 88 },
      { name: 'Jeju-do', value: 63 },
      { name: 'Gangwon-do', value: 42 },
      { name: 'Daegu', value: 55 },
      { name: 'Incheon', value: 80 },
      { name: 'Daejeon', value: 68 },
      { name: 'Gwangju', value: 58 },
      { name: 'Ulsan', value: 70 },
      { name: 'Sejong', value: 60 },
      { name: 'Chungcheongbuk-do', value: 62 },
      { name: 'Chungcheongnam-do', value: 65 },
      { name: 'Jeollabuk-do', value: 50 },
      { name: 'Jeollanam-do', value: 45 },
      { name: 'Gyeongsangbuk-do', value: 72 },
      { name: 'Gyeongsangnam-do', value: 67 },
    ];

    chart.setOption({
      title: {
        text: '시도별 데이터 시각화',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>값: {c}',
      },
      visualMap: {
        min: 0,
        max: 100,
        text: ['높음', '낮음'],
        realtime: false,
        calculable: true,
        inRange: {
          color: ['#e0f3db', '#a8ddb5', '#43a2ca', '#0868ac'],
        },
        left: 'right',
        top: 'bottom',
      },
      series: [
        {
          name: '시도별 값',
          type: 'map',
          map: 'KOREA',
          nameProperty: 'NAME_2',
          roam: true,
          label: {
            show: true,
          },
          data: mockData, // ✅ 데이터 연결
        },
      ],
    });

    return () => {
      chart.dispose();
    };
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>ECharts Korea Map</h2>
      <div ref={chartRef} style={{ width: '100%', height: '800px' }} />
    </div>
  );
};
