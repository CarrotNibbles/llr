import { ContextMenu, ContextMenuTrigger } from '@radix-ui/react-context-menu';
import { ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import { motion } from 'framer-motion';
import { type MouseEvent, useRef, useState, type MouseEventHandler } from 'react';

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
    <div className="flex">
      <li className="lg:w-10">
        <ContextMenu>
          <ContextMenuTrigger
            onContextMenu={onContextMenu}
            className="flex flex-col w-full h-full"
            ref={constraintRef}
          >
            {...rectPositions.map((rectPosition, index) => (
              <motion.div
                key={index}
                drag="y"
                dragConstraints={constraintRef}
                className={`w-full h-10 bg-black`}
              />
            ))}
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
    </div>
  );
};
