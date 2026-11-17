import { Panel, Stack } from 'design-system';
import type { ReactElement } from 'react';
import { Example } from '../components/Example';
import { PropsTable } from '../components/PropsTable';

export function PanelDocumentation(): ReactElement {
  return (
    <Panel title="Panel">
      <Stack gap="large">
        <p style={{ margin: 0 }}>Conteneur qui regroupe un ensemble cohérent, avec un titre optionnel.</p>
        <PropsTable
          rows={[
            { name: 'title', type: 'string', description: 'Titre affiché en haut' },
            { name: 'children', type: 'ReactNode', description: 'Contenu' },
          ]}
        />
        <Example title="Avec titre" code={`<Panel title="Batch">...</Panel>`}>
          <Panel title="Batch">3 médias en attente</Panel>
        </Example>
        <Example title="Sans titre" code={`<Panel>...</Panel>`}>
          <Panel>3 médias en attente</Panel>
        </Example>
      </Stack>
    </Panel>
  );
}
