/**
 * 元素集合
 * 定义集合(ISet) 有序集（数组）（IArray)
 * 基于有序集 定义
 * 寻址器 视图（包含一个寻址器并实现IArray)
 * 寻址器之间可以进行变换 可以组合变为寻址管道
 * 通过把试图的寻址器叠加可以得到新的视图，称之为视图的叠加
 * 视图的叠加是对寻址器的组合的抽象
 *
 * 可以认为有序集出于一个离散1D空间中  其定位器为一个number
 * number从0开始
 * 可以通过寻址器将其投影到其他空间中 如2D空间 则这时候的
 * 定位器变为一个IPoint2D
 * 以此类推
 *
 * 定位器: IAddress
 * 寻址器：IAddressGenerator 包含一个函数可以接受一个obj 得到一个obj 两个obj都是地址
 * 视图：IView
 * 数组 IArray
 * 集合 ISet
 * 数组 数组View
 *
 * 工具类 View(视图的变换和叠加)  Address(寻址器变换和叠加)
 */