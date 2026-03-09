Plan: run Havok on both clients and server (frontend and backend)
Server is authoritative on ball position and velocity: server regularly sends updates, client extrapolate from this using Havok
- if mismatch detected between server values and client values, a corrective vector is computed and progressively added to client values each frame
Client is authoritative on racket swings, but it still sends records of racket position to server
- therefore client is authoritative on racket/ball collisions. The server verifies the hit based on its recorded racket position and ball position, but otherwise freely accept the client's decision on the result of the hit on the ball
Messages must all be timestamped to account for latency. Then when updating position, the physics engine must 'fast-forward' to go back to its own time (eg message received at t=0 mandate a correction, but you're at t=90, so you use corrected pos and velocity to fast-forward the next 90ms, which correctly accounts for possible collisions)
