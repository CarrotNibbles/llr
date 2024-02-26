'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

export const LikeButton = (props: { likes: number }) => {
  return (
    <Button variant="link" className="p-0 item-end space-y-0">
      <Icons.emptyLike className="mr-3 h-5 w-5" />
      {props.likes}
    </Button>
  );
};
