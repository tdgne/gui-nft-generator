import { ipcMain, dialog, app } from 'electron';
import fs from 'fs';
import path from 'path';
import asar from 'asar';
import os from 'os';
import Collection from '../types/Collection';

const METADATA_FILENAME = 'metadata.json';

const COLLECTION_FILTER = { name: 'Project File (*.gng)', extensions: ['gng'] };

const tmpdirPaths: string[] = [];

app.on('quit', () => {
  tmpdirPaths.forEach((p) => {
    fs.rmSync(p, { recursive: true, force: true });
  });
});

async function browseToCreateCollection(): Promise<Electron.SaveDialogReturnValue> {
  const options: Electron.SaveDialogOptions = {
    defaultPath: '*.gng',
    filters: [COLLECTION_FILTER],
  };
  return dialog.showSaveDialog(options);
}

async function browseToOpenCollection(): Promise<Electron.OpenDialogReturnValue> {
  const options: Electron.OpenDialogOptions = {
    properties: ['openFile'],
    filters: [COLLECTION_FILTER],
  };
  return dialog.showOpenDialog(options);
}

async function browseImages(): Promise<Electron.OpenDialogReturnValue> {
  const options: Electron.OpenDialogOptions = {
    properties: ['openFile', 'multiSelections'],
    filters: [{ extensions: ['png', 'jpg', 'jpeg'], name: 'Images' }],
  };
  return dialog.showOpenDialog(options);
}

function writeCollectionMetadata(collection: Collection) {
  if (!collection.tmpdirPath) {
    throw new Error('path is not set');
  }
  const metadataPath = path.join(collection.tmpdirPath, METADATA_FILENAME);
  fs.writeFileSync(metadataPath, collection.serialize());
}

async function expandCollectionProjectFileTo(archive: string, dest: string) {
  await asar.extractAll(archive, dest);
}

function makeTmpDir(): string {
  const p = fs.mkdtempSync(path.join(os.tmpdir(), 'gng-'));
  tmpdirPaths.push(p);
  return p;
}

ipcMain.handle('browse-and-open-collection', async (event) => {
  const { canceled, filePaths } = await browseToOpenCollection();
  if (canceled) return;
  const firstPath = filePaths[0];
  const tmpdirPath = makeTmpDir();
  expandCollectionProjectFileTo(firstPath, tmpdirPath);
  const metadataPath = path.join(tmpdirPath, METADATA_FILENAME);
  event.sender.send(
    'open-collection',
    Collection.deserialize(fs.readFileSync(metadataPath).toString()).copyWith({
      path: firstPath,
      tmpdirPath,
    })
  );
});

async function saveCollectionToProjectFile(collection: Collection) {
  if (!collection.path) {
    throw new Error('path is undefined');
  }
  if (!collection.tmpdirPath) {
    throw new Error('tmpdirPath is undefined');
  }
  writeCollectionMetadata(collection);
  await asar.createPackage(collection.tmpdirPath, collection.path);
}

ipcMain.handle('browse-and-create-collection', async (event) => {
  const { canceled, filePath } = await browseToCreateCollection();
  if (canceled || !filePath) return;
  const tmpdirPath = makeTmpDir();
  const name = path.basename(filePath);
  const collection = new Collection(name, filePath, tmpdirPath);
  saveCollectionToProjectFile(collection);
  event.sender.send('open-collection', collection);
});

ipcMain.handle(
  'browse-and-add-images',
  async (event, { copyDestDir, layerId }) => {
    const browseResult = await browseImages();
    if (browseResult.canceled) {
      return;
    }
    if (!fs.existsSync(copyDestDir)) {
      fs.mkdirSync(copyDestDir, { recursive: true });
    }
    browseResult.filePaths.forEach((p) => {
      fs.copyFileSync(p, path.join(copyDestDir, path.parse(p).base));
    });
    const ids = browseResult.filePaths.map((p) => path.parse(p).base);
    event.sender.send('add-images', ids, layerId);
  }
);

ipcMain.handle(
  'write-collection-to-project-file',
  async (event, collectionObject) => {
    const collection = Collection.fromObject(collectionObject);
    saveCollectionToProjectFile(collection);
    event.sender.send('wrote-collection-to-project-file', collection);
  }
);
