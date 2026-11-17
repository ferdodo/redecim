import { type ReactElement, useState } from 'react';
import { theme } from '../theme';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps): ReactElement {
  const [pressed, setPressed] = useState(false);
  const isPressed = pressed && !disabled;
  const isLight = variant === 'secondary';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseDown={(): void => setPressed(true)}
      onMouseUp={(): void => setPressed(false)}
      onMouseLeave={(): void => setPressed(false)}
      style={{
        background: theme.gradients[variant],
        color: isLight ? theme.colors.text : theme.colors.textLight,
        textShadow: isLight ? `0 1px 0 ${theme.colors.highlight}` : `0 -1px 0 ${theme.colors.shadow}`,
        border: `1px solid ${theme.colors.borderDark}`,
        borderRadius: '999px',
        padding: `${theme.spacing.medium} 20px`,
        fontFamily: theme.fontFamily,
        fontSize: theme.fontSize,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        filter: disabled ? 'grayscale(1) opacity(0.55)' : 'none',
        transform: isPressed ? 'translateY(1px)' : 'none',
        boxShadow: isPressed
          ? `inset 0 2px 4px ${theme.colors.shadow}, 0 0 0 transparent`
          : `inset 0 1px 0 ${theme.colors.highlight}, 0 2px 4px ${theme.colors.shadow}`,
      }}
    >
      {label}
    </button>
  );
}
