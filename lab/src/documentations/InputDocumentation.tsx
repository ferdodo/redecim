import { Input, Panel, Stack } from 'design-system';
import { type ReactElement, useState } from 'react';
import { Example } from '../components/Example';
import { PropsTable } from '../components/PropsTable';

export function InputDocumentation(): ReactElement {
  const [text, setText] = useState('');
  const [bitsPerPixel, setBitsPerPixel] = useState('8');

  return (
    <Panel title="Input">
      <Stack gap="large">
        <p style={{ margin: 0 }}>Champ de saisie contrôlé : la valeur vient toujours du parent.</p>
        <PropsTable
          rows={[
            { name: 'value', type: 'string', description: 'Valeur affichée' },
            { name: 'onChange', type: '(value: string) => void', description: 'Reçoit la nouvelle valeur' },
            { name: 'label', type: 'string', description: 'Libellé au-dessus du champ' },
            { name: 'placeholder', type: 'string', description: 'Texte affiché quand le champ est vide' },
            { name: 'type', type: "'text' | 'number'", defaultValue: "'text'", description: 'Type de saisie' },
            { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Bloque la saisie' },
          ]}
        />
        <Example
          title="Texte"
          code={`<Input label="Dossier" value={path} onChange={setPath} placeholder="/home/..." />`}
        >
          <Input label="Dossier" value={text} onChange={setText} placeholder="/home/..." />
        </Example>
        <Example
          title="Nombre"
          code={`<Input label="Bits par pixel cible" type="number" value={target} onChange={setTarget} />`}
        >
          <Input label="Bits par pixel cible" type="number" value={bitsPerPixel} onChange={setBitsPerPixel} />
        </Example>
        <Example title="Désactivé" code={`<Input label="Dossier" value={path} onChange={setPath} disabled />`}>
          <Input label="Dossier" value="/home/dev/photos" onChange={setText} disabled />
        </Example>
      </Stack>
    </Panel>
  );
}
