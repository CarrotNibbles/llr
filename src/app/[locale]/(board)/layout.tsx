import { TooltipProvider } from '@/components/ui/tooltip';
import { BoardHeader } from './components/BoardHeader';

type BoardLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function BoardLayout({ children }: BoardLayoutProps): React.ReactElement {
  return (
    <TooltipProvider>
      <div className="flex flex-col items-center">
        <BoardHeader />
        {children}
      </div>
    </TooltipProvider>
  );
}
