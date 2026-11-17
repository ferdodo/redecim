import { BatchControls, Button, Panel, Stack } from 'design-system';
import { type ReactElement, useState } from 'react';
import { Example } from '../components/Example';
import { PropsTable } from '../components/PropsTable';

export function BatchControlsDocumentation(): ReactElement {
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING'>('IDLE');
  const [targetMaxBitsPerPixel, setTargetMaxBitsPerPixel] = useState(8);
  const noop = (): void => {};

  return (
    <Panel title="BatchControls">
      <Stack gap="large">
        <p style={{ margin: 0 }}>
          Configure et lance le batch. La configuration et le lancement sont bloqués dès que le batch n'est plus en
          attente.
        </p>
        <PropsTable
          rows={[
            { name: 'status', type: "'IDLE' | 'PROCESSING'", description: 'État du batch' },
            { name: 'targetMaxBitsPerPixel', type: 'number', description: 'Bits par pixel maximum visés' },
            {
              name: 'onTargetMaxBitsPerPixelChange',
              type: '(targetMaxBitsPerPixel: number) => void',
              description: 'Reçoit la nouvelle cible',
            },
            { name: 'onStart', type: '() => void', description: 'Lance le batch' },
            { name: 'summary', type: 'string', description: 'Résumé de la barre de progression' },
            { name: 'canStart', type: 'boolean', description: 'Enables the Compress button when media is selected' },
          ]}
        />
        <Example
          title="Interactif"
          code={`<BatchControls
  status={batch.status}
  targetMaxBitsPerPixel={batch.targetMaxBitsPerPixel}
  onTargetMaxBitsPerPixelChange={configureBatch}
  onStart={startBatch}
  summary="[==========          ] 50% (2/4) processing: 1"
  canStart
/>`}
        >
          <Stack gap="large">
            <BatchControls
              status={status}
              targetMaxBitsPerPixel={targetMaxBitsPerPixel}
              onTargetMaxBitsPerPixelChange={setTargetMaxBitsPerPixel}
              onStart={(): void => setStatus('PROCESSING')}
              summary="[==========          ] 50% (2/4) processing: 1"
              canStart
            />
            <Stack direction="row">
              <Button label="Réinitialiser" variant="secondary" onClick={(): void => setStatus('IDLE')} />
            </Stack>
          </Stack>
        </Example>
        <Example title="En cours" code={`<BatchControls status="PROCESSING" ... summary="[====================] 100% (4/4)" />`}>
          <BatchControls
            status="PROCESSING"
            targetMaxBitsPerPixel={8}
            onTargetMaxBitsPerPixelChange={noop}
            onStart={noop}
            summary="[====================] 100% (4/4)"
            canStart
          />
        </Example>
      </Stack>
    </Panel>
  );
}
