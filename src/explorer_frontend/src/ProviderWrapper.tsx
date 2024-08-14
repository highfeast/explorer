import React from "react";
import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth";
import { SiweIdentityProvider } from "ic-use-siwe-identity";
import { InternetIdentityProvider } from "ic-use-internet-identity";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "@privy-io/wagmi";
import { canisterId, idlFactory } from "../../declarations/ic_siwe_provider";
import { privyConfig, wagmiConfig } from "./eth/config";
import { Erc4337Provider } from "./eth/EthContext";
import Actors from "./ic/Actors";
import ActorsII from "./ic/ii/Actors";
import AuthController from "./AuthGuard";
import { BluebandProvider } from "ic-use-blueband-db";

const queryClient = new QueryClient();

type ProviderWrapperProps = {
  children: React.ReactNode;
  storeId: string | undefined;
};

export default function ProviderWrapper({
  children,
  storeId,
}: ProviderWrapperProps) {
  if (storeId && storeId.length > 0) {
    return (
      <InternetIdentityProvider>
        <ActorsII>
          <BluebandProvider>{children}</BluebandProvider>
        </ActorsII>
      </InternetIdentityProvider>
    );
  }

  return (
    <PrivyProvider
      appId={"clz451ibc04ptqp7hpa3i817v"}
      config={privyConfig as PrivyClientConfig}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <Erc4337Provider>
            <SiweIdentityProvider<any>
              canisterId={canisterId}
              idlFactory={idlFactory as any}
            >
              <Actors>
                <AuthController>
                  <BluebandProvider>{children}</BluebandProvider>
                </AuthController>
              </Actors>
            </SiweIdentityProvider>
          </Erc4337Provider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
