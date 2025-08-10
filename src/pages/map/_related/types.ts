import { Level } from '@/types';

export type SelectedSido = {
  gid1: string;
  name: string;
  level?: Level;
  zoom?: number;
} | null;
