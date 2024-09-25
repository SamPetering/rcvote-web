import { Label } from '@/components/ui/label';
import { PropsWithChildren } from 'react';

export function FormSection({
  label,
  children,
}: PropsWithChildren<{ label: string }>) {
  return (
    <div className="relative">
      <Label className="absolute -top-3.5 mb-2 ml-2 flex bg-card pl-2 pr-2 text-lg">
        {label}
      </Label>
      <div className="border-t border-primary pb-4 pl-4 pt-6">{children}</div>
    </div>
  );
}
