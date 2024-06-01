import { ethers } from "ethers";

export async function POST(request: Request) {
  const { message, signature, address } = await request.json();

  try {
    const signerAddress = ethers.verifyMessage(message, signature);
    console.log(signerAddress);

    if (signerAddress.toLowerCase() === address.toLowerCase()) {
      return new Response(
        JSON.stringify({ success: true, message: "Signature verified" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Signature verification failed",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
