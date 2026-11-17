import { OrchestrateProcesses, RecoverCandidate, SyncProcesses } from 'features';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { BrowserWindowContext } from './contexts/BrowserWindowContext';
import { createBrowserWindowContext } from './createBrowserWindowContext';
import { getBridge } from './getBridge';

const context = createBrowserWindowContext(getBridge());
Object.assign(window, { context });

new OrchestrateProcesses(context).register();
new SyncProcesses(context).register();
new RecoverCandidate(context).register();

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <BrowserWindowContext value={context}>
      <App />
    </BrowserWindowContext>,
  );
}
