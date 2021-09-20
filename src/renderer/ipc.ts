const electron = (window as any).electron as any;

export function on(channel: string, callback: unknown) {
  electron.ipcRenderer.on(channel, callback);
}

export function once(channel: string, callback: unknown) {
  electron.ipcRenderer.once(channel, callback);
}

export function removeAllListeners(channel: string) {
  electron.ipcRenderer.removeAllListeners(channel);
}

export function removeListener(channel: string, callback: unknown) {
  electron.ipcRenderer.removeListener(channel, callback);
}

export function invoke(channel: string, data?: unknown) {
  return electron.ipcRenderer.invoke(channel, data);
}
