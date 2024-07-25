import { TooltipProvider } from "@/components/ui/tooltip";

export default function StratLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return <TooltipProvider>{children}</TooltipProvider>;
}
