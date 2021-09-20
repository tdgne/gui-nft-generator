import React, { Dispatch, ReactChild, useContext, useReducer } from 'react';
import {
  CollectionState,
  CollectionReducer,
  CollectionAction,
} from './CollectionReducer';

export const CollectionContext = React.createContext<CollectionState>({});

export const CollectionUpdateContext =
  React.createContext<Dispatch<CollectionAction> | undefined>(undefined);

export const CollectionContextProvider = ({
  children,
}: {
  children: ReactChild;
}) => {
  const [state, dispatch] = useReducer(CollectionReducer, {});

  return (
    <CollectionUpdateContext.Provider value={dispatch}>
      <CollectionContext.Provider value={state}>
        {children}
      </CollectionContext.Provider>
    </CollectionUpdateContext.Provider>
  );
};

export function useCollectionEditorState() {
  const state = useContext(CollectionContext);
  return state;
}

export function useCollectionEditorDispatch() {
  const dispatch = useContext(CollectionUpdateContext);
  if (!dispatch) {
    throw new Error('dispatch is not ready');
  }
  return dispatch;
}
