
//地理坐标系
///标准对象扩展器
export class StandardObject<T = object> {
  public constructor(public target: T) {}
  get value() {
    return this.target;
  }
  //操作函数
  with(patch: T) {
    return { ...this.target, ...patch };
  }
}
export type GenericStandardObject = StandardObject<object>;
