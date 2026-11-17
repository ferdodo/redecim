import type { CSSProperties, ReactElement } from 'react';
import { theme } from '../theme';

interface InsetLabelProps {
  children: string;
  variant?: 'label' | 'body' | 'title';
}

export function InsetLabel({ children, variant = 'body' }: InsetLabelProps): ReactElement {
  const variants: Record<string, CSSProperties> = {
    label: {
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
    body: {
      fontSize: '13px',
      fontWeight: 400,
      letterSpacing: '0px',
    },
    title: {
      fontSize: '15px',
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
  };

  const style: CSSProperties = {
    ...variants[variant],
    color: '#bbbbbb',
    fontFamily: theme.fontFamily,
    fontStyle: 'italic',
    textShadow: `0 1px 0 rgba(255, 255, 255, 0.3), 0 -1px 0 rgba(0, 0, 0, 0.5)`,
    margin: 0,
    userSelect: 'none',
  };

  return (
    <span style={style}>
      {children}
    </span>
  );
}
