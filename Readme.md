*This project has been created as part of the 42 curriculum by Fcretin, Tvoisin, Niroched, Sflechel, Edarnand.*

<!-- Ceci sont des commentaire pour avec ma font: Double-struck et des icon personnaliser -->
<!-- 📘 🗎 🖋 👀 🗣 … 🧪-->
<!-- 𝔸 𝔹 ℂ 𝔻 𝔼 𝔽 𝔾 ℍ 𝔾 𝕀 𝕁 𝕂 𝕃 𝕄 ℕ 𝕆 ℙ ℚ ℝ 𝕊 𝕋 𝕌 𝕍 𝕎 𝕏 𝕐 ℤ -->
<!-- 𝕒 𝕓 𝕔 𝕕 𝕖 𝕗 𝕘 𝕙 𝕚 𝕛 𝕜 𝕝 𝕞 𝕟 𝕠 𝕡 𝕢 𝕣 𝕤 𝕥 𝕦 𝕧 𝕨 𝕩 𝕪 𝕫  -->
<!-- 𝟘 𝟙 𝟚 𝟛 𝟜 𝟝 𝟞 𝟟 𝟠 𝟡 -->
<!-- 𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡 -->
<!-- http://github.com/tandpfun/skill-icons#readme -->
<!-- [tag_test]: url "on hover" -->
<!-- Ceci sont des commentaire pour avec ma font: Double-struck et des icon personnaliser -->

[tag_icon_front]: https://skillicons.dev/icons?i=react,sass
[tag_icon_back]: https://skillicons.dev/icons?i=express,js
[tag_icon_db]: https://skillicons.dev/icons?i=mysql
[tag_icon_infrastructure]: https://skillicons.dev/icons?i=docker,nginx
[tag_icon_all]: https://skillicons.dev/icons?i=github,npm,nodejs,docker,nginx,express,mysql,react,js,html,sass,ts,makefile
[tag_ressource_grid]: https://cssgrid-generator.netlify.app/

# 𝔽t_transcendence too late (without `_` yes....)
<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=github,npm,nodejs,docker,nginx,express,mysql,react,js,html,sass,ts" />
    <!-- ![icons][tag_icon_all] -->
  </a>
</p>

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
| Fcretin   | Product Owner   | Product vision, prioritization                                                |
| Tvoisin   | Project Manager | Team coordination, task tracking & deadline management                        |
| Edarnand  | Technical Lead  | Architecture design, code quality, code reviews, code refactor                |
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

Weekly planning sessions with a short retrospective to identify blockers and improvements.


### Tools Used

| Purpose              | Tool                              |
| :---                 | :---                              |
| Version control      | Git & GitHub                      |
| Communication        | Discord                           |

### Meetings & Communication

- Weekly sprint planning meetings.
- All major technical decisions were discussed (but never be documented in something like GitHub Issues, Notion) before implementation.

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
| Git            | Any standard version                   |
| Make           | Any standard version                   |
| Docker Compose | >= 2.x (included with Docker Desktop)  |
| Docker         | >= 24.x                                |

> No local Node.js, MySQL, or Nginx installation required — everything runs inside Docker containers.

### Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ft_transcendence
   ```

2. **Create your environment file:**
   ```bash
   cp env.exemple .env
   ```
      <!-- cp /sgoinfre/fcretin/private/ft_transcendence_too_late/.env .env -->
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

#### Once running,
- Prod open your browser at: `https://localhost:9443`
- Dev open your browser at: `http://localhost:5173` (`http://localhost:8081` PHPMyAdmin)

