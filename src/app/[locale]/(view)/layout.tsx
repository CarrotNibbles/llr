import { TooltipProvider } from '@/components/ui/tooltip';
import { ViewFooter } from './components/ViewFooter';
import { ViewHeader } from './components/ViewHeader';

type BoardLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function BoardLayout({ children }: BoardLayoutProps): React.ReactElement {
  return (
    <TooltipProvider>
      <div className="flex flex-col items-center">
        <ViewHeader />
        {children}
        <ViewFooter />
      </div>
    </TooltipProvider>
  );
}
