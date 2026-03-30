import { PhysicsBody, PhysicsMotionType, PhysicsShape, PhysicsShapeBox, PhysicsShapeSphere, Quaternion, Scene, TransformNode, Vector3 } from "@babylonjs/core";
import { Env } from "./media.js"

function ToVec3(input: any) : Vector3 {
    const ret = new Vector3(input.x, input.y, input.z);
    return ret;
}

function ToQuat(input: any) : Quaternion {
    const ret = Quaternion.FromEulerAngles(input.x, input.y, input.z);
    return ret;
}

export class Environment {
  public wallMin: Vector3;
  public wallMax: Vector3;

  constructor() {
    this._computeArenaBounds();
  }

  private _computeArenaBounds() {
    const env = JSON.parse(Env);
    const groundDim = ToVec3(env.groundDimensions);
    const wallDim = ToVec3(env.wallDimensions);
    const wallRightPos = ToVec3(env.wallRightPos);
    const wallLeftPos = ToVec3(env.wallLeftPos);
    const ceilingPos = ToVec3(env.ceilingPos);

    const verticalThickness = groundDim.y / 2; 
    const horizontalThickness = wallDim.y / 2;

    this.wallMin = new Vector3(wallLeftPos.x + horizontalThickness, verticalThickness, -(groundDim.z / 2));
    this.wallMax = new Vector3(wallRightPos.x - horizontalThickness, ceilingPos.y - verticalThickness, (groundDim.z / 2));
  }
}

  
