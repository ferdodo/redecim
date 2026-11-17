import { Divider, Panel, Stack } from 'design-system';
import type { ReactElement } from 'react';
import { Example } from '../components/Example';

export function DividerDocumentation(): ReactElement {
  return (
    <Panel title="Divider">
      <Stack gap="large">
        <p style={{ margin: 0 }}>Séparateur horizontal pour délimiter les sections.</p>
        <Example
          title="Divider"
          code={`<Stack gap="medium">
  <p>Section 1</p>
  <Divider />
  <p>Section 2</p>
</Stack>`}
        >
          <Stack gap="medium">
            <p style={{ margin: 0, fontSize: '13px' }}>Section 1</p>
            <Divider />
            <p style={{ margin: 0, fontSize: '13px' }}>Section 2</p>
          </Stack>
        </Example>
      </Stack>
    </Panel>
  );
}
