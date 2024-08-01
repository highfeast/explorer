/* eslint-disable */
import { createClient, http } from "viem";
import {
  arbitrum,
  base,
  baseSepolia,
  mainnet,
  optimism,
  polygon,
  sepolia,
  zora,
} from "viem/chains";
import { createConfig } from "@privy-io/wagmi";

export const privyConfig = {
  loginMethods: ["google", "email"],
  appearance: {
    theme: "light",
    accentColor: "#676FFF",
    logo: `http://localhost:3000/logo2.svg`,
  },
  embeddedWallets: {
    createOnLogin: "all-users",
    noPromptOnSignature: false,
  },
  walletConnectCloudProjectId: "957c795c4c86e7c46609c0cd4064fa00",
};

export const supportedChains = [
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  baseSepolia,
  zora,
];


export const wagmiConfig = createConfig({
   //@ts-ignore
  chains: [mainnet, baseSepolia],
  client({ chain }) {
    return createClient({
      chain,
      transport: http()
    });
  },
});
