import type { ReactElement, ReactNode } from 'react';
import { theme } from '../theme';

interface StackProps {
  direction?: 'row' | 'column';
  gap?: 'small' | 'medium' | 'large';
  children: ReactNode;
}

export function Stack({ direction = 'column', gap = 'medium', children }: StackProps): ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction,
        alignItems: direction === 'row' ? 'center' : 'stretch',
        gap: theme.spacing[gap],
      }}
    >
      {children}
    </div>
  );
}
