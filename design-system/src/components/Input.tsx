import type { ChangeEvent, ReactElement } from 'react';
import { theme } from '../theme';

interface InputProps {
  value: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'number';
  disabled?: boolean;
  readOnly?: boolean;
  onClick?: () => void;
}

export function Input({
  value,
  onChange,
  label,
  placeholder,
  type = 'text',
  disabled = false,
  readOnly = false,
  onClick,
}: InputProps): ReactElement {
  return (
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.small,
        color: theme.colors.textMuted,
        textShadow: `0 1px 0 ${theme.colors.highlight}`,
        fontFamily: theme.fontFamily,
        fontSize: theme.fontSize,
        fontWeight: 'normal',
      }}
    >
      {label}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        onChange={(event: ChangeEvent<HTMLInputElement>): void => onChange?.(event.target.value)}
        onClick={onClick}
        style={{
          background: theme.gradients.lcd,
          color: theme.colors.lcdText,
          textShadow: `0 0 6px ${theme.colors.lcdGlow}`,
          caretColor: theme.colors.lcdText,
          border: `1px solid ${theme.colors.borderDark}`,
          borderRadius: '4px',
          padding: theme.spacing.medium,
          fontFamily: theme.lcdFontFamily,
          fontSize: theme.fontSize,
          outline: 'none',
          boxShadow: `inset 0 2px 5px rgba(0, 0, 0, 0.8), 0 1px 0 ${theme.colors.highlight}`,
          opacity: disabled ? 0.5 : 1,
          cursor: readOnly && onClick ? 'pointer' : 'auto',
        }}
      />
    </label>
  );
}
