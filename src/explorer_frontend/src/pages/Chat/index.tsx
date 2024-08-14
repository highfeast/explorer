import React, { act, useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { PlaceholdersAndVanishInput } from "../../lib/components/atoms/query-input";
import { useActor } from "../../ic/ii/Actors";

import QueryResponse from "../../lib/components/organisms/query-response";
import { Box, Text } from "@radix-ui/themes";
// import { useBlueBand } from "ic-use-blueband-db";
// import { useInternetIdentity } from "ic-use-internet-identity";
import { BlueBand } from "../../lib/components/organisms/Blueband";

interface Interaction {
  userInput: string;
  aiResponse: {
    text: string;
    references: any[];
  } | null;
}
const placeholders = ["Hello?", "I have a question?", "What do you think?"];

const OPENAI_SECRET = import.meta.env.VITE_OPENAI_SECRET;

const QueryInterface = ({ storeId }: { storeId: string }) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [store, setStore] = useState<any | null>(storeId);
  const { actor } = useActor();
  // const { isQuerying } = useBlueBand();
  const [index, setIndex] = useState<any | null>(null);
  const [isInitalized, setisInitalized] = useState(false);

  // Retrieve storefromurl

  useEffect(() => {
    setStore(storeId);
  }, []);

  // Initialize Vector DB
  useEffect(() => {
    async function init() {
      const config = {
        collection: store,
        api_key: OPENAI_SECRET,
      };
      const db = new BlueBand(actor, config);
      if (db) {
        const _index = await db.initialize();
        setIndex(_index);
        setisInitalized(true);
        console.log("db initialized", true);
      }
    }
    if (store && actor && !isInitalized) {
      init();
    }
  }, [store, actor, isInitalized, setIndex]);

  const getAIResponse = async (
    input: string
  ): Promise<Interaction["aiResponse"] | null> => {
    try {
      let response: any;
      const x = await actor.fetchQueryResponse(input, OPENAI_SECRET, "");
      response = JSON.parse(x);

      if (!response.embedding) {
        return {
          text: response.text,
          references: response.references,
        };
      } else {
        //do similarity check and resend request
        console.log(response.embedding[0]);

        // const config = {
        //   collection: store,
        //   api_key: OPENAI_SECRET,
        // };

        // const db = new BlueBand(actor, config);
        // const index = await db.initialize();
        console.log(index);

        const results = await index.queryDocuments(response.embedding[0], {
          maxDocuments: 4,
          maxChunks: 512,
        });

        const context = await Promise.all(
          results.map(async (result: any) => {
            const sections = await result.renderSections(500, 1, true);
            console.log("assumed title", result.title);
            const id = await actor.documentIDToTitle(store, result.title);
            return {
              title: result.title,
              id: id,
              score: result.score,
              chunks: result.chunks.length,
              sections: sections.map((section: any) => ({
                text: section.text
                  .replace(/\n+/g, "\n")
                  .replace(/\n/g, "\\n")
                  .replace(/"/g, '\\"'),
                tokens: section.tokenCount,
              })),
            };
          })
        );

        console.log(context);
        if (context && context.length > 0) {
          console.log("fine-tuned context", context[0].sections[0].text);
          const x = await actor.fetchQueryResponse(
            input,
            OPENAI_SECRET,
            context[0].sections[0].text
          );
          const newResponse = JSON.parse(x);
          console.log("new response", newResponse);
          return {
            text: newResponse.text,
            references: newResponse.references,
          };
        }
      }
      return {
        text: "",
        references: [],
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentInput.trim() === "" || isFetching) return;
    setIsFetching(true);
    const placeHolderInteraction: Interaction = {
      userInput: currentInput,
      aiResponse: null,
    };
    // Add the placeholder interaction
    setInteractions((prevInteractions) => [
      ...prevInteractions,
      placeHolderInteraction,
    ]);

    const aiResponse = await getAIResponse(currentInput);
    // Replace the last ai response that is null
    setInteractions((prevInteractions) =>
      prevInteractions.map((interaction, index) =>
        index === prevInteractions.length - 1
          ? { ...interaction, aiResponse: aiResponse }
          : interaction
      )
    );
    setCurrentInput("");
    setIsFetching(false);
  };

  return (
    <div
      className={`flex ${
        !actor && "bg-[#f4e8c9]"
      } flex-col p-2 rounded-3xl  justify-between items-center gap-10 min-h-60`}
    >
      {interactions.length === 0 ? (
        <>
          <img
            className="mt-5 rounded-full opacity-50"
            alt="query-db"
            src={"/hat.png"}
            width={150}
            height={150}
          />

          <Text size={"8"} className="text-[#ac8c65]" weight={"regular"}>
            Foodfolio.ai
          </Text>
        </>
      ) : (
        <div className="w-full space-y-6 mt-6">
          {interactions.map((interaction, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex justify-end">
                <p className="mb-2 py-2 px-4 text-right text-[#014338] dark:bg-[#f4e8c9]">
                  User: {interaction.userInput}
                </p>
              </div>
              {interaction.aiResponse && (
                <QueryResponse
                  text={interaction.aiResponse.text}
                  attachments={interaction.aiResponse.references}
                />
              )}

              {isFetching && !interaction.aiResponse && (
                <Loader className="animate-spin" />
              )}
            </div>
          ))}
        </div>
      )}

      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
        value={currentInput}
        disabled={false} // isFetching || !isInitalized
      />
    </div>
  );
};

export default QueryInterface;
