import { Box, Button } from "@radix-ui/themes";
import NavGroup from "../molecules/nav-group";

import { useMemo, useState } from "react";
import { useEthContext } from "../../../eth/EthContext";
import BearAvatar from "../atoms/bear-avatar";
import { shortenAddress } from "../../utils";
import { usePrivy } from "@privy-io/react-auth";
import ProfileDialog from "../molecules/profile-dialog";
import { useAccount } from "wagmi";

const Header = ({ className }: { className?: string }) => {
  const [segment, setSegments] = useState<number>(0);
  const { address } = useAccount();
  const { user } = usePrivy();
  const { toggleAccountModal } = useEthContext();

  const navs = useMemo(
    () => [
      {
        title: "Feed",
        value: "feed",
        href: "/",
        isActive: segment === 0,
      },
      {
        title: "Proposals",
        value: "proposals",
        href: "/proposals",
        isActive: segment === 1,
      },
      {
        title: "Docs",
        value: "docs",
        href: "/documentation",
        isActive: segment === 2,
      },
    ],
    [segment]
  );

  return (
    <div
      className={` flex justify-between items-center px-4 min-h-[70px] bg-transparent pr-8 ${className}`}
    >
      <a className="flex space-x-2 text-md" target="_blank" href="#">
        <img
          className="mt-5 rounded-full opacity-100"
          alt="query-db"
          src={"/hat.png"}
          width={50}
          height={50}
        />
      </a>

      <NavGroup navs={navs} />

      {address && user && (
        <Button
          color="gray"
          variant="outline"
          className="w-fit px-3  py-5 cursor-pointer"
          onClick={toggleAccountModal}
        >
         
          {address && (
          <Box>
            <BearAvatar size="1" did={address ?? ""} />
          </Box>
        )}
          {shortenAddress(address)}
        </Button>
      )}

      <ProfileDialog />
    </div>
  );
};

export default Header;
