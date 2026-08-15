import { Button } from "@/components/ui/button";
import { mixColors, mutedColors } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, ZoomIn, ZoomOut } from "lucide-react";
import { makeAutoObservable, reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { GradientBar } from "./gradient-bar";

const DEFAULT_START_COLOR = mutedColors.gray + "BB";
const DEFAULT_END_COLOR = mutedColors.red + "BB";

export class CellSelection {
  cells: { value: number }[] = [];
  selectedCell: number | null = null;
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

  select(cellIndex: number) {
    this.selectedCell = cellIndex;
  }

  toggle(cellIndex: number) {
    if (this.cells[cellIndex].value === 0) {
      if (this.onCellsCount < this.maxOnCells) {
        this.cells[cellIndex].value = 1;
        this.onCellsCount++;
      }
    } else {
      this.cells[cellIndex].value = 0;
      this.onCellsCount--;
    }
  }

  public get bounds() {
    let min = Infinity;
    let max = -Infinity;

    for (const cell of this.cells) {
      if (cell.value < min && cell.value > 0)
        min = cell.value;
      if (cell.value > max)
        max = cell.value;
    }

    return { min, max };
  }
}

export enum Variant {
  View = "view",
  Grid = "grid",
  Result = "result"
}

export type GridPickerProps = {
  cellSelection: CellSelection;
  src: string;
  variant?: Variant;
  imageClassName?: string;
  canvasProps?: CellCanvasStyleProps;
} & React.HTMLAttributes<HTMLDivElement> & CellCanvasStyleProps;

export const GridPicker = observer(({ cellSelection, src, variant, className, ...props }: GridPickerProps) => {
  variant = variant ?? Variant.View;

  const { t } = useTranslation();
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const outerImageContainerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [tooltip, setTooltip] = useState<{ cellIndex: number, x: number, y: number, value: number } | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [renderedSize, setRenderedSize] = useState({ width: 0, height: 0 });
  const [zoomScale, setZoomScale] = useState(1);
  const [showImage, setShowImage] = useState(true);
  const [showCells, setShowCells] = useState(true);
  const wheelStep = 0.5;

  const canvasStyle = props.canvasProps ?? {};
  const startColor = canvasStyle.startColor ?? DEFAULT_START_COLOR;
  const endColor = canvasStyle.endColor ?? DEFAULT_END_COLOR;

  const { min, max } = cellSelection.bounds;

  function toggleCell(cellIndex: number) {
    if (variant === Variant.Grid) {
      cellSelection.toggle(cellIndex);
    } else if (variant === Variant.Result) {
      cellSelection.select(cellIndex);
    }
  }

  function showTooltip(cellIndex: number | null, clientX?: number, clientY?: number) {
    if (cellIndex == null
      || clientX == undefined
      || clientY == undefined
      || variant !== Variant.Result
      || cellSelection.cells[cellIndex].value <= 0) {
      setTooltip(null);
      return;
    }

    setTooltip({
      cellIndex,
      x: clientX,
      y: clientY,
      value: cellSelection.cells[cellIndex].value
    });
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
    const observer = new ResizeObserver(() => {
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
      wheel={{ step: wheelStep }}
      onPinchStop={z => setZoomScale(z.state.scale)}
      onZoomStop={z => setZoomScale(z.state.scale)}
    >
      {({ zoomIn, zoomOut }) => (
        <div
          ref={cardContainerRef}
          className="relative w-full min-h-0 flex flex-col gap-2 border bg-muted p-1 rounded-md"
        >
          {variant != Variant.View && (
            <div className="flex w-full flex-wrap items-center justify-end gap-2 p-2 border-b">
              <Button
                size="icon"
                variant="outline"
                aria-label={t("posts:vote.zoomIn")}
                title={t("posts:vote.zoomIn")}
                onClick={() => zoomIn()}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                variant="outline"
                aria-label={t("posts:vote.zoomOut")}
                title={t("posts:vote.zoomOut")}
                onClick={() => zoomOut()}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                variant="outline"
                aria-label={showImage ? t("posts:vote.hideImage") : t("posts:vote.showImage")}
                title={showImage ? t("posts:vote.hideImage") : t("posts:vote.showImage")}
                onClick={() => setShowImage(!showImage)}
              >
                {showImage ? <Eye /> : <EyeOff />}
              </Button>

              <Button
                size="icon"
                variant="outline"
                aria-label={showCells ? t("posts:vote.hideCells") : t("posts:vote.showCells")}
                title={showCells ? t("posts:vote.hideCells") : t("posts:vote.showCells")}
                onClick={() => setShowCells(!showCells)}
              >
                {showCells ? <Eye /> : <EyeOff />}
              </Button>
            </div>
          )}

          <TransformComponent
            wrapperClass="w-full! flex-1! min-h-0!"
            contentClass="relative w-full! h-full!"
          >
            <div
              className="relative w-full h-full overflow-hidden select-none"
              ref={outerImageContainerRef}
              {...props}
            >
              {showImage && (
                <img
                  ref={imgRef}
                  src={src}
                  alt="Grid Picker"
                  className={cn("w-full h-full max-h-128 object-contain object-top", props.imageClassName)}
                  onLoad={() =>
                    setImageSize({
                      width: imgRef.current!.naturalWidth,
                      height: imgRef.current!.naturalHeight,
                    })
                  }
                />
              )}

              {showCells && (
                <div className="absolute inset-0 flex justify-center">
                  <CellCanvas
                    cellSelection={cellSelection}
                    style={{
                      height: renderedSize.height,
                      width: renderedSize.width,
                    }}
                    scale={zoomScale}
                    onCellClick={toggleCell}
                    onHover={showTooltip}
                    startColor={startColor}
                    endColor={endColor}
                    {...props.canvasProps}
                  />
                </div>
              )}
            </div>
          </TransformComponent>

          {variant === Variant.Result && <GradientBar
            min={min}
            max={max}
            current={tooltip?.value ?? null}
            startColor={startColor}
            endColor={endColor}
          />}

          {tooltip && createPortal(
            <div
              className="fixed bg-card p-2 rounded-md border z-50 pointer-events-none whitespace-nowrap"
              style={{ left: tooltip.x, top: tooltip.y, transform: "translate(0.5rem, 0.5rem)" }}
            >
              Score: {tooltip.value.toFixed(4)}
            </div>,
            document.body
          )}
        </div>
      )}
    </TransformWrapper>
  );
});

type CellCanvasStyleProps = {
  gridColor?: string;
  startColor?: string;
  endColor?: string;
}

type CellCanvasProps = {
  cellSelection: CellSelection;
  scale: number;
  onCellClick?: (cellIndex: number) => void;
  onHover?: (cellIndex: number | null, clientX?: number, clientY?: number) => void;
} & React.HTMLAttributes<HTMLDivElement> & CellCanvasStyleProps;

const CellCanvas = observer(({ cellSelection, scale, className,
  gridColor = mutedColors.gray + "AA",
  startColor = DEFAULT_START_COLOR,
  endColor = DEFAULT_END_COLOR,
  onCellClick,
  onHover,
  ...props }: CellCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function redrawCanvas() {
    if (!canvasRef.current)
      return;

    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth * scale;
    canvas.height = canvas.clientHeight * scale;

    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCells();
    drawGrid();
  }

  function drawGrid() {
    const canvas = canvasRef.current;
    if (!canvas)
      return;

    const ctx = canvas.getContext("2d")!;

    const cellWidth = canvas.width / cellSelection.cols;
    const cellHeight = canvas.height / cellSelection.rows;

    ctx.strokeStyle = gridColor;
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
    const canvas = canvasRef.current;
    if (!canvas)
      return;

    const ctx = canvas.getContext("2d")!;

    const cellWidth = canvas.width / cellSelection.cols;
    const cellHeight = canvas.height / cellSelection.rows;

    const { min, max } = cellSelection.bounds;

    cellSelection.cells.forEach((cell, cellIndex) => {
      if (cell.value <= 0 && cellSelection.selectedCell !== cellIndex)
        return;

      const row = Math.floor(cellIndex / cellSelection.cols);
      const col = cellIndex % cellSelection.cols;

      const x = Math.floor(col * cellWidth);
      const y = Math.floor(row * cellHeight);

      if (cell.value > 0) {
        const ratio = min == max ? 1 : (cell.value - min) / (max - min);
        ctx.fillStyle = mixColors(startColor, endColor, ratio);
        ctx.fillRect(x, y, Math.ceil(cellWidth), Math.ceil(cellHeight));
      }

      if (cellSelection.selectedCell === cellIndex) {
        const lineWidth = 2;
        const inset = lineWidth / 2;

        ctx.strokeStyle = mutedColors.gold;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(x + inset, y + inset, Math.ceil(cellWidth) - lineWidth, Math.ceil(cellHeight) - lineWidth);
      }
    });
  }

  function cellFromEvent(e: { clientX: number, clientY: number }) {
    if (!canvasRef.current)
      return null;

    const rect = canvasRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    const col = Math.max(0, Math.min(cellSelection.cols - 1, Math.floor(relX * cellSelection.cols)));
    const row = Math.max(0, Math.min(cellSelection.rows - 1, Math.floor(relY * cellSelection.rows)));

    return { index: row * cellSelection.cols + col, clientX: e.clientX, clientY: e.clientY };
  }

  function handleHover(e: React.PointerEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) {
    if (!onHover)
      return;

    const cell = cellFromEvent(e);
    if (cell)
      onHover(cell.index, cell.clientX, cell.clientY);
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!onCellClick)
      return;

    const cell = cellFromEvent(e);
    if (cell)
      onCellClick(cell.index);
  }

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      redrawCanvas();
    });

    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }
    redrawCanvas();

    const disposeCells = reaction(
      () => cellSelection.cells.map(cell => cell.value),
      () => redrawCanvas()
    );

    const disposeSelection = reaction(
      () => cellSelection.selectedCell,
      () => redrawCanvas()
    );

    return () => {
      disposeCells();
      disposeSelection();
      resizeObserver.disconnect();
    };
  }, [cellSelection, scale]);

  return (
    <div className={cn("relative", className)} {...props}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-pointer"
        onClick={handleClick}
        onPointerMove={handleHover}
        onPointerLeave={() => onHover?.(null)}
      />
    </div>
  );
});
