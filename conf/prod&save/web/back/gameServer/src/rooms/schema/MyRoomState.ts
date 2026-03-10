import { Schema, type } from "@colyseus/schema";

export class Position extends Schema {
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
  @type(Position) position = new Position();
  @type(Quaternion) quaternion = new Quaternion();
}

export class MyRoomState extends Schema {
  @type(Ball) ball = new Ball();
}
