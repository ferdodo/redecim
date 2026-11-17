import { Panel, Stack, Window } from 'design-system';
import type { ReactElement } from 'react';
import { Example } from '../components/Example';
import { PropsTable } from '../components/PropsTable';

export function WindowDocumentation(): ReactElement {
  return (
    <Panel title="Window">
      <Stack gap="large">
        <p style={{ margin: 0 }}>Fenêtre complète avec barre de titre, boutons de contrôle (minimiser/fermer) et contenu.</p>
        <PropsTable
          rows={[
            { name: 'title', type: 'string', description: 'Titre de la fenêtre' },
            { name: 'children', type: 'ReactNode', description: 'Contenu de la fenêtre' },
            { name: 'onClose', type: '() => void', defaultValue: 'undefined', description: 'Action au clic sur le bouton fermer' },
          ]}
        />
        <Example
          title="Fenêtre simple"
          code={`<Window title="Ma Fenêtre">
  <p>Contenu de la fenêtre</p>
</Window>`}
        >
          <Window title="Ma Fenêtre" onClose={(): void => {}}>
            <p style={{ margin: 0, fontSize: '13px' }}>Contenu de la fenêtre avec possibilité de minimiser ou fermer.</p>
          </Window>
        </Example>
        <Example
          title="Fenêtre avec composition"
          code={`<Window title="Batch Processing">
  <MediaLibraryScanner />
</Window>`}
        >
          <Window title="Batch Processing" onClose={(): void => {}}>
            <p style={{ margin: 0, fontSize: '13px', marginBottom: '12px' }}>
              Permet de contenir les compositions comme MediaLibraryScanner ou MediaBatchGallery.
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#3f6375' }}>
              Utilisez les boutons de la barre de titre pour minimiser ou fermer la fenêtre.
            </p>
          </Window>
        </Example>
      </Stack>
    </Panel>
  );
}
