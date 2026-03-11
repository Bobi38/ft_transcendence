import { MapSchema, Schema, type } from "@colyseus/schema";

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

export class Player extends Schema {
  @type(Vector3) position = new Vector3();
  @type(Vector3) rackPos = new Vector3();
  @type(Quaternion) rackRot = new Quaternion();
  @type("boolean") sideNear = true;
  @type("boolean") connected = true;
}

export class Score extends Schema {
  @type("number") teamNear = 0;
  @type("number") teamFar = 0;
}

export class MyRoomState extends Schema {
  @type(Ball) ball = new Ball();
  @type("boolean") started = false;
  @type("boolean") won = false;
  @type("boolean") endedDisconnect = false;
  @type(Score) score = new Score();
  @type({ map: Player }) players = new MapSchema<Player>();
}
