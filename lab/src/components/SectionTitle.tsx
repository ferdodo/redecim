import { theme } from 'design-system';
import type { ReactElement } from 'react';

interface SectionTitleProps {
  title: string;
}

export function SectionTitle({ title }: SectionTitleProps): ReactElement {
  return (
    <h2
      style={{
        margin: '16px 0 0',
        color: theme.colors.textLight,
        fontWeight: 300,
        fontSize: '24px',
        textShadow: `0 2px 6px ${theme.colors.shadow}`,
      }}
    >
      {title}
    </h2>
  );
}
