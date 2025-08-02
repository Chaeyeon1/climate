import { INVENTORY_PATH, MAP_PATH, NEWS_PATH } from './const';

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
