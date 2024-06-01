import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ethers, getAddress, verifyMessage } from "ethers";

class InvalidMetamaskLogin extends CredentialsSignin {
  code = "Invalid Address";
}

class InvalidEmailLogin extends CredentialsSignin {
  code = "Invalid Email";
}

class systemError extends CredentialsSignin {
  code = "System Error";
}

interface User {
  id: number;
  email?: string;
  address?: string;
  password?: string;
  role: string;
}

const getUserByEmail = async (email: string): Promise<User | null> => {
  // similate get a teacherdata from database
  if (email === "nyy100604@gmail.com") {
    return { id: 1, email, role: "teacher" };
  }
  throw new Error("");
};

const getUserByAddress = async (address: string): Promise<User | null> => {
  // similate get a addressdata from database
  if (address === "0x54d160a7AeC0bAdDa0CF718b9989Dfff5f6f6f8C") {
    return { id: 2, address, role: "issuer" };
  }
  throw new Error("");
};

export const { signIn, signOut, auth, handlers } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Metamask",
      id: "Metamask",
      credentials: {
        address: { label: "Address", type: "text", placeholder: "0x0" },
        message: { label: "Message", type: "text", placeholder: "" },
        signature: { label: "Signerture", type: "text", placeholder: "" },
      },
      //@ts-ignore
      async authorize(
        credentials: { address: string; message: string; signature: string },
        request
      ) {
        if (credentials) {
          console.log("credentials", credentials);

          try {
            // const singer = getAddress(credentials.address as string);
            // console.log("address", singer);
            console.log("message", credentials.message);
            console.log("signature", credentials.signature);

            const signerAddress = verifyMessage(
              credentials.message,
              credentials.signature
            );
            console.log("signerAddress", signerAddress);
            const user = await getUserByAddress(signerAddress);
            if (user && user.role === "issuer") {
              return user;
            }
          } catch (e) {
            console.error("Invalid address");
            throw new InvalidMetamaskLogin();
          }
        }
        throw new systemError();
      },
    }),
    CredentialsProvider({
      name: "Email",
      id: "Email",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "" },
        password: { label: "Password", type: "text", placeholder: "" },
      },
      //@ts-ignore
      async authorize(
        credentials: { email: string; password: string },
        request
      ) {
        if (credentials) {
          console.log("credentials", credentials);

          try {
            const user = await getUserByEmail(credentials.email);
            if (user && user.role === "teacher") {
              console.log("user", user);

              return user;
            }
          } catch (e) {
            console.error("Invalid email");
            throw new InvalidEmailLogin();
          }
        }
        throw new systemError();
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      console.log("role", user?.role);

      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },
  },
});
