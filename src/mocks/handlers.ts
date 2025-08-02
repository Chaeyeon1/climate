// src/mocks/handlers.ts
import { http } from 'msw';

export const handlers = [
  // 로그인
  http.post('/login', async ({ request }) => {
    return new Response(JSON.stringify({ accessToken: 'mocked-token-123456' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }),

  // 인벤토리 목록
  http.get('/inventory', async () => {
    return new Response(
      JSON.stringify([
        {
          id: '1',
          title: '고온 노출과 정신 건강',
          description: '기후 변화가 청년 정신 건강에 미치는 영향',
          image: 'https://picsum.photos/id/101/200/200',
        },
      ]),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }),

  // 인벤토리 상세
  http.get('/inventory/:id', async ({ params }) => {
    const { id } = params;

    return new Response(
      JSON.stringify({
        id,
        title: '고온 노출과 정신 건강',
        author: 'Jingwen Liu',
        journal: 'Nature Climate Change (2025)',
        region: '호주',
        type: '논문',
        sector: '연구',
        tags: ['기후변화', '정신건강'],
        content: `# [인벤토리1]

## 논문 제목: " Increasing burden of poor mental health attributable to high temperature in Australia"

저널: Nature Climate Change(2025)

저자: Jingwen Liu

### 주제: “고온 노출로 인한 정신 건강 위협: MBDs 질병 부담과 기후 변화 대응의 필요성 요약”

정신 및 행동 장애(MBDs)는 불안, 우울, 양극성 장애, 정신분열증, 알코올 및 약물 사용 장애 등을 포함하는 질환군으로, 기능 저하와 조기 사망의 주요 원인입니다. 본 연구는 고온 노출이 MBDs에 미치는 영향을 정량적으로 평가하고, 기후 변화 시나리오에 따른 미래 질병 부담을 예측하고자 호주 전역(2003~2018년)을 대상으로 수행되었습니다.

분석은 지역별 임계온도를 초과하는 고온 노출 데이터를 바탕으로 건강 문제 평가 지표인 [[1]](https://www.notion.so/1-2422b3641d8780608de4f755048d445c?pvs=21)장애 조정 생명 연수(DALYs)를 산출하였으며, 대표 농도경로(RCP) [[2]](https://www.notion.so/1-2422b3641d8780608de4f755048d445c?pvs=21)4.5 및 [[3]](https://www.notion.so/1-2422b3641d8780608de4f755048d445c?pvs=21)8.5 시나리오를 적용해 기후, 인구, 적응 변수에 따른 미래 예측도 병행했습니다.

연구 결과, RCP 8.5 시나리오에서 2050년대까지 호주 내 평균 기온이 크게 상승할 것으로 예측되었고, 이에 따라 고온 노출로 인한 MBDs 질병 부담 역시 증가할 전망입니다. 고온 노출로 인한 연평균 MBDs 부담은 약 8,458 DALYs(전체 부담의 1.8%)로 추산되었으며, 2030년대에는 11.0~17.2%, 2050년대에는 27.5~48.9%까지 증가할 것으로 예상됩니다. 특히 25~44세의 젊은 성인층에서 부담이 집중되는 경향이 뚜렷하게 나타났습니다.

MBDs 부담률은 인구 증가, 기후 변화, 적응 수준에 따라 달라집니다. 적응이 없을 경우, RCP 8.5 시나리오에서 부담률이 가장 높지만, 50% 및 100% 적응 시에는 각각 약 1.9~2.2%, 1.8% 내외로 감소해, 적응 전략이 정신건강 부담 완화에 중요한 역할을 함을 시사합니다. 2050년대에는 인구 증가가 기후 변화보다 정신건강 부담에 더 큰 영향을 미칠 것으로 예측되며, 인구 구조 변화와 기후 영향이 지역별로 다르게 나타나므로, 지역 특성을 고려한 맞춤형 적응 및 완화 전략이 필요합니다.

이 연구는 기후 변화에 따른 정신건강 위험을 줄이기 위해 적응과 완화 전략의 병행이 필수적임을 강조합니다. 효과적인 대응을 위해서는 고온 노출의 영향을 충분히 이해하고, 지역사회 보호와 인구 적응을 촉진할 수 있는 실질적 지원 및 정책 마련이 중요합니다.

### [논문 출처 및 링크]

Liu, J., Varghese, B.M., Hansen, A. *et al.* Increasing burden of poor mental health attributable to high temperature in Australia. *Nat. Clim. Chang.* **15**, 489–496 (2025). https://doi.org/10.1038/s41558-025-02309-x

### [카테고리 정리]

- 지역: 호주
- 종류: 논문
- 태그: 정신건강, 행동장애, MBDs, 기후변화, 고온노출, 공중보건, 질병부담, 청년정신건강, 회복탄력성, 기온상승, DALYs, RCP시나리오, 호주연구, 건강영향평가, 미래예측
- 부문: 연구

[[1]](https://www.notion.so/1-2422b3641d8780608de4f755048d445c?pvs=21) 장애 조정 생명 연수(DALYs, Disability-Adjusted Life Years)는 질병, 사고 등으로 인한 건강 수명의 손실을 나타내며, 즉각적인 사망은 아니지만 개인과 사회에 장기적인 영향을 주는 건강 문제를 평가하는 데 유용한 지표이다.

[[2]](https://www.notion.so/1-2422b3641d8780608de4f755048d445c?pvs=21) RCP 4.5는 인간 활동으로 인한 온실가스 배출이 2045년경부터 감소하여 2100년까지 2050년 수준의 약 절반에 도달하는 것을 가정한 중간 시나리오이다.

[[3]](https://www.notion.so/1-2422b3641d8780608de4f755048d445c?pvs=21) RCP 8.5는 온실가스 배출이 현재 추세대로 지속되는 경우를 가정한 최악의 시나리오로, 기후변화의 가장 극단적인 영향을 예측하는 데 사용된다.`,
        source: 'https://doi.org/10.1038/s41558-025-02309-x',
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }),

  // 필터 옵션
  http.get('/inventory/filters', async () => {
    return new Response(
      JSON.stringify({
        regions: ['전체', '호주', '한국'],
        types: ['논문', '기사'],
        sectors: ['연구', '정책'],
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }),

  // 지도 데이터
  http.get('/map', async () => {
    return new Response(
      JSON.stringify({
        indicator: 'temperature',
        period: '여름철',
        data: [
          { region: '서울', predicted: 28.3, observed: 29.3 },
          { region: '부산', predicted: 27.1, observed: 28.0 },
        ],
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }),

  // 시군구 다운로드 (CSV)
  http.get('/map/export', async () => {
    const csv = `시도,시군구,관측값,예측값\n서울,강남구,28.3,29.0\n`;
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="export.csv"',
      },
    });
  }),
];
