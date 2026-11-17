import type { ReactElement } from 'react';
import { theme } from '../theme';

export function Divider(): ReactElement {
  return (
    <div
      style={{
        height: '1px',
        background: `linear-gradient(90deg, transparent 0%, ${theme.colors.border} 50%, transparent 100%)`,
        alignSelf: 'stretch',
      }}
    />
  );
}
