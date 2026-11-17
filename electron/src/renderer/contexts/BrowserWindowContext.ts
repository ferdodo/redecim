import type { BrowserWindowContext as BrowserWindowContextValue } from 'core';
import { createContext } from 'react';

export const BrowserWindowContext = createContext<BrowserWindowContextValue>({} as BrowserWindowContextValue);
