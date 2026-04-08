import { Matrix, TransformNode, Vector3 } from "@babylonjs/core";

export interface Character extends TransformNode {
    getRacketWorldMatrix(): Matrix;
    getRacketHit(): Vector3;
}