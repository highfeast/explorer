import { useEthContext } from "../../../eth/EthContext";
import { Box, Dialog, Inset } from "@radix-ui/themes";
import { Button, Flex, Separator, TextField, Text } from "@radix-ui/themes";
import {
  ModalContent,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "./modal";
import BearAvatar from "../atoms/bear-avatar";
import { usePrivy } from "@privy-io/react-auth";
import { shortenAddress } from "../../utils";
import { useAccount } from "wagmi";
import { useSiweIdentity } from "ic-use-siwe-identity";
import { useState, useEffect } from "react";

// const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

export default function ProfileDialog() {
  const { user } = usePrivy();
  const { address } = useAccount();
  const { isAccountModalOpen, toggleAccountModal, handleLogout } =
    useEthContext();

  const { login, isLoggingIn, prepareLoginStatus, identity } =
    useSiweIdentity();
  const [principal, setPrincipal] = useState<null | string>(null);

  async function fetchIdentity() {
    const _principal = identity.getPrincipal();
    setPrincipal(_principal.toText());
  }

  useEffect(() => {
    if (identity && !principal) {
      fetchIdentity();
    }
  }, [principal, identity]);

  return (
    <Dialog.Root open={isAccountModalOpen} onOpenChange={toggleAccountModal}>
        
      {isAccountModalOpen && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-sm z-40" />
      )}

      <ModalContent>
        <Flex direction="column" gap="3">
          <>
            <Inset
              className="p-4 bg-slate-200"
              clip="padding-box"
              side="top"
              pb="current"
            >
              <Box className="content-center flex gap-3">
                <BearAvatar size="4" did={address ?? ""} />
                <Box>
                  {user &&
                    user?.linkedAccounts
                      .filter((x) => x.type === "google_oauth")
                      .map((account: any, i: number) => {
                        if (account) {
                          return (
                            <Box className="w-full" key={i}>
                              <Text
                                weight={"bold"}
                                size={"5"}
                                className={"text-center"}
                              >
                                {account.name}
                              </Text>
                              <br />
                              <Text
                                size={"2"}
                                className={"text-center"}
                                weight={"bold"}
                              >
                                {account.email}
                              </Text>

                              <Flex className="w-full mt-1 items-start justify-between">
                                <Flex align={"center"}>
                                  <Text
                                    // weight={"bold"}
                                    className="mr-2"
                                    size={"1"}
                                  >
                                    Joined since
                                  </Text>
                                  <Text size={"1"}>
                                    {account.firstVerifiedAt?.toDateString()}
                                  </Text>
                                </Flex>
                              </Flex>
                            </Box>
                          );
                        }

                        return <div key={i} />;
                      })}
                </Box>
              </Box>
            </Inset>
            <br />

            <TextField.Root
              readOnly={true}
              defaultValue={shortenAddress(address ?? "")}
            >
              <TextField.Slot>
                <Text>ETH</Text>
              </TextField.Slot>
            </TextField.Root>

            <TextField.Root
              className=""
              size="1"
              readOnly={true}
              defaultValue={principal ?? ""}
            >
              {/* <TextField.Slot>
                <Text>ICP</Text>
              </TextField.Slot> */}
            </TextField.Root>
          </>
        </Flex>

        <div className="opacity-0 hidden">
          <ModalTitle>Profile</ModalTitle>

          <ModalDescription>Overview</ModalDescription>
        </div>
        <Separator className="my-8 w-full opacity-0" orientation="horizontal" />

        <ModalFooter>
          <Dialog.Close>
            <Button onClick={handleLogout}>Log out</Button>
          </Dialog.Close>
        </ModalFooter>
      </ModalContent>
    </Dialog.Root>
  );
}
