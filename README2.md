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

Once running, open your browser at: `https://localhost`

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

> **Why React?** React's component model fits the modular nature of the app (game views, chat, profile, etc.) and its ecosystem accelerated development significantly.

### Backend ![icons][tag_icon_js]

| Technology        | Role                                                                              |
| :---              | :---                                                                              |
| **Express.js**    | REST API gateway handling auth, user management, chat, and routing                |
| **WebSockets (ws)**| Low-level WebSocket library powering the Morpion matchmaking and room system    |
| **Colyseus (TS)** | Authoritative game server framework for Pong 3D, handling rooms and game state   |

> **Why Colyseus for Pong 3D?** Colyseus provides built-in room management, server-side game loop, and delta-state synchronization — exactly what a real-time 3D game requires. It runs in TypeScript for type safety in complex game logic.

> **Why custom WebSockets for Morpion?** The Morpion game required a lightweight, fully custom matchmaking system (room creation, player queuing, game state relay) built from scratch to demonstrate mastery of the WebSocket protocol without abstractions.

### Database ![icons][tag_icon_mysql]

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
| **Leaderboard**                | Player rankings by wins across game types                                   | Fcretin                |
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

> ⚠️ *Fill in the exact module names from the subject to match the official list. The table below is a draft based on your stack — update points and justifications accordingly.*

| Module                          | Type  | Points | Implemented By  | Description                                                                       |
| :---                            | :---  | :---   | :---            | :---                                                                              |
| **Use a Framework (Frontend)**  | Major | 2 pts  | All             | React JSX used as the frontend framework instead of vanilla JS                    |
| **Use a Framework (Backend)**   | Major | 2 pts  | Edarnand        | Express.js used as the backend API framework                                      |
| **WebSocket Real-Time**         | Major | 2 pts  | Niroched        | Custom WebSocket server powering Morpion matchmaking and live game state           |
| **Remote Players**              | Major | 2 pts  | Sflechel, Niroched | Both games support two remote players connecting over the network              |
| **3D Game (Pong 3D)**           | Major | 2 pts  | Sflechel        | Three-dimensional Pong using Colyseus for authoritative server-side game state    |
| **Colyseus Game Server**        | Major | 2 pts  | Sflechel        | Colyseus framework (TypeScript) manages Pong 3D rooms, state sync & game loop    |
| **Live Chat**                   | Minor | 1 pt   | Tvoisin         | Real-time messaging between connected users via WebSockets                        |
| **User Management**             | Minor | 1 pt   | Edarnand        | Registration, login, profile editing, avatar upload, stats & match history        |
| **Leaderboard**                 | Minor | 1 pt   | Fcretin         | Dynamic leaderboard displaying player rankings                                    |

**Total: _X_ pts** *(update once your full module list is confirmed)*

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
- Built the Pong 3D game in TypeScript using the Colyseus framework.
- Implemented the Colyseus game rooms, server-side game loop, ball physics, and state synchronization to the React frontend.
- Integrated the Colyseus client in the React frontend for live game updates.
- **Challenge**: Synchronizing 3D game physics between server and client with minimal latency — resolved by running all physics on the server and sending delta updates to the client.

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
