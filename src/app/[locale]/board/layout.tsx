import { TooltipProvider } from '@/components/ui/tooltip';

export default function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return <TooltipProvider>{children}</TooltipProvider>;
}
