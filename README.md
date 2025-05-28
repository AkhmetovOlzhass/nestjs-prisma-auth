# 🛡️ NestJS Prisma Auth Boilerplate

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="100" alt="Nest Logo" />
</p>

> A **progressive, production-ready** authentication boilerplate using **NestJS**, **Prisma**, and **GraphQL** with secure email confirmation, access/refresh JWT strategy, and PostgreSQL database.

---

## ✨ Features

- 🔐 Secure **authentication system** (signup, login, logout)
- ✅ **Email confirmation** using `nodemailer`
- 🔁 JWT-based **access** and **refresh** tokens
- 📬 Email delivery via Gmail SMTP (configurable)
- 📦 Built with **Prisma ORM** and **PostgreSQL** (Supabase-ready)
- ⚙️ Easily extendable with GraphQL modules and decorators
- 🧪 Includes `@CurrentUser()` + `GqlAuthGuard` support

---

## 📁 Tech Stack

- [NestJS](https://nestjs.com)
- [GraphQL](https://docs.nestjs.com/graphql/quick-start)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/) (via Supabase)
- [JWT](https://jwt.io/)
- [Nodemailer](https://nodemailer.com/about/)

---

## 🚀 Getting Started

```bash
$ npm install
```

Create your `.env` file at root:

```dotenv
# Supabase connection pool (app usage)
DATABASE_URL="postgresql://<username>:<password>@<host>:6543/postgres?pgbouncer=true"

# Direct connection (for Prisma migrations)
DIRECT_URL="postgresql://<username>:<password>@<host>:5432/postgres"

# Email auth
EMAIL_USER=your@email.com
EMAIL_PASS=your-app-password
EMAIL_CONFIRM_SECRET=any-secret

# JWT
JWT_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret

FRONTEND_LINK=http://localhost:3001

PORT=3000
```

---

## ✅ Compile and Run Migrations

```bash
# Generate Prisma client
$ npx prisma generate

# Create and apply migration
$ npx prisma migrate dev --name init
```

---

## 🧪 Run Locally

```bash
# development
$ npm run start:dev

# production
$ npm run start:prod
```

---

## 📫 Email Confirmation Logic

Upon signup:

- User receives confirmation link like:

```
https://yourfrontend.com/confirm-email?token=xyz123
```

- Token is JWT-signed and stored in the database (`emailConfirmToken`)
- On confirmation mutation, token is verified and user marked as `emailConfirmed`

---

## 🔐 Auth Flow

1. `signup(data)` — creates user, sends email link
2. `confirmEmail(token)` — activates user
3. `login(data)` — returns `accessToken`, `refreshToken`
4. `refreshToken(token)` — issues new tokens
5. `logout()` — removes refresh token from DB

---

## 🛡 Protected Routes

Use built-in `GqlAuthGuard` + `@CurrentUser()` to protect and access private GraphQL queries:

```ts
@UseGuards(GqlAuthGuard)
@Query(() => User)
me(@CurrentUser() user) {
  return this.userService.findById(user.id);
}
```

---

## 🛠 Project Scripts

```bash
# Run unit tests
$ npm run test

# Run e2e tests
$ npm run test:e2e

# Check test coverage
$ npm run test:cov
```

---

## 📦 Deployment

Check out the [NestJS Deployment Guide](https://docs.nestjs.com/deployment) or use:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

---

## 🧠 Resources

- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [GraphQL Docs](https://graphql.org/learn/)
- [Supabase](https://supabase.com)
- [Nodemailer Docs](https://nodemailer.com/about/)

---

## 👨‍💻 Author

Made with ❤️ by \Olzhas— feel free to contribute or fork.
