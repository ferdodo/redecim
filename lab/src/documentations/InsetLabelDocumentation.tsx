import { InsetLabel, Panel, Stack } from 'design-system';
import type { ReactElement } from 'react';
import { Example } from '../components/Example';
import { PropsTable } from '../components/PropsTable';

export function InsetLabelDocumentation(): ReactElement {
  return (
    <Panel title="InsetLabel">
      <Stack gap="large">
        <p style={{ margin: 0 }}>
          Texte stylisé avec effet inset (enfoncé), inspiré du style Winamp. Gris avec ombre pour créer
          une profondeur visuelle.
        </p>
        <PropsTable
          rows={[
            { name: 'children', type: 'ReactNode', description: 'Le texte à afficher' },
            {
              name: 'variant',
              type: "'label' | 'body' | 'title'",
              defaultValue: "'body'",
              description: 'Taille et poids de la police',
            },
          ]}
        />
        <Example
          title="Variants"
          code={`<Stack gap="medium">
  <InsetLabel variant="label">Label</InsetLabel>
  <InsetLabel variant="body">Body text</InsetLabel>
  <InsetLabel variant="title">Title</InsetLabel>
</Stack>`}
        >
          <Stack gap="medium">
            <InsetLabel variant="label">Label</InsetLabel>
            <InsetLabel variant="body">Body text</InsetLabel>
            <InsetLabel variant="title">Title</InsetLabel>
          </Stack>
        </Example>
        <Example
          title="Long text"
          code={`<InsetLabel variant="body">
  This is a longer text to show how the inset effect works with multiple lines of text.
</InsetLabel>`}
        >
          <InsetLabel variant="body">
            This is a longer text to show how the inset effect works with multiple lines of text.
          </InsetLabel>
        </Example>
        <Example
          title="Barre de progression"
          code={`<InsetLabel variant="body">
  [==========          ] 50% (2/4) processing: 1
</InsetLabel>`}
        >
          <InsetLabel variant="body">
            [==========          ] 50% (2/4) processing: 1
          </InsetLabel>
        </Example>
      </Stack>
    </Panel>
  );
}
