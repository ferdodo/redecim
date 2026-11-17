export const ipcChannels = {
  invoke: 'redecim:invoke',
  publish: 'redecim:publish',
  call: 'redecim:call',
  reply: 'redecim:reply',
  selectDirectory: 'redecim:select-directory',
  minimizeWindow: 'redecim:minimize-window',
} as const;
