import { EngravedTitle, Panel, Stack } from 'design-system';
import type { ReactElement } from 'react';
import { Example } from '../components/Example';
import { PropsTable } from '../components/PropsTable';

export function EngravedTitleDocumentation(): ReactElement {
  return (
    <Panel title="EngravedTitle">
      <Stack gap="large">
        <p style={{ margin: 0 }}>Titre avec effet gravé au laser, pour un aspect incrustré dans la matière.</p>
        <PropsTable
          rows={[
            { name: 'children', type: 'ReactNode', description: 'Contenu du titre' },
          ]}
        />
        <Example
          title="Basique"
          code={`<EngravedTitle>Batch</EngravedTitle>`}
        >
          <EngravedTitle>Batch</EngravedTitle>
        </Example>
        <Example
          title="Autres textes"
          code={`<Stack gap="medium">
  <EngravedTitle>Configuration</EngravedTitle>
  <EngravedTitle>Paramètres avancés</EngravedTitle>
</Stack>`}
        >
          <Stack gap="medium">
            <EngravedTitle>Configuration</EngravedTitle>
            <EngravedTitle>Paramètres avancés</EngravedTitle>
          </Stack>
        </Example>
      </Stack>
    </Panel>
  );
}
