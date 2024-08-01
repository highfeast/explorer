import React, { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useSiweIdentity } from "ic-use-siwe-identity";
import GlassContainer from "./lib/components/molecules/glass-container";
import LayoutWrapper from "./lib/components/template/layout-wrapper";
import Welcome from "./pages/Welcome";
import { useAccount } from "wagmi";

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { authenticated, user } = usePrivy();
  const { address, isConnected } = useAccount();
  const { clear, isInitializing, identity, identityAddress } = useSiweIdentity();

  useEffect(() => {
    if (!isInitializing) {
      // If the user is not connected, clear the session.
      if (!isConnected && identity) {
        clear();
      }

      // If the user switches to a different address, clear the session.
      if (identityAddress && address && address !== identityAddress) {
        clear();
      }
    }
  }, [isInitializing, isConnected, identity, identityAddress, address, clear]);

  if (isInitializing) {
    return null;
  }

  // Editor's login page.
  if (!isInitializing && (!isConnected || !identity)) {
    return (
      <LayoutWrapper>
        <GlassContainer>
          <Welcome />
        </GlassContainer>
      </LayoutWrapper>
    );
  }

  return <>{children}</>;
}