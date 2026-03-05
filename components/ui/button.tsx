import { cn } from '@/lib/utils/cn';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' };

export function Button({ className, variant = 'default', ...props }: Props) {
  return (
    <button
      className={cn(
        'rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50',
        variant === 'default' ? 'bg-slate-900 text-white' : 'border bg-white',
        className
      )}
      {...props}
    />
  );
}
