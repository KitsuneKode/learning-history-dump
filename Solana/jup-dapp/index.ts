import axios, { AxiosError } from "axios";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";

const qty = 0.0000001 * LAMPORTS_PER_SOL;
const JUP_URl = "https://lite-api.jup.ag";

const SLIPPAGE = 5;

const privateKey = bs58.decode(process.env.PRIVATE_KEY!);

const inputMint = "So11111111111111111111111111111111111111112";
const outPutTokenMintName = "TROLL";
const outputMint = "5UUH9RTDiSpq6HKS6bp4NdU9PNJpXRXuiw6ShBTBhgH2";

const keyPair = Keypair.fromSecretKey(privateKey);

const publicKey = keyPair.publicKey.toBase58();
const connection = new Connection(process.env.RPC_ENDPOINT!, "confirmed");

async function swap() {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${JUP_URl}/swap/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${qty}&slippageBps=${SLIPPAGE}&userPublicKey=${publicKey}`,
    headers: {
      Accept: "application/json",
    },
  };

  try {
    const quoteResponse = await axios.request(config);

    if (quoteResponse.data) {
      // console.log(quoteResponse.data);
      console.log(
        `You will get ${quoteResponse.data.outAmount} of ${outPutTokenMintName} for ${qty} of SOL `,
      );

      const quoteData = JSON.stringify({
        quoteResponse: quoteResponse.data,
        userPublicKey: publicKey,
      });
      const ans = prompt("do you to swap? y/n ");

      if (ans === "y") {
        await requestUnsignedSwapTransaction(quoteData);
      }
    }
  } catch (error) {
    console.error((error as AxiosError).message);
  }
}

async function requestUnsignedSwapTransaction(quoteData: string) {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://lite-api.jup.ag/swap/v1/swap",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: quoteData,
  };

  try {
    const marketResponse = await axios.request(config);

    if (marketResponse.data) {
      console.log({ swapTransaction: marketResponse.data.swapTransaction });

      const tx = Uint8Array.from(
        Buffer.from(marketResponse.data.swapTransaction, "base64"),
      );
      await signSwapTransaction(tx);
    }
  } catch (error) {
    console.error((error as AxiosError).message);
  }
}

async function signSwapTransaction(transaction: Uint8Array) {
  try {
    const tx = VersionedTransaction.deserialize(transaction);
    tx.sign([keyPair]);

    const txId = await connection.sendTransaction(tx);
    console.log(`https://explorer.solana.com/tx/${txId}?cluster=mainnet`);
  } catch (error) {
    console.error(error);
  }
}

swap();
