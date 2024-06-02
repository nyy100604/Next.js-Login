
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
Project refer to https://authjs.dev/.

## Auth.js 安裝及配置
1.安裝套件
```bash
// 首先，確保已安裝 NextAuth.js 和 ethers packages：
npm install next-auth@beta ethers
```
2.配置環境變數AUTH_SECRET以及JWT_SECRET
```bash
// 生成AUTH_SECRET
npx auth secret
//.env
AUTH_SECRET=
JWT_SECRET=
```
3.Start by creating a new auth.ts file at the root of your app with the following content.
```bash
import NextAuth from "next-auth"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
})
```
4.Add an Route Handler under /app/api/auth/[...nextauth]/route.ts.
```bash
import { handlers } from "@/auth" // Referring to the auth.ts we just created
export const { GET, POST } = handlers
```




