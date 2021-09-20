import Layer from './Layer';

export default class Collection {
  public readonly name: string;

  /**
   * Path of the project file
   */
  public readonly path?: string;

  /**
   * Path of the working tmpdir
   */
  public readonly tmpdirPath?: string;

  public readonly layers: Layer[];

  public readonly layerNameCount: number;

  public constructor(
    name: string,
    path?: string,
    tmpdirPath?: string,
    layers?: Layer[],
    layerNameCount?: number
  ) {
    this.name = name;
    this.path = path;
    this.tmpdirPath = tmpdirPath;
    if (layers) {
      this.layers = layers;
    } else {
      this.layers = [];
    }
    this.layerNameCount = layerNameCount || 1;
  }

  public copyWith(
    modifyObject: { [P in keyof Collection]?: Collection[P] }
  ): Collection {
    return Object.assign(Object.create(Collection.prototype), {
      ...this,
      ...modifyObject,
    });
  }

  public serialize() {
    return JSON.stringify(
      this.copyWith({ path: undefined, tmpdirPath: undefined }),
      null,
      2
    );
  }

  public static deserialize(json: string): Collection {
    return this.fromObject(JSON.parse(json));
  }

  public static fromObject(object: any): Collection {
    return new Collection(
      object.name ?? '',
      object.path,
      object.tmpdirPath,
      object.layers?.map((o: unknown) => Layer.fromObject(o)),
      object.layerNameCount
    );
  }
}
