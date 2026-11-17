import { Button, Panel, Stack } from 'design-system';
import { type ReactElement, useState } from 'react';
import { Example } from '../components/Example';
import { PropsTable } from '../components/PropsTable';

export function ButtonDocumentation(): ReactElement {
  const [clickCount, setClickCount] = useState(0);

  return (
    <Panel title="Button">
      <Stack gap="large">
        <p style={{ margin: 0 }}>Déclenche une action. Une seule action primaire par zone.</p>
        <PropsTable
          rows={[
            { name: 'label', type: 'string', description: 'Texte du bouton' },
            { name: 'onClick', type: '() => void', description: 'Action déclenchée au clic' },
            {
              name: 'variant',
              type: "'primary' | 'secondary' | 'danger'",
              defaultValue: "'primary'",
              description: 'Importance visuelle',
            },
            { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Bloque le clic' },
          ]}
        />
        <Example
          title="Variantes"
          code={`<Button label="Lancer" onClick={start} />
<Button label="Annuler" variant="secondary" onClick={cancel} />
<Button label="Supprimer" variant="danger" onClick={remove} />`}
        >
          <Stack direction="row">
            <Button label="Lancer" onClick={(): void => setClickCount(clickCount + 1)} />
            <Button label="Annuler" variant="secondary" onClick={(): void => setClickCount(clickCount + 1)} />
            <Button label="Supprimer" variant="danger" onClick={(): void => setClickCount(clickCount + 1)} />
            <span>Clics : {clickCount}</span>
          </Stack>
        </Example>
        <Example title="Désactivé" code={`<Button label="Lancer" onClick={start} disabled />`}>
          <Button label="Lancer" onClick={(): void => setClickCount(clickCount + 1)} disabled />
        </Example>
      </Stack>
    </Panel>
  );
}
