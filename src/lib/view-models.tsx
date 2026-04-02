import { CandidateDto, VoteOnCandidateDto } from "./Api";

export interface CombinedPollCandidate {
  candidate: CandidateDto;
  vote: VoteOnCandidateDto;
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
