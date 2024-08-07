import { motion } from "framer-motion";
import { useState } from "react";

import { Link } from "lucide-react";
import { cn } from "../../utils";

type Nav = {
  title: string;
  value: string;
  href: string;
  isActive: boolean;
};

const NavGroup = ({
  navs: propNavs,
  containerClassName,
  activeNavClassName,
  navClassName,
}: {
  navs: Nav[];
  containerClassName?: string;
  activeNavClassName?: string;
  navClassName?: string;
}) => {
  const initialActiveNav = propNavs.find((nav) => nav.isActive) || propNavs[0];
  const [active, setActive] = useState<Nav>(initialActiveNav);
  const [navs, setNavs] = useState<Nav[]>(propNavs);

  const moveSelectedNavToTop = (idx: number) => {
    const newNavs = [...propNavs];
    const selectedNav = newNavs.splice(idx, 1);
    newNavs.unshift(selectedNav[0]);
    setNavs(newNavs);
    setActive(newNavs[0]);
  };

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full",
        containerClassName
      )}
    >
      {propNavs.map((nav, idx) => (
        <Link
          key={nav.title}
          onClick={() => {
            moveSelectedNavToTop(idx);
          }}
          className={cn("relative px-4 py-2 rounded-full", navClassName)}
          style={{
            transformStyle: "preserve-3d",
          }}
          href={nav.href}
        >
          {active.value === nav.value && (
            <motion.div
              layoutId="clickedbutton"
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              className={cn(
                "absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-full ",
                activeNavClassName
              )}
            />
          )}

          <span
            className={cn(
              "relative block text-black",
              active.value === nav.value && "text-white"
            )}
          >
            {nav.title}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default NavGroup;