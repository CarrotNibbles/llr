'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons';

type LikeButtonProps = React.ComponentPropsWithoutRef<typeof Button> & {
  likes: number;
};

export const LikeButton = ({ className, ...props }: LikeButtonProps) => {
  return (
    <Button variant="link" className={cn('p-0 item-end space-y-0', className)}>
      <HeartFilledIcon className="mr-3 h-5 w-5 text-red-500" />
      {props.likes}
    </Button>
  );
};
