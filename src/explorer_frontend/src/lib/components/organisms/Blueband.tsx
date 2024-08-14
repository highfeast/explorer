import { LocalDocumentIndex } from "ic-use-blueband-db";

const OPENAI_SECRET = import.meta.env.VITE_OPENAI_SECRET;

export class BlueBand {
  private collectionId: string;
  private api_key: string = OPENAI_SECRET;
  constructor(
    private actor: any,
    config: any,
    private logFunction?: (message: string) => void
  ) {
    this.collectionId = config.collection;
    this.api_key = config.api_key;
  }

  private OPENAI_KEY = async () => {
    return OPENAI_SECRET;
  };

  async log(text: string) {
    if (this.logFunction) {
      this.logFunction(text);
    } else {
      console.log(text);
    }
  }

  async initialize() {
    if (!this.api_key) throw new Error("OPENAI_KEY is not defined");
    const isCatalog = await this.IsDocExists(this.collectionId);
    if (this.collectionId) {
      //   const secret = await this.OPENAI_KEY();
      const config = {
        actor: this.actor,
        indexName: this.collectionId,
        apiKey: this.api_key,
        isCatalog: isCatalog,
        _getDocumentId: this.getDocumentID,
        _getDocumentTitle: this.getDocumentTitle,
        chunkingConfig: {
          chunkSize: 502,
        },
      };

      return new LocalDocumentIndex(config);
    }
  }

  async IsDocExists(collectionId: string) {
    if (!collectionId || !this.actor) return false;
    console.log("let's try this", collectionId);
    const info = await this.actor.getMetadataList(collectionId);
    return info && info.length > 0;
  }

  getDocumentID = async (title: string) => {
    if (!this.actor || !this.collectionId)
      throw new Error("Index is not initialized");
    try {
      const info = await this.actor.titleToDocumentID(this.collectionId, title);
      return info[0];
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  getDocumentTitle = async (docId: string) => {
    try {
      if (!this.collectionId) throw new Error("Sign in required");
      const info = await this.actor.documentIDToTitle(this.collectionId, docId);
      return info[0];
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  async customAddVector(
    index: LocalDocumentIndex,
    documentTitle: string,
    documentId: string
  ) {
    this.log(`Adding document with id: ${documentId}`);

    if (!this.collectionId) throw new Error("no collection id detected");

    const documentResult = await index.addVectors(
      this.collectionId,
      documentTitle,
      documentId
    );

    this.log(`Vector added for document. ID: ${documentResult.id}`);
    await this.actor.endUpdate(this.collectionId, documentResult.id);
    this.log("Vector update frozen for document");

    return {
      documentId,
      vectorId: documentResult.id,
    };
  }

  async similarityQuery(index: LocalDocumentIndex, prompt: string) {
    await this.initialize();
    this.log(`Generating embedding for prompt: ${prompt}`);
    // const secret = await this.OPENAI_KEY();
    const response = await this.actor.generateEmbeddings(
      [prompt],
      this.api_key
    );

    if ("success" in response) {
      const embedding = JSON.parse(response.success).data[0].embedding;
      this.log("Embedding generated successfully");

      const results = await index.queryDocuments(embedding, {
        maxDocuments: 4,
        maxChunks: 512,
      });

      this.log(`Query returned ${results.length} results`);

      return Promise.all(
        results.map(async (result: any) => {
          const sections = await result.renderSections(500, 1, true);
          console.log("assumed title", result.title);
          const id = await this.getDocumentID(result.title);
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
    } else {
      throw new Error("Error generating embedding");
    }
  }

  async getDocuments(collectionId: string) {
    if (!collectionId || !this.actor) return;

    const result = await this.actor.getMetadataList(collectionId);
    if (result[0]) {
      const embedding = await this.actor.getIndex(collectionId);
      return { documents: result[0], embedding };
    }
    return { documents: [], embedding: null };
  }
}
