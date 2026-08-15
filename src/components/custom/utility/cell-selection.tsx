import { makeAutoObservable } from "mobx";

export class CellSelection {
  cells: { value: number }[][] = [];
  selectedCell: { row: number, col: number } | null = null;

  rows: number;
  viewRows: number;

  cols: number;
  viewCols: number;

  onCellsCount = 0;
  maxOnCells: number;

  constructor(rows: number, cols: number, maxOnCells: number) {
    this.rows = rows;
    this.cols = cols;
    this.viewRows = rows;
    this.viewCols = cols;

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

    for (let row = 0; row < this.viewRows; row++) {
      for (let col = 0; col < this.viewCols; col++) {
        const value = this.viewCells[row][col].value;

        if (value < min && value > 0)
          min = value;
        if (value > max)
          max = value;
      }
    }

    return { min, max };
  }

  // Recalculate the cells on the defined view resolution.
  // If a cell starts and ends at different view cells, split up the value proportionally.
  public get viewCells() {
    if (this.viewRows === this.rows && this.viewCols === this.cols)
      return this.cells;

    const viewCells = Array.from({ length: this.viewRows }, () =>
      Array.from({ length: this.viewCols }, () => ({ value: 0 }))
    );

    const rowScale = this.viewRows / this.rows;
    const colScale = this.viewCols / this.cols;

    for (let srcRow = 0; srcRow < this.rows; srcRow++) {
      const srcY1 = srcRow * rowScale;
      const srcY2 = (srcRow + 1) * rowScale;

      for (let srcCol = 0; srcCol < this.cols; srcCol++) {
        const srcX1 = srcCol * colScale;
        const srcX2 = (srcCol + 1) * colScale;

        const value = this.cells[srcRow][srcCol].value;
        const sourceArea = (srcX2 - srcX1) * (srcY2 - srcY1);

        for (let row = Math.floor(srcY1); row < Math.ceil(srcY2); row++) {
          const overlapY = Math.min(srcY2, row + 1) - Math.max(srcY1, row);

          if (overlapY <= 0) continue;

          for (let col = Math.floor(srcX1); col < Math.ceil(srcX2); col++) {
            const overlapX = Math.min(srcX2, col + 1) - Math.max(srcX1, col);

            if (overlapX <= 0) continue;

            const fraction = (overlapX * overlapY) / sourceArea;

            viewCells[row][col].value += value * fraction;
          }
        }
      }
    }

    return viewCells;
  }
}
