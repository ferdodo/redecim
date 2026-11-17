import { createRoot } from 'react-dom/client';
import { Lab } from './Lab';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(<Lab />);
}
