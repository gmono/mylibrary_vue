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

//对象视图 重要

//通用对象视图扩展器

export interface IPropertyLinker {
  getValue(target: object, propName: string): any;
  setValue(target: object, propName: string, value: any): void;
}

export interface ITransformer {
  transformTo(rawdata: any): any;
  transformBack(data: any): any;
}
/**
 * 恒等映射
 */
export class IdentityLinker implements IPropertyLinker {
  getValue(target: object, propName: string) {
    return (target as any)[propName];
  }
  setValue(target: object, propName: string, value: any): void {
    (target as any)[propName] = value;
  }
}

/**
 * 可以给赋值和获取值的过程添加一个转换 
 * 赋值的时候转换过去 获取值的时候转换回来
 * 可以认为是一个另一个space中的对象添加一个视图 使之出于这个space
 */
export class TransformLinker extends IdentityLinker {
  public constructor(public transformer:ITransformer){
    super();
  }
  override getValue(target: object, propName: string) {
    return this.transformer.transformBack(super.getValue(target,propName));
  }
  override setValue(target: object, propName: string, value: any): void {
    (target as any)[propName] = this.transformer.transformTo(value);
  }
}
//linker只针对对象的一个属性 不同属性可以使用不同的linker
//这里是各种Transformer 比如IdentityTransformer 针对数字的公式transformer

export type IObjectDictionary<V>={[idx:PropertyKey]:V}
export type IMap<K,V>=Map<K,V>
export type IDictionary<K,V>=
  K extends PropertyKey ? IObjectDictionary<V>|IMap<K,V>
  :IMap<K,V>;

export type LinkerTable=IDictionary<string,IPropertyLinker>;

export class ObjectView {
  public constructor(public target: object) {
    //构造target的所有属性 并使用恒等连接器来连接
    //可以给任何属性赋予不同的Linker
  }
}


