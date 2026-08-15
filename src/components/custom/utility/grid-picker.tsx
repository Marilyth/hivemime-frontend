import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { mixColors, mutedColors } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { Image, LayoutGrid, SlidersHorizontal, ZoomIn, ZoomOut } from "lucide-react";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { CellSelection } from "./cell-selection";
import { GradientBar } from "./gradient-bar";

const DEFAULT_START_COLOR = mutedColors.gray + "BB";
const DEFAULT_END_COLOR = mutedColors.red + "BB";

const CLICK_DRAG_THRESHOLD = 5;

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

  const cardContainerRef = useRef<HTMLDivElement>(null);
  const outerImageContainerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [tooltip, setTooltip] = useState<{ row: number, col: number, x: number, y: number, value: number } | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [renderedSize, setRenderedSize] = useState({ width: 0, height: 0 });
  const [zoomScale, setZoomScale] = useState(1);
  const [showImage, setShowImage] = useState(true);
  const [showCells, setShowCells] = useState(true);
  const wheelStep = 0.5;

  const canvasStyle = props.canvasProps ?? {};
  const startColor = canvasStyle.startColor ?? DEFAULT_START_COLOR;
  const endColor = canvasStyle.endColor ?? DEFAULT_END_COLOR;

  function toggleCell(row: number, col: number) {
    if (variant === Variant.Grid) {
      cellSelection.toggle(row, col);
    } else if (variant === Variant.Result) {
      cellSelection.select(row, col);
    }
  }

  function showTooltip(row: number | null, col?: number, clientX?: number, clientY?: number) {
    const value = row != null && col != undefined
      ? cellSelection.viewCells[row][col].value
      : 0;

    if (row == null
      || col == undefined
      || clientX == undefined
      || clientY == undefined
      || variant !== Variant.Result
      || value <= 0) {
      setTooltip(null);
      return;
    }

    setTooltip({
      row,
      col,
      x: clientX,
      y: clientY,
      value,
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
      panning={{ disabled: zoomScale <= 1 }}
      wheel={{ step: wheelStep }}
      doubleClick={{ disabled: true }}
      onPinchStop={z => setZoomScale(z.state.scale)}
      onZoomStop={z => setZoomScale(z.state.scale)}
    >
      {({ zoomIn, zoomOut }) => (
        <div
          ref={cardContainerRef}
          className="relative w-full min-h-0 flex flex-col gap-2 border bg-muted p-1 rounded-md"
        >
          {variant != Variant.View && (
            <div className="flex w-full h-full flex-wrap items-center justify-end gap-2 p-2 border-b">
              <Button
                size="sm"
                variant="outline"
                onClick={() => zoomIn()}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => zoomOut()}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>

              <Separator orientation="vertical" className="py-4"></Separator>

              <Button
                size="sm"
                variant="outline"
                className={`${showImage ? "" : "opacity-50"}`}
                onClick={() => setShowImage(!showImage)}
              >
                <Image />
              </Button>

              <Button
                size="sm"
                variant="outline"
                className={`${showCells ? "" : "opacity-50"}`}
                onClick={() => setShowCells(!showCells)}
              >
                <LayoutGrid />
              </Button>

              {variant === Variant.Result && (
                <>
                  <Separator orientation="vertical" className="py-4"></Separator>
                  <GridResolutionControls cellSelection={cellSelection} />
                </>
              )}
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
              <img
                ref={imgRef}
                src={src}
                className={cn("w-full h-full max-h-128 object-contain object-top transition-opacity", props.imageClassName, showImage ? "" : "opacity-0")}
                onLoad={() =>
                  setImageSize({
                    width: imgRef.current!.naturalWidth,
                    height: imgRef.current!.naturalHeight,
                  })
                }
              />

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
            min={cellSelection.bounds.min}
            max={cellSelection.bounds.max}
            current={tooltip?.value ?? null}
            startColor={startColor}
            endColor={endColor}
          />}

          {tooltip && createPortal(
            <div
              className="fixed bg-card p-2 rounded-md border z-50 pointer-events-none whitespace-nowrap"
              style={{ left: tooltip.x, top: tooltip.y, transform: "translate(0.5rem, 0.5rem)" }}
            >
              Score: {tooltip.value.toFixed(2)}
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

const GridResolutionControls = observer(({ cellSelection }: { cellSelection: CellSelection }) => {
  const { t } = useTranslation();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
        >
          <span>
            {cellSelection.viewRows}
            <span className="text-informational"> x </span>
            {cellSelection.viewCols}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <PopoverTitle>{t("posts:result.gridResolution")}</PopoverTitle>
        <div className="flex flex-col gap-4 mt-3">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("posts:result.resolutionRows")}</span>
              <span>{cellSelection.viewRows}</span>
            </div>
            <Slider
              min={1}
              max={cellSelection.rows}
              value={[cellSelection.viewRows]}
              onValueChange={(v) => cellSelection.viewRows = v[0]}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("posts:result.resolutionColumns")}</span>
              <span>{cellSelection.viewCols}</span>
            </div>
            <Slider
              min={1}
              max={cellSelection.cols}
              value={[cellSelection.viewCols]}
              onValueChange={(v) => cellSelection.viewCols = v[0]}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});

type CellCanvasProps = {
  cellSelection: CellSelection;
  scale: number;
  onCellClick?: (row: number, col: number) => void;
  onHover?: (row: number | null, col?: number, clientX?: number, clientY?: number) => void;
} & React.HTMLAttributes<HTMLDivElement> & CellCanvasStyleProps;

const CellCanvas = observer(({ cellSelection, scale, className,
  gridColor = mutedColors.gray + "AA",
  startColor = DEFAULT_START_COLOR,
  endColor = DEFAULT_END_COLOR,
  onCellClick,
  onHover,
  ...props }: CellCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const clickStartRef = useRef<{ x: number, y: number } | null>(null);

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

    const cellWidth = canvas.width / cellSelection.viewCols;
    const cellHeight = canvas.height / cellSelection.viewRows;

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    for (let i = 1; i < cellSelection.viewCols; i++) {
      const x = i * cellWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let i = 1; i < cellSelection.viewRows; i++) {
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

    const cellWidth = canvas.width / cellSelection.viewCols;
    const cellHeight = canvas.height / cellSelection.viewRows;
    const { min, max } = cellSelection.bounds;

    for (let row = 0; row < cellSelection.viewRows; row++) {
      for (let col = 0; col < cellSelection.viewCols; col++) {
        const value = cellSelection.viewCells[row][col].value;
        const isSelected = cellSelection.selectedCell?.row === row && cellSelection.selectedCell?.col === col;

        if (value <= 0 && !isSelected)
          continue;

        const x = Math.floor(col * cellWidth);
        const y = Math.floor(row * cellHeight);

        if (value > 0) {
          const ratio = min == max ? 1 : (value - min) / (max - min);
          ctx.fillStyle = mixColors(startColor, endColor, ratio);
          ctx.fillRect(x, y, Math.ceil(cellWidth), Math.ceil(cellHeight));
        }

        if (isSelected) {
          const lineWidth = 2;
          const inset = lineWidth / 2;

          ctx.strokeStyle = mutedColors.gold;
          ctx.lineWidth = lineWidth;
          ctx.strokeRect(x + inset, y + inset, Math.ceil(cellWidth) - lineWidth, Math.ceil(cellHeight) - lineWidth);
        }
      }
    }
  }

  function cellFromEvent(e: { clientX: number, clientY: number }) {
    if (!canvasRef.current)
      return null;

    const rect = canvasRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    const col = Math.max(0, Math.min(cellSelection.viewCols - 1, Math.floor(relX * cellSelection.viewCols)));
    const row = Math.max(0, Math.min(cellSelection.viewRows - 1, Math.floor(relY * cellSelection.viewRows)));

    return { row, col, clientX: e.clientX, clientY: e.clientY };
  }

  function handleHover(e: React.PointerEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) {
    if (!onHover)
      return;

    const cell = cellFromEvent(e);
    if (cell)
      onHover(cell.row, cell.col, cell.clientX, cell.clientY);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    clickStartRef.current = { x: e.clientX, y: e.clientY };
  }

  function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    const start = clickStartRef.current;
    clickStartRef.current = null;

    if (!start)
      return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;

    // A drag (e.g. panning the image) is not a click.
    if (Math.hypot(dx, dy) > CLICK_DRAG_THRESHOLD)
      return;

    if (!onCellClick)
      return;

    const cell = cellFromEvent(e);
    if (cell)
      onCellClick(cell.row, cell.col);
  }

  function handlePointerLeave() {
    clickStartRef.current = null;
    onHover?.(null);
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
      () => cellSelection.viewCells.map(row => row.map(cell => cell.value)),
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
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handleHover}
        onPointerLeave={handlePointerLeave}
      />
    </div>
  );
});
