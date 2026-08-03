# Cost Tracker App + SonarQube

Proyecto de ejemplo del video de YouTube sobre **auditoría de código con SonarQube**. Es una app de control de gastos construida con **TanStack Start** (React) + **Drizzle ORM** + **SQLite**, que se analiza con **SonarQube** para detectar vulnerabilidades, bugs y code smells.

> ⚠️ **Importante:** el código contiene vulnerabilidades **intencionales** (SQL Injection, secretos hardcodeados, contraseñas en texto plano) para demostrar cómo SonarQube las detecta. **No lo uses en producción tal cual está.**

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend/Backend | TanStack Start (React 19 + Vite) |
| Base de datos | SQLite + Drizzle ORM |
| Autenticación | JWT |
| Calidad de código | SonarQube (Sonar Scanner) |
| Infra | Docker Compose (SonarQube + PostgreSQL) |

## Estructura

```
.
├── docker-compose.yml            # SonarQube + PostgreSQL (DB del análisis)
├── cost-tracker-app/             # La aplicación
│   ├── src/                      # Código fuente (React + server functions)
│   ├── db/                       # Esquema y seed de la base de datos
│   ├── data/                     # BD SQLite (no versionada)
│   ├── .env.example              # Variables de entorno de ejemplo
│   ├── sonar-project.properties  # Configuración del análisis de SonarQube
│   └── drizzle.config.ts         # Config de Drizzle
```

## Requisitos

- Node.js 20+
- Docker y Docker Compose
- Sonar Scanner CLI (`sonar-scanner`)

## Puesta en marcha

### 1. Arrancar la aplicación

```bash
cd cost-tracker-app
cp .env.example .env          # y pon un JWT_SECRET propio
npm install
npm run db:push               # crea las tablas en SQLite
npm run db:seed               # datos de ejemplo
npm run dev
```

La app corre en `http://localhost:3000`.

### 2. Levantar SonarQube

```bash
docker compose up -d
```

Espera a que arranque (tarda un poco la primera vez) y entra a `http://localhost:9000`.
Credenciales por defecto: `admin` / `admin`.

### 3. Crear el proyecto y analizar

1. En SonarQube, crea un proyecto llamado `cost-tracker-app`.
2. Genera un token y copia el comando `sonar-scanner` que te muestra.
3. Ejecútalo dentro de `cost-tracker-app/`:

```bash
sonar-scanner \
  -Dsonar.projectKey=cost-tracker-app \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=TU_TOKEN
```

La configuración de fuentes, exclusions y TypeScript ya está en `sonar-project.properties`.

### 4. Ver el reporte

En `http://localhost:9000/dashboard?id=cost-tracker-app` verás:

- **Security Hotspots** → las SQL Injections en `src/server/auth.ts`
- **Code Smells** y **Bugs** → reglas de React, TypeScript y mejores prácticas
- **Cobertura** (si configuras tu test runner)
- Métricas de **Duplicated Lines**, **Complexity**, **Maintainability** y más

## Vulnerabilidades intencionales

Este repo se usa como demo, así que incluye problemas a propósito para que SonarQube los marque:

| Archivo | Problema | Regla |
|---------|----------|-------|
| `src/server/auth.ts` | SQL Injection en login/registro | `sql-injection` |
| `src/server/auth.ts` | Secreto JWT hardcodeado/débil | `hardcoded-credential` |
| `src/server/auth.ts` | Contraseñas guardadas en texto plano | `storage-of-sensitive-data` |
| `db/seed.ts` | Contraseñas de ejemplo en el código | `hardcoded-credential` |

La corrección de cada una queda como ejercicio: usa queries parametrizadas (Drizzle), hashea las contraseñas (bcrypt/argon2) y maneja el secreto vía variables de entorno.

## Scripts

```bash
npm run dev          # servidor de desarrollo
npm run build        # build de producción
npm run typecheck    # chequeo de tipos (tsc --noEmit)
npm run db:push      # sincroniza el esquema con SQLite
npm run db:seed      # inserta datos de ejemplo
```

## Recursos

- [SonarQube Docs](https://docs.sonarqube.org/)
- [SonarQube Rules](https://rules.sonarsource.com/)
- [TanStack Start](https://tanstack.com/start)
- [Drizzle ORM](https://orm.drizzle.team/)
