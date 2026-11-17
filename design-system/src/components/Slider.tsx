import { type KeyboardEvent, type PointerEvent, type ReactElement, useEffect, useRef, useState } from 'react';
import { theme } from '../theme';

const TOOLTIP_HIDE_DELAY_MS = 900;

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  disabled?: boolean;
}

export function Slider({ value, onChange, min, max, step = 1, label, disabled = false }: SliderProps): ReactElement {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [recentlyChanged, setRecentlyChanged] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const ratio = (value - min) / (max - min);
  const showTooltip = !disabled && (dragging || recentlyChanged);

  useEffect(() => (): void => clearTimeout(hideTimer.current), []);

  const change = (rawValue: number): void => {
    const steppedValue = Math.round((rawValue - min) / step) * step + min;
    const clampedValue = Math.min(max, Math.max(min, Number(steppedValue.toFixed(10))));
    if (clampedValue !== value) {
      onChange(clampedValue);
      setRecentlyChanged(true);
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setRecentlyChanged(false), TOOLTIP_HIDE_DELAY_MS);
    }
  };

  const changeFromPointer = (clientX: number): void => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const rect = track.getBoundingClientRect();
    change(min + ((clientX - rect.left) / rect.width) * (max - min));
  };

  const keySteps: Record<string, number> = {
    ArrowRight: step,
    ArrowUp: step,
    ArrowLeft: -step,
    ArrowDown: -step,
    PageUp: step * 10,
    PageDown: -step * 10,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.medium,
        fontFamily: theme.fontFamily,
        fontSize: theme.fontSize,
        opacity: disabled ? 0.5 : 1,
        flex: 1,
      }}
    >
      {label && (
        <span style={{ color: theme.colors.textMuted, textShadow: `0 1px 0 ${theme.colors.highlight}`, fontWeight: 600 }}>
          {label}
        </span>
      )}
      <div style={{ display: 'flex', gap: theme.spacing.medium, alignItems: 'center' }}>
        <div
          ref={trackRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-disabled={disabled}
          onPointerDown={(event: PointerEvent<HTMLDivElement>): void => {
            if (disabled) {
              return;
            }
            event.currentTarget.setPointerCapture(event.pointerId);
            setDragging(true);
            changeFromPointer(event.clientX);
          }}
          onPointerMove={(event: PointerEvent<HTMLDivElement>): void => {
            if (dragging) {
              changeFromPointer(event.clientX);
            }
          }}
          onPointerUp={(): void => setDragging(false)}
          onPointerCancel={(): void => setDragging(false)}
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>): void => {
            if (disabled) {
              return;
            }
            if (event.key === 'Home') {
              event.preventDefault();
              change(min);
            } else if (event.key === 'End') {
              event.preventDefault();
              change(max);
            } else if (keySteps[event.key] !== undefined) {
              event.preventDefault();
              change(value + keySteps[event.key]);
            }
          }}
          style={{
            flex: 1,
            position: 'relative',
            height: '22px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            touchAction: 'none',
            outline: 'none',
            userSelect: 'none',
          }}
        >
        <div
          style={{
            position: 'absolute',
            top: '7px',
            left: 0,
            right: 0,
            height: '8px',
            background: theme.gradients.lcd,
            border: `1px solid ${theme.colors.borderDark}`,
            borderRadius: '999px',
            boxShadow: `inset 0 2px 3px rgba(0, 0, 0, 0.8), 0 1px 0 ${theme.colors.highlight}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${ratio * 100}%`,
              height: '100%',
              background: theme.gradients.primary,
              boxShadow: '0 0 8px rgba(76, 188, 242, 0.9)',
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: `calc(${ratio * 100}% - 7px)`,
            width: '14px',
            height: '22px',
            background: `linear-gradient(180deg, transparent 7px, ${theme.colors.border} 7px 8px, ${theme.colors.highlight} 8px 9px, transparent 9px 11px, ${theme.colors.border} 11px 12px, ${theme.colors.highlight} 12px 13px, transparent 13px), ${theme.gradients.metal}`,
            border: `1px solid ${theme.colors.borderDark}`,
            borderRadius: '4px',
            boxShadow: dragging
              ? `inset 0 1px 0 ${theme.colors.highlight}, 0 0 8px rgba(76, 188, 242, 0.9)`
              : `inset 0 1px 0 ${theme.colors.highlight}, 0 2px 4px ${theme.colors.shadow}`,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 6px)',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: `2px ${theme.spacing.medium}`,
              whiteSpace: 'nowrap',
              background: theme.gradients.lcd,
              border: `1px solid ${theme.colors.borderDark}`,
              borderRadius: '4px',
              color: theme.colors.lcdText,
              textShadow: `0 0 6px ${theme.colors.lcdGlow}`,
              fontFamily: theme.lcdFontFamily,
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.8)',
              pointerEvents: 'none',
              userSelect: 'none',
              opacity: showTooltip ? 1 : 0,
              transition: 'opacity 150ms ease-out',
            }}
          >
            {value}
          </span>
        </div>
      </div>
      </div>
    </div>
  );
}
