import { cn } from "@/lib/utils";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";


export class CellSelection {
  cells: { isOn: boolean }[] = [];
  rows: number;
  cols: number;
  onCellsCount = 0;
  maxOnCells: number;

  constructor(rows: number, cols: number, maxOnCells: number) {
    this.rows = rows;
    this.cols = cols;
    const cellCount = rows * cols;
    for (let i = 0; i < cellCount; i++) {
      this.cells.push({ isOn: false });
    }

    this.maxOnCells = maxOnCells;
    makeAutoObservable(this);
  }

  reset() {
    this.cells.forEach(cell => cell.isOn = false);
    this.onCellsCount = 0;
  }

  activate(cellIndex: number) {
    if (!this.cells[cellIndex].isOn && this.onCellsCount < this.maxOnCells) {
      this.cells[cellIndex].isOn = true;
      this.onCellsCount++;
    }
  }

  deactivate(cellIndex: number) {
    if (this.cells[cellIndex].isOn) {
      this.cells[cellIndex].isOn = false;
      this.onCellsCount--;
    }
  }
}

export type DrawPickerProps = {
  cellSelection: CellSelection;
} & React.HTMLAttributes<HTMLDivElement>;


export const DrawPicker = observer(({ cellSelection, children, className, ...props }: DrawPickerProps) => {
  const lastPosition = useRef({ x: 0, y: 0 } as { x: number, y: number } | null);
  const [dragging, setDragging] = useState(false);

  const cursorMode = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canTurnOnCells = cellSelection.onCellsCount < cellSelection.maxOnCells;

  function triggerCell(cellIndex: number) {
    if (cursorMode.current) {
      cellSelection.activate(cellIndex);
    } else {
      cellSelection.deactivate(cellIndex);
    }
  }

  function getCellIndex(clientX: number, clientY: number) {
    const rect = containerRef.current!.getBoundingClientRect();

    const relativeCoordinates = {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    };

    const col = Math.floor(relativeCoordinates.x * cellSelection.cols);
    const row = Math.floor(relativeCoordinates.y * cellSelection.rows);

    return row * cellSelection.cols + col;
  }

  async function pointerDown(e: React.PointerEvent<HTMLDivElement>) {
    lastPosition.current = { x: e.clientX, y: e.clientY };

    // If the user is using touch, they have to imply intent by holding down for a little bit.
    if (e.pointerType == "touch") {
      await new Promise(resolve => setTimeout(resolve, 300));

      if (lastPosition.current == null)
        return;

      const dx = Math.abs(e.clientX - lastPosition.current.x);
      const dy = Math.abs(e.clientY - lastPosition.current.y);

      if (dx * dx + dy * dy > 50) {
        return;
      }
    }

    e.preventDefault();

    const cell = getCellIndex(e.clientX, e.clientY);
    cursorMode.current = !cellSelection.cells[cell].isOn;
    triggerCell(cell);

    setDragging(true);
  }

  function pointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const previousPosition = lastPosition.current;
    lastPosition.current = { x: e.clientX, y: e.clientY };

    if (!dragging)
        return;

    const cell = getCellIndex(e.clientX, e.clientY);

    // Also interpolate between the last position and the current position to trigger all cells in between.
    if (previousPosition) {
      const dx = e.clientX - previousPosition.x;
      const dy = e.clientY - previousPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const stepX = dx / distance;
      const stepY = dy / distance;

      for (let i = 0; i < distance; i += 1) {
        const intermediateX = previousPosition.x + stepX * i;
        const intermediateY = previousPosition.y + stepY * i;
        const intermediateCell = getCellIndex(intermediateX, intermediateY);
        triggerCell(intermediateCell);
      }
    }

    triggerCell(cell);
  }

  function pointerUp(e: React.PointerEvent<HTMLDivElement>) {
    lastPosition.current = null;

    if (!dragging)
        return;

    setDragging(false);
  }

  useEffect(() => {
    const el = containerRef.current!;

    const handleTouchMove = (e: TouchEvent) => {
      if (dragging) {
        e.preventDefault();
      }
    };

    el.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, [dragging]);

  return (
    <div
      className={cn(`relative inline-block select-none w-fit h-fit ${canTurnOnCells ? "cursor-crosshair" : "cursor-not-allowed"}`, className)}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
      onPointerCancel={pointerUp}
      ref={containerRef}
      {...props}
    >
      {children}

      <div className="absolute inset-0 grid" style={{ gridTemplateRows: `repeat(${cellSelection.rows}, 1fr)`, gridTemplateColumns: `repeat(${cellSelection.cols}, 1fr)` }}>
        {cellSelection.cells.map((cell, index) => (
          <div key={index} className={cn("border border-gray-500", cell.isOn && "bg-blue-500")}></div>
        ))}
      </div>
    </div>
  );
});
