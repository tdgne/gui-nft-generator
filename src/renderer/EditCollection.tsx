import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import * as ipc from './ipc';
import Collection from '../types/Collection';
import LayerStackEditor from './LayerStackEditor';
import {
  CollectionContextProvider,
  useCollectionEditorDispatch,
  useCollectionEditorState,
} from './CollectionEditorContext';
import { CollectionState } from './CollectionReducer';

function Header() {
  const state = useCollectionEditorState();
  const dispatch = useCollectionEditorDispatch();

  return (
    <div>
      <div>
        <label htmlFor="name">
          Collection Name:&nbsp;
          <input
            id="name"
            type="text"
            placeholder="My Awesome Collection"
            value={state.collection?.name ?? ''}
            onChange={(e) =>
              dispatch({ type: 'set-collection-name', name: e.target.value })
            }
          />
        </label>
      </div>
      <div>Folder: {state.collection?.path ?? '[none]'}</div>
    </div>
  );
}

interface EditCollectionLocationState {
  collection: Collection;
}

function CollectionEditor({ initialState }: { initialState: CollectionState }) {
  const [isInitialRender, setInitialRender] = useState(true);
  const state = useCollectionEditorState();
  const dispatch = useCollectionEditorDispatch();

  useEffect(() => {
    if (isInitialRender) {
      dispatch({
        type: 'set-collection',
        collection: Collection.fromObject(initialState.collection),
      });
      setInitialRender(false);
    }
  }, [dispatch, isInitialRender, initialState]);

  useEffect(() => {
    if (state.collection) {
      ipc.invoke('write-collection-to-project-file', state.collection);
    }
  }, [state.collection]);

  return (
    <>
      <Header />
      <LayerStackEditor />
    </>
  );
}

export default function EditCollection() {
  const history = useHistory();
  const location = useLocation<EditCollectionLocationState>();

  useEffect(() => {
    ipc.on('open-collection', (c: Collection) => {
      history.push('edit-collection', { collection: c });
    });

    return () => {
      ipc.removeAllListeners('open-collection');
    };
  });

  return (
    <CollectionContextProvider>
      <CollectionEditor
        initialState={{ collection: location.state.collection }}
      />
    </CollectionContextProvider>
  );
}
