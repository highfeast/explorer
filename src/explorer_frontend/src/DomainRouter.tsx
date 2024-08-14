import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlassContainer from "./lib/components/molecules/glass-container";
import ChatWrapper from "./lib/components/template/chat-wrapper";
import QueryInterface from "./pages/Chat";
import ProviderWrapper from "./ProviderWrapper";

type DomainRouterProps = {
  children: React.ReactNode;
};

export default function DomainRouter({ children }: DomainRouterProps) {
  // const [subDomain, setSubDomain] = useState<string | null>(null);
  const { storeId } = useParams();


  return (
    <ProviderWrapper storeId={storeId}>
      {storeId ? (
        <ChatWrapper>
          <GlassContainer>
            <QueryInterface storeId={storeId} />
          </GlassContainer>
        </ChatWrapper>
      ) : (
        children
      )}
    </ProviderWrapper>
  );
}