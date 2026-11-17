import type { ReactElement } from 'react';
import { Button } from '../components/Button';
import { EngravedTitle } from '../components/EngravedTitle';
import { InsetFrame } from '../components/InsetFrame';
import { InsetLabel } from '../components/InsetLabel';
import { LedIndicator } from '../components/LedIndicator';
import { Slider } from '../components/Slider';
import { Stack } from '../components/Stack';

interface BatchControlsProps {
  status: 'IDLE' | 'PROCESSING';
  targetMaxBitsPerPixel: number;
  onTargetMaxBitsPerPixelChange: (targetMaxBitsPerPixel: number) => void;
  onStart: () => void;
  summary: string;
  canStart: boolean;
}

export function BatchControls({
  status,
  targetMaxBitsPerPixel,
  onTargetMaxBitsPerPixelChange,
  onStart,
  summary,
  canStart,
}: BatchControlsProps): ReactElement {
  const leds = {
    IDLE: { status: 'off' as const, label: 'Idle' },
    PROCESSING: { status: 'warning' as const, label: 'Compressing' },
  };
  const isIdle = status === 'IDLE';

  return (
    <InsetFrame>
      <Stack gap="large">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <EngravedTitle>Compress files</EngravedTitle>
          <div title={leds[status].label}>
            <LedIndicator status={leds[status].status} />
          </div>
        </div>
        <Stack direction="row" gap="medium">
          <Slider
            label="File size"
            value={targetMaxBitsPerPixel}
            onChange={onTargetMaxBitsPerPixelChange}
            min={0.01}
            max={1}
            step={0.01}
            disabled={!isIdle || !canStart}
          />
          <div style={{ marginTop: '1.3rem' }}>
            <Button label="Compress" onClick={onStart} disabled={!isIdle || !canStart} />
          </div>
        </Stack>
        <InsetLabel>{summary}</InsetLabel>
      </Stack>
    </InsetFrame>
  );
}
