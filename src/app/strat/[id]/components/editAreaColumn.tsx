import { ContextMenu, ContextMenuTrigger } from '@radix-ui/react-context-menu';
import { ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import { motion } from 'framer-motion';
import React, { type MouseEvent, useRef, useState, type MouseEventHandler } from 'react';

export const EditAreaColumn = ({ job }: { job: any }) => {
  const constraintRef = useRef<HTMLSpanElement>(null);
  const [menuOpenMouseY, setMenuOpenMouseY] = useState(0);
  const [rectPositions, setRectPositions] = useState<number[]>([]);

  const onContextMenu = (evt: MouseEvent<HTMLSpanElement>) => {
    setMenuOpenMouseY(evt.clientY - evt.currentTarget.getBoundingClientRect().top);
  };

  const onCreate: MouseEventHandler<HTMLDivElement> = (evt) => {
    setRectPositions([...rectPositions, menuOpenMouseY]);
  };

  return (
    <li className="flex lg:w-10 md:w-5">
      <ContextMenu>
        <ContextMenuTrigger
          onContextMenu={onContextMenu}
          className="w-full h-full"
          ref={constraintRef}
        >
          {...rectPositions.map((rectPosition, index) => {
            const box: React.ReactNode = (
              <motion.div
                key={index}
                drag="y"
                dragConstraints={constraintRef}
                className={`lg:w-10 h-10 bg-black absolute`}
                style={{ translateY: `${rectPosition}px` }}
              />
            );

            return box;
          })}
        </ContextMenuTrigger>
        <ContextMenuContent className="lg:w-32">
          <ContextMenuItem inset onClick={onCreate}>
            Create
          </ContextMenuItem>
          <ContextMenuItem inset>Lock</ContextMenuItem>
          <ContextMenuItem inset>Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </li>
  );
};
