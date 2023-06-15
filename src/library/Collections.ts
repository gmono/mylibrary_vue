//view区域 主要提供操作容器的方法
/**
 * 对象字典
 */
export type IObjectDictionary<V> = { [idx: PropertyKey]: V };
/**
 * 映射字典
 */
export type IMap<K, V> = Map<K, V>;
/**
 * 通用字典接口
 */
export type IDictionary<K, V> = K extends PropertyKey
  ? IObjectDictionary<V> | IMap<K, V>
  : IMap<K, V>;
export function dictType(dt: IDictionary<any, any>) {
  return dt instanceof Map ? "map" : "object";
}
export function isObjectKey(k: any) {
  return typeof k == "number" || typeof k == "string" || typeof k == "symbol";
}

export type IEnumerable<V> = Iterable<V>;

/**
 * 表示可以检查元素情况的集合
 */
export interface ICheckable<V> {
  has(v: V): boolean;
}

export interface ICollectionView<V> extends ICheckable<V> {
  add(v: V): boolean;
  remove(v: V): boolean;
}

/**
 * 表示一个有限集合
 */
export interface ILimitCollectionView<V> extends ICollectionView<V> {
  /**
   * 表示集合的元素数量
   */
  get count(): number;
}
//有序表
export interface IMappingView<K, V> {
  get(k: K): V;
  set(k: K, v: V);
}
export interface IListView<V>
  // eslint-disable-next-line prettier/prettier
  extends IMappingView<number, V>,
    ILimitCollectionView<V> {
  removeAt(idx: number);
}
export interface IDictionaryView<K, V> extends IMappingView<K, V> {
  hasKey(k: K): boolean;
  hasValue(v: V): boolean;
}

export class DictionaryView<K, V> implements IDictionaryView<K, V> {
  public constructor(public baseDict: IDictionary<K, V>) {}
  /**
   * 查询一个key是否存在
   * @param k key
   * @returns 是否存在此key
   */
  hasKey(k: K): boolean {
    if (dictType(this.baseDict) == "map") {
      return (this.baseDict as IMap<K, V>).has(k);
    } else {
      if (!isObjectKey(k))
        throw new Error("错误,对象字典的key必须是propertykey类型");
      return (k as any) in this.baseDict;
    }
  }
  hasValue(v: V): boolean {
    throw new Error("Method not implemented.");
  }
  get(k: K): V {
    throw new Error("Method not implemented.");
  }
  set(k: K, v: V) {
    throw new Error("Method not implemented.");
  }
  //标准字典接口
}
