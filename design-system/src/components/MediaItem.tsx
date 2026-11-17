import type { ReactElement } from 'react';
import { ActionButton } from './ActionButton';
import { theme } from '../theme';

interface MediaItemProps {
  fileName: string;
  originalImage: string;
  candidateImage?: string;
  originalSizeInBytes: number;
  candidateSizeInBytes?: number;
  state: 'idle' | 'processing' | 'completed' | 'error';
  progression?: number;
  inBatch: boolean;
  onToggleBatch: () => void;
  isVideo?: boolean;
  onApplyCandidate?: () => void;
  onRemoveCandidate?: () => void;
}

export function MediaItem({
  fileName,
  originalImage,
  candidateImage,
  originalSizeInBytes,
  candidateSizeInBytes,
  state,
  progression = 0,
  inBatch,
  onToggleBatch,
  isVideo = false,
  onApplyCandidate,
  onRemoveCandidate,
}: MediaItemProps): ReactElement {
  const formatBytes = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex += 1;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const getStateLabel = (): string => {
    switch (state) {
      case 'processing':
        return `Processing (${progression}%)`;
      case 'completed':
        return 'Compressed';
      case 'error':
        return 'Error';
      default:
        return 'To compress';
    }
  };

  const gainPercent = candidateSizeInBytes
    ? Math.round(((originalSizeInBytes - candidateSizeInBytes) / originalSizeInBytes) * 100)
    : 0;

  return (
    <div
      style={{
        padding: `${theme.spacing.medium} ${theme.spacing.large}`,
        background: theme.gradients.lcd,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px',
        boxShadow: `inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 0 ${theme.colors.highlight}`,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.large,
        minHeight: '180px',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4
          style={{
            margin: 0,
            marginBottom: '4px',
            color: theme.colors.lcdText,
            textShadow: `0 0 6px ${theme.colors.lcdGlow}`,
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: theme.lcdFontFamily,
          }}
        >
          {fileName}
        </h4>
        <div
          style={{
            color: theme.colors.lcdText,
            textShadow: `0 0 6px ${theme.colors.lcdGlow}`,
            fontSize: '12px',
            fontFamily: theme.lcdFontFamily,
          }}
        >
          {formatBytes(originalSizeInBytes)}
          {candidateSizeInBytes && ` → ${formatBytes(candidateSizeInBytes)} (gain ${gainPercent}%)`}
        </div>
        <div
          style={{
            color: theme.colors.lcdText,
            textShadow: `0 0 6px ${theme.colors.lcdGlow}`,
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: theme.lcdFontFamily,
            marginTop: '4px',
          }}
        >
          {getStateLabel()}
        </div>
      </div>

      <div
        style={{
          width: '200px',
          height: '150px',
          background: theme.colors.shadow,
          border: `1px solid ${theme.colors.borderDark}`,
          borderRadius: '4px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        {isVideo ? (
          <video
            src={originalImage}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
            title={`Original: ${fileName}`}
            aria-label={`Original video: ${fileName}`}
            controls
          >
            <track kind="captions" srcLang="en" label="English" />
          </video>
        ) : (
          <img
            src={originalImage}
            alt={`Original: ${fileName}`}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        )}
      </div>

      {candidateImage && (
        <div
          style={{
            width: '200px',
            height: '150px',
            background: theme.colors.shadow,
            border: `1px solid ${theme.colors.borderDark}`,
            borderRadius: '4px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {isVideo ? (
            <video
              src={candidateImage}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
              title={`Candidate: ${fileName}`}
              aria-label={`Compressed video: ${fileName}`}
              controls
            >
              <track kind="captions" srcLang="en" label="English" />
            </video>
          ) : (
            <img
              src={candidateImage}
              alt={`Compressed: ${fileName}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          )}
          {state === 'processing' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `rgba(0, 0, 0, 0.5)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: `2px solid ${theme.colors.borderDark}`,
                  borderTopColor: theme.colors.highlight,
                  animation: 'spin 1s linear infinite',
                }}
              />
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: theme.spacing.medium, alignItems: 'center', flexShrink: 0 }}>
        {candidateImage && (
          <div style={{ display: 'flex', gap: theme.spacing.small }}>
            {onApplyCandidate && <ActionButton icon="✓" label="Apply" onClick={onApplyCandidate} />}
            {onRemoveCandidate && (
              <ActionButton icon="✕" label="Cancel" variant="danger" onClick={onRemoveCandidate} />
            )}
          </div>
        )}

        <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.medium, cursor: 'pointer', userSelect: 'none' }}>
          <input
            type="checkbox"
            checked={inBatch}
            onChange={onToggleBatch}
            style={{
              width: '18px',
              height: '18px',
              cursor: 'pointer',
            }}
          />
        </label>
      </div>
    </div>
  );
}
