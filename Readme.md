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

[tag_icon_react]: https://skillicons.dev/icons?i=react
[tag_icon_js]: https://skillicons.dev/icons?i=js
[tag_icon_infrastructure]: https://skillicons.dev/icons?i=docker,nginx,express,js
[tag_icon_db]: https://skillicons.dev/icons?i=mysql
[tag_icon_all]: https://skillicons.dev/icons?i=github,npm,nodejs,docker,nginx,express,mysql,react,js,html,sass,ts
[tag_ressource_grid]: https://cssgrid-generator.netlify.app/ 
[tag_ressource_claude_transition]: https://claude.ai/public/artifacts/96fe632f-2869-4d78-99f4-20053d0ebf7c

# 𝔽t_transcendence
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
| Fcretin   | Product Owner   | Product vision, backlog prioritization                                        |
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
   cp /sgoinfre/fcretin/private/ft_transcendence_too_late/.env .env
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

### Frontend ![icons][tag_icon_react]

| Technology    | Role                                                                    |
| :---          | :---                                                                    |
| **Vite**      | Fast build tool and dev server for the React frontend                   |
| **React JSX** | Component-based UI framework for a dynamic single-page application      |
| **SCSS**      | Structured and maintainable styling with variables, nesting, and mixins |

> **Why React?** React's component model fits the modular nature of the app (game views, chat, profile, etc.), its ecosystem accelerated development significantly and main stream.

### Backend ![icons][tag_icon_js]

| Technology          | Role                                                                              |
| :---                | :---                                                                              |
| **Express.js**      | API gateway handling auth, user management, chat, and routing                |
| **WebSockets (ws)** | Low-level WebSocket library powering the Morpion matchmaking and room system      |
| **Colyseus (TS)**   | Authoritative game server framework for Pong 3D, handling rooms and game state    |

> **Why Colyseus for Pong 3D?** Colyseus provides built-in room management, server-side game loop, and delta-state synchronization — exactly what a real-time 3D game requires. It runs in TypeScript for type safety in complex game logic.

> **Why custom WebSockets for Morpion (chat other)?** The Morpion game required a lightweight, fully custom matchmaking system (room creation, player queuing, game state relay) built from scratch to demonstrate mastery of the WebSocket protocol without abstractions.

### Database ![icons][tag_icon_db]

| Technology     | Role                                                      |
| :---           | :---                                                      |
| **MySQL**      | Relational database for persistent storage                |
| **Sequelize**  | ORM for schema definition, migrations, and query building |

> **Why MySQL + Sequelize?** MySQL is a battle-tested relational database well-suited to the structured, relational data of this project (users, matches, stats). Sequelize adds type-safe model definitions and simplifies migrations.

- [🗓 𝕊ummary](#summary)

</details>

<br>

---

<br>

<details id="db_schema">
    <summary>
        <h2>🗄 𝔻atabase 𝕊chema</h2>
    </summary>

### Tables Overview

#### `users`
| Field          | Type         | Notes                        |
| :---           | :---         | :---                         |
| `id`           | INT (PK)     | Auto-increment primary key   |
| `username`     | VARCHAR(50)  | Unique, required             |
| `email`        | VARCHAR(100) | Unique, required             |
| `password_hash`| VARCHAR(255) | Bcrypt hashed password       |
| `avatar`       | VARCHAR(255) | Path or URL to avatar image  |
| `created_at`   | DATETIME     | Account creation timestamp   |

#### `matches`
| Field        | Type     | Notes                                   |
| :---         | :---     | :---                                    |
| `id`         | INT (PK) | Auto-increment primary key              |
| `game_type`  | ENUM     | `'pong3d'` or `'morpion'`               |
| `player1_id` | INT (FK) | References `users.id`                   |
| `player2_id` | INT (FK) | References `users.id`                   |
| `winner_id`  | INT (FK) | References `users.id`, nullable         |
| `played_at`  | DATETIME | Match timestamp                         |

#### `stats`
| Field       | Type     | Notes                       |
| :---        | :---     | :---                        |
| `id`        | INT (PK) | Auto-increment primary key  |
| `user_id`   | INT (FK) | References `users.id`       |
| `wins`      | INT      | Total wins                  |
| `losses`    | INT      | Total losses                |
| `game_type` | ENUM     | `'pong3d'` or `'morpion'`   |

#### `messages`
| Field       | Type         | Notes                      |
| :---        | :---         | :---                       |
| `id`        | INT (PK)     | Auto-increment primary key |
| `sender_id` | INT (FK)     | References `users.id`      |
| `content`   | TEXT         | Message body               |
| `sent_at`   | DATETIME     | Timestamp                  |

### Relationships

- A **user** has many **matches** (as player1 or player2).
- A **user** has one **stats** record per game type.
- A **match** has one **winner** (nullable until the game ends).
- A **user** has many **messages**.

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


- **`2`  `Major`**: Use a framework for both the frontend and backend.
- **`4`  `Major`**: Implement real-time features using WebSockets or similar technology.
- **`6`  `Major`**: Remote players — Enable two players on separate computers to play the same game in real-time.
- **`8`  `Major`**: Introduce an AI Opponent for games
- **`10` `Major`**: Implement advanced 3D graphics using a library like Three.js or Babylon.js.
- **`12` `Major`**: Allow users to interact with other users. The minimum requirements are:
- **`14` `Major`**: Implement a complete web-based game where users can play against each other.
- **`16` `Major`**: Add another game with user history and matchmaking.

<br>

- **`17` `Minor`**: Use an ORM for the database.
- **`18` `Minor`**: Implement remote authentication with OAuth 2.0 (Google, GitHub, 42, etc.).
- **`19` `Minor`**: Implement a complete 2FA (Two-Factor Authentication) system for the users.

### other
- **`Major`**: Backend as microservices.
- **`Minor`**: Support for additional browsers.

**Total: _19_ pts**

### Justifications

> -
> -

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
- Defined product vision and wrote user stories for all major features.
- Maintained and prioritized the product backlog throughout the project.
- **Challenge**: by quickly identifying lower-priority features and focusing on the main interface.

### Tvoisin — Project Manager
- Organized sprint planning and retrospectives.
- Tracked tasks and deadlines.
- Designed the overall microservice architecture and Docker Compose setup.
- Wrote all Dockerfiles and Nginx configuration.
- Implemented the Makefile, the Express.js gateway, API routes, and the database schema (Sequelize models).

### Edarnand — Technical Lead
- Conducted code reviews and enforced code quality standards.
- Design and wrote scss
- Work with sflechel on Pong3d game and Colyseus
- **Challenge**: Getting all services to communicate correctly through the Nginx reverse proxy — resolved by carefully mapping routes and Docker network aliases.

### Sflechel — Developer
- Built the Pong 3D game in TypeScript using the Colyseus framework.
- Implemented the Colyseus game rooms, server-side game loop, ball physics, and state synchronization to the React frontend.
- Integrated the Colyseus client in the React frontend for live game updates.
- **Challenge**: Synchronizing 3D game physics between server and client with minimal latency — resolved by running all physics on the server and sending delta updates to the client.

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

### AI Usage

Claude, Gemini was used during this project for the following tasks:

- **README drafting**: this README based on project requirements and baseReadme.md.
- **UI transitions & animations**: Generating CSS transition ideas for the frontend (see [transition artifact][tag_ressource_claude_transition]).
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
