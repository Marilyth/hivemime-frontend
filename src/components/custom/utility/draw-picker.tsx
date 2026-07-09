import { mutedColors } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { makeAutoObservable, reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";


export class CellSelection {
  cells: { value: number }[] = [];
  rows: number;
  cols: number;
  onCellsCount = 0;
  maxOnCells: number;

  constructor(rows: number, cols: number, maxOnCells: number) {
    this.rows = rows;
    this.cols = cols;
    const cellCount = rows * cols;
    for (let i = 0; i < cellCount; i++) {
      this.cells.push({ value: 0 });
    }

    this.maxOnCells = maxOnCells;
    makeAutoObservable(this);
  }

  reset() {
    this.cells.forEach(cell => cell.value = 0);
    this.onCellsCount = 0;
  }

  activate(cellIndex: number) {
    if (this.cells[cellIndex].value === 0 && this.onCellsCount < this.maxOnCells) {
      this.cells[cellIndex].value = 1;
      this.onCellsCount++;
    }
  }

  deactivate(cellIndex: number) {
    if (this.cells[cellIndex].value > 0) {
      this.cells[cellIndex].value = 0;
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
    cursorMode.current = cellSelection.cells[cell].value === 0;
    triggerCell(cell);

    setDragging(true);
  }

  function pointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const previousPosition = lastPosition.current;
    lastPosition.current = { x: e.clientX, y: e.clientY };

    const isPressing = (e.buttons & 1) === 1;

    if (!isPressing)
      setDragging(false);

    if (!dragging || !isPressing)
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
      
      <CellCanvas cellSelection={cellSelection} gridWidth={2} />
    </div>
  );
});


export type CellCanvasProps = {
  cellSelection: CellSelection;
  cellColor?: string;
  gridColor?: string;
  gridWidth?: number;
  showTooltip?: boolean;
};

export const CellCanvas = observer(({ cellSelection, cellColor = mutedColors.honeyBrown + "AA", gridColor = mutedColors.gray, gridWidth = 1, showTooltip }: CellCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);

  function drawGrid(){
    if (!gridCanvasRef.current || gridWidth <= 0)
      return;

    const canvas = gridCanvasRef.current;
    const ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    const cellWidth = canvas.width / cellSelection.cols;
    const cellHeight = canvas.height / cellSelection.rows;

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = gridWidth;

    for (let i = 1; i < cellSelection.cols; i++) {
      const x = i * cellWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let i = 1; i < cellSelection.rows; i++) {
      const y = i * cellHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  function drawCells(){
    if (!canvasRef.current)
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cellSelection.cells.forEach((cell, index) => {
      drawCell(index);
    });

    drawGrid();
  }

  function drawCell(cellIndex: number){
    if (!canvasRef.current)
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    const cellWidth = canvas.width / cellSelection.cols;
    const cellHeight = canvas.height / cellSelection.rows;

    const row = Math.floor(cellIndex / cellSelection.cols);
    const col = cellIndex % cellSelection.cols;

    const x = Math.floor(col * cellWidth);
    const y = Math.floor(row * cellHeight);

    ctx.clearRect(x, y, Math.ceil(cellWidth), Math.ceil(cellHeight));

    // Fill active cells.
    if (cellSelection.cells[cellIndex].value > 0) {
      ctx.fillStyle = cellColor;
      ctx.fillRect(x, y, Math.ceil(cellWidth), Math.ceil(cellHeight));
    }
  }

  useEffect(() => {
    if (!canvasRef.current || !gridCanvasRef.current)
      return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    drawCells();

    reaction(() => cellSelection.cells.map(cell => cell.value), (current, previous) => {
      for(let i = 0; i < current.length; i++){
        if(current[i] !== previous[i]){
          drawCell(i);
        }
      }
    });
  }, [cellSelection, cellColor]);

  useEffect(() => {
    if (!canvasRef.current || !gridCanvasRef.current)
      return;

    const canvas = gridCanvasRef.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = width;
    canvas.height = height;

    drawGrid();
  }, [gridColor, gridWidth]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <canvas
        ref={gridCanvasRef}
        className="absolute inset-0 w-full h-full opacity-0 hover:opacity-50 transition-opacity duration-300"
      />
    </>
  );
});