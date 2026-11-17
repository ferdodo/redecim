import { Button, Panel, Stack } from 'design-system';
import type { ReactElement } from 'react';
import { Example } from '../components/Example';
import { PropsTable } from '../components/PropsTable';

export function StackDocumentation(): ReactElement {
  const noop = (): void => {};

  return (
    <Panel title="Stack">
      <Stack gap="large">
        <p style={{ margin: 0 }}>Conteneur qui aligne ses enfants en ligne ou en colonne avec un espacement du thème.</p>
        <PropsTable
          rows={[
            {
              name: 'direction',
              type: "'row' | 'column'",
              defaultValue: "'column'",
              description: "Sens d'alignement",
            },
            {
              name: 'gap',
              type: "'small' | 'medium' | 'large'",
              defaultValue: "'medium'",
              description: 'Espacement entre les enfants',
            },
            { name: 'children', type: 'ReactNode', description: 'Contenu' },
          ]}
        />
        <Example
          title="Ligne"
          code={`<Stack direction="row">
  <Button label="Lancer" onClick={start} />
  <Button label="Annuler" variant="secondary" onClick={cancel} />
</Stack>`}
        >
          <Stack direction="row">
            <Button label="Lancer" onClick={noop} />
            <Button label="Annuler" variant="secondary" onClick={noop} />
          </Stack>
        </Example>
        <Example
          title="Colonne"
          code={`<Stack gap="small">
  <Button label="Lancer" onClick={start} />
  <Button label="Annuler" variant="secondary" onClick={cancel} />
</Stack>`}
        >
          <Stack gap="small">
            <Button label="Lancer" onClick={noop} />
            <Button label="Annuler" variant="secondary" onClick={noop} />
          </Stack>
        </Example>
      </Stack>
    </Panel>
  );
}