- [🗓 𝕊ummary](#summary)

</details>

<br>

---

<br>

<details id="tech_stack">
    <summary>
        <h2>🏗 𝕋echnical 𝕊tack</h2>
    </summary>

### Infrastructure & DevOps ![icons][tag_icon_infrastructure]

| Technology        | Role                                                                                     |
| :---              | :---                                                                                     |
| **Makefile**      | Simplified CLI interface for common dev/prod operations                                  |
| **Docker Compose**| Orchestration of multi-container setup (frontend, backend, database, nginx, phpmyadmin)  |
| **Docker**        | Containerization of every service for reproducible, isolated environments                |
| **Nginx**         | Reverse proxy, HTTPS termination, and static file serving for the compiled frontend      |

> **Why Docker?** Docker ensures every team member and evaluator runs the exact same environment, eliminating "works on my machine" issues and simplifying deployment.

### Frontend ![icons][tag_icon_front]

| Technology        | Role                                                                    |
| :---              | :---                                                                    |
| **Vite (dev)**    | Fast build tool and dev server for the React frontend                   |
| **React JSX**     | Component-based UI framework for a dynamic single-page application      |
| **SCSS**          | Structured and maintainable styling with variables, nesting, and mixins |
| **Babylon**       | oui |

> **Why React?** React's component model fits the modular nature of the app (game views, chat, profile, etc.), its ecosystem accelerated development significantly and Mainstream.

### Backend ![icons][tag_icon_back]

| Technology          | Role                                                                                |
| :---                | :---                                                                                |
| **Express.js**      | API gateway handling auth, user management, chat, and routing                       |
| **WebSockets (ws)** | Low-level WebSocket library powering the Morpion matchmaking and room system        |
| **Colyseus (TS)**   | Authoritative game server framework for Pong 3D, handling rooms and game state      |

> **Why Colyseus for Pong 3D ?** Colyseus provides built-in room management, server-side game loop, and delta-state synchronization — exactly what a real-time 3D game requires. It runs in TypeScript for type safety in complex game logic.

> **Why custom WebSockets for Morpion (chat other) ?** The Morpion game required a lightweight, fully custom matchmaking system (room creation, player queuing, game state relay) built from scratch to demonstrate mastery of the WebSocket protocol without abstractions.

### Database ![icons][tag_icon_db]

| Technology     | Role                                                      |
| :---           | :---                                                      |
| **MySQL**      | Relational database for persistent storage                |
| **Sequelize**  | ORM for schema definition, migrations, and query building |

> **Why MySQL, Sequelize?** MySQL is a battle-tested relational database well-suited to the structured, relational data of this project (users, matches, stats). Sequelize adds type-safe model definitions and simplifies migrations.

- [🗓 𝕊ummary](#summary)

</details>

<br>

---

<br>

<details id="db_schema">
    <summary>
        <h2>🗄 𝔻atabase 𝕊chema</h2>
    </summary>

The database contains **11 tables** managed via Sequelize ORM. A `StatMorp` and `StatPong3D` row is automatically created for each new user via a Sequelize `afterCreate` hook.

---

#### `user_co` — Users
| Field              | Type          | Notes                                          |
| :---               | :---          | :---                                           |
| `id`               | INT (PK)      | Auto-increment primary key                     |
| `name`             | VARCHAR(128)  | Display name, required                         |
| `Log42`            | VARCHAR(128)  | 42 school login, nullable (OAuth users)        |
| `password`         | VARCHAR(128)  | Hashed password, nullable (OAuth users)        |
| `mail`             | VARCHAR(256)  | Unique email address, required                 |
| `adress`           | VARCHAR(256)  | Optional address                               |
| `phoneNumber`      | VARCHAR(20)   | Optional phone number                          |
| `OAuth`            | BOOLEAN       | Whether account was created via OAuth          |
| `MPFA`             | BOOLEAN       | 2FA enabled flag (default: true)               |
| `co`               | BOOLEAN       | Currently connected flag                       |
| `password_2FA`     | VARCHAR(256)  | Temporary 2FA code, nullable                   |
| `password_2FA_time`| TIME          | Expiry time of the 2FA code                    |
| `Hostlastco`       | VARCHAR(256)  | IP/host of last connection, nullable           |
| `Datelastco`       | DATE          | Date of last connection, nullable              |

---

#### `connect_co` — Active Sessions / Tokens
| Field    | Type         | Notes                              |
| :---     | :---         | :---                               |
| `id`     | INT (PK)     | Auto-increment primary key         |
| `token`  | VARCHAR(512) | Session/JWT token, required        |
| `userId` | INT (FK)     | References `user_co.id` (CASCADE)  |

---

#### `Friend` — Friend Relationships
| Field    | Type    | Notes                                             |
| :---     | :---    | :---                                              |
| `Friend1`| INT (PK, FK) | First user — references `user_co.id`         |
| `Friend2`| INT (PK, FK) | Second user — references `user_co.id`        |
| `State`  | BOOLEAN | Friendship accepted (default: false = pending)    |
| `WhoAsk` | INT (FK)| User who sent the request — references `user_co.id`|

> Composite primary key on `(Friend1, Friend2)` enforces uniqueness of each pair.

---

#### `PswEmail` — Password / Email Verification Codes
| Field        | Type         | Notes                                      |
| :---         | :---         | :---                                       |
| `id`         | INT (PK)     | Auto-increment primary key                 |
| `type`       | INT          | Code type (e.g. password reset vs 2FA)     |
| `idUser`     | INT (FK)     | References `user_co.id`                    |
| `Code`       | VARCHAR(512) | The verification/reset code                |
| `DateCreate` | DATE         | Code creation timestamp                    |

---

#### `chat_G` — Global Chat Messages
| Field      | Type         | Notes                              |
| :---       | :---         | :---                               |
| `contenu`  | VARCHAR(512) | Message content, required          |
| `time`     | TIME         | Time the message was sent          |
| `SenderId` | INT (FK)     | References `user_co.id` (CASCADE)  |

---

#### `PrivChat` — Private Conversations
| Field      | Type    | Notes                            |
| :---       | :---    | :---                             |
| `id`       | INT (PK)| Auto-increment primary key       |
| `id1`      | INT (FK)| First participant — `user_co.id` |
| `id2`      | INT (FK)| Second participant — `user_co.id`|
| `lastmess` | DATE    | Timestamp of latest message      |

---

#### `PrivMess` — Private Messages
| Field      | Type         | Notes                               |
| :---       | :---         | :---                                |
| `id`       | INT (PK)     | Auto-increment primary key          |
| `SenderId` | INT (FK)     | Sender — references `user_co.id`    |
| `contenu`  | VARCHAR(512) | Message content, required           |
| `time`     | TIME         | Time the message was sent           |
| `ChatId`   | INT (FK)     | References `PrivChat.id` (CASCADE)  |

---

#### `GameMorp` — Morpion Match Records
| Field            | Type         | Notes                                                            |
| :---             | :---         | :---                                                             |
| `id`             | INT (PK)     | Auto-increment primary key                                       |
| `how_win`        | ENUM         | `horizontal`, `diagonal_lr`, `diagonal_rl`, `vertical`, `abort`, `draw` |
| `date_game`      | DATE         | Match date (default: now)                                        |
| `player_1`       | INT (FK)     | References `user_co.id` (CASCADE)                                |
| `player_2`       | INT (FK)     | References `user_co.id` (CASCADE)                                |
| `winner`         | INT (FK)     | References `user_co.id`, nullable                                |
| `loser`          | INT (FK)     | References `user_co.id`, nullable                                |
| `time_player_1`  | INT          | Total time spent by player 1 (ms)                                |
| `time_player_2`  | INT          | Total time spent by player 2 (ms)                                |
| `nb_turn_player_1`| INT         | Number of turns played by player 1                               |
| `nb_turn_player_2`| INT         | Number of turns played by player 2                               |
| `map`            | VARCHAR(128) | Board state snapshot (e.g. `"OX--XO-XO"`)                        |

---

#### `StatMorp` — Morpion Aggregated Statistics (per user)
One row per user, auto-created on user registration. Tracks win/loss counts broken down by symbol (X or O) and win condition type.

| Field                    | Type | Notes                                    |
| :---                     | :--- | :---                                     |
| `idUser`                 | INT (FK) | References `user_co.id`              |
| `total_game`             | INT  | Total games played                       |
| `time_played`            | INT  | Total time played (ms)                   |
| `nb_turn_played`         | INT  | Total turns played                       |
| `type_X_horizontal_winner` | INT | Wins as X via horizontal alignment     |
| `type_X_horizontal_loser`  | INT | Losses as X vs horizontal alignment    |
| `type_X_vertical_winner`   | INT | Wins as X via vertical alignment       |
| `type_X_vertical_loser`    | INT | Losses as X vs vertical alignment      |
| `type_X_diagonal_winner`   | INT | Wins as X via diagonal                 |
| `type_X_diagonal_loser`    | INT | Losses as X vs diagonal                |
| `type_X_abort_winner`      | INT | Wins as X by opponent abort            |
| `type_X_abort_loser`       | INT | Losses as X by own abort               |
| `type_X_draw`              | INT | Draws as X                             |
| *(same fields for O)*    | INT  | Identical set repeated for symbol O      |

---

#### `GamePong3D` — Pong 3D Match Records
| Field             | Type    | Notes                                        |
| :---              | :---    | :---                                         |
| `id`              | INT (PK)| Auto-increment primary key                   |
| `id_player_1`     | INT (FK)| References `user_co.id` (CASCADE)            |
| `score_1`         | INT     | Score of player 1                            |
| `id_player_2`     | INT (FK)| References `user_co.id` (CASCADE)            |
| `score_2`         | INT     | Score of player 2                            |
| `abortwinner`     | INT (FK)| Winner if game was aborted, nullable         |
| `abortloser`      | INT (FK)| Loser if game was aborted, nullable          |
| `winner`          | INT (FK)| Normal winner, nullable                      |
| `loser`           | INT (FK)| Normal loser, nullable                       |
| `date_game_start` | DATE    | Match start timestamp                        |
| `date_game_end`   | DATE    | Match end timestamp (default: now)           |
| `time`            | INT     | Match duration (ms)                          |

---

#### `StatPong3D` — Pong 3D Aggregated Statistics (per user)
One row per user, auto-created on user registration.

| Field        | Type     | Notes                             |
| :---         | :---     | :---                              |
| `idUser`     | INT (FK) | References `user_co.id`           |
| `total_game` | INT      | Total games played                |
| `time_played`| INT      | Total time played (ms)            |
| `win`        | INT      | Total wins                        |
| `lose`       | INT      | Total losses                      |
| `abortwinner`| INT      | Games won by opponent abort       |
| `abortloser` | INT      | Games lost by own abort           |

---

### Relationships Summary

```
user_co
  ├── has many connect_co         (sessions/tokens)
  ├── has many PswEmail           (verification codes)
  ├── has many chat_G             (global chat messages sent)
  ├── belongs to many User        through Friend (as Friends / FriendOf)
  ├── has many PrivChat           (as user1 or user2)
  ├── has many GameMorp           (as player_1, player_2, winner, loser)
  ├── has one  StatMorp           (auto-created on register)
  ├── has many GamePong3D         (as id_player_1, id_player_2, winner, loser)
  └── has one  StatPong3D         (auto-created on register)

PrivChat
  └── has many PrivMess
```

- [🗓 𝕊ummary](#summary)

</details>


<br>

---

<br>

<details id="features">
    <summary>
        <h2>🎮 𝔽eatures 𝕃ist</h2>
    </summary>

| Feature                        | Description                                                                 | Contributor(s)         |
| :---                           | :---                                                                        | :---                   |
| **Docker Containerization**    | Full multi-service Docker setup for dev and prod                            | Tvoisin                |
| **Nginx & Express**            | HTTPS routing, route API                                                    | Tvoisin                |
| **Database & ORM**             | Mysql init with sequalize & PHPMyAdmin                                      | Tvoisin                |
| **Frontend**                   | Html in jsx, logic & scss                                                   | Fcretin  Edarnand      |
| **Pong 3D**                    | 3D Pong game with real-time multiplayer via Colyseus rooms                  | Sflechel               |
| **Morpion (Tic-Tac-Toe)**      | Multiplayer Morpion with custom matchmaking and room system via WebSockets  | Niroched               |

- [🗓 𝕊ummary](#summary)

</details>

<br>

---

<br>

<details id="modules">
    <summary>
        <h2>📦 𝕄odules</h2>
    </summary>

| Module                                                                                        | Type  | Points | Implemented By   | Description       |
| :---                                                                                          | :---  | :---   | :---             | :---              |
| Use a framework for both the frontend and backend.                                            | Major | 2pts   | Fcretin Tvoisin  | ...               |
| Implement real-time features using WebSockets or similar technology.                          | Major | 4pts   |                  | ...               |
| Remote players — Enable two players on separate computers to play the same game in real-time. | Major | 6pts   |                  | ...               |
| Introduce an AI Opponent for games                                                            | Major | 8pts   |                  | ...               |
| Implement advanced 3D graphics using a library like Three.js or Babylon.js.                   | Major | 10pts  |                  | ...               |
| Allow users to interact with other users.                                                     | Major | 12pts  |                  | ...               |
| Implement a complete web-based game where users can play against each other.                  | Major | 14pts  |                  | ...               |
| Add another game with user history and matchmaking.                                           | Major | 16pts  |                  | ...               |
| Use an ORM for the database.                                                                  | Minor | 17pts  |                  | ...               |
| Implement remote authentication with OAuth 2.0 (Google, GitHub, 42, etc.).                    | Minor | 18pts  |                  | ...               |
| Implement a complete 2FA (Two-Factor Authentication) system for the users.                    | Minor | 19pts  |                  | ...               |
| ...                                                                                           | ...   | ...    |                  | ...               |
| Backend as microservices.                                                                     | Major | ...    |                  | ...               |
| Support for additional browsers.                                                              | Minor | ...    |                  | ...               |


- [🗓 𝕊ummary](#summary)

</details>

<br>

---

<br>

<details id="contributions">
    <summary>
        <h2>🙋 𝕀ndividual ℂontributions</h2>
    </summary>

### Fcretin — Product Owner
- Defined product vision for all major features.
- Maintained and prioritized features throughout the project.
- **Challenge**: by quickly identifying lower-priority features and focusing on the main interface.

### Tvoisin — Project Manager
- Organized sprint planning and retrospectives.
- Tracked tasks and deadlines.
- Designed the overall microservice architecture and Docker Compose setup.
- Wrote all Dockerfiles and Nginx configuration.
- Implemented the Makefile, the Express.js gateway, API routes, and the database schema (Sequelize models).

### Edarnand — Technical Lead
- Conducted code reviews and make sure every part of the project worked together.
- Paid attention to the standardization of the UI/UX on the site
- Work with sflechel on Pong3d game and server implementation
- **Challenge**: ... .

### Sflechel — Developer
- Built the Pong 3D game in TypeScript using the Colyseus framework.
- Implemented the Colyseus game rooms, server-side game loop, ball physics, and state synchronization to the React frontend.
- Integrated the Colyseus client in the React frontend for live game updates.
- **Challenge**: ... .
### Niroched — Developer
- Built the entire Morpion (Tic-Tac-Toe) game from scratch, including game logic, win detection, and board state management.
- Designed and implemented the custom WebSocket matchmaking system: player queuing, room creation, and game state relay, spectator built entirely from scratch without a game server framework.
- **Challenge**: ... .


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

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [WebSocket API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Sequelize ORM Documentation](https://sequelize.org/)
- [Colyseus Documentation](https://docs.colyseus.io/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [SCSS / Sass Documentation](https://sass-lang.com/documentation/)
- [Javascript Documentation](https://javascript.info/)

### AI Usage

Claude, Gemini was used during this project for the following tasks:

- **README drafting**: this README based on project requirements and baseReadme.md.
- **UI transitions & animations**: Generating CSS transition ideas for the frontend.
- **Boilerplate generation**: Generating initial Sequelize model definitions and Express route scaffolding to accelerate development.
- **Good practice & bug seeking**: ....

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
    │   ├── add_db                  # Optional include user and other
    │   ├── init_db                 # DB initialization logic
    │   ├── models                  # Sequelize ORM models (User, Match, Stats, Message)
    │   ├── common
    │   ├── gameServer              # Colyseus game server entry point (TypeScript)
    │   ├── gateway                 # Express API gateway (routing)
    │   ├── auth                    # Authentication routes & logic
    │   │   ├── package.json
    │   │   ├── Dockerfile
    │   │   └── src
    │   │       ├── AuthServ_p.js
    │   │       ├── models
    │   │       └── routes
    │   │           ├── auth
    │   │           │   ├── auth.controller.js
    │   │           │   ├── auth.DTO.js
    │   │           │   └── auth.service.js
    │   │           ├── index_p.js  
    │   │           ├── Oauth       # Controler / DTO / service
    │   │           └── secu        # Controler / DTO / service
    │   ├── chat                    # Real-time chat WebSocket handler
    │   ├── morpion                 # Morpion game logic + custom matchmaking (WebSockets)
    │   ├── pong3D                  # Pong 3D Colyseus rooms and game loop (TypeScript)
    │   └── user                    # User profile & stats routes
    └── front
        ├── Dockerfile              # Frontend container image
        ├── package.json
        ├── media                   # Static assets (images, fonts)
        ├── tool                    # Frontend utility scripts
        ├── index.html              # App entry point
        ├── prod                    # Production server Nginx
        ├── vite.config.js          # Devlopement server build configuration
        └── src                     # React source code (components, pages, hooks)
```

- [🗓 𝕊ummary](#summary)

</details>
