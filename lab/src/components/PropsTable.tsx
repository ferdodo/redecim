import { theme } from 'design-system';
import type { ReactElement } from 'react';

interface PropsTableProps {
  rows: { name: string; type: string; defaultValue?: string; description: string }[];
}

export function PropsTable({ rows }: PropsTableProps): ReactElement {
  const cellStyle = {
    padding: theme.spacing.medium,
    borderBottom: `1px solid ${theme.colors.border}`,
    textAlign: 'left' as const,
  };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: theme.fontSize }}>
      <thead>
        <tr style={{ color: theme.colors.textMuted, textShadow: `0 1px 0 ${theme.colors.highlight}` }}>
          <th style={cellStyle}>Prop</th>
          <th style={cellStyle}>Type</th>
          <th style={cellStyle}>Défaut</th>
          <th style={cellStyle}>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <td style={cellStyle}>
              <code>{row.name}</code>
            </td>
            <td style={cellStyle}>
              <code>{row.type}</code>
            </td>
            <td style={cellStyle}>
              <code>{row.defaultValue ?? '—'}</code>
            </td>
            <td style={cellStyle}>{row.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
