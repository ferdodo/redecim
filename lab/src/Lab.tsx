import { Stack, theme } from 'design-system';
import type { ReactElement } from 'react';
import { SectionTitle } from './components/SectionTitle';
import { ActionButtonDocumentation } from './documentations/ActionButtonDocumentation';
import { BatchControlsDocumentation } from './documentations/BatchControlsDocumentation';
import { BatchWindowDocumentation } from './documentations/BatchWindowDocumentation';
import { ButtonDocumentation } from './documentations/ButtonDocumentation';
import { DividerDocumentation } from './documentations/DividerDocumentation';
import { EngravedTitleDocumentation } from './documentations/EngravedTitleDocumentation';
import { InputDocumentation } from './documentations/InputDocumentation';
import { InsetLabelDocumentation } from './documentations/InsetLabelDocumentation';
import { LedIndicatorDocumentation } from './documentations/LedIndicatorDocumentation';
import { MediaBatchGalleryDocumentation } from './documentations/MediaBatchGalleryDocumentation';
import { MediaItemDocumentation } from './documentations/MediaItemDocumentation';
import { MediaLibraryScannerDocumentation } from './documentations/MediaLibraryScannerDocumentation';
import { PanelDocumentation } from './documentations/PanelDocumentation';
import { SliderDocumentation } from './documentations/SliderDocumentation';
import { StackDocumentation } from './documentations/StackDocumentation';
import { WindowDocumentation } from './documentations/WindowDocumentation';

export function Lab(): ReactElement {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: theme.gradients.sky,
        backgroundAttachment: 'fixed',
        color: theme.colors.text,
        fontFamily: theme.fontFamily,
        padding: '32px',
        boxSizing: 'border-box',
      }}
    >
      <h1
        style={{
          marginTop: 0,
          color: theme.colors.textLight,
          fontWeight: 300,
          fontSize: '36px',
          textShadow: `0 2px 6px ${theme.colors.shadow}`,
        }}
      >
        Redecim Lab
      </h1>
      <Stack gap="large">
        <SectionTitle title="Briques" />
        <ActionButtonDocumentation />
        <ButtonDocumentation />
        <DividerDocumentation />
        <EngravedTitleDocumentation />
        <InputDocumentation />
        <InsetLabelDocumentation />
        <LedIndicatorDocumentation />
        <MediaItemDocumentation />
        <PanelDocumentation />
        <SliderDocumentation />
        <StackDocumentation />
        <WindowDocumentation />
        <SectionTitle title="Compositions" />
        <BatchWindowDocumentation />
        <BatchControlsDocumentation />
        <MediaBatchGalleryDocumentation />
        <MediaLibraryScannerDocumentation />
      </Stack>
    </main>
  );
}
