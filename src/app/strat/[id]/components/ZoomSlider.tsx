'use client';

import { cn, getZoom } from '@/lib/utils';
import { Slider as DefaultSlider } from '@/components/ui/slider';
import { useLastZoomState, useZoomState } from '@/lib/states';

type SliderProps = React.ComponentProps<typeof DefaultSlider>;

export function ZoomSlider({ className, ...props }: SliderProps) {
  const [zoom, setZoom] = useZoomState();
  const [_, setLastZoom] = useLastZoomState();
  return (
    <DefaultSlider
      defaultValue={[5]}
      onValueChange={(value) => {
        setLastZoom(zoom);
        setZoom(getZoom(value[0]));
      }}
      max={15}
      min={0}
      step={1}
      className={cn('w-[15%] ml-1', className)}
      {...props}
    />
  );
}
