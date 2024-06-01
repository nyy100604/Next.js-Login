"use client";
import { signOut } from "next-auth/react";
const Signout = () => {
  return (
    <button
      className="px-3 py-2 bg-black text-white font-bold rounded-2xl "
      onClick={() => signOut()}
    >
      signout
    </button>
  );
};

export default Signout;
