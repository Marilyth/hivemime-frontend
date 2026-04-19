"use client";

import { Key, useEffect, useRef, useState } from "react";
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { GripVertical } from "lucide-react";
import { FaCircle } from "react-icons/fa6";
import { Input } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";

export type OnDroppedArgs = {
    draggableData: unknown;
    dropAreaData: unknown | undefined;
    zone: DropZone | null;
}

type DropZone = Edge | "center";

type HiveMimeDraggableProps = React.ComponentProps<"div"> & {
    data?: unknown;

    /**
     * If provided, moves draggable items when they are dropped inside the list.
     */
    dataList?: unknown[];

    isDropArea?: boolean;
    canDrop?: (draggableData: unknown) => boolean;
    onDropped?: (args: OnDroppedArgs) => void;
    dropAreaName?: Key[] | null;

    isDraggable?: boolean;
    canDrag?: () => boolean;
    /**
     * If set, draggables can only be dropped on droppables whose dropAreaName matches.
     */
    draggableOnArea?: Key[] | null;

    isSticky?: boolean;
    hasHandle?: boolean;

    allowedZones?: DropZone[];
}

export function HiveMimeDraggable({
    className, data, dataList, onDropped, isSticky = false, hasHandle = false,
    canDrop, canDrag, isDropArea = false, isDraggable = false, allowedZones = [], dropAreaName, draggableOnArea, ...props }: HiveMimeDraggableProps) {
  const ref = useRef<HTMLDivElement>(null);
  const handleRef = useRef(null);
  const [isDropping, setDropping] = useState<boolean>(false);
  const [currentZone, setCurrentZone] = useState<DropZone | null>(null);
  const [isDragging, setDragging] = useState<boolean>(false);

  function getDropZone(element: HTMLElement, input: Input): DropZone | null {
    if (allowedZones.length === 0) {
      return null;
    }

    const rect = element.getBoundingClientRect();
    const { clientY, clientX } = input;
    
    // Calculate relative position within the element (0 to 1)
    const relativeY = (clientY - rect.top) / rect.height;
    const relativeX = (clientX - rect.left) / rect.width;
    
    // If center is allowed, create a 33% buffer zone for it.
    const centerRadius = allowedZones.includes('center') ? 0.17 : 0;

    // If center is an allowed edge, divide into thirds.
    if (allowedZones.includes('top') && relativeY < 0.5 - centerRadius) {
      return 'top';
    } else if (allowedZones.includes('bottom') && relativeY > 0.5 + centerRadius) {
      return 'bottom';
    } else if (allowedZones.includes('left') && relativeX < 0.5 - centerRadius) {
      return 'left';
    } else if (allowedZones.includes('right') && relativeX > 0.5 + centerRadius) {
      return 'right';
    }

    return 'center';
  }
  
  function moveToList(draggable: Record<string, unknown>, edge: DropZone | null)
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

  // https://bugzilla.mozilla.org/show_bug.cgi?id=1853069
  function onMouseEnter() {
    if (hasHandle)
      ref.current!.draggable = false;
  }

  function onMouseLeave() {
    if (hasHandle)
      ref.current!.draggable = true;
  }

  useEffect(() => {
    const element = ref.current!;

    const dragCleanup = draggable({
      element,
      getInitialData: () => { return { "inputData": data, "inputDataList": dataList, "draggableOnArea": draggableOnArea } },
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
      canDrag: () => isDraggable && (canDrag ? canDrag() : true),
      dragHandle: hasHandle ? handleRef.current! : undefined,
    });

    const dropCleanup = dropTargetForElements({
      element,
      getData: () => { return { "inputData": data, "inputDataList": dataList, "dropAreaName": dropAreaName } },
      onDrag: ({location}) => {
        const targetData = location.current.dropTargets[0].data;

        // Don't propagate if we aren't the top target.
        if (targetData.inputData !== data) {
          setDropping(false);
          setCurrentZone(null);
        }
        else {
          setDropping(true);
          setCurrentZone(getDropZone(element, location.current.input));
        }
      },
      onDragLeave: () => {
        setDropping(false);
        setCurrentZone(null);
      },
      onDrop: ({location, source}) => {
        setDropping(false);
        setCurrentZone(null);

        const target = location.current.dropTargets[0];

        const sourceData = source.data;
        const targetData = target.data;

        // Don't propagate if we aren't the top target.
        if (targetData.inputData !== data) {
          return;
        }

        const dropZone = getDropZone(element, location.current.input);
        moveToList(sourceData, dropZone);

        if (onDropped) {
          onDropped({draggableData: sourceData.inputData, dropAreaData: data, zone: dropZone});
        }
      },
      getIsSticky: () => isSticky,
      canDrop: (args) => {
        return isDropArea &&
          (!args.source.data.draggableOnArea || (args.source.data.draggableOnArea as Key[]).some(k => dropAreaName?.includes(k))) &&
          args.source.element !== element &&
          (canDrop ? canDrop(args.source.data.inputData) : true);
      }
    });

    return () => {
      dropCleanup();
      dragCleanup();
    };
  }, [dataList, hasHandle]);

  return (
  <div
    ref={ref}
    className={`relative ${isDragging ? "opacity-20" : ""} ${(isDropping && (allowedZones.length == 0 || currentZone == "center")) ? "bg-honey-yellow/10" : ""}`}
    {...props}
  >
    {currentZone && currentZone !== "center" && (
      <div>
        <FaCircle className={`absolute h-2 justify-center text-honey-brown ${
            currentZone === "top"
              ? `-top-0.5 -left-3 right-0`
              : currentZone === "bottom"
              ? `-bottom-0.5 -left-3 right-0`
              : currentZone === "left"
              ? `-left-0.5 -top-3 bottom-0`
              : `-right-0.5 -top-3 bottom-0`
          }`} />
          <div className={`absolute w-full bg-honey-brown/50 ${
            currentZone === "top"
              ? `top-0 h-1`
              : currentZone === "bottom"
              ? `bottom-0 h-1`
              : currentZone === "left"
              ? `left-0 w-1`
              : `right-0 w-1`
          }`}></div>
        </div>
    )}
    {currentZone === "center" && (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative">
          <div className="w-6 h-6 rounded-full border-2 border-honey-brown/30 bg-honey-brown/5"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-honey-brown/80"></div>
          </div>
        </div>
      </div>
    )}
      <div className="flex w-full items-center gap-1">
        {hasHandle && (<GripVertical className="h-4 w-4 text-honey-brown cursor-grab " ref={handleRef} />)}
        <div className={`flex-1 ${className}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          {props.children}
        </div>
      </div>
  </div>
);

}