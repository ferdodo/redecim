import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { theme } from '../theme';

interface InsetFrameProps {
  children: ReactNode;
  style?: CSSProperties;
}

export function InsetFrame({ children, style }: InsetFrameProps): ReactElement {
  return (
    <div
      style={{
        padding: theme.spacing.large,
        background: theme.gradients.metal,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius,
        boxShadow: `inset 0 1px 3px ${theme.colors.shadow}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
