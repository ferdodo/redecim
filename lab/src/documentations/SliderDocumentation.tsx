import { Panel, Slider, Stack } from 'design-system';
import { type ReactElement, useState } from 'react';
import { Example } from '../components/Example';
import { PropsTable } from '../components/PropsTable';

export function SliderDocumentation(): ReactElement {
  const [bitsPerPixel, setBitsPerPixel] = useState(8);
  const [quality, setQuality] = useState(0.5);
  const noop = (): void => {};

  return (
    <Panel title="Slider">
      <Stack gap="large">
        <p style={{ margin: 0 }}>
          Choisit une valeur dans un intervalle, à la souris en glissant le curseur ou en cliquant sur la glissière, et
          au clavier avec les flèches, Page précédente / suivante, Début et Fin. La valeur s'affiche sur l'écran LCD.
        </p>
        <PropsTable
          rows={[
            { name: 'value', type: 'number', description: 'Valeur affichée' },
            { name: 'onChange', type: '(value: number) => void', description: 'Reçoit la nouvelle valeur, arrondie au pas' },
            { name: 'min', type: 'number', description: 'Valeur minimale' },
            { name: 'max', type: 'number', description: 'Valeur maximale' },
            { name: 'step', type: 'number', defaultValue: '1', description: 'Pas entre deux valeurs' },
            { name: 'label', type: 'string', description: 'Libellé à gauche de la valeur' },
            { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Bloque la sélection' },
          ]}
        />
        <Example
          title="Entier"
          code={`<Slider label="Bits par pixel cible" value={target} onChange={setTarget} min={1} max={24} />`}
        >
          <Slider label="Bits par pixel cible" value={bitsPerPixel} onChange={setBitsPerPixel} min={1} max={24} />
        </Example>
        <Example
          title="Pas décimal"
          code={`<Slider label="Qualité" value={quality} onChange={setQuality} min={0} max={1} step={0.05} />`}
        >
          <Slider label="Qualité" value={quality} onChange={setQuality} min={0} max={1} step={0.05} />
        </Example>
        <Example
          title="Désactivé"
          code={`<Slider label="Bits par pixel cible" value={target} onChange={setTarget} min={1} max={24} disabled />`}
        >
          <Slider label="Bits par pixel cible" value={8} onChange={noop} min={1} max={24} disabled />
        </Example>
      </Stack>
    </Panel>
  );
}
