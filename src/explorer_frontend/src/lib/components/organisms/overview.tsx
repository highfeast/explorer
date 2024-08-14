import { useEffect, useState } from "react";
import {
  LucidePlusCircle,
  RefreshCwIcon,
  CheckIcon,
  CopyIcon,
} from "lucide-react";
import {
  Text,
  Button,
  Table,
  Card,
  Badge,
  Inset,
  Flex,
} from "@radix-ui/themes";
import { useSiweIdentity } from "ic-use-siwe-identity";
import { useActor } from "../../../ic/Actors";
import { useBlueBand } from "ic-use-blueband-db";

type RecipeInfo = {
  chunkCount: number;
  chunkEndId: number;
  chunkStartId: number;
  isEmbedded: boolean;
  name: string;
  recipe_id: string;
  size: number;
};

const OPENAI_SECRET = import.meta.env.VITE_OPENAI_SECRET;

function Overview({ toggleHome }: { toggleHome: () => void }) {
  const { identity } = useSiweIdentity();
  const { actor } = useActor();
  const [fetching, setFetching] = useState(true);
  const [recipes, setRecipes] = useState<any | null>(null);
  const [store, setStore] = useState<any | string>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const { isInitalized, isSaving, AddItem, initializeIndex } = useBlueBand();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset success message after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Initialize Vector DB
  useEffect(() => {
    if (!isInitalized && store && actor) {
      console.log(actor);
      const config = {
        collection: store,
        api_key: OPENAI_SECRET,
      } as any;
      initializeIndex(actor, config);
    }
    console.log("db initialized", isInitalized);
  }, [store, actor, isInitalized]);

  const fetchRecipes = async () => {
    if (!identity) {
      return;
    }
    setFetching(true);
    const profile = await actor.getMyProfile();
    const storeId = profile[0].store.toString();
    setStore(storeId);
    console.log("store id maybe exists", storeId);
    if (storeId) {
      const result = await actor.getMetadataList(storeId);
      console.log("the result", result);
      if (result[0]) {
        const convertedRecipes = result[0].map((recipe: RecipeInfo | any) => ({
          ...recipe,
          chunkCount: Number(recipe.chunkCount),
          chunkEndId: Number(recipe.chunkEndId),
          chunkStartId: Number(recipe.chunkStartId),
          size: Number(recipe.size),
        }));
        setRecipes(convertedRecipes);
      }
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between w-full">
        <Text weight="bold" size="3" className="">
          Recipes
        </Text>
        <Flex className="gap-3">
          <Button onClick={toggleHome} className="cursor-pointer py-2">
            <LucidePlusCircle /> Add
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer py-2"
            onClick={() => copyToClipboard(`http://localhost:3000/${store}`)}
          >
            <CopyIcon />
            {copySuccess ? " Copied!" : ""}
          </Button>
        </Flex>
      </div>
      <Card className="mt-8">
        <div className="flex justify-between w-full items-center">
          <Badge size="3" color="indigo">
            All
          </Badge>
          <Button
            className="cursor-pointer"
            variant="soft"
            disabled={fetching}
            onClick={fetchRecipes}
          >
            <RefreshCwIcon className={fetching ? "animate-spin" : ""} />
          </Button>
        </div>

        <Inset side="x" my="5">
          <Table.Root>
            <Table.Header className="bg-slate-200">
              <Table.Row>
                <Table.ColumnHeaderCell>recipe</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>chunk size</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>isEmbedded</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {recipes &&
                recipes.length > 0 &&
                recipes.map((recipe: RecipeInfo, i: number) => (
                  <Table.Row key={i}>
                    <Table.RowHeaderCell>{recipe.name}</Table.RowHeaderCell>
                    <Table.Cell>{recipe.size}</Table.Cell>
                    <Table.Cell>
                      {!recipe.isEmbedded ? (
                        <>
                          <Button
                            loading={isSaving}
                            disabled={!isInitalized}
                            onClick={() =>
                              AddItem(recipe.name, recipe.recipe_id)
                            }
                            className="cursor-pointer"
                            size={"1"}
                          >
                            Save
                          </Button>
                        </>
                      ) : (
                        <Button size="1" disabled={true} variant="soft">
                          <CheckIcon />
                        </Button>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table.Root>
        </Inset>
      </Card>
      {/* alert dialog for vectorizing this */}
    </div>
  );
}

export default Overview;
