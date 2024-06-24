export type ExtractArrayElementType<ArrayType> =
  ArrayType extends Array<infer ElementType> ? ElementType : never;
