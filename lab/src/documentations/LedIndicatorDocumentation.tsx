import { LedIndicator, Panel, Stack } from 'design-system';
import type { ReactElement } from 'react';
import { Example } from '../components/Example';
import { PropsTable } from '../components/PropsTable';

export function LedIndicatorDocumentation(): ReactElement {
  return (
    <Panel title="LedIndicator">
      <Stack gap="large">
        <p style={{ margin: 0 }}>Affiche un état d'un coup d'œil, par exemple celui d'un process ou du batch.</p>
        <PropsTable
          rows={[
            { name: 'status', type: "'off' | 'on' | 'warning' | 'error'", description: 'État affiché' },
            { name: 'label', type: 'string', description: 'Texte à droite de la LED' },
          ]}
        />
        <Example
          title="États"
          code={`<LedIndicator status="off" label="Inactif" />
<LedIndicator status="on" label="En cours" />
<LedIndicator status="warning" label="Attention" />
<LedIndicator status="error" label="Erreur" />`}
        >
          <Stack direction="row" gap="large">
            <LedIndicator status="off" label="Inactif" />
            <LedIndicator status="on" label="En cours" />
            <LedIndicator status="warning" label="Attention" />
            <LedIndicator status="error" label="Erreur" />
          </Stack>
        </Example>
        <Example title="Sans libellé" code={`<LedIndicator status="on" />`}>
          <LedIndicator status="on" />
        </Example>
      </Stack>
    </Panel>
  );
}
