import type { ReactElement } from 'react';
import { theme } from '../theme';

interface LedIndicatorProps {
  status: 'off' | 'on' | 'warning' | 'error';
  label?: string;
}

export function LedIndicator({ status, label }: LedIndicatorProps): ReactElement {
  const led = theme.leds[status];

  return (
    <>
      <style>{`
        @keyframes led-pulse {
          0%, 100% {
            filter: brightness(1);
            opacity: 1;
            box-shadow: inset 0 -1px 2px rgba(0, 0, 0, 0.5), 0 0 8px 2px ${led.glow};
          }
          50% {
            filter: brightness(0.7);
            opacity: 0.7;
            box-shadow: inset 0 -1px 2px rgba(0, 0, 0, 0.5), 0 0 4px 1px ${led.glow};
          }
        }
      `}</style>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: theme.spacing.medium,
          color: theme.colors.text,
          textShadow: `0 1px 0 ${theme.colors.highlight}`,
          fontFamily: theme.fontFamily,
          fontSize: theme.fontSize,
          fontWeight: 600,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            padding: '2px',
            borderRadius: '50%',
            background: theme.gradients.metal,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: `0 1px 2px ${theme.colors.shadow}`,
          }}
        >
          <span
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: `radial-gradient(circle at 35% 30%, ${led.light} 0%, ${led.base} 40%, ${led.dark} 100%)`,
              boxShadow: `inset 0 -1px 2px rgba(0, 0, 0, 0.5), 0 0 8px 2px ${led.glow}`,
              animation: status === 'warning' ? 'led-pulse 1.5s ease-in-out infinite' : 'none',
            }}
          />
        </span>
        {label}
      </span>
    </>
  );
}
