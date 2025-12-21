export interface ChangeEventCustom<T> {
  target: {
    name?: string;
    value?: T;
  };
}
