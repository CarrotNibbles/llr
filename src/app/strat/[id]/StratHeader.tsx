import { Button } from '@/components/ui/button';
import { CopyIcon, HeartIcon, Share1Icon } from '@radix-ui/react-icons';

export const StratHeader = () => {
  return (
    <div className="rounded-none border-b flex space-x-4 py-2 px-4 items-center">
      <div className="font-bold">섭힐이 부릅니다: 살려주세요</div>
      <div className="text-zinc-500">마의 전당 판데모니움: 천옥편 4(영웅)</div>
      <div className="flex-grow"></div>
      <div className="flex">
        <Button variant="ghost" size="icon">
          <Share1Icon />
        </Button>
        <Button variant="ghost" size="icon">
          <CopyIcon />
        </Button>
      </div>
      <Button className="">
        <HeartIcon className="mr-2" />
        13598
      </Button>
    </div>
  );
};
