import { useEffect, useState } from "react";
import { Flex, Text, Button, Box, Blockquote } from "@radix-ui/themes";
import { LockKeyholeOpen } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { useSiweIdentity } from "ic-use-siwe-identity";
import { useAccount } from "wagmi";

import BearAvatar from "../../lib/components/atoms/bear-avatar";
import { useEthContext } from "../../eth/EthContext";

function Welcome() {
  const { isConnected, address } = useAccount();
  const { user, authenticated } = usePrivy();
  const { handleLogin, toggleAccountModal } = useEthContext();
  const {
    login,
    isLoggingIn,
    prepareLoginStatus,
    identity,
    prepareLogin,
    isPrepareLoginIdle,
    prepareLoginError,
    loginError,
    identityAddress,
  } = useSiweIdentity();

  /**
   * Preload a Siwe message on every address change.
   */
  useEffect(() => {
    if (!isPrepareLoginIdle || !isConnected || !address) return;
    prepareLogin();
  }, [isConnected, address, prepareLogin, isPrepareLoginIdle]);

  /**
   * Show an error toast if the prepareLogin() call fails.
   */
  useEffect(() => {
    if (prepareLoginError) {
      console.error(prepareLoginError.message, {
        position: "bottom-right",
      });
    }
  }, [prepareLoginError]);

  /**
   * Show an error toast if the login call fails.
   */
  useEffect(() => {
    if (loginError) {
      console.error(loginError.message, {
        position: "bottom-right",
      });
    }
  }, [loginError]);

  useEffect(() => {
    console.log(prepareLoginStatus, identityAddress);
  }, [prepareLoginStatus, identityAddress]);

  const handleSIWELogin = async () => {
    console.log("Login User to cannister", address);
    await login();
  };

  return (
    <>
      <Box className="mt-12  pb-6 flex flex-col h-full justify-end min-h-96 px-6">
        <Box className=" bg-white py-2" maxWidth="">
          <Blockquote
            color="green"
            size={{
              initial: "9",
              lg: "9",
            }}
            weight={"medium"}
          >
            <span className="text-[#ffc66f]">For Everyone </span> Who Eats
            <br />
          </Blockquote>
        </Box>

        <Box className="py-2" maxWidth="">
          <Text
            weight={"regular"}
            size={{
              initial: "6",
              lg: "7",
            }}
            className="mt-3 w-full  max-w-[30%] mx-0"
          >
            Create Food Assitants with your own recipes and instructions.
          </Text>
          <br />
          <br />

          <Box className="flex flex-col sm:flex-row justify-between gap-4 w-full mx-0">
            {!address ? (
              <Button
                color="green"
                variant="outline"
                size={"4"}
                className="w-full sm:w-[48%]  py-5 cursor-pointer"
                onClick={handleLogin}
                loading={isLoggingIn}
              >
                Sign in to Create
              </Button>
            ) : (
              <Button
                color="gray"
                variant="solid"
                size={"4"}
                className="w-full sm:w-[48%] bg-[#014338] min-w-full  py-5 cursor-pointer"
                onClick={handleSIWELogin}
              >
                <Box>
                  {/* <BearAvatar size="2" did={address} /> */}
                  <LockKeyholeOpen color="#f4e8c9" />
                </Box>
                <span className="text-[#f4e8c9]"> SIWE Verify</span>
              </Button>
            )}
            {/* 
            <Box className="w-full sm:w-[48%] cursor-pointer">
              <SignUp />
            </Box> */}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Welcome;
