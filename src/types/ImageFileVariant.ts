import Variant from './Variant';

export default class ImageFileVariant implements Variant {
  public readonly type: 'image-file';

  public readonly params: Map<string, string>;

  public readonly id: string;

  constructor(id: string, params?: Map<string, string>) {
    this.type = 'image-file';
    this.params = params || new Map<string, string>();
    this.id = id;
  }

  public copyWith(
    modifyObject: { [P in keyof ImageFileVariant]?: ImageFileVariant[P] }
  ): ImageFileVariant {
    return Object.assign(Object.create(ImageFileVariant.prototype), {
      ...this,
      ...modifyObject,
    });
  }
}
