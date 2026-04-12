*This project has been created as part of the 42 curriculum by Fcretin, Tvoisin, Niroched, Sflechel, Edarnand.*

[tag_icon_docker]: https://skillicons.dev/icons?i=docker
[tag_icon_js]: https://skillicons.dev/icons?i=js
[tag_icon_react]: https://skillicons.dev/icons?i=react
[tag_icon_ts]: https://skillicons.dev/icons?i=ts
[tag_icon_mysql]: https://skillicons.dev/icons?i=mysql
[tag_icon_nginx]: https://skillicons.dev/icons?i=nginx
[tag_icon_scss]: https://skillicons.dev/icons?i=sass

[tag_ressource_grid]: https://cssgrid-generator.netlify.app/
[tag_ressource_claude_transition]: https://claude.ai/public/artifacts/96fe632f-2869-4d78-99f4-20053d0ebf7c

# ![icons][tag_icon_react] 𝔽t_transcendence ![icons][tag_icon_js]

<details id="summary">
    <summary>
        <h2>🗓 𝕊ummary</h2>
    </summary>

- [𝔻escription](#description)
- [👥 𝕋eam 𝕀nformation](#team_info)
- [📋 ℙroject 𝕄anagement](#project_management)
- [🛠 𝕀nstructions & ℝequirements](#requirements)
- [🏗 𝕋echnical 𝕊tack](#tech_stack)
- [🗄 𝔻atabase 𝕊chema](#db_schema)
- [🎮 𝔽eatures 𝕃ist](#features)
- [📦 𝕄odules](#modules)
- [🙋 𝕀ndividual ℂontributions](#contributions)
- [ℝesources](#resources)
- [📁 ℝepository 𝕊tructure 𝕋ree](#rst)

</details>

<br>

---

<br>

<details id="description">
    <summary>
        <h2>𝔻escription</h2>
    </summary>

## ft_transcendence — Real-Time Multiplayer Gaming Platform

ft_transcendence is a full-stack web application that lets users compete against each other online in real time. The platform features two distinct games — a **3D Pong** game and a **Tic-Tac-Toe (Morpion)** — alongside a full user management system, real-time chat, authentication, and a matchmaking system.

### Key Features

- 🏓 **Pong 3D** — A three-dimensional take on the classic Pong game, powered by Colyseus for authoritative server-side game state and real-time synchronization.
- ✖️ **Morpion (Tic-Tac-Toe)** — A fully custom matchmaking and room system built from scratch with WebSockets, supporting remote player matchmaking.
- 💬 **Real-Time Chat** — In-app messaging between users.
- 🔐 **Secure Authentication** — User login, registration, and session management.
- 👤 **User Profiles** — Customizable profiles with stats and match history.
- 🏆 **Leaderboard** — Player rankings based on match results.

- [🗓 𝕊ummary](#summary)

</details>

<br>

---

<br>

<details id="team_info">
    <summary>
        <h2>👥 𝕋eam 𝕀nformation</h2>
    </summary>

| Login     | Role            | Responsibilities                                                              |
| :---      | :---            | :---                                                                          |
| Fcretin   | Product Owner   | Product vision, backlog prioritization, feature definition & acceptance       |
| Tvoisin   | Project Manager | Team coordination, Scrum ceremonies, task tracking & deadline management      |
| Edarnand  | Technical Lead  | Architecture design, code quality, reviews, DevOps (Docker, Nginx, Makefile) |
| Niroched  | Developer       | Morpion game logic, custom room & matchmaking system (WebSockets)             |
| Sflechel  | Developer       | Pong 3D game logic, Colyseus server integration & TypeScript game server      |

- [🗓 𝕊ummary](#summary)

</details>

<br>

---

<br>

<details id="project_management">
    <summary>
        <h2>📋 ℙroject 𝕄anagement</h2>
    </summary>

### Work Organization

The team followed an **Agile/Scrum** methodology with weekly sprints. Tasks were broken down into user stories and assigned during sprint planning sessions. Progress was reviewed at the end of each sprint with a short retrospective to identify blockers and improvements.

### Tools Used

| Purpose              | Tool                              |
| :---                 | :---                              |
| Task tracking        | GitHub Issues / GitHub Projects   |
| Version control      | Git & GitHub                      |
| Communication        | Discord                           |
| Code review          | GitHub Pull Requests              |

### Meetings & Communication

- Weekly sprint planning and review meetings via Discord.
- Daily async standups in the team Discord channel.
- All major technical decisions were discussed and documented in GitHub Issues before implementation.

- [🗓 𝕊ummary](#summary)

</details>

<br>

---

<br>

<details id="requirements">
    <summary>
        <h2>🛠 𝕀nstructions & ℝequirements</h2>
    </summary>

### Prerequisites

| Tool           | Version / Notes                        |
| :---           | :---                                   |
| Docker         | >= 24.x                                |
| Docker Compose | >= 2.x (included with Docker Desktop)  |
| Make           | Any standard version                   |
| Git            | Any standard version                   |

> No local Node.js, MySQL, or Nginx installation required — everything runs inside Docker containers.

### Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ft_transcendence
   ```

2. **Create your environment file:**
   ```bash
   cp env.example .env
   ```
   Then open `.env` and fill in the required values (database credentials, JWT secrets, OAuth keys if applicable, etc.).

3. **Run in production mode:**
   ```bash
   make prod
   ```

   Or in development mode with hot reload:
   ```bash
   make dev
   ```

### Useful Makefile Commands

| Command       | Description                              |
| :---          | :---                                     |
| `make prod`   | Build and start all containers (prod)    |
| `make dev`    | Start with hot reload (dev mode)         |
| `make down`   | Stop and remove containers               |
| `make clean`  | Remove containers, volumes, and images   |
| `make logs`   | Follow container logs                    |

### Access

Once running, open your browser at: `https://localhost:9443`

- [🗓 𝕊ummary](#summary)

</details>

<br>

---

<br>

<details id="tech_stack">
    <summary>
        <h2>🏗 𝕋echnical 𝕊tack</h2>
    </summary>

### Infrastructure & DevOps

| Technology        | Role                                                                                     |
| :---              | :---                                                                                     |
| **Docker**        | Containerization of every service for reproducible, isolated environments                |
| **Docker Compose**| Orchestration of multi-container setup (frontend, backend, database, nginx, phpmyadmin) |
| **Makefile**      | Simplified CLI interface for common dev/prod operations                                  |
| **Nginx**         | Reverse proxy, HTTPS termination, and static file serving for the compiled frontend      |

> **Why Docker?** Docker ensures every team member and evaluator runs the exact same environment, eliminating "works on my machine" issues and simplifying deployment.

### Frontend ![icons][tag_icon_react]

| Technology    | Role                                                                    |
| :---          | :---                                                                    |
| **React JSX** | Component-based UI framework for a dynamic single-page application      |
| **SCSS**      | Structured and maintainable styling with variables, nesting, and mixins |
| **Vite**      | Fast build tool and dev server for the React frontend                   |
| **Babylon (TS)** | Web-native, game-oriented 3D library     

> **Why React?** React's component model fits the modular nature of the app (game views, chat, profile, etc.) and its ecosystem accelerated development significantly.

> **Why Babylon?** Babylon JS is built specifically for the web, and unlike Three.js ships with game-oriented features.

### Backend ![icons][tag_icon_js]

| Technology        | Role                                                                              |
| :---              | :---                                                                              |
| **Express.js**    | REST API gateway handling auth, user management, chat, and routing                |
| **WebSockets (ws)**| Low-level WebSocket library powering the Morpion matchmaking and room system    |
| **Colyseus (TS)** | Authoritative game server framework for Pong 3D, handling rooms and game state   |

> **Why Colyseus for Pong 3D?** Colyseus provides built-in room management and binary-encoded delta-state synchronization, allowng for lightweight coordination between server and client. It runs in TypeScript for type safety in complex game logic.

> **Why custom WebSockets for Morpion?** The Morpion game required a lightweight, fully custom matchmaking system (room creation, player queuing, game state relay) built from scratch to demonstrate mastery of the WebSocket protocol without abstractions.

### Database ![icons][tag_icon_mysql]

| Technology     | Role                                                      |
| :---           | :---                                                      |
| **MySQL**      | Relational database for persistent storage                |
| **Sequelize**  | ORM for schema definition, migrations, and query building |

> **Why MySQL + Sequelize?** > **Why MySQL + Sequelize?** MySQL is a battle-tested relational database well-suited to the structured, relational data of this project (users, matches, stats). Sequelize enhances developer productivity with type-safe model definitions, streamlined migrations, and seamless integration with JavaScript, making it particularly well-suited for Node.js applications.

> **Database Schema**
Nous avons qu'une seule database MYSQL que nous visualisons avec myadminphp sous le port 8081

### Tables and Relationships

---

## Users

Stores user accounts created during registration. Users are linked to other tables through relationships, enabling direct access to their data across the application.

#### Fields

- `id` (INT, Primary Key, Auto Increment)  
  Used to generate authentication cookies (`token` and `temp`) and identify users across all related tables (JOIN operations).

- `username`, `password`, `email` (STRING)  
  Basic authentication and identity information.

- `co`, `MPFA` (BOOLEAN)  
  Indicates if the user is currently connected and whether Multi-Factor Authentication is enabled.

- `HostLastCo`, `DateLastCo` (BOOLEAN, DATE)  
  Used to determine if the user must pass 2FA:
  - first login
  - login from a new host
  - last connection older than a defined threshold (e.g. 10 days)

---

## PssWrdEmail

Stores verification codes sent by email for 2FA or password reset operations.

#### Fields

- `id` (INT, Foreign Key → Users.id)  
  Links the code to a specific user.

- `type` (INT)  
  Defines the purpose of the code:
  - `1` = 2FA authentication  
  - `2` = password reset  

- `code` (INT, hashed)  
  Secure verification code.

- `DateCreate` (DATE)  
  Creation date used for expiration logic.

---

## Chat

---

### General Chat (`ChatG`)

Stores all messages sent in the public chat room. Messages are encrypted before being saved.

#### Fields

- `SenderId` (INT, Foreign Key → Users.id)  
  Identifies the user who sent the message.

- `contenu` (STRING)  
  Encrypted message content.

- `time` (TIME)  
  Timestamp of message sending.

---

### Private Chat (`PrivChat` & `PrivMess`)

Each private conversation between two users is stored in `PrivChat`. Messages are stored separately in `PrivMess` using the chat ID.

Example:
To retrieve a conversation between user `6` and user `12`, the application finds the corresponding entry in `PrivChat`, retrieves its `id`, then fetches all messages in `PrivMess` with that `ChatId`.

#### PrivChat Fields

- `id` (INT, Primary Key, Auto Increment)  
  Unique identifier of the conversation. Ensures one conversation per pair of users.

- `id1` (INT, Foreign Key → Users.id)  
  First user in the conversation.

- `id2` (INT, Foreign Key → Users.id)  
  Second user in the conversation.

- `lastMess` (DATE)  
  Used to retrieve the last message sent.

---

#### PrivMess Fields

- `id` (INT, Primary Key, Auto Increment)  
  Unique message identifier.

- `ChatId` (INT, Foreign Key → PrivChat.id)  
  Identifies the conversation (HasMany / BelongsTo relation).

- `SenderId` (INT, Foreign Key → Users.id)  
  User who sent the message.

- `contenu` (STRING, encrypted)  
  Message content.

- `time` (TIME)  
  Timestamp of message sending.

### Friend Relationship

Users can establish friendships with other users through a junction table (`Friend`), implementing a many-to-many self-referential relationship.

This table not only links users together but also stores additional metadata such as the friendship status and the user who initiated the request.

#### Fields

- `Friend1` (INT, Primary Key) – ID of the first user
- `Friend2` (INT, Primary Key) – ID of the second user
- `State` (BOOLEAN) – indicates whether the friend request is accepted
- `WhoAsk` (INT) – ID of the user who initiated the friend request

## GAME

Each game mode (PONG3D and MORPION) has its own dedicated tables to store statistics and match history.

---

## STATS (StatMorp & StatPong3D)

Each user has a dedicated stats record per game mode. These tables store aggregated performance data that is updated after each match.

They track overall progression such as total games played, wins, losses, and game-specific outcomes (e.g. win conditions in Morpion).

#### Purpose

- Track user performance per game mode
- Increment values after each completed match
- Provide historical statistics for ranking and analysis

---

## GAME (GameMorp & GamePong3D)

Each played match is stored as a single database entry containing the result and relevant metadata.

These tables represent the history of all games played in the system.

#### Purpose

- Store each game instance
- Record winner and loser IDs
- Track match-specific data (e.g. draw state for Morpion)
- Allow replay/history reconstruction if needed

#### Fields (general concept)

- `id` (INT, Primary Key, Auto Increment) – unique match identifier  
- `winnerId` (INT, Foreign Key → Users.id) – winning player  
- `loserId` (INT, Foreign Key → Users.id) – losing player  
- `draw` (BOOLEAN, only for Morpion) – indicates a draw result  
- `createdAt` (DATETIME) – match timestamp  

 
- [🗓 𝕊ummary](#summary)

</details>

<br>

---

<br>

<br>

---

<br>

<details id="features">
    <summary>
        <h2>🎮 𝔽eatures 𝕃ist</h2>
    </summary>

| Feature                        | Description                                                                 | Contributor(s)         |
| :---                           | :---                                                                        | :---                   |
| **User Registration & Login**  | Secure account creation and authentication with hashed passwords            | Edarnand               |
| **User Profiles**              | Customizable profile pages with avatar, stats, and match history            | Fcretin, Edarnand      |
| **Real-Time Chat**             | In-app messaging system using WebSockets                                    | Tvoisin                |
| **Pong 3D**                    | 3D Pong game with real-time multiplayer via Colyseus rooms                  | Sflechel               |
| **Morpion (Tic-Tac-Toe)**      | Multiplayer Morpion with custom matchmaking and room system via WebSockets  | Niroched               |
| **Matchmaking System**         | Custom queue-based matchmaking built from scratch for Morpion               | Niroched               |
| **Match History**              | Per-user record of past games and results                                   | Edarnand               |
| **Nginx Reverse Proxy**        | HTTPS routing and static file serving                                       | Edarnand               |
| **Docker Containerization**    | Full multi-service Docker setup for dev and prod                            | Edarnand               |

- [🗓 𝕊ummary](#summary)

</details>

<br>

---

<br>

<details id="modules">
    <summary>
        <h2>📦 𝕄odules</h2>
    </summary>

| Module                          | Type  | Points | Implemented By  | Description                                                                       |
| :---                            | :---  | :---   | :---            | :---                                                                              |
| **Framework (Frontend & Backend)** | Major | 2 pts  | Tvoisin, Fcretin | Express.js used as the backend API framework                                  |
| **WebSocket Real-Time**         | Major | 2 pts  | Tvoisin, Fcretin, Niroched | Custom WebSocket server powering Morpion and chat systems              |
| **Web-based game (Pong 3D)**    | Major | 2 pts  | Sflechel        | Three-dimensional Pong using Colyseus for authoritative server-side game state    |
| **3D graphics and gameplay**    | Major | 2 pts  | Sflechel        | 3D graphics using Babylon JS and a custom 3D physics engine                       |
| **Second game (Morpion)**       | Major | 2 pts  | Niroched        | Morpion: Tic-tac-toe game with remote players and vs AI mode, and spectating      | 
| **Remote Players**              | Major | 2 pts  | Sflechel, Niroched | Both games support two remote players connecting over the network              |
| **AI Opponent**                 | Major | 2 pts  | Sflechel, Niroched | Both games feature AI opponents, online (Morpion) and offline (Pong3D)         |
| **User interactions**           | Major | 2 pts  | Tvoisin, Fcretin, Edarnand | Real-time messaging between connected users via WebSockets             |
| **ORM Database**                | Minor | 1 pt   | Tvoisin         | Sequelize                                                                         |
| **OAuth Remote Authentication** | Minor | 1 pt   | Tvoisin         | Possible to register and connect with Google and Github accounts                  |
| **Two-Factor Authentication**   | Minor | 1 pt   | Tvoisin         | User accounts are protected with email sent when connecting                       |

**Total: 19 pts**

### Justifications

- **React** was chosen for its component model, ecosystem, and team familiarity — it accelerated building modular UI views (game, chat, profile).
- **Colyseus** was the right tool for Pong 3D: it provides authoritative server-side game rooms, state synchronization, and a built-in game loop out of the box, avoiding the need to reinvent the wheel for a real-time multiplayer game.
- **Custom WebSocket matchmaking** for Morpion was built from scratch to demonstrate mastery of the low-level WebSocket API — queue management, room creation, player pairing, and game state relay without any framework.
- **MySQL** was selected over NoSQL because the data model is clearly relational (users, matches, stats) and benefits from foreign keys and joins.

- [🗓 𝕊ummary](#summary)

</details>

<br>

---

<br>

<details id="contributions">
    <summary>
        <h2>🙋 𝕀ndividual ℂontributions</h2>
    </summary>

> ⚠️ *This section is a draft — each member should review and update their entry with honest, specific details.*

### Fcretin — Product Owner
- Defined product vision and wrote user stories for all major features.
- Maintained and prioritized the product backlog throughout the project.
- Worked on the Leaderboard feature and user profile pages.
- **Challenge**: Balancing scope with the team's available time — resolved by cutting lower-priority features early and focusing on core gameplay.

### Tvoisin — Project Manager
- Organized sprint planning, daily standups, and retrospectives.
- Tracked tasks and deadlines using GitHub Projects / Issues.
- Implemented the real-time chat feature (WebSocket-based messaging).
- **Challenge**: Keeping the team aligned across async work — resolved with structured Discord threads and clear task ownership in GitHub Issues.

### Edarnand — Technical Lead
- Designed the overall microservice architecture and Docker Compose setup.
- Wrote all Dockerfiles and Nginx configuration.
- Implemented the Makefile, the Express.js gateway, authentication routes, and the database schema (Sequelize models).
- Conducted code reviews and enforced code quality standards.
- **Challenge**: Getting all services to communicate correctly through the Nginx reverse proxy — resolved by carefully mapping routes and Docker network aliases.

### Niroched — Developer
- Built the entire Morpion (Tic-Tac-Toe) game from scratch, including game logic, win detection, and board state management.
- Designed and implemented the custom WebSocket matchmaking system: player queuing, room creation, and game state relay — built entirely from scratch without a game server framework.
- **Challenge**: Building a reliable room/matchmaking system without Colyseus — resolved by carefully designing a queue manager with proper connection lifecycle handling (disconnects, timeouts).

### Sflechel — Developer
Modules implemeted:

Web-based game : Pong3D, a 3D online multiplayer squash game
Remote players : Real-time two-player networked gameplay via Colyseus
Advanced 3D graphics : Full Babylon.js scene, court and player avatars
AI opponent : Local single-player mode with a bot opponent

sflechel built Pong3D end-to-end: a 3D squash game where the ball rebounds off all four surfaces of a walled court and players lose a point by missing the ball. It uses a custom deterministic physics engine (sphere vs. AABB racket, sphere vs. infinite-plane walls, no gravity) running headlessly in both server and client.
Multiplayer follows a server-authoritative model with client-side prediction: the client simulates ahead locally, saves a ball state snapshot every tick, and reconciles against tick-stamped server patches — applying a corrective delta for small errors or rewinding and re-simulating for large ones. The rendered mesh lerps to the corrected physics body to keep corrections visually smooth.
The AI and multiplayer modes are architecturally separated via a GameSession interface implemented by LocalSessionManager (AI mode) and NetworkSessionManager (online mode), following SOLID principles so that switching modes requires no changes to game logic.
The player avatar is a Wii-inspired Mii model modified in Blender (arms, legs removed; face added).
Challenges:
The trickiest part of the networking was clock synchronisation: ensuring that each server patch's tick number matched the exact locally-saved snapshot for that tick. This was resolved by tick-stamping all server broadcasts and saving full ball state per tick on the client, then diagnosing drift through careful position/velocity log comparison. Integrating Babylon.js into a React SPA also proved unexpectedly problematic as Babylon assumes full page reloads between sessions, so navigating in and out of the game caused rapid memory accumulation. This was solved by implementing an OOP dispose cascade on component unmount that explicitly releases all Babylon resources in dependency order.

- [🗓 𝕊ummary](#summary)

</details>

<br>

---

<br>

<details id="resources">
    <summary>
        <h2>ℝesources</h2>
    </summary>

### Documentation

- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Sequelize ORM Documentation](https://sequelize.org/)
- [Colyseus Documentation](https://docs.colyseus.io/)
- [Babylon JS Documentation](https://doc.babylonjs.com/)
- [WebSocket API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Vite Documentation](https://vitejs.dev/)
- [SCSS / Sass Documentation](https://sass-lang.com/documentation/)

### Tools

- [CSS Grid Generator][tag_ressource_grid]
- [Transition examples by Claude][tag_ressource_claude_transition]
- [Skill Icons (README icons)](https://github.com/tandpfun/skill-icons#readme)

### AI Usage

Claude (Anthropic) was used during this project for the following tasks:

- **README drafting**: Generating the initial structure and content of this README based on project requirements.
- **UI transitions & animations**: Generating CSS transition ideas for the frontend (see [transition artifact][tag_ressource_claude_transition]).
- **Debugging assistance**: Helping diagnose WebSocket connection issues and Docker networking problems.
- **Boilerplate generation**: Generating initial Sequelize model definitions and Express route scaffolding to accelerate development.

> All AI-generated code was reviewed, tested, and adapted by the team before being integrated into the project.

- [🗓 𝕊ummary](#summary)

</details>

<br>

---

<br>

<details id="rst">
    <summary>
        <h2>📁 ℝepository 𝕊tructure 𝕋ree</h2>
    </summary>

```text
.
├── conf
│   ├── db                          # MySQL initialization scripts
│   ├── myadmin                     # phpMyAdmin configuration
│   ├── nginx
│   │   ├── default.conf            # Nginx reverse proxy configuration
│   │   └── Dockerfile              # Nginx container image
│   └── secrets                     # Secret files (not committed)
├── crypt.js                        # Utility for encryption/key generation
├── docker-compose.dev.yml          # Docker Compose — hot reload dev mode
├── docker-compose.prod.yml         # Docker Compose — compiled production mode
├── env.example                     # Environment variable template
├── Makefile                        # Convenience commands (make prod, make dev, etc.)
├── package.json
├── README.md
└── web
    ├── back
    │   ├── add_db                  # DB seeding / migration scripts
    │   ├── init_db                 # DB initialization logic
    │   ├── models                  # Sequelize ORM models (User, Match, Stats, Message)
    │   ├── common                  # Shared utilities and middleware
    │   ├── gameServer              # Colyseus game server entry point (TypeScript)
    │   ├── gateway                 # Express API gateway (routing)
    │   ├── auth                    # Authentication routes & logic
    │   ├── chat                    # Real-time chat WebSocket handler
    │   ├── morpion                 # Morpion game logic + custom matchmaking (WebSockets)
    │   ├── pong3D                  # Pong 3D Colyseus rooms and game loop (TypeScript)
    │   └── user                    # User profile & stats routes
    └── front
        ├── Dockerfile              # Frontend container image
        ├── index.html              # App entry point
        ├── media                   # Static assets (images, fonts)
        ├── package.json
        ├── prod                    # Production build output
        ├── src                     # React source code (components, pages, hooks)
        ├── tool                    # Frontend utility scripts
        └── vite.config.js          # Vite build configuration
```

- [🗓 𝕊ummary](#summary)

</details>
