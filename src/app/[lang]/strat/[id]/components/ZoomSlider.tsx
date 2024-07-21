'use client';

import { Slider as DefaultSlider } from '@/components/ui/slider';
import { useZoomState } from '@/lib/states';
import { cn, getZoom } from '@/lib/utils';

type SliderProps = React.ComponentProps<typeof DefaultSlider>;

export function ZoomSlider({ className, ...props }: SliderProps) {
  const [zoom, setZoom] = useZoomState();
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
