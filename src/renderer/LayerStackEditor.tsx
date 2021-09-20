import React, { useState, useEffect } from 'react';
import Layer from 'types/Layer';
import DummyVariant from 'types/DummyVariant';
import ImageFileVariant from 'types/ImageFileVariant';
import styled from 'styled-components';
import * as ipc from './ipc';
import {
  useCollectionEditorDispatch,
  useCollectionEditorState,
} from './CollectionEditorContext';
import Collection from '../types/Collection';

function getLayerAssetDirectoryPath(
  collection: Collection,
  layerIndex: number
): string {
  if (!collection.tmpdirPath) {
    throw new Error('Collection tmpdirPath is not set.');
  }
  const layer = collection.layers[layerIndex];
  return `${collection.tmpdirPath}/assets/${layer.id}`;
}

function getVariantAssetFilePath(
  collection: Collection,
  layerIndex: number,
  variantIndex: number
) {
  const variantFileName =
    collection.layers[layerIndex].variants[variantIndex].id;
  return `${getLayerAssetDirectoryPath(
    collection,
    layerIndex
  )}/${variantFileName}`;
}

const ThumbnailBox = styled.div`
  width: 100px;
  height: 100px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  border-radius: 10px;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: auto;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 10px;
`;

const DummyThumbnail = styled.div`
  width: 100%;
  height: auto;
  padding: 5px;
  box-sizing: border-box;
  color: #fff;
  text-align: center;
  font-size: 10px;
`;

const VariantBox = styled.div`
  flex: 0 0 auto;
  width: 120px;
  max-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const VariantName = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: keep-all;
  width: 100%;
  overflow: hidden;
`;

function VariantEditor(props: { layerIndex: number; variantIndex: number }) {
  const { layerIndex, variantIndex } = props;
  const state = useCollectionEditorState();
  const dispatch = useCollectionEditorDispatch();
  const layer = state.collection?.layers[layerIndex];
  const variant = layer?.variants[variantIndex];

  if (!variant) {
    throw new Error(
      `Variant ${variantIndex} of layer ${layerIndex} does not exist.`
    );
  }

  if (!state.collection) {
    throw new Error('Collection does not exist.');
  }

  function deleteVariant(l: Layer, lIndex: number, vIndex: number) {
    dispatch({
      type: 'set-layer',
      index: lIndex,
      layer: l.copyWith({
        variants: l.variants.filter((_, i) => i !== vIndex),
      }),
    });
  }

  if (variant.type === 'dummy') {
    return (
      <VariantBox>
        <VariantName>Dummy</VariantName>
        <ThumbnailBox>
          <DummyThumbnail>
            Dummy <br /> {variant.id}
          </DummyThumbnail>
        </ThumbnailBox>
        <div>
          <button
            type="button"
            onClick={() => deleteVariant(layer, layerIndex, variantIndex)}
          >
            Delete
          </button>
        </div>
      </VariantBox>
    );
  }

  return (
    <VariantBox>
      <VariantName>{variant.id}</VariantName>
      <ThumbnailBox>
        <Thumbnail
          src={`file://${getVariantAssetFilePath(
            state.collection,
            layerIndex,
            variantIndex
          )}`}
        />
      </ThumbnailBox>
      <div>
        <button
          type="button"
          onClick={() => deleteVariant(layer, layerIndex, variantIndex)}
        >
          Delete
        </button>
      </div>
    </VariantBox>
  );
}

const VariantEditorContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
  height: auto;
  margin: 10px 30px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

function LayerEditor({ index }: { index: number }) {
  const [clickAddImages, setClickAddImages] = useState(false);
  const state = useCollectionEditorState();
  const dispatch = useCollectionEditorDispatch();

  const layer = state.collection?.layers[index];

  useEffect(() => {
    function addImages(ids: string[], layerId: string) {
      if (!layer || layerId !== layer?.id) {
        return;
      }

      const newVariants = ids
        .filter((id) => !layer.variants.find((v) => v.id === id))
        .map((id) => new ImageFileVariant(id));
      const newLayer = layer.copyWith({
        variants: layer.variants.concat(newVariants),
      });
      dispatch({ type: 'set-layer', layer: newLayer, index });
    }

    ipc.on('add-images', addImages);

    return () => {
      ipc.removeListener('add-images', addImages);
    };
  });

  useEffect(() => {
    if (clickAddImages && layer && state.collection) {
      ipc.invoke('browse-and-add-images', {
        layerId: layer.id,
        copyDestDir: `${getLayerAssetDirectoryPath(state.collection, index)}`,
      });
      setClickAddImages(false);
    }
  }, [clickAddImages, index, layer, state.collection]);

  function onClickAddDummy() {
    if (layer) {
      const newLayer = layer.copyWith({
        variants: layer.variants.concat(new DummyVariant()),
      });
      dispatch({ type: 'set-layer', layer: newLayer, index });
    }
  }

  return (
    <div>
      <div>
        {layer?.id}{' '}
        <button type="button" onClick={() => setClickAddImages(true)}>
          + Images
        </button>{' '}
        <button type="button" onClick={onClickAddDummy}>
          + Dummy
        </button>
      </div>
      <VariantEditorContainer>
        {layer?.variants.map((variant, variantIndex) => (
          <VariantEditor
            key={variant.id}
            layerIndex={index}
            variantIndex={variantIndex}
          />
        ))}
      </VariantEditorContainer>
    </div>
  );
}

export default function LayerStackEditor() {
  const state = useCollectionEditorState();
  const dispatch = useCollectionEditorDispatch();

  return (
    <div>
      <div>
        {state.collection?.layers.map((layer, index) => (
          <LayerEditor key={layer.id} index={index} />
        ))}
      </div>
      <div>
        <button
          type="button"
          onClick={() =>
            dispatch({
              type: 'add-layers',
              layers: [new Layer(`Layer ${state.collection?.layerNameCount}`)],
            })
          }
        >
          +
        </button>
      </div>
    </div>
  );
}
