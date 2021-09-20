import React from 'react';
import Layer from '../types/Layer';
import Collection from '../types/Collection';

interface CollectionActionInterface {
  type: string;
}

export type CollectionAction = CollectionActionInterface &
  (
    | { type: 'set-collection'; collection: Collection }
    | { type: 'set-collection-name'; name: string }
    | { type: 'add-layers'; layers: Layer[] }
    | { type: 'set-layers'; layers: Layer[] }
    | { type: 'set-layer'; layer: Layer; index: number }
  );

export type CollectionState = {
  collection?: Collection;
};

export const CollectionReducer: React.Reducer<
  CollectionState,
  CollectionAction
> = (state, action) => {
  // eslint-disable-next-line no-console
  console.log('reduce', state, action);
  switch (action.type) {
    case 'set-collection':
      return { ...state, collection: action.collection };
    case 'set-collection-name':
      return {
        ...state,
        collection: state.collection?.copyWith({ name: action.name }),
      };
    case 'add-layers':
      return {
        ...state,
        collection: state.collection?.copyWith({
          layers: state.collection.layers.concat(action.layers),
          layerNameCount:
            state.collection.layerNameCount + action.layers.length,
        }),
      };
    case 'set-layers':
      return {
        ...state,
        collection: state.collection?.copyWith({
          layers: action.layers,
        }),
      };
    case 'set-layer':
      return {
        ...state,
        collection: state.collection?.copyWith({
          layers: state.collection?.layers.map((layer, index) => {
            return index === action.index ? action.layer : layer;
          }),
        }),
      };
    default:
      return state;
  }
};
