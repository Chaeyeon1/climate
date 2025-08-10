import { INVENTORY_PATH, MAP_PATH, NEWS_PATH } from './const';
import {
  LEVEL_SIDO,
  LEVEL_SIGUNGU,
  INDICATOR_HEAT_INDEX,
  INDICATOR_PRECIPITATION,
  INDICATOR_TEMPERATURE,
  INDICATOR_WBGT,
  INDICATOR_WILDFIRE_RISK,
  PERIOD_ALL,
  PERIOD_AVERAGE,
  PERIOD_SUMMER,
} from './pages/map/_related/const';

export type PageType = typeof INVENTORY_PATH | typeof NEWS_PATH | typeof MAP_PATH;
export type TabType = {
  type: PageType;
  title: string;
  subTitle: string;
};

/** API Type */
export type CardParams = {
  region?: string;
  type?: string;
  sector?: string;
  query?: string;
};
export type CardResponse = {
  id: string;
  title: string;
  description: string;
  image: string;
  region: string;
  type: string;
  sector: string;
};

export type MarkdownContentResponse = {
  id: string;
  title: string;
  author: string;
  journal: string;
  region: string;
  type: string;
  sector: string;
  tags: string[];
  content: string;
  source: string;
};

export type FilterResponse = {
  regions: string[];
  types: string[];
  sectors: string[];
};

export type Level = typeof LEVEL_SIDO | typeof LEVEL_SIGUNGU;
export type Indicator =
  | typeof INDICATOR_TEMPERATURE
  | typeof INDICATOR_WBGT
  | typeof INDICATOR_HEAT_INDEX
  | typeof INDICATOR_WILDFIRE_RISK
  | typeof INDICATOR_PRECIPITATION;
export type Period = typeof PERIOD_AVERAGE | typeof PERIOD_SUMMER | typeof PERIOD_ALL;

export type EnvIndicatorFilterParams = {
  indicator: Indicator;
  period: Period;
};

export type MapTableItem = {
  region: string; // 시/도
  predict: number; // 예측값
  value: number; // 관측값
};

export type EnvTable = {
  indicator: Indicator;
  period: Period;
  items: MapTableItem[];
};

export type ChoroplethItem = { gid: string; value: number | null };
export type ChoroplethResponse = {
  metric: string;
  level: Level;
  domain?: { min: number; max: number };
  items: ChoroplethItem[];
};

export type MapResp = {
  indicator: Indicator;
  period: Period;
  level: Level;
  domain: { min: number; max: number };
  items: Array<{ gid: string; value: number | null }>;
};
