import { PollCandidateDto, PollCategoryDto, UpsertVoteToCandidateDto } from "./Api";

export interface CombinedPollCandidate {
  candidate: PollCandidateDto;
  vote: UpsertVoteToCandidateDto;
}

export interface CombinedPollCategory {
  category: PollCategoryDto;
  value: number | null;
}

export enum ChartType {
  Bar,
  Column,
  Pie,
  Doughnut,
  HalfDoughnut,
  Nightingale,
  Line,
  SmoothLine,
  Area,
  Scatter,
  Geographics
}

export interface ChartDataPoints {
  chartType: ChartType;
  dataPoints: ChartDataPoint[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
  subChart?: ChartDataPoints;
}