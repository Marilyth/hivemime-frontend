import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mutedColors } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { Eraser, Move, PencilLine, Undo2, ZoomIn, ZoomOut } from "lucide-react";
import { makeAutoObservable, reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TransformComponent, TransformWrapper, useControls } from "react-zoom-pan-pinch";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";


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

enum ActionMode {
  View = "view",
  Draw = "draw",
  Erase = "erase"
}

export type DrawPickerProps = {
  cellSelection: CellSelection;
  src: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const DrawPicker = observer(({ cellSelection, src, className, ...props }: DrawPickerProps) => {
  const { t } = useTranslation();
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const outerImageContainerRef = useRef<HTMLDivElement>(null);
  const innerImageContainerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const lastPosition = useRef({ x: 0, y: 0 } as { x: number, y: number } | null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [renderedSize, setRenderedSize] = useState({ width: 0, height: 0 });
  const [actionMode, setActionMode] = useState<ActionMode>(ActionMode.View);
  const [isEditing, setIsEditing] = useState(false);
  const [cursorSize, setCursorSize] = useState(1);
  const [zoomScale, setZoomScale] = useState(1);
  const wheelStep = 0.5;
  const isEditingRef = useRef(false);
  const undoStack = useRef<{ value: number }[][]>([]);

  const canTurnOnCells = cellSelection.onCellsCount < cellSelection.maxOnCells;

  function undo() {
    const previousState = undoStack.current.pop();

    if (previousState == undefined) {
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

  function updateActionMode(mode: ActionMode) {
    if (actionMode == mode)
      mode = ActionMode.View;

    setActionMode(mode);
  }

  function updateIsEditing(isEditing: boolean) {
    isEditingRef.current = isEditing;
    setIsEditing(isEditing);
  }

  function triggerCell(row: number, col: number) {
    for (let r = row - Math.floor(cursorSize / 2); r <= row + Math.floor(cursorSize / 2); r++)
      for (let c = col - Math.floor(cursorSize / 2); c <= col + Math.floor(cursorSize / 2); c++) {
        if (r < 0 || r >= cellSelection.rows || c < 0 || c >= cellSelection.cols)
          continue;

        const cellIndex = r * cellSelection.cols + c;

        if (actionMode === ActionMode.Draw) {
          cellSelection.activate(cellIndex);
        } else if (actionMode === ActionMode.Erase) {
          cellSelection.deactivate(cellIndex);
        }
      }
  }

  function getCell(clientX: number, clientY: number, rect: DOMRect) {
    const relativeCoordinates = {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    };

    const col = Math.floor(relativeCoordinates.x * cellSelection.cols);
    const row = Math.floor(relativeCoordinates.y * cellSelection.rows);

    return { row, col, cellIndex: row * cellSelection.cols + col };
  }

  async function pointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (actionMode === ActionMode.View || e.buttons !== 1)
      return;

    lastPosition.current = { x: e.clientX, y: e.clientY };
    const rect = e.currentTarget.getBoundingClientRect();

    e.preventDefault();

    const cell = getCell(e.clientX, e.clientY, rect);
    undoStack.current.push(cellSelection.cells.map(cell => ({ value: cell.value })));

    // setActionMode(cellSelection.cells[cell.cellIndex].value === 0 ? ActionMode.Draw : ActionMode.Erase);

    updateIsEditing(true);
    triggerCell(cell.row, cell.col);
  }

  function pointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const previousPosition = lastPosition.current;
    lastPosition.current = { x: e.clientX, y: e.clientY };

    const isPressing = (e.buttons & 1) === 1;

    if (!isPressing || !isEditingRef.current) {
      updateIsEditing(false);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const cell = getCell(e.clientX, e.clientY, rect);

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
        const intermediateCell = getCell(intermediateX, intermediateY, rect);
        triggerCell(intermediateCell.row, intermediateCell.col);
      }
    }

    triggerCell(cell.row, cell.col);
  }

  function pointerUp(e: React.PointerEvent<HTMLDivElement>) {
    lastPosition.current = null;
    updateIsEditing(false);
  }

  function resize() {
    // We have to calculate the image's size to best fit the container ourselves.
    // object-contain does not tell us the rendered image dimensions.
    if (!outerImageContainerRef.current || !imgRef.current)
      return;

    const { width, height } = { width: outerImageContainerRef.current.clientWidth, height: outerImageContainerRef.current.clientHeight };
    const { imgWidth, imgHeight } = { imgWidth: imgRef.current.naturalWidth, imgHeight: imgRef.current.naturalHeight };

    const widthOverflow = imgWidth / (width ? width : imgWidth);
    const heightOverflow = imgHeight / (height ? height : imgHeight);

    if (widthOverflow > heightOverflow) {
      setRenderedSize({ width: width, height: imgHeight / widthOverflow });
    } else {
      setRenderedSize({ width: imgWidth / heightOverflow, height: height });
    }
  }

  useEffect(() => {
    const el = cardContainerRef.current!;

    const handleTouchMove = (e: TouchEvent) => {
      if (isEditingRef.current) {
        e.preventDefault();
      }
    };

    el.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isEditing]);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      resize();
    });

    if (cardContainerRef.current) {
      observer.observe(cardContainerRef.current);
    }

    resize();
    return () => observer.disconnect();
  }, [imageSize]);

  return (
    <TransformWrapper
      smooth={false}
      panning={{ disabled: isEditing }}
      wheel={{ step: wheelStep }}
      onPinchStop={z => setZoomScale(z.state.scale)}
      onZoomStop={z => setZoomScale(z.state.scale)}>
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <div ref={cardContainerRef} className="w-full h-full flex flex-col gap-2">
          <div className="flex w-full flex-wrap items-center justify-end gap-2 rounded-md border bg-card p-2">
            {/* Zoom */}
            <Button size="icon" variant="outline" onClick={() => zoomIn()}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={() => zoomOut()}>
              <ZoomOut className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-4!" />

            {/* Mode */}
            <ToggleGroup
              type="single"
              value={actionMode}
              className="border"
              onValueChange={(value) => {
                if (value) updateActionMode(value as ActionMode);
              }}
            >
              <ToggleGroupItem value={ActionMode.View}>
                <Move className="h-4 w-4" />
              </ToggleGroupItem>

              <ToggleGroupItem value={ActionMode.Draw}>
                <PencilLine className="h-4 w-4" />
              </ToggleGroupItem>

              <ToggleGroupItem value={ActionMode.Erase}>
                <Eraser className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            {/** CursorSize */}
            <Select onValueChange={(v) => setCursorSize(Number(v))} defaultValue={cursorSize.toString()}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  <div className="w-1 h-1 rounded-full bg-foreground" />1x1
                </SelectItem>
                <SelectItem value="3">
                  <div className="w-2 h-2 rounded-full bg-foreground" />3x3
                </SelectItem>
                <SelectItem value="5">
                  <div className="w-3 h-3 rounded-full bg-foreground" />5x5
                </SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-4!" />

            {/* History */}
            <Button
              size="icon"
              variant="outline"
              onClick={undo}
              disabled={undoStack.current.length === 0}
            >
              <Undo2 className="h-4 w-4" />
            </Button>

          </div>
          <TransformComponent wrapperClass="w-full! h-full! rounded-md" contentClass="relative w-full! h-full! select-none">
            <div
              className="relative w-full h-full overflow-hidden select-none"
              ref={outerImageContainerRef}
              {...props}
            >
              <img ref={imgRef} src={src} alt="Draw Picker"
                className="h-full w-full object-contain object-top"
                onLoad={() => setImageSize({ width: imgRef.current!.naturalWidth, height: imgRef.current!.naturalHeight })}
              />
              <div className="absolute inset-0 flex justify-center">
                <CellCanvas cellSelection={cellSelection} style={{ height: renderedSize.height, width: renderedSize.width }}
                  scale={zoomScale}
                  onPointerDown={pointerDown}
                  onPointerMove={pointerMove}
                  onPointerUp={pointerUp}
                  onPointerCancel={pointerUp} />
              </div>
            </div>
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
});


export type CellCanvasProps = {
  cellSelection: CellSelection;
  scale: number;
} & React.HTMLAttributes<HTMLDivElement>;

export const CellCanvas = observer(({ cellSelection, scale, className, ...props }: CellCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showGrid, setShowGrid] = useState(true);

  function redrawCanvas() {
    if (!canvasRef.current || !gridCanvasRef.current)
      return;

    canvasRef.current.width = canvasRef.current.clientWidth * scale;
    canvasRef.current.height = canvasRef.current.clientHeight * scale;

    gridCanvasRef.current.width = gridCanvasRef.current.clientWidth * scale;
    gridCanvasRef.current.height = gridCanvasRef.current.clientHeight * scale;

    drawGrid();
    drawCells();
  }

  function drawGrid() {
    if (!gridCanvasRef.current)
      return;

    const canvas = gridCanvasRef.current;
    const ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellWidth = canvas.width / cellSelection.cols;
    const cellHeight = canvas.height / cellSelection.rows;

    ctx.strokeStyle = mutedColors.gray + "AA";
    ctx.lineWidth = 1;

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

  function drawCells() {
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

  function drawCell(cellIndex: number) {
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
      ctx.fillStyle = mutedColors.honeyBrown + "AA";
      ctx.fillRect(x, y, Math.ceil(cellWidth), Math.ceil(cellHeight));
    }
  }

  useEffect(() => {
    redrawCanvas();

    const dispose = reaction(() => cellSelection.cells.map(cell => cell.value), (current, previous) => {
      for (let i = 0; i < current.length; i++) {
        if (current[i] !== previous[i]) {
          drawCell(i);
        }
      }
    });

    return () => {
      dispose();
    };
  }, [cellSelection, scale]);

  return (
    <div className={cn("relative", className)} {...props}>
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
    </div>
  );
});