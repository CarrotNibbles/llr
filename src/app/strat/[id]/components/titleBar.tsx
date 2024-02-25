import { Menubar } from '@/components/ui/menubar';
import { DownloadIcon, GlobeIcon, Share2Icon } from '@radix-ui/react-icons';
import { MenubarMenu } from '@radix-ui/react-menubar';

export const TitleBar = ({ id }: { id: string }) => (
  <Menubar className="flex p-3 justify-between">
    <div className="flex">
      <h1 className="text-xl px-1">My First Strat</h1>
      <div className="flex px-1">
        <h2 className="text-xs self-end">언영 4층 어쩌고</h2>
      </div>
    </div>
    <div className="flex">
      <MenubarMenu>
        <DownloadIcon />
      </MenubarMenu>
      <MenubarMenu>
        <Share2Icon />
      </MenubarMenu>
      <MenubarMenu>
        <GlobeIcon />
      </MenubarMenu>
    </div>
  </Menubar>
);
