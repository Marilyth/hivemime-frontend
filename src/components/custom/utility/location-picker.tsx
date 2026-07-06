import { Button } from "@/components/ui/button";
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
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.parent = parent;

    makeAutoObservable(this);
  }

  isSelected() {
    return this.parent.selectedRectangle === this;
  }
}

export class LocationRectangles {
  maxRectangles: number;
  rectangles: LocationRectangle[] = [];
  selectedRectangle: LocationRectangle | null = null;

  constructor(maxRectangles: number = 1) {
    this.maxRectangles = maxRectangles;
    makeAutoObservable(this);
  }

  addRectangle(x: number, y: number, width: number, height: number) {
    const rect = new LocationRectangle(x, y, width, height, this);
    this.rectangles.push(rect);
  }

  removeRectangle(rect: LocationRectangle) {
    this.rectangles = this.rectangles.filter(r => r !== rect);
  }
}

export interface LocationPickerProps {
  rectangles: LocationRectangles;
}

export interface LocationProps {
  rectangle: LocationRectangle;
}

export const LocationPicker = observer((props: LocationPickerProps) => {
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function getPosition(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function pointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (props.rectangles.rectangles.length >= props.rectangles.maxRectangles)
      return;

    e.preventDefault();

    const pos = getPosition(e);

    e.currentTarget.setPointerCapture(e.pointerId);

    setDragging(true);
    const newRect = new LocationRectangle(pos.x, pos.y, 0, 0, props.rectangles);
    props.rectangles.addRectangle(newRect.x, newRect.y, newRect.width, newRect.height);
    props.rectangles.selectedRectangle = null;
  }

  function pointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging)
        return;

    const pos = getPosition(e);
    const currentRect = props.rectangles.rectangles[props.rectangles.rectangles.length - 1];

    const containerRect = containerRef.current?.getBoundingClientRect();

    currentRect.width = pos.x - currentRect.x;
    currentRect.height = pos.y - currentRect.y;
  }

  function pointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging)
        return;

    e.currentTarget.releasePointerCapture(e.pointerId);

    setDragging(false);
    props.rectangles.selectedRectangle = props.rectangles.rectangles[props.rectangles.rectangles.length - 1];
  }

  return (
    <div
      className="relative inline-block select-none touch-none w-full h-full"
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
      ref={containerRef}
    >
      {dragging && (
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
      )}

      {props.rectangles.rectangles.map((rect, index) => (
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
                className={`${props.rectangle.isSelected() ? 'border border-honey-brown' : ''} rounded-sm bg-honey-brown/25`}
                onResizeStop={handleResizeStop}
                onDragStop={handleDragStop}
                onPointerDown={handleClick}
            >
                {props.rectangle.isSelected() && (
                    <Button variant="destructive" className="absolute p-0 h-8 -top-8 -right-12" onClick={handleDelete}>
                        <Trash2 />
                    </Button>
                )}
            </Rnd>
        </>
    );
});