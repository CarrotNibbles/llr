'use client';

import { cn } from '@/lib/utils';
import { Slider as DefaultSlider } from '@/components/ui/slider';
import { useZoomState } from '@/lib/states';

type SliderProps = React.ComponentProps<typeof DefaultSlider>;

export function ZoomSlider({ className, ...props }: SliderProps) {
  const [zoom, setZoom] = useZoomState();
  return (
    <DefaultSlider
      defaultValue={[40]}
      value={[zoom]}
      onValueChange={(value) => {
        setZoom(value[0]);
      }}
      max={80}
      step={10}
      className={cn('w-[15%] ml-1', className)}
      {...props}
    />
  );
}
