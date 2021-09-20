import { v4 as uuidv4 } from 'uuid';
import Variant from './Variant';

export default class DummyVariant implements Variant {
  public readonly type: 'dummy';

  public readonly params: Map<string, string>;

  public readonly id: string;

  constructor(id?: string, params?: Map<string, string>) {
    this.type = 'dummy';
    this.params = params || new Map<string, string>();
    this.id = id || uuidv4();
  }

  public copyWith(
    modifyObject: { [P in keyof DummyVariant]?: DummyVariant[P] }
  ): DummyVariant {
    return Object.assign(Object.create(DummyVariant.prototype), {
      ...this,
      ...modifyObject,
    });
  }
}
