import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  TextField,
  Text,
  Dialog,
  Separator,
  Select,
  Box,
  Checkbox,
} from "@radix-ui/themes";

import {
  ModalContainer,
  ModalTrigger,
  ModalContent,
  ModalTitle,
  ModalFooter,
  ModalDescription,
} from "../molecules/modal";
import RadioCardGroup from "../molecules/radio-card-group";
import { usePrivy } from "@privy-io/react-auth";
import { useSiweIdentity } from "ic-use-siwe-identity";
import { useActor } from "../../../ic/Actors";

const SignUp = ({
  isOpen,
  toggleSignup,
}: {
  isOpen: boolean;
  toggleSignup: () => void;
}) => {
  const { identity, identityAddress } = useSiweIdentity();
  const { actor } = useActor();
  const { user } = usePrivy();

  const [tabIndex, settabIndex] = useState(0);
  const [name, setName] = useState(
    user?.linkedAccounts.filter((x) => x.type === "google_oauth")[0].name ?? ""
  );
  const [store, setStore] = useState();

  const items = [
    {
      id: "1",
      title: "Chef",
      description: "Cookbooks,  receipes, cooking instructions...",
    },
    {
      id: "2",
      title: "Dietician",
      description: "Meal plans, diet recommendations...",
    },
    {
      id: "3",
      title: "Catering",
      description: "Event planning, meal budgets...",
    },
  ];

  const handleSumbit = async () => {
    if (!actor) {
      console.log("no actor found");
      return;
    }
    const storeID = await actor.generateUserName(name.replace(/\s/g, "-"));
    const response = await actor.saveMyProfile(name, "", storeID);
    console.log(response);
    toggleSignup();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={toggleSignup}>
      {/* <ModalTrigger>
        <Button color="bronze" className="w-full py-5 cursor-pointer">
          Request Demo
        </Button>
      </ModalTrigger> */}

      {isOpen && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-[2px] z-40" />
      )}

      <ModalContent>
        <ModalTitle>
          <span className="lighter opacity-40"> {"<create>"}</span>.
          <span className="text-green-400">Foodfolio</span>.ai
        </ModalTitle>

        <ModalDescription>
          {tabIndex !== 1 ? (
            <>
              Store food recipes and guides on-chain and provide context for the{" "}
              <em>Highfeast Explorer</em> AI assitant to answer queries from
              your customized page
            </>
          ) : (
            <></>
          )}
        </ModalDescription>

        <Flex direction="column" gap="3">
          {/* tab 1 */}
          {!tabIndex ? (
            <RadioCardGroup items={items} />
          ) : (
            <>
              <Separator className="my-4 w-full" orientation="horizontal" />

              <Flex direction={"column"} gap={"4"} className="w-full">
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Name
                  </Text>
                  <TextField.Root
                    value={name}
                    placeholder="Enter your full name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    ID
                  </Text>
                  <TextField.Root value={store} placeholder="Edit ID" />
                </label>

                <Flex mb="1" align={"center"} className="justify-between">
                  <label>
                    <Text as="div" size="2" weight="bold">
                      Region
                    </Text>

                    <Select.Root defaultValue="UK">
                      <Select.Trigger />
                      <Select.Content className="w-full">
                        <Select.Group>
                          <Select.Label>Countries</Select.Label>
                          <Select.Item value="UK">United Kingdom</Select.Item>
                        </Select.Group>
                      </Select.Content>
                    </Select.Root>
                  </label>

                  <Text as="label" size="2">
                    <Flex gap="2">
                      <Checkbox defaultChecked />
                      Agree to Terms and Conditions
                    </Flex>
                  </Text>
                </Flex>
              </Flex>
            </>
          )}
        </Flex>
        <Separator className="my-8 w-full opacity-0" orientation="horizontal" />
        <ModalFooter>
          <Dialog.Close>
            <Button>Cancel</Button>
          </Dialog.Close>

          <Button
            onClick={!tabIndex ? () => settabIndex(tabIndex + 1) : handleSumbit}
          >
            {!tabIndex ? "Next" : "Deploy Cannister"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Dialog.Root>
  );
};

export default SignUp;
