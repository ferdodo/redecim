import { BatchWindow, Panel, Stack } from 'design-system';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { PropsTable } from '../components/PropsTable';

export function BatchWindowDocumentation(): ReactElement {
  const [path, setPath] = useState('');

  const mockMediaItems = [
    {
      fileName: 'sample.mp4',
      originalImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%238fd88a" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="white" font-size="10"%3Evideo%3C/text%3E%3C/svg%3E',
      originalSizeInBytes: 5242880,
      state: 'idle' as const,
      inBatch: false,
      onToggleBatch: (): void => {},
      isVideo: true,
    },
  ];

  return (
    <Panel title="BatchWindow">
      <Stack gap="large">
        <p style={{ margin: 0 }}>
          Interface complète de traitement par batch : fenêtre avec contrôles + scanner + galerie de média.
        </p>
        <PropsTable
          rows={[
            { name: 'title', type: 'string', defaultValue: "'Batch Processor'", description: 'Titre de la fenêtre' },
            { name: 'path', type: 'string', description: 'Chemin du dossier courant' },
            { name: 'onPathChange', type: '(path: string) => void', description: 'Callback de changement de path' },
            { name: 'mediaItems', type: 'MediaItemData[]', description: 'Liste des médias à afficher' },
            { name: 'isScanning', type: 'boolean', defaultValue: 'false', description: 'État de scan en cours' },
            { name: 'status', type: "'IDLE' | 'PROCESSING'", description: 'État du batch' },
            { name: 'targetMaxBitsPerPixel', type: 'number', description: 'Valeur cible du slider' },
            { name: 'onTargetMaxBitsPerPixelChange', type: '(value: number) => void', description: 'Callback du slider' },
            { name: 'onStart', type: '() => void', description: 'Action au clic Compress' },
            { name: 'onScan', type: '() => void', description: 'Action du scan de répertoire' },
            { name: 'onClose', type: '() => void', defaultValue: 'undefined', description: 'Action de fermeture' },
            { name: 'summary', type: 'string', description: 'Résumé de la barre de progression' },
          ]}
        />
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600 }}>Aperçu:</h4>
          <BatchWindow
            path={path}
            onPathChange={setPath}
            mediaItems={mockMediaItems}
            status="IDLE"
            targetMaxBitsPerPixel={12}
            onTargetMaxBitsPerPixelChange={(): void => {}}
            onStart={(): void => {}}
            onScan={(): void => {}}
            onClose={(): void => {}}
            summary="[==========          ] 50% (1/2)"
          />
        </div>
      </Stack>
    </Panel>
  );
}
