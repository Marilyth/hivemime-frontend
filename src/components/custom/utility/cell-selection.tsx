import { makeAutoObservable } from "mobx";

export class CellSelection {
  cells: { value: number }[][] = [];
  selectedCell: { row: number, col: number } | null = null;
  rows: number;
  cols: number;
  onCellsCount = 0;
  maxOnCells: number;

  constructor(rows: number, cols: number, maxOnCells: number) {
    this.rows = rows;
    this.cols = cols;
    this.cells = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ value: 0 }))
    );

    this.maxOnCells = maxOnCells;
    makeAutoObservable(this);
  }

  select(row: number, col: number) {
    this.selectedCell = { row, col };
  }

  toggle(row: number, col: number) {
    const cell = this.cells[row][col];

    if (cell.value === 0) {
      if (this.onCellsCount < this.maxOnCells) {
        cell.value = 1;
        this.onCellsCount++;
      }
    } else {
      cell.value = 0;
      this.onCellsCount--;
    }
  }

  public get bounds() {
    let min = Infinity;
    let max = -Infinity;

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const value = this.cells[row][col].value;

        if (value < min && value > 0)
          min = value;
        if (value > max)
          max = value;
      }
    }

    return { min, max };
  }
}
