import { Button } from "@/components/ui/button";
import { mutedColors } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { Undo2 } from "lucide-react";
import { makeAutoObservable, reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";


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

enum CursorMode {
  Inactive,
  Pending,
  Active,
  Erase,
  Draw
}

export type DrawPickerProps = {
  cellSelection: CellSelection;
  src: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const DrawPicker = observer(({ cellSelection, src, className, ...props }: DrawPickerProps) => {
  const { t } = useTranslation();
  const outerContainerRef = useRef<HTMLDivElement>(null);
  const innerContainerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const lastPosition = useRef({ x: 0, y: 0 } as { x: number, y: number } | null);
  const [dragging, setDragging] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [renderedSize, setRenderedSize] = useState({ width: 0, height: 0 });
  const [cursorMode, setCursorMode] = useState(CursorMode.Inactive);
  const cursorModeRef = useRef(CursorMode.Inactive);
  const undoStack = useRef<{ value: number }[][]>([]);

  const canTurnOnCells = cellSelection.onCellsCount < cellSelection.maxOnCells;

  function undo() {
    const previousState = undoStack.current.pop();  

    if (previousState == undefined)
    {
      cellSelection.cells.forEach(cell => cell.value = 0);
      cellSelection.onCellsCount = 0;
      return;
    }

    for (let i = 0; i < cellSelection.cells.length; i++) {
      const cell = cellSelection.cells[i];

      if (previousState![i].value != cell.value) {
        cell.value = previousState![i].value;
        if (cell.value > 0)
          cellSelection.onCellsCount++;
        else
          cellSelection.onCellsCount--;
      }
    }
  }

  function updateCursorMode(mode: CursorMode) {
    cursorModeRef.current = mode;
    setCursorMode(mode);
  }

  function triggerCell(cellIndex: number) {
    if (cursorModeRef.current === CursorMode.Draw) {
      cellSelection.activate(cellIndex);
    } else if (cursorModeRef.current === CursorMode.Erase) {
      cellSelection.deactivate(cellIndex);
    }
  }

  function getCellIndex(clientX: number, clientY: number) {
    const rect = innerContainerRef.current!.getBoundingClientRect();

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
      updateCursorMode(CursorMode.Pending);
      await new Promise(resolve => setTimeout(resolve, 300));

      if (lastPosition.current == null)
        return;

      const dx = Math.abs(e.clientX - lastPosition.current.x);
      const dy = Math.abs(e.clientY - lastPosition.current.y);

      if (dx * dx + dy * dy > 50) {
        updateCursorMode(CursorMode.Inactive);
        return;
      }
    }

    e.preventDefault();

    const cell = getCellIndex(e.clientX, e.clientY);
    undoStack.current.push(cellSelection.cells.map(cell => ({ value: cell.value })));

    updateCursorMode(cellSelection.cells[cell].value === 0 ? CursorMode.Draw : CursorMode.Erase);
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
    updateCursorMode(CursorMode.Inactive);

    if (!dragging)
        return;

    setDragging(false);
  }
  
  function resize(){
    // We have to calculate the image's size to best fit the container ourselves.
    // object-contain does not tell us the rendered image dimensions.
    if (!outerContainerRef.current || !imgRef.current)
      return;

    const {width, height} = { width: outerContainerRef.current.clientWidth, height: outerContainerRef.current.clientHeight };
    const {imgWidth, imgHeight} = { imgWidth: imgRef.current.naturalWidth, imgHeight: imgRef.current.naturalHeight };

    const widthOverflow = imgWidth / (width ? width : imgWidth);
    const heightOverflow = imgHeight / (height ? height : imgHeight);

    if (widthOverflow > heightOverflow) {
      setRenderedSize({ width: width, height: imgHeight / widthOverflow });
    } else {
      setRenderedSize({ width: imgWidth / heightOverflow, height: height });
    }
  }

  useEffect(() => {
    const el = outerContainerRef.current!;

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

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      resize();
    });

    if (outerContainerRef.current) {
      observer.observe(outerContainerRef.current);
    }

    resize();
    return () => observer.disconnect();
  }, [imageSize]);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="w-full h-6 flex flex-row items-center justify-end gap-2">
        <Button variant="outline" onClick={undo} disabled={undoStack.current.length === 0}>
          <Undo2 className="w-4 h-4" /> {t("a11y:undo")}
        </Button>
      </div>
      <div
        className="w-full h-full select-none"
        ref={outerContainerRef}
        {...props}
      >
        <div style={{ width: renderedSize.width, height: renderedSize.height }}
          ref={innerContainerRef}
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={pointerUp}
          onPointerCancel={pointerUp}
          className={cn(`relative ${canTurnOnCells ? "cursor-crosshair" : "cursor-not-allowed"}`, className)}>
          <img ref={imgRef} src={src} alt="Draw Picker"
            className="block w-full h-full object-contain"
            onLoad={() => setImageSize({ width: imgRef.current!.naturalWidth, height: imgRef.current!.naturalHeight })}
          />
          <CellCanvas cellSelection={cellSelection} />
        </div>
      </div>
    </div>
  );
});


export type CellCanvasProps = {
  cellSelection: CellSelection;
  cellColor?: string;
  gridWidth?: number;
  showTooltip?: boolean;
};

export const CellCanvas = observer(({ cellSelection, cellColor = mutedColors.honeyBrown + "AA", gridWidth = 1, showTooltip }: CellCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showGrid, setShowGrid] = useState(true);

  function redrawCanvas(){
    if (!canvasRef.current || !gridCanvasRef.current)
      return;

    canvasRef.current.width = canvasRef.current.clientWidth * window.devicePixelRatio;
    canvasRef.current.height = canvasRef.current.clientHeight * window.devicePixelRatio;

    gridCanvasRef.current.width = gridCanvasRef.current.clientWidth * window.devicePixelRatio;
    gridCanvasRef.current.height = gridCanvasRef.current.clientHeight * window.devicePixelRatio;

    drawGrid();
    drawCells();
  }

  function drawGrid(){
    if (!gridCanvasRef.current || gridWidth <= 0)
      return;

    const canvas = gridCanvasRef.current;
    const ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    const cellWidth = canvas.width / cellSelection.cols;
    const cellHeight = canvas.height / cellSelection.rows;

    ctx.strokeStyle = mutedColors.gray + "AA";
    ctx.lineWidth = gridWidth;

    ctx.strokeRect(0, 0, canvas.width, canvas.height);

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
    const observer = new ResizeObserver(([entry]) => {
      redrawCanvas();
    });

    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }

    redrawCanvas();
    window.addEventListener("resize", redrawCanvas);

    const dispose = reaction(() => cellSelection.cells.map(cell => cell.value), (current, previous) => {
      for(let i = 0; i < current.length; i++){
        if(current[i] !== previous[i]){
          drawCell(i);
        }
      }
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", redrawCanvas);
      dispose();
    };
  }, [cellSelection, cellColor, gridWidth]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <canvas
        ref={gridCanvasRef}
        onPointerEnter={e => setShowGrid(true)}
        onPointerLeave={e => setShowGrid(false)}
        className={`absolute inset-0 w-full h-full ${showGrid ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
      />
    </>
  );
});