import { TooltipProvider } from '@/components/ui/tooltip';

type BoardLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function BoardLayout({ children }: BoardLayoutProps): React.ReactElement {
  return <TooltipProvider>{children}</TooltipProvider>;
}
