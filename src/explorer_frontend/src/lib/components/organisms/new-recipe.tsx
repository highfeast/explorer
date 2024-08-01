import { useCallback, useEffect, useState } from "react";
import { FileSpreadsheet, ArrowLeft } from "lucide-react";

import {
  Flex,
  Text,
  Card,
  IconButton,
  TextField,
  TextArea,
  Button,
  Dialog,
  Callout,
} from "@radix-ui/themes";

import { useDropzone } from "react-dropzone";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import * as XLSX from "xlsx";
import { useActor } from "../../../ic/Actors";
import { ModalDescription, ModalFooter, ModalTitle } from "../molecules/modal";
import { generateMarkdown } from "../../utils";

function NewRecipe({ toggleHome }: { toggleHome: () => void }) {

  const { actor } = useActor();

  // Local State
  const [title, setTitle] = useState("");
  const [descripiton, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [file, setFile] = useState(null);
  const [parsedContent, setParsedContent] = useState(null);
  const [JSONContent, setJSONContent] = useState<any | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const onDrop = useCallback((acceptedFiles: any) => {
    const file = acceptedFiles[0];
    if (
      file &&
      (file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.name.endsWith(".xlsx"))
    ) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const metadataSheet = workbook.Sheets["Recipe Metadata"];
        const ingredientsSheet = workbook.Sheets["Ingredients"];

        const metadata: any = XLSX.utils.sheet_to_json(metadataSheet, {
          header: 2,
        })[0];
        const ingredients = XLSX.utils.sheet_to_json(ingredientsSheet, {
          header: ["Name", "Quantity", "Unit"],
        });

        const parsed = {
          Title: metadata.Title,
          Description: metadata.Description,
          Instructions: metadata.Instructions,
          CuisineType: metadata.CuisineType ?? "",
          DietType: metadata.DietType ?? "",
          Tags: metadata.Tags ?? "",
          ingredients: ingredients.slice(1),
        };

        setParsedContent(parsed);
        setIsModalOpen(true);
        setFile(file.name);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload an Excel file (.xlsx)");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  });

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setParsedContent(null);
    setJSONContent(null);
    setFile(null);
  };

  const handleSave = () => {
    const json = {
      title: parsedContent.Title,
      description: parsedContent.Description,
      instructions: parsedContent.Instructions,
      cuisine_type: parsedContent.CuisineType,
      diet_type: parsedContent.DietType,
      ingredients: parsedContent.ingredients.map((ing) => ({
        name: ing.Name,
        quantity: ing.Quantity,
        unit: ing.Unit,
      })),
      tags: parsedContent.Tags.split(",").map((tag) => tag.trim()),
    };
    setJSONContent(json);
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!actor) {
      console.log("no actor found");
      return;
    }

    try {
      const payload = {
        additionalInstructions: instructions,
        ...JSONContent,
      };
      const formattedPayload = JSON.stringify(payload, null, 1);
      console.log("this is the payload to be submitted", formattedPayload);

      const response = await actor.addRecipe(
        JSONContent.title,
        formattedPayload
      );
      handleReset();
      toggleHome();
    } catch (e: any) {
      console.log(e.message || "error adding receipe");
    }
  };

  return (
    <>
      <div className="w-full md:w-2/3">
        <div className="flex gap-3 w-full align-middle">
          <IconButton
            variant="soft"
            className="cursor-pointer py-2"
            onClick={toggleHome}
          >
            <ArrowLeft />
          </IconButton>
          <Text weight="bold" size="3" className="">
            Add New Recipe
          </Text>
        </div>

        <Card className="mt-8">
          <Flex direction={"column"} gap={"4"} className="w-full">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Title
              </Text>
              <TextField.Root
                value={JSONContent ? JSONContent.title : title}
                placeholder="e.g Halloween fried chicken"
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            {JSONContent && JSONContent.description?.length > 2 && (
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Description
                </Text>

                <TextArea
                  value={JSONContent.description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
            )}
          </Flex>
        </Card>

        <Card className="mt-8">
          <Flex direction={"column"} gap={"2"} className="w-full">
            <label>
              <div className="flex w-full align-middle justify-between mb-3">
                <Text as="div" size="2" mb="1" weight="bold">
                  Content
                </Text>
                <Button
                  variant="soft"
                  className="cursor-pointer py-2"
                  size={"1"}
                >
                  Download Template
                </Button>
              </div>

              <div className="relative w-full min-h-28 cursor-pointer">
                {!JSONContent ? (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <TextArea
                      value={""}
                      className="bg-slate-50 h-full"
                      size={"3"}
                      readOnly={true}
                    />
                    <div className="absolute gap-2 flex top-0 pt-8 align-middle justify-center h-full w-full">
                      <FileSpreadsheet className="opacity-70" />
                      <Text className="opacity-70">
                        {isDragActive
                          ? "Drop CSV file here"
                          : "Drop or click to upload CSV file"}
                      </Text>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50">
                    <Callout.Root
                      size="1"
                      className="flex flex-row justify-between center"
                    >
                      <Callout.Text>{file}</Callout.Text>
                      <Text
                        size={"3"}
                        className="text-red-500"
                        onClick={() => setJSONContent(null)}
                      >
                        x
                      </Text>
                    </Callout.Root>
                  </div>
                )}
              </div>
            </label>

            {/* <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Additional Instructions{" "}
                <span className="text-xs opacity-50 light italic">
                  optional
                </span>
              </Text>

              <div className=" w-full">
                <TextArea
                  value={instructions}
                  className="bg-slate-50 h-full"
                  size={"3"}
                  readOnly={true}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>
            </label> */}
          </Flex>
        </Card>

        <br />
        <Button
          onClick={handleSubmit}
          className="float-right mt-4 cursor-pointer"
          size={"3"}
        >
          Save
        </Button>
      </div>

      <Dialog.Root open={isModalOpen} onOpenChange={toggleModal}>
        <Dialog.Content className="bg-white p-2 rounded-lg max-w-2xl mx-auto mt-0  max-h-[70vh] overflow-auto">
          <ModalTitle>
            <span className="hidden">Preview</span>
          </ModalTitle>
          <ModalDescription>
            <span className=" hidden">New Recipe</span>
          </ModalDescription>

          {parsedContent && (
            <div
              className="markdown-body"
              style={{
                background: "whitesmoke",
                color: "#333",
              }}
            >
              <Markdown remarkPlugins={[remarkGfm]}>
                {generateMarkdown(parsedContent)}
              </Markdown>
            </div>
          )}

          <ModalFooter>
            <Flex className="px-2 gap-4">
              <Dialog.Close>
                <Button variant="outline" onClick={toggleModal}>
                  Cancel
                </Button>
              </Dialog.Close>
              <Button onClick={handleSave}> Save</Button>
            </Flex>
          </ModalFooter>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}

export default NewRecipe;
