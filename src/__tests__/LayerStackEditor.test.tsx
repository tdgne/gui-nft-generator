import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import path from 'path';
import LayerStackEditor from '../renderer/LayerStackEditor';
import { CollectionContextProvider } from '../renderer/CollectionEditorContext';
import testCollectionJson from './testCollection.json';
import Collection from '../types/Collection';

jest.mock('../renderer/ipc', () => {
  return {
    on() {},
    invoke() {},
    removeListener() {},
    removeAllListeners() {},
  };
});

describe('LayerStackEditor', () => {
  it('should render', () => {
    const initialState = {
      collection: Collection.fromObject(testCollectionJson).copyWith({
        tmpdirPath: path.join(__dirname, 'assets'),
      }),
    };
    expect(
      render(
        <CollectionContextProvider>
          <LayerStackEditor />
        </CollectionContextProvider>
      )
    ).toBeTruthy();
    expect(
      render(
        <CollectionContextProvider initialState={initialState}>
          <LayerStackEditor />
        </CollectionContextProvider>
      )
    ).toBeTruthy();
  });
});
