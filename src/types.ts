export interface DynamicObject {
  [key: string]: any;
}
export interface StatusResult extends DynamicObject {
  changes: string;
  path: string;
}
