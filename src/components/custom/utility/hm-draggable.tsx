"use client";

import { Key, useEffect, useRef, useState } from "react";
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge, attachClosestEdge, Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { GripVertical } from "lucide-react";
import { FaCircle } from "react-icons/fa6";

type HiveMimeDraggableProps = React.ComponentProps<"div"> & {
    data?: unknown;

    /**
     * If provided, moves draggable items when they are dropped inside the list.
     */
    dataList?: unknown[];

    canDrop?: (draggableData: unknown) => boolean;
    isDroppable?: boolean;
    onDropped?: ({draggableData, droppableData, edge}: {draggableData: unknown, droppableData: unknown | undefined, edge: Edge | null}) => void;

    canDrag?: () => boolean;
    isDraggable?: boolean;

    isSticky?: boolean;
    hasHandle?: boolean;

    allowedEdges?: Edge[];
    droppableFor?: Key[] | null;

    /**
     * If set, draggables can only be dropped on droppables whose droppableFor matches.
     */
    draggableOn?: Key[] | null;
}

export function HiveMimeDraggable({
    className, data, dataList, onDropped, isSticky = false, hasHandle = false,
    canDrop, canDrag, isDroppable = false, isDraggable = false, allowedEdges = [], droppableFor: droppableGroups, draggableOn: droppableOn, ...props }: HiveMimeDraggableProps) {
  const ref = useRef(null);
  const handleRef = useRef(null);
  const [isDropping, setDropping] = useState<boolean>(false);
  const [currentEdge, setCurrentEdge] = useState<Edge | null>(null);
  const [isDragging, setDragging] = useState<boolean>(false);

  function moveToList(draggable: Record<string, unknown>, edge: Edge | null)
  {
    const draggableList = draggable["inputDataList"] as unknown[];

    // If the target list is different, remove the item from the old list.
    if (draggableList != dataList)
      draggableList?.splice(draggableList.indexOf(draggable["inputData"]), 1);

    // If we have a target list, add the item to the list.
    if (dataList)
    {
      const oldIndex = dataList.indexOf(draggable["inputData"]);

      // Remove the item from the old index if it exists.
      if (oldIndex != -1)
        dataList.splice(oldIndex, 1);

      const newIndex = data ? dataList.indexOf(data) + ((edge == "bottom" || edge == "right") ? 1 : 0) : -1;

      // Insert the item at the new index.
      if (newIndex == -1)
        dataList.push(draggable["inputData"]);
      else
        dataList.splice(newIndex, 0, draggable["inputData"]);
    }
  }

  useEffect(() => {
    const element = ref.current!;

    const dragCleanup = draggable({
      element,
      getInitialData: () => { return { "inputData": data, "inputDataList": dataList, "droppableOn": droppableOn } },
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
      canDrag: () => isDraggable && (canDrag ? canDrag() : true),
      dragHandle: hasHandle ? handleRef.current! : undefined,
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

        // Don't propagate if we aren't the top target.
        if (targetData.inputData !== data) {
          setDropping(false);
          setCurrentEdge(null);
        }
        else {
          setDropping(true);
          setCurrentEdge(extractClosestEdge(targetData));
        }
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
        moveToList(sourceData, edge);

        if (onDropped) {
          onDropped({draggableData: sourceData.inputData, droppableData: data, edge});
        }
      },
      getIsSticky: () => isSticky,
      canDrop: (args) => {
        return isDroppable &&
          (!args.source.data.droppableOn || (args.source.data.droppableOn as Key[]).some(k => droppableGroups?.includes(k))) &&
          args.source.element !== element &&
          (canDrop ? canDrop(args.source.data.inputData) : true);
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
    className={`relative rounded-lg ${isDragging ? "opacity-20" : ""} ${(isDropping && allowedEdges.length == 0) ? "bg-honey-yellow/5" : ""}`}
    {...props}
  >
    {currentEdge && (
      <div>
        <FaCircle className={`absolute h-2 justify-center text-honey-brown ${
            currentEdge === "top"
              ? `-top-0.5 -left-3 right-0`
              : currentEdge === "bottom"
              ? `-bottom-0.5 -left-3 right-0`
              : currentEdge === "left"
              ? `-left-0.5 -top-3 bottom-0`
              : `-right-0.5 -top-3 bottom-0`
          }`} />
          <div className={`absolute w-full bg-honey-brown/50 ${
            currentEdge === "top"
              ? `top-0 h-1`
              : currentEdge === "bottom"
              ? `bottom-0 h-1`
              : currentEdge === "left"
              ? `left-0 w-1`
              : `right-0 w-1`
          }`}></div>
      </div>
    )}
      <div className="flex w-full items-center gap-1">
        {hasHandle && (<GripVertical className="h-4 w-4 text-honey-brown cursor-grab " ref={handleRef} />)}
        <div className={`flex-1 ${className}`}>
          {props.children}
        </div>
      </div>
  </div>
);

}