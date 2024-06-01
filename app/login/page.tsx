"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useSearchParams } from "next/navigation";

import Image from "next/image";

// 擴展 window 類型以包含 ethereum 屬性
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const params = useSearchParams();

  console.log("params", params.get("code"));
  useEffect(() => {
    if (params.get("code")) {
      const error = params.get("code");
      setError(error as string);
    }
  }, []);

  const handleTeacherLogin = async () => {
    try {
      await signIn("Email", { email, password });
    } catch (error) {
      console.error("Teacher login failed:", error);
      setError("Teacher login failed");
    }
  };

  const signVerifyMessage = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const message = "Please sign the message to login.";
    const signature = await signer.signMessage(message);
    console.log("Signature:", signature);
    return [signer.address, message, signature] as const;
  };

  const handleIssuerLogin = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        // const address = accounts[0];
        // console.log("address", address);
        const [signer, message, signature] = await signVerifyMessage();
        console.log(signature);

        await signIn("Metamask", { address: signer, message, signature });
      } catch (error) {
        console.error("Issuer login failed:", error);
        setError("Issuer login failed");
      }
    } else {
      setError("MetaMask is not installed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl mb-4">
        <Image alt="Logo" src="/Logo.png" width={150} height={100} />
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <h2 className="text-xl">Teacher Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2 p-2 border border-gray-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2 p-2 border border-gray-300"
        />
        <button
          onClick={handleTeacherLogin}
          className="p-2 bg-blue-500 text-white"
        >
          Login as Teacher
        </button>
      </div>
      <div>
        <h2 className="text-xl">Issuer Login with MetaMask</h2>
        <button
          onClick={handleIssuerLogin}
          className="p-2 bg-green-500 text-white"
        >
          Login with MetaMask
        </button>
      </div>
    </div>
  );
}
