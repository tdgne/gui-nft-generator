import React, { Dispatch, ReactChild, useContext, useReducer } from 'react';
import {
  CollectionState,
  CollectionReducer,
  CollectionAction,
} from './CollectionReducer';

export const CollectionContext = React.createContext<CollectionState>({});

export const CollectionUpdateContext = React.createContext<
  Dispatch<CollectionAction> | undefined
>(undefined);

export const CollectionContextProvider = ({
  children,
  initialState,
}: {
  children: ReactChild;
  initialState?: CollectionState;
}) => {
  const [state, dispatch] = useReducer(CollectionReducer, initialState ?? {});

  return (
    <CollectionUpdateContext.Provider value={dispatch}>
      <CollectionContext.Provider value={state}>
        {children}
      </CollectionContext.Provider>
    </CollectionUpdateContext.Provider>
  );
};

CollectionContextProvider.defaultProps = { initialState: {} };

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
