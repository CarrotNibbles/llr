'use client';

import { Slider as DefaultSlider } from '@/components/ui/slider';
import { zoomAtom } from '@/lib/atoms';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';

type SliderProps = React.ComponentProps<typeof DefaultSlider>;

const getZoom = (zoomState: number) => {
  return [0.3, 0.5, 2 / 3, 0.8, 0.9, 1, 1.1, 1.2, 4 / 3, 1.5, 1.7, 2, 2.4, 3, 4, 5][zoomState];
};

export function ZoomSlider({ className, ...props }: SliderProps) {
  const [zoom, setZoom] = useAtom(zoomAtom);

  return (
    <DefaultSlider
      defaultValue={[5]}
      onValueChange={(value) => {
        const newZoom = getZoom(value[0]);
        setZoom({
          value: newZoom,
          changeRatio: newZoom / zoom.value,
        });
      }}
      max={15}
      min={0}
      step={1}
      className={cn('w-[15%] ml-1', className)}
      {...props}
    />
  );
}
