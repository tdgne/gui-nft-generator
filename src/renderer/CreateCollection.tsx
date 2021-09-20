import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import * as ipc from './ipc';
import Collection from '../types/Collection';

export default function CreateCollection() {
  const history = useHistory();

  const handleSelectLocationAndCreate = () => {
    ipc.invoke('browse-and-create-collection');
  };

  useEffect(() => {
    ipc.on('open-collection', (collection: Collection) => {
      history.push('edit-collection', { collection });
    });

    return () => {
      ipc.removeAllListeners('open-collection');
    };
  });

  return (
    <div>
      <h1>Create a New Collection</h1>
      <div>
        <button
          type="button"
          className="large"
          onClick={handleSelectLocationAndCreate}
        >
          Browse and Create
        </button>
      </div>
    </div>
  );
}
