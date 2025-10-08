"use client";

import { useEffect, useRef, useState } from "react";
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge, attachClosestEdge, Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

type HiveMimeDraggableProps<T extends object> = React.ComponentProps<"div"> & {
    data?: T;

    canDrop?: (draggableData: T) => boolean;
    isDroppable?: boolean;
    onDropped?: ({draggableData, droppableData, edge}: {draggableData: T, droppableData: T | undefined, edge: Edge | null}) => void;

    canDrag?: () => boolean;
    isDraggable?: boolean;

    isSticky?: boolean;
    allowedEdges?: Edge[];
    edgeGap?: number;
}

export function HiveMimeDraggable<T extends object>({
    className, data, onDropped, isSticky = false,
    canDrop, canDrag, isDroppable = false, isDraggable = false, allowedEdges = [], edgeGap = 0, ...props }: HiveMimeDraggableProps<T>) {
  const ref = useRef(null);
  const [isDropping, setDropping] = useState<boolean>(false);
  const [currentEdge, setCurrentEdge] = useState<Edge | null>(null);
  const [isDragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    const element = ref.current!;
    
    const dragCleanup = draggable({
      element,
      getInitialData: () => { return { "inputData": data } },
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
      canDrag: () => isDraggable && (canDrag ? canDrag() : true),
    });

    const dropCleanup = dropTargetForElements({
      element,
      getData: ({ input }) => {
        // If we have allowed edges, attach the closest edge data to the drop target.
        return attachClosestEdge({ "inputData": data }, {
          element,
          input,
          allowedEdges: allowedEdges,
        });
      },
      onDrag: ({location}) => {
        const targetData = location.current.dropTargets[0].data;

        setDropping(true);
        
        // Don't propagate if we aren't the top target.
        if (targetData.inputData !== data)
          setCurrentEdge(null);
        else
          setCurrentEdge(extractClosestEdge(targetData));
      },
      onDragLeave: () => {
        setDropping(false);
        setCurrentEdge(null);
      },
      onDrop: ({location, source}) => {
        setDropping(false);
        setCurrentEdge(null);

        const target = location.current.dropTargets[0];

        const sourceData = source.data;
        const targetData = target.data;
        
        // Don't propagate if we aren't the top target.
        if (targetData.inputData !== data) {
          return;
        }

        const edge = extractClosestEdge(targetData);

        if (onDropped) {
          onDropped({draggableData: sourceData.inputData as T, droppableData: data, edge});
        }
      },
      getIsSticky: () => isSticky,
      canDrop: (args) => {
        return isDroppable && args.source.element !== element && (canDrop ? canDrop(args.source.data.inputData as T) : true);
      }
    });

    return () => {
      dropCleanup();
      dragCleanup();
    };
  }, []);

  return (
  <div
    ref={ref}
    {...props}
    className={`relative rounded-lg ${isDragging ? "opacity-20" : ""} ${isDropping ? "bg-honey-yellow/5" : ""} ${className}`}
  >
    {currentEdge && (
      <div
        className={`absolute opacity-50 rounded-lg ${
          currentEdge === "top"
            ? `-top-${edgeGap} left-0 right-0 h-1 bg-honey-yellow`
            : currentEdge === "bottom"
            ? `-bottom-${edgeGap} left-0 right-0 h-1 bg-honey-yellow`
            : currentEdge === "left"
            ? `left-${edgeGap} top-0 bottom-0 w-1 bg-honey-yellow`
            : `right-${edgeGap} top-0 bottom-0 w-1 bg-honey-yellow`
        }`}
      />
    )}
    {props.children}
  </div>
);

}