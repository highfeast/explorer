import { Box, Button, Text } from "@radix-ui/themes";
import { useInternetIdentity } from "ic-use-internet-identity";
import BearAvatar from "../atoms/bear-avatar";

import { useEffect, useState } from "react";
import { shortenAddress } from "../../utils";

const ChatHeader = ({ className }: { className?: string }) => {
  const { login, loginStatus, identity } = useInternetIdentity();
  const [principal, setPrincipal] = useState<string | null>(null);
  // const { isInitalized } = useBlueBand();
  const disabled =
    loginStatus === "logging-in" ||
    loginStatus === "success" ||
    principal?.length > 1;
  const text =
    loginStatus === "logging-in"
      ? "Logging in..."
      : principal
      ? shortenAddress(principal)
      : "Login";
  const handleLogin = async () => {
    await login();
  };

  useEffect(() => {
    const fetchIdentity = () => {
      const aa = identity.getPrincipal();
      setPrincipal(aa.toText());
    };

    if (identity && !principal) {
      fetchIdentity();
    }
  }, [identity, principal]);

  return (
    <div
      className={` flex justify-between items-center px-4 min-h-[70px] bg-transparent pr-8 ${className}`}
    >
      <a
        className="flex space-x-2 text-md"
        target="_blank"
        href="https://github.com/highfeast/explorer"
      >
        <Text size={"4"} className="">
          {principal ?? ""}
        </Text>
      </a>

      <Button
        color="bronze"
        variant="outline"
        className="w-fit px-3  py-5 cursor-pointer"
        onClick={handleLogin}
        disabled={disabled}
      >
        {principal && (
          <Box>
            <BearAvatar size="1" did={principal ?? ""} />
          </Box>
        )}

        {text}
      </Button>
    </div>
  );
};

export default ChatHeader;
