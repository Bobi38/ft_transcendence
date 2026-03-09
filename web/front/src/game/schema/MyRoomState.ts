// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 4.0.16
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Ball } from './Ball'
import { Player } from './Player'

export class MyRoomState extends Schema {
    @type(Ball) public ball: Ball = new Ball();
    @type("boolean") public started!: boolean;
    @type({ map: Player }) public players: MapSchema<Player> = new MapSchema<Player>();
}
