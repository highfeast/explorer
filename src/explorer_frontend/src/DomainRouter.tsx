import React, { useEffect, useState } from "react";
import GlassContainer from "./lib/components/molecules/glass-container";
import ChatWrapper from "./lib/components/template/chat-wrapper";
import QueryInterface from "./pages/Chat";
import ProviderWrapper from "./ProviderWrapper";

type DomainRouterProps = {
  children: React.ReactNode;
};

export default function DomainRouter({ children }: DomainRouterProps) {
  const [subDomain, setSubDomain] = useState<string | null>(null);

  useEffect(() => {
    const host = window.location.host;
    const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
    if (arr.length > 0) setSubDomain(arr[0]);
  }, []);

  return (
    <ProviderWrapper subDomain={subDomain}>
      {subDomain ? (
        <ChatWrapper>
          <GlassContainer>
            <QueryInterface storeId={subDomain} />
          </GlassContainer>
        </ChatWrapper>
      ) : (
        children
      )}
    </ProviderWrapper>
  );
}