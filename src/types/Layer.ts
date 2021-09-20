import DummyVariant from './DummyVariant';
import ImageFileVariant from './ImageFileVariant';
import Variant from './Variant';

export default class Layer {
  public readonly id: string;

  public readonly variants: Variant[];

  constructor(id: string, variants?: Variant[]) {
    this.id = id;
    this.variants = variants || [];
  }

  public copyWith(modifyObject: { [P in keyof Layer]?: Layer[P] }): Layer {
    return Object.assign(Object.create(Layer.prototype), {
      ...this,
      ...modifyObject,
    });
  }

  static fromObject(object: any): Layer {
    if (!object.id || !object.variants) {
      throw new Error('invalid object');
    }
    return new Layer(
      object.id,
      object.variants.map((o: any) => {
        if (o.type === 'dummy') {
          return new DummyVariant(o.id, o.params);
        }
        return new ImageFileVariant(o.id, o.params);
      })
    );
  }
}
