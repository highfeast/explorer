import { RadioCards, Flex, Box, Text } from "@radix-ui/themes";
import React from "react";

// RadioCardGroup Component
const RadioCardGroup = ({
  items,
}: {
  items: Array<{ id: string; title: string; description: string }>;
}) => {
  return (
    <Box maxWidth="600px">
      <RadioCards.Root
        defaultValue={items[0]?.id}
        columns={{ initial: "1", sm: "3" }}
      >
        {items.map((item, i) => (
          <RadioCards.Item disabled={i > 0} value={item.id} key={item.id}>
            <Flex direction="column" width="100%">
              <Text weight="bold" className="text-green-400">
                {item.title}
              </Text>
              <Text>{item.description}</Text>
            </Flex>
          </RadioCards.Item>
        ))}
      </RadioCards.Root>
    </Box>
  );
};

export default RadioCardGroup;
