import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ReactNode } from 'react';

export function Tooltip({
  children,
  content,
}: {
  children: ReactNode;
  content: ReactNode;
}) {
  return (
    <TooltipProvider>
      <UITooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className="max-h-[20rem] min-w-[10rem] overflow-y-scroll p-4">
          {content}
        </TooltipContent>
      </UITooltip>
    </TooltipProvider>
  );
}
