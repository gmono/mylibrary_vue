/**
 * 投影机制
 */
import {Matrix,inverse} from "ml-matrix"

export interface IPoint2D {
  x: number;
  y: number;
}
//一个二维向量定义为二维空间中的一个点
export type Vector2=IPoint2D;


export class Point2D{
  public static ToComplex(v:Vector2):Complex{
    return complex(v.x,v.y)
  }
  public static ToVector(v:Complex):Vector2{
    return {x:v.re,y:v.im} as Vector2
  }
}


export type ProjectionFunc = (point: IPoint2D) => IPoint2D;
export interface IProjection {
  //这两个都是投影函数
  projToPixel(point: IPoint2D): IPoint2D;
  pixelToProj(point: IPoint2D): IPoint2D;
}

/**
 * 一系列用于操作Projection的函数
 */
export class Projection{
  public static reverse(proj:IProjection){
    return new ReverseProjection(proj);
  }
}
/**
 * 恒等映射
 */
export class BaseProjection implements IProjection {
  public projToPixel(point: IPoint2D): IPoint2D {
    return point;
  }
  pixelToProj(point: IPoint2D): IPoint2D {
    return point;
  }
}
import math, {  add, complex, Complex, pi } from "mathjs"
import { assert } from "ts-pystyle";

/**
 * 矩阵表示的投影 可以表示一个线性映射
 * 一般而言 这里的矩阵应该表示一个欧氏空间
 * 但如果更改内积的方式 也可以表示闵氏空间
 */
export class MatrixProjection extends BaseProjection {

  /**
   * 表示从real到pixel坐标的映射
   * 增广矩阵用于表示平移 这是real 坐标到pixel坐标的映射
   *  */ 
  public projMatrix=Matrix.eye(3,3)
  /**
   * 表示从pixel到real坐标的映射
   */
  get invertMatrix(){
    return inverse(this.projMatrix)
  }

  public override pixelToProj(point:IPoint2D):IPoint2D{
    const res=this.invertMatrix.mmul(Matrix.columnVector([point.x,point.y])).to1DArray()
    return {x:res[0],y:res[1]} as IPoint2D;
  }
  public override projToPixel(point:IPoint2D):IPoint2D{
    const res=this.projMatrix.mmul(Matrix.columnVector([point.x,point.y])).to1DArray()
    return {x:res[0],y:res[1]} as IPoint2D;
  }
}


/**
 * 复数表示的投影  用一个复数表示投影
 * 这个复数用作乘法 表示了从投影空间到像素空间的映射
 * 如果反过来  使用reverse
 */
export class ComplexProjection extends BaseProjection {

  /**
   * 表示从real到pixel坐标的映射
   * 增广矩阵用于表示平移 这是real 坐标到pixel坐标的映射
   *  */ 
  public mulFactor:Complex=complex("1+0i");
  /**
   * 表示从pixel到real坐标的映射
   */
  get inverseFactor(){
    return math.divide(1,this.mulFactor) as Complex
  }

  public calculate(point:IPoint2D,factor:Complex){
    const res=math.multiply(Point2D.ToComplex(point),factor) as Complex;
    return Point2D.ToVector(res)
  }
  public override pixelToProj(point:IPoint2D):IPoint2D{
    return this.calculate(point,this.mulFactor)
  }
  public override projToPixel(point:IPoint2D):IPoint2D{
    return this.calculate(point,this.inverseFactor)
  }
}




//高阶投影
/**
 * 投影反转
 *  */
export class ReverseProjection implements IProjection{
  public constructor(public rawProj:IProjection ){

  }
  projToPixel(point: IPoint2D): IPoint2D {
    return this.rawProj.pixelToProj(point);
  }
  pixelToProj(point: IPoint2D): IPoint2D {
    return this.rawProj.projToPixel(point);
  }
  //获取原始映射
  
}










/////////////////////////////shadow部分  空间投影
///允许point对象使用任何坐标系作为定位方式  影子 其体现为创建一个空间的物体在另一个空间的影子
///将其转换为pixel坐标 其本身表示像素坐标 而包装的是投影坐标
///通过提供reversed projection可以转换这两者
export class PorjToPixelShadow implements IPoint2D{
  public constructor(public pointObject:IPoint2D
                      ,public projection:IProjection){

  }
  //realpoint 等同于原始点对象  pixelPoint表示像素坐标对象
  get realPoint(){
    return this.pointObject;
  }
  get pixelPoint(){
    
    return this.projection.projToPixel(this.pointObject)
  }
  set pixelPoint(value){
    this.pointObject=this.projection.pixelToProj(value)
  }
  set realPoint(value){
    this.pointObject=value;
  }
  //获取像素坐标
  get x(){
    return this.pixelPoint.x;
  }
  get y(){
    return this.pixelPoint.y;
  }
  //设置像素坐标
  set x(value){
    var pixel={...this.pixelPoint,x:value}
    this.pixelPoint=pixel;
  }
  set y(value){
    var pixel={...this.pixelPoint,y:value}
    this.pixelPoint=pixel;
  }
  
}


//同样是影子  可以给点应用一个投影
export class PixelToProjShadow extends PorjToPixelShadow implements IPoint2D {
  public constructor(public pointObject:IPoint2D
    ,public projection:IProjection){
    super(pointObject,new ReverseProjection(projection));
  }
  //将projection作为reverseProjection返回
  get revProj(){
    return this.projection as ReverseProjection;
  }
  //获取原始的proj到pixel的转换
  get rawProj(){
    return this.revProj.rawProj;
  }
}



//通用管道 和 坐标变换管道

//坐标变换管道可以把一系列Projection包装成一个Projection
