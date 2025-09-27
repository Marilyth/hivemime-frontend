"use client";

import { useEffect, useRef, useState } from "react";
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';


type HiveMimeDraggableProps = React.ComponentProps<"div"> & {
    data: Record<string, unknown>;
}

export function HiveMimeDraggable({ className, data, ...props }: HiveMimeDraggableProps) {
  const ref = useRef(null);
  const [isDragging, setDragging] = useState<boolean>(false);
  const [isDropping, setIsDropping] = useState<boolean>(false);

  useEffect(() => {
    const element = ref.current;

    const dropCleanup = dropTargetForElements({
      element: element!,
      getData: () => { return { ...data } },
      canDrop: ({ source }) => source.element !== element,
      onDragEnter: () => setIsDropping(true),
      onDragLeave: () => setIsDropping(false),
      onDrop: ({ source }) => {
        setIsDropping(false);
        console.log(`Dropped: ${source.data} on ${data.name}`);
      }
    });

    const dragCleanup = draggable({
      element: element!,
      getInitialData: () => { return { ...data } },
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false)
    });

    return () => {
      dropCleanup();
      dragCleanup();
    };
  }, []);

  return (
    <div className={`rounded-lg ${isDragging ? "opacity-0" : ""} ${isDropping ? "border-1 border-dashed border-honey-brown" : ""} ${className}`} ref={ref}  {...props}>
        {props.children}
    </div>
  );
}
