import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { theme } from '../theme';

interface WindowProps {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
}

export function Window({ title, children, onClose, onMinimize }: WindowProps): ReactElement {

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: theme.gradients.metal,
        border: `2px solid ${theme.colors.border}`,
        borderRadius: '6px',
        boxShadow: `0 8px 16px ${theme.colors.shadow}, inset 0 1px 0 ${theme.colors.highlight}`,
        overflow: 'hidden',
        minWidth: '300px',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${theme.spacing.small} ${theme.spacing.medium}`,
          background: theme.gradients.titleBar,
          borderBottom: `1px solid ${theme.colors.borderDark}`,
          minHeight: '28px',
          WebkitAppRegion: 'drag',
        } as CSSProperties}
      >
        <h3
          style={{
            margin: 0,
            color: theme.colors.textLight,
            fontSize: '13px',
            fontWeight: 'normal',
            fontFamily: theme.fontFamily,
            textShadow: `0 1px 0 ${theme.colors.shadow}`,
            flex: 1,
            userSelect: 'none',
          }}
        >
          {title}
        </h3>

        <div style={{ display: 'flex', gap: '2px', WebkitAppRegion: 'no-drag' } as CSSProperties} className="window-titlebar-buttons">
          <button
            type="button"
            onClick={onMinimize}
            style={{
              width: '20px',
              height: '20px',
              padding: 0,
              border: `1px solid ${theme.colors.borderDark}`,
              borderRadius: '3px',
              background: theme.gradients.secondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 700,
              color: theme.colors.text,
              textShadow: `0 1px 0 ${theme.colors.highlight}`,
            }}
          >
            _
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '20px',
              height: '20px',
              padding: 0,
              border: `1px solid ${theme.colors.borderDark}`,
              borderRadius: '3px',
              background: theme.gradients.danger,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 700,
              color: theme.colors.textLight,
              textShadow: `0 -1px 0 ${theme.colors.shadow}`,
            }}
          >
            ✕
          </button>
        </div>
      </div>

      <div
        style={{
          padding: theme.spacing.large,
          background: theme.gradients.glass,
          flex: 1,
          overflow: 'auto',
        }}
      >
        {children}
      </div>
    </div>
  );
}
