export interface Player {
  id: string;
  name: string;
  class: string;
  race: string;
  level: number;
  campaign: string;
  stats: Record<string, number>;
}
