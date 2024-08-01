import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ConnectedWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import {
  BiconomySmartAccountV2,
  Bundler,
  createSmartAccountClient,
  LightSigner,
  Paymaster,
  PaymasterMode,
} from "@biconomy/account";
import {
  createPublicClient,
  encodeFunctionData,
  fromBytes,
  getAddress,
  http,
  toBytes,
  toHex,
} from "viem";
import { baseSepolia } from "viem/chains";

interface EthContextType {
  index: number;
  address: `0x${string}` | null;
  isAccountModalOpen: boolean;
  network: any;
  switchNetwork: (index: number) => void;
  toggleAccountModal: () => void;
  smartAccount: BiconomySmartAccountV2 | null;
  resetSmartAccount: (privyWallet: ConnectedWallet) => void;
  handleLogin: () => void;
  handleLogout: () => void;
  publicClient: any;
}

const EthContext = createContext<EthContextType | undefined>(undefined);

export const Erc4337Provider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { authenticated, login, logout, connectOrCreateWallet } = usePrivy();
  const { wallets } = useWallets();

  const [index, setIndex] = useState<number>(0);
  const [network, switchNetwork] = useState<any | null>(baseSepolia);
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [smartAccount, setSmartAccount] =
    useState<BiconomySmartAccountV2 | null>(null);

  const toggleAccountModal = () => setIsAccountModalOpen(!isAccountModalOpen);
  

  async function smartAccountClient(privyWallet: ConnectedWallet) {
    if (!privyWallet) {
      console.log("not privy embedded wallet found");
      return;
    }
    // await privyWallet.switchChain("0x15B92");
    const provider = await privyWallet.getEthersProvider();
    const signer = provider?.getSigner() as LightSigner;

    const bundler = new Bundler({
      bundlerUrl: `https://bundler.biconomy.io/api/v2/${network.id}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
      chainId: baseSepolia.id,
    });

    const paymaster = new Paymaster({
      paymasterUrl:
        "https://paymaster.biconomy.io/api/v1/84532/mNqq4P5XS.01645e59-f431-4c62-b974-c090d95c4c05",
    });

    console.log("signer, ", provider?.getSigner() as LightSigner);
    const smClient = await createSmartAccountClient({
      signer,
      chainId: network.id,
      bundler: bundler,
      bundlerUrl: `https://bundler.biconomy.io/api/v2/${network.id}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
      biconomyPaymasterApiKey:
        'mNqq4P5XS.01645e59-f431-4c62-b974-c090d95c4c05"',
      rpcUrl: network.rpcUrls[0],
      paymaster: paymaster,
      paymasterUrl:
        "https://paymaster.biconomy.io/api/v1/84532/mNqq4P5XS.01645e59-f431-4c62-b974-c090d95c4c05",
    });
    console.log(smClient);
    return smClient;
  }

  const handleLogin = async () => {
    try {
      if (authenticated) {
        await logout();
      }
      login();
      connectOrCreateWallet();
    } catch (e) {
      console.log((e as any).message | e);
    }
  };

  const handleLogout = async () => {
    try {
      setIsAccountModalOpen(false);
      await logout();
    } catch (e) {
      console.log(e);
      console.log((e as any).message | e);
    }
  };

  const resetSmartAccount = async (privyWallet: ConnectedWallet) => {
    const smartWallet = await smartAccountClient(privyWallet);
    if (smartWallet) {
      setSmartAccount(smartWallet);
      setAddress(await smartWallet.getAddress());
    }
  };

  useEffect(() => {
    if (wallets.length > 0) {
      const embeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === "privy"
      );
      if (!embeddedWallet) {
        console.log("no embedded wallet wound");
        return;
      }
      console.log("embedded wallet", embeddedWallet);
      resetSmartAccount(embeddedWallet);
    }
  }, [wallets]);

  const publicClient = createPublicClient({
    chain: network,
    transport: http(),
  });

  return (
    <EthContext.Provider
      value={{
        index,
        address,
        network,
        smartAccount,
        publicClient,
        isAccountModalOpen,
        toggleAccountModal,
        handleLogin,
        handleLogout,
        switchNetwork,
        resetSmartAccount,
      }}
    >
      {children}
    </EthContext.Provider>
  );
};

export const useEthContext = () => {
  const context = useContext(EthContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
