import { Schema, type } from "@colyseus/schema";

export class Vector3 extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 3;
  @type("number") z: number = 7;
}

export class Quaternion extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;
  @type("number") w: number = 0;
}

export class Ball extends Schema {
  @type(Vector3) position = new Vector3();
  @type(Vector3) velocity = new Vector3();
}

export class MyRoomState extends Schema {
  @type(Ball) ball = new Ball();
}
