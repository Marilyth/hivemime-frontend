import { CandidateDto } from "./Api";
import { UiCandidateVote } from "./vote-models";

export interface CombinedPollCandidate {
  candidate: CandidateDto;
  vote: UiCandidateVote;
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
