// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 4.0.16
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Vector3 } from './Vector3'
import { Quaternion } from './Quaternion'

export class Player extends Schema {
    @type(Vector3) public position: Vector3 = new Vector3();
    @type(Vector3) public rackPos: Vector3 = new Vector3();
    @type(Quaternion) public rackRot: Quaternion = new Quaternion();
    @type("boolean") public sideNear!: boolean;
}
