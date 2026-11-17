import { ActionButton, Panel, Stack } from 'design-system';
import type { ReactElement } from 'react';
import { Example } from '../components/Example';
import { PropsTable } from '../components/PropsTable';

export function ActionButtonDocumentation(): ReactElement {
  return (
    <Panel title="ActionButton">
      <Stack gap="large">
        <p style={{ margin: 0 }}>Petit bouton d'action compact pour les opérations contextuelles.</p>
        <PropsTable
          rows={[
            { name: 'label', type: 'string', description: 'Texte du bouton' },
            { name: 'onClick', type: '() => void', description: 'Action déclenchée au clic' },
            {
              name: 'variant',
              type: "'primary' | 'danger' | 'secondary'",
              defaultValue: "'primary'",
              description: 'Style du bouton',
            },
            { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Bloque le clic' },
            { name: 'icon', type: 'string', defaultValue: 'undefined', description: 'Icône ou symbole avant le label' },
          ]}
        />
        <Example
          title="Variantes"
          code={`<ActionButton label="✓ Confirmer" onClick={confirm} />
<ActionButton label="✕ Supprimer" variant="danger" onClick={remove} />
<ActionButton label="Annuler" variant="secondary" onClick={cancel} />`}
        >
          <Stack direction="row" gap="medium">
            <ActionButton label="✓ Confirmer" onClick={(): void => {}} />
            <ActionButton label="✕ Supprimer" variant="danger" onClick={(): void => {}} />
            <ActionButton label="Annuler" variant="secondary" onClick={(): void => {}} />
          </Stack>
        </Example>
        <Example title="Avec icônes" code={`<ActionButton icon="✓" label="Confirmer" onClick={confirm} />`}>
          <Stack direction="row" gap="medium">
            <ActionButton icon="✓" label="Confirmer" onClick={(): void => {}} />
            <ActionButton icon="✕" label="Supprimer" variant="danger" onClick={(): void => {}} />
            <ActionButton icon="↶" label="Récupérer" variant="secondary" onClick={(): void => {}} />
          </Stack>
        </Example>
        <Example title="États" code={`<ActionButton label="Normal" onClick={action} />
<ActionButton label="Désactivé" disabled onClick={action} />`}>
          <Stack direction="row" gap="medium">
            <ActionButton label="Normal" onClick={(): void => {}} />
            <ActionButton label="Désactivé" disabled onClick={(): void => {}} />
          </Stack>
        </Example>
      </Stack>
    </Panel>
  );
}
