import { Button } from "@/components/ui/button";
import { clamp, cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { ResizeDirection } from "re-resizable";
import { useRef, useState } from "react";
import { DraggableData, Position, ResizableDelta, Rnd } from "react-rnd";

export class LocationRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  parent: LocationRectangles;

  constructor(x: number, y: number, width: number, height: number, parent: LocationRectangles) {
    this.parent = parent;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    makeAutoObservable(this);
  }

  isSelected() {
    return this.parent.selectedRectangle === this;
  }

  makeRelative() {
    this.x = this.x / this.parent.containerWidth;
    this.y = this.y / this.parent.containerHeight;
    this.width = this.width / this.parent.containerWidth;
    this.height = this.height / this.parent.containerHeight;
  }

  makeAbsolute() {
    this.x = this.x * this.parent.containerWidth;
    this.y = this.y * this.parent.containerHeight;
    this.width = this.width * this.parent.containerWidth;
    this.height = this.height * this.parent.containerHeight;
  }
}

export class LocationRectangles {
  maxRectangles: number;
  containerWidth: number = 0;
  containerHeight: number = 0;
  rectangles: LocationRectangle[] = [];
  selectedRectangle: LocationRectangle | null = null;

  constructor(maxRectangles: number = 1) {
    this.maxRectangles = maxRectangles;
    makeAutoObservable(this);
  }

  addRectangle(x: number, y: number) {
    const rect = new LocationRectangle(x, y, 1, 1, this);
    this.rectangles.push(rect);
  }

  removeRectangle(rect: LocationRectangle) {
    this.rectangles = this.rectangles.filter(r => r !== rect);
  }
}

export type LocationPickerProps = {
  rectangles: LocationRectangles;
} & React.HTMLAttributes<HTMLDivElement>;

export interface LocationProps {
  rectangle: LocationRectangle;
}

export const LocationPicker = observer(({ rectangles, children, className, ...props }: LocationPickerProps) => {
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canCreateNewRectangle = rectangles.rectangles.length < rectangles.maxRectangles;
  const overlayClass = cn(
    "absolute bg-black/30 pointer-events-none transition-opacity duration-[250ms]",
    dragging ? "opacity-100" : "opacity-0"
  );

  let dimLeft = 0;
  let dimTop = 0;
  let dimRight = 0;
  let dimBottom = 0;

  if (dragging) {
    const currentRect = rectangles.rectangles[rectangles.rectangles.length - 1];
    dimLeft = Math.min(currentRect.x, currentRect.x + currentRect.width);
    dimTop = Math.min(currentRect.y, currentRect.y + currentRect.height);
    dimRight = Math.max(currentRect.x, currentRect.x + currentRect.width);
    dimBottom = Math.max(currentRect.y, currentRect.y + currentRect.height);
  }

  function getPosition(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function pointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!canCreateNewRectangle)
      return;

    e.preventDefault();

    const pos = getPosition(e);
    const containerRect = containerRef.current!.getBoundingClientRect();

    rectangles.containerWidth = containerRect.width;
    rectangles.containerHeight = containerRect.height;
    e.currentTarget.setPointerCapture(e.pointerId);

    setDragging(true);

    rectangles.addRectangle(pos.x, pos.y);
    rectangles.selectedRectangle = null;
  }

  function pointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging)
        return;

    const pos = getPosition(e);
    const currentRect = rectangles.rectangles[rectangles.rectangles.length - 1];

    const newWidth = clamp(pos.x - currentRect.x, -currentRect.x, rectangles.containerWidth - currentRect.x);
    const newHeight = clamp(pos.y - currentRect.y, -currentRect.y, rectangles.containerHeight - currentRect.y);
    
    currentRect.width = newWidth;
    currentRect.height = newHeight;
  }

  function pointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging)
        return;

    e.currentTarget.releasePointerCapture(e.pointerId);

    setDragging(false);;

    // Convert negative width/height to positive and adjust x/y accordingly to avoid RND issues.
    const currentRect = rectangles.rectangles[rectangles.rectangles.length - 1];
    if (currentRect.width < 0) {
      currentRect.x += currentRect.width;
      currentRect.width = Math.abs(currentRect.width);
    }

    if (currentRect.height < 0) {
      currentRect.y += currentRect.height;
      currentRect.height = Math.abs(currentRect.height);
    }

    rectangles.selectedRectangle = currentRect;
  }

  return (
    <div
      className={cn(`relative inline-block select-none touch-none w-full h-full ${canCreateNewRectangle ? "cursor-crosshair" : "cursor-not-allowed"}`, className)}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
      ref={containerRef}
      {...props}
    >
      {children}

      {/* Top */}
      <div
        className={overlayClass}
        style={{
          left: 0,
          top: 0,
          width: "100%",
          height: dimTop,
        }}
      />

      {/* Left */}
      <div
        className={overlayClass}
        style={{
          left: 0,
          top: dimTop,
          width: dimLeft,
          height: dimBottom - dimTop,
        }}
      />

      {/* Right */}
      <div
        className={overlayClass}
        style={{
          left: dimRight,
          top: dimTop,
          right: 0,
          height: dimBottom - dimTop,
        }}
      />

      {/* Bottom */}
      <div
        className={overlayClass}
        style={{
          left: 0,
          top: dimBottom,
          width: "100%",
          bottom: 0,
        }}
      />

      {rectangles.rectangles.map((rect, index) => (
        <RectangleDisplay key={index} rectangle={rect} />
      ))}
    </div>
  );
});

export const RectangleDisplay = observer((props: LocationProps) => {
    function handleDragStop(e: MouseEvent, data: DraggableData) {
        props.rectangle.x = data.x;
        props.rectangle.y = data.y;
    }

    function handleResizeStop(e: MouseEvent | TouchEvent, dir: ResizeDirection, elementRef: HTMLElement, delta: ResizableDelta, position: Position) {
        props.rectangle.width = elementRef.offsetWidth;
        props.rectangle.height = elementRef.offsetHeight;
        props.rectangle.x = position.x;
        props.rectangle.y = position.y;
    }

    function handleClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        props.rectangle.parent.selectedRectangle = props.rectangle;
    }

    function handleDelete() {
        props.rectangle.parent.removeRectangle(props.rectangle);
    }

    return (
        <>
            <Rnd
                position={{
                    x: Math.min(props.rectangle.x, props.rectangle.x + props.rectangle.width),
                    y: Math.min(props.rectangle.y, props.rectangle.y + props.rectangle.height),
                }}
                size={{
                    width: Math.abs(props.rectangle.width),
                    height: Math.abs(props.rectangle.height),
                }}
                bounds="parent"
                className={`border bg-honey-brown/10 border-honey-brown rounded-sm ${props.rectangle.isSelected() && 'bg-honey-brown/25 z-100!'}`}
                onResizeStop={handleResizeStop}
                onDragStop={handleDragStop}
                onPointerDown={handleClick}
                minWidth={0}
                minHeight={0}
            >
                {props.rectangle.isSelected() && (
                    <Button variant="destructive" className="absolute p-0 h-8 w-8 -top-8 -right-10 rounded-full no-drag!" onPointerDown={handleDelete}>
                        <Trash2 />
                    </Button>
                )}
            </Rnd>
        </>
    );
});