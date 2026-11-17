import type { ReactElement, ReactNode } from 'react';
import { theme } from '../theme';

interface EngravedTitleProps {
  children: ReactNode;
}

export function EngravedTitle({ children }: EngravedTitleProps): ReactElement {
  return (
    <h3
      style={{
        margin: 0,
        padding: `${theme.spacing.small} 0`,
        fontSize: '18px',
        fontWeight: 'normal',
        fontStyle: 'italic',
        fontFamily: theme.fontFamily,
        letterSpacing: '0.5px',
        background: `linear-gradient(180deg, ${theme.colors.shadow} 0%, ${theme.colors.text} 50%, ${theme.colors.shadow} 100%)`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
      }}
    >
      {children}
    </h3>
  );
}
