import { Button, Dialog, Flex, TextField, Text } from "@radix-ui/themes";
import React from "react";

// ModalTrigger Component
const ModalTrigger = ({ children }: { children: React.ReactNode }) => {
  return <Dialog.Trigger>{children}</Dialog.Trigger>;
};

// ModalTitle Component
const ModalTitle = ({ children }: { children: React.ReactNode }) => {
  return <Dialog.Title size={"7"}>{children}</Dialog.Title>;
};

// ModalDescription Component
const ModalDescription = ({ children }: { children: React.ReactNode }) => {
  return (
    <Dialog.Description size="2" mb="4">
      {children}
    </Dialog.Description>
  );
};

// ModalContent Component
const ModalContent = ({ children }: { children: React.ReactNode }) => {
  return <Dialog.Content maxWidth="600px">{children}</Dialog.Content>;
};

// ModalFooter Component
const ModalFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex gap="3" mt="4" justify="end">
      {children}
    </Flex>
  );
};

// ModalContainer Component
const ModalContainer = ({ children }: { children: React.ReactNode }) => {
  return <Dialog.Root>{children}</Dialog.Root>;
};

export {
  ModalTitle,
  ModalContent,
  ModalContainer,
  ModalFooter,
  ModalTrigger,
  ModalDescription,
};
