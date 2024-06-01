"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";

const LoginPage = () => {
  const [account, setAccount] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    connect();
  }, []);

  const handleLogin = () => {
    if (account) {
      const signMessage = async () => {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner(); // 使用 'await' 获取 signer
          const message = "Please sign this message to log in";
          const signature = await signer.signMessage(message);
          console.log("Signature:", signature);
          // 发送签名到后台进行验证
          const response = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, signature, address: account }),
          });
          const result = await response.json();
          if (result.success) {
            router.push("/dashboard");
          } else {
            alert("Verification failed");
          }
        } catch (error) {
          console.error(error);
        }
      };
      signMessage();
    } else {
      alert("Please login your metamask wallet first!");
    }
  };

  const connect = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (ex) {
      console.error(ex);
    }
  };

  return (
    <div>
      {!account ? (
        <button onClick={connect}>Connect with MetaMask</button>
      ) : (
        <div>Connected as {account}</div>
      )}
      <button onClick={handleLogin}>Login with Metamask</button>
    </div>
  );
};

export default LoginPage;
