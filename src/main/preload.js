const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ping');
    },
    on(channel, func) {
      const validChannels = ['open-collection', 'add-images'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    removeListener(channel) {
      ipcRenderer.removeAllListeners(channel);
    },
    removeAllListeners(channel) {
      ipcRenderer.removeAllListeners(channel);
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
    invoke(channel, data) {
      const validChannels = [
        'browse-and-open-collection',
        'browse-and-create-collection',
        'write-collection-to-project-file',
        'browse-and-add-images',
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.invoke(channel, data);
      } else {
        console.error('unknown channel invoked');
      }
    },
  },
});
