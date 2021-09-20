export default interface Variant {
  readonly type: 'image-file' | 'dummy';
  readonly params: Map<string, string>;
  readonly id: string;

  copyWith(modifyObject: { [P in keyof Variant]?: Variant[P] }): Variant;
}
