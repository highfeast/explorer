import React, { useState } from "react";
import {
  Box,
  Card,
  Flex,
  DataList,
  Avatar,
  Text,
  IconButton,
} from "@radix-ui/themes";
import {
  BookIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  MenuIcon,
} from "lucide-react";
import AuroraBackground from "../atoms/aurora-background";
import { Toaster } from "../atoms/sonner";
import Header from "../organisms/header";

//LayoutLeft Component
const LayoutLeftPanel = ({
  isOpen,
  toggleDrawer,
  items,
}: {
  isOpen: boolean;
  toggleDrawer: () => void;
  items: React.ReactNode[];
}) => {
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);

  const toggleDesktopExpand = () => {
    setIsDesktopExpanded(!isDesktopExpanded);
  };

  return (
    <div className="relative ">
      <div className="md:hidden">
        <button onClick={toggleDrawer} className="p-2">
          <MenuIcon />
        </button>
      </div>
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:bg-transparent md:w-auto md:ml-4`}
      >
        <div
          className={`p-4 md:p-0 h-full flex flex-col transition-all duration-300 ease-in-out  ${
            isDesktopExpanded ? "md:w-64" : "md:w-16"
          }`}
        >
          <button
            onClick={toggleDesktopExpand}
            className="hidden md:block p-2 mb-4"
          >
            {isDesktopExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </button>
          <Box className="flex-grow overflow-hidden">
            <Card>
              <DataList.Root>
                {items.map((item, i) => (
                  <DataList.Item key={i} className="flex items-center">
                    <DataList.Label minWidth="40px" className="flex-shrink-0">
                      {i === 1 ? <BookIcon /> : <HomeIcon />}
                    </DataList.Label>
                    {(isOpen || isDesktopExpanded) && (
                      <DataList.Value>
                        <Flex align="center" gap="1">
                          <Text size={"2"} weight={"bold"}>
                            {item}
                          </Text>
                          {/* {i === 1 && (
                            <IconButton
                              size="1"
                              aria-label="Copy value"
                              color="gray"
                              variant="ghost"
                            >
                              <ChevronDown />
                            </IconButton>
                          )} */}
                        </Flex>
                      </DataList.Value>
                    )}
                  </DataList.Item>
                ))}
              </DataList.Root>
            </Card>
          </Box>
        </div>
      </div>
    </div>
  );
};

// LayoutContent Component
const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full px-4">{children}</div>;
};

// LayoutFooter Component
const LayoutFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <footer className="w-full px-4 mt-16 ">
      <Card className="p-4 text-center bg-[#e6effc] border-opacity-5">
        {" "}
        {children}
      </Card>
    </footer>
  );
};

// DashboardWrapper Component
const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <div>
      <main className="flex w-screen" style={{ minHeight: "100vh" }}>
        <AuroraBackground className="flex flex-col gap-2 w-full max-w-full">
          <Header />
          <div className="flex flex-col md:flex-row w-full">
            <LayoutLeftPanel
              isOpen={isDrawerOpen}
              toggleDrawer={toggleDrawer}
              items={[<div key="1">Home</div>, <div key="2">Recipes</div>]}
            />
            <LayoutContent>{children}</LayoutContent>
          </div>
        </AuroraBackground>
        <Toaster />
      </main>
    </div>
  );
};

export { LayoutLeftPanel, LayoutContent, LayoutFooter, DashboardWrapper };
