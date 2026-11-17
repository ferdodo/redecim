import { InsetFrame, Stack, theme } from 'design-system';
import type { ReactElement, ReactNode } from 'react';

interface ExampleProps {
  title: string;
  code: string;
  children: ReactNode;
}

export function Example({ title, code, children }: ExampleProps): ReactElement {
  return (
    <Stack gap="small">
      <h3
        style={{
          margin: 0,
          fontSize: theme.fontSize,
          color: theme.colors.textMuted,
          textShadow: `0 1px 0 ${theme.colors.highlight}`,
        }}
      >
        {title}
      </h3>
      <InsetFrame>
        {children}
      </InsetFrame>
      <pre
        style={{
          margin: 0,
          padding: theme.spacing.medium,
          background: theme.gradients.lcd,
          border: `1px solid ${theme.colors.borderDark}`,
          borderRadius: '4px',
          color: theme.colors.lcdText,
          textShadow: `0 0 6px ${theme.colors.lcdGlow}`,
          fontFamily: theme.lcdFontFamily,
          fontSize: '12px',
          overflowX: 'auto',
          boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.8)',
        }}
      >
        {code}
      </pre>
    </Stack>
  );
}
