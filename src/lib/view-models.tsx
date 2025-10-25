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
  Bar = "Bar",
  Column = "Column",
  Pie = "Pie",
  Doughnut = "Doughnut",
  HalfDoughnut = "HalfDoughnut",
  Line = "Line",
  SmoothLine = "SmoothLine",
  Area = "Area",
  Scatter = "Scatter",
  World = "World",
  Calendar = "Calendar"
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