import type { ReactElement, ReactNode } from 'react';
import { theme } from '../theme';

interface PanelProps {
  title?: string;
  children: ReactNode;
}

export function Panel({ title, children }: PanelProps): ReactElement {
  return (
    <section
      style={{
        background: theme.gradients.metal,
        border: `1px solid ${theme.colors.borderDark}`,
        borderRadius: theme.radius,
        padding: '3px',
        color: theme.colors.text,
        fontFamily: theme.fontFamily,
        fontSize: theme.fontSize,
        boxShadow: `inset 0 1px 0 ${theme.colors.highlight}, 0 6px 16px ${theme.colors.shadow}`,
      }}
    >
      {title && (
        <h2
          style={{
            margin: '0 0 3px',
            padding: `${theme.spacing.small} ${theme.spacing.medium}`,
            background: theme.gradients.titleBar,
            border: `1px solid ${theme.colors.borderDark}`,
            borderRadius: '5px 5px 2px 2px',
            color: theme.colors.textLight,
            textShadow: `0 1px 2px ${theme.colors.shadow}`,
            fontSize: theme.fontSize,
            fontWeight: 700,
            letterSpacing: '0.5px',
            boxShadow: `inset 0 1px 0 ${theme.colors.highlight}`,
          }}
        >
          {title}
        </h2>
      )}
      <div
        style={{
          padding: theme.spacing.large,
          background: theme.gradients.glass,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '4px',
          boxShadow: `inset 0 1px 3px ${theme.colors.shadow}`,
        }}
      >
        {children}
      </div>
    </section>
  );
}
