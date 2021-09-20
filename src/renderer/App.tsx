import React, { useEffect } from 'react';
import {
  MemoryRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from 'react-router-dom';
import './App.global.css';
import * as ipc from './ipc';
import Collection from '../types/Collection';
import CreateCollection from './CreateCollection';
import EditCollection from './EditCollection';

const Hello = () => {
  const handleOpenCollection = () => {
    ipc.invoke('browse-and-open-collection');
  };

  const history = useHistory();

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
      <h1 style={{ textAlign: 'center' }}>NFT Builder</h1>
      <div className="Hello">
        <Link to="/create-collection">
          <button type="button" className="large">
            <span role="img" aria-label="image">
              🖼️
            </span>
            Create New Collection
          </button>
        </Link>
        <button type="button" className="large" onClick={handleOpenCollection}>
          <span role="img" aria-label="folder">
            📂
          </span>
          Open Collection
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/create-collection" component={CreateCollection} />
        <Route path="/edit-collection" component={EditCollection} />
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
