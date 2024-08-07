import Error "mo:base/Error";
import Debug "mo:base/Debug";
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";

import BluebandProvider "./blueband/BluebandProvider";

import Request "./Request";
import Profiles "./profiles/Profiles";

import Types "./Types";
import HTTPTypes "./utils/HTTPTypes";

shared ({ caller }) actor class Main() {

    // Type aliases
    type SiweProvider = Types.SiweProvider;
    type UserProfile = Types.UserProfile;
    type GetAddressResponse = Types.GetAddressResponse;
    type VectorStore = BluebandProvider.VectorStore;
    type Metadata = BluebandProvider.MetadataList;
    type RecipeInfo = BluebandProvider.DocumentMetadata;
    type State = Types.Explorer;

    // State variables
    private stable var SiweProviderCanister : ?SiweProvider = null;
    private stable var BluebandProviderCanister : ?BluebandProvider.BluebandProvider = null;
    stable var state = Types.empty();

    ///////////////////////////
    // Initialization Functions
    ///////////////////////////

    // Identity canister reference
    private func initSiweProviderCanister(cannister : Principal) : async () {
        SiweProviderCanister := ?actor (Principal.toText(cannister)) : ?SiweProvider;
    };

    // DB canister reference
    private func initBluebandProviderCanister(cannister : Principal) : async () {
        BluebandProviderCanister := ?actor (Principal.toText(cannister)) : ?BluebandProvider.BluebandProvider;
    };

    public func init(identityProvider : Principal, bluebandProvider : Principal) : async () {
        try {
            await initSiweProviderCanister(identityProvider);
            await initBluebandProviderCanister(bluebandProvider);
        } catch (error) {
            throw Error.reject("Failed to initialize canisters: " # Error.message(error));
        };
    };

    ///////////////////////////
    // Helper Functions
    ///////////////////////////

    // Get Database Provider (for Read-only)
    private func getDB() : async BluebandProvider.BluebandProvider {
        switch (BluebandProviderCanister) {
            case (null) {
                throw Error.reject("No BluebandProvider Canister found");
            };
            case (?db) { return db };
        };
    };

    // Verify Profile and Database Canister (for Owner-write)
    private func verifyProfileAndDB(caller : Principal) : async (UserProfile, BluebandProvider.BluebandProvider) {
        switch (await getProfile(Principal.toText(caller))) {
            case (null) { throw Error.reject("No user profile found") };
            case (?profile) {
                switch (BluebandProviderCanister) {
                    case (null) {
                        throw Error.reject("No BluebandProvider Canister found");
                    };
                    case (?db) { return (profile, db) };
                };
            };
        };
    };

    ///////////////////////////
    // Identity Store Functions
    ///////////////////////////

    // Get user address from SiweProvider
    public func getAddress(caller : Text) : async Text {
        // Call the SiweProviderCanister to get the address
        switch (SiweProviderCanister) {
            case (?canister) {
                let result = await Profiles.getAddress(canister, caller);
                result;
            };
            case null {
                throw Error.reject("SIWE Provider canister not initialized");
            };
        };
    };

    // List all profiles
    public query func listProfiles() : async [(Text, UserProfile)] {
        return Profiles.listProfiles(state.profiles);
    };

    // Get caller's profile
    public shared (msg) func getMyProfile() : async ?UserProfile {
        let caller = Principal.toText(msg.caller);
        return Profiles.getMyProfile(state.profiles, caller);
    };

    // Get profile by caller
    private func getProfile(caller : Text) : async ?UserProfile {
        return Profiles.getMyProfile(state.profiles, caller);
    };

    // Save caller's profile
    public shared (msg) func saveMyProfile(name : Text, avatarUrl : Text, store : Text) : async () {
        let caller = Principal.toText(msg.caller);
        let address = await getAddress(caller);
        ignore Profiles.saveMyProfile(state.profiles, caller, name, avatarUrl, address, store);
    };

    // Update caller's profile
    public shared (msg) func updateMyProfile(name : Text, avatarUrl : Text) : async () {
        let caller = Principal.toText(msg.caller);
        ignore Profiles.updateMyProfile(state.profiles, caller, name, avatarUrl);
    };

    // Update caller's profile
    public shared func generateUserName(name : Text) : async Text {
        let result = await Profiles.generateRandomID(name);
        result;
    };

    ///////////////////////////
    // DB Write Owner
    //////////////////////////

    public shared (msg) func addRecipe(title : Text, content : Text) : async ?({
        bucket : ?Principal;
        recipe_id : ?Text;
    }) {
        let (profile, db) = await verifyProfileAndDB(msg.caller);
        let result = await db.addDocument(profile.store, title, content);
        switch (result) {
            case (?{ collection; documentId }) {
                ?{ bucket = collection; recipe_id = documentId };
            };
            case (null) {
                throw Error.reject("Failed to add document");
            };
        };
    };

    public shared (msg) func embedRecipe(
        recipe_id : Text,
        vector_id : Text,
        start : Nat,
        end : Nat,
        vector : [Float],
    ) : async Text {

        let (profile, db) = await verifyProfileAndDB(msg.caller);
        await db.putVector(
            profile.store,
            recipe_id,
            vector_id,
            start,
            end,
            vector,
        );
    };

    public shared (msg) func endUpdate(recipeId : Text) : async () {
        let (profile, db) = await verifyProfileAndDB(msg.caller);
        await db.endUpdate(profile.store, recipeId);
    };

    public shared (msg) func myStorePrincipal() : async ?Principal {
        let (profile, db) = await verifyProfileAndDB(msg.caller);
        await db.getCollectionPrincipal(profile.store);
    };

    ///////////////////////////
    // DB Read Functions
    //////////////////////////

    public func getIndex(storeId : Text) : async ?{ items : VectorStore } {
        let db = await getDB();
        await db.index(storeId);
    };

    public func metadata(storeId : Text) : async ?Metadata {
        let db = await getDB();
        return await db.getMetadataList(storeId);
    };

    public func getChunks(storeId : Text, recipe_id : Text) : async ?Text {
        let db = await getDB();
        return await db.getChunks(storeId, recipe_id);
    };

    public func getMetadata(storeId : Text, recipe_id : Text) : async ?RecipeInfo {
        let db = await getDB();
        return await db.getMetadata(storeId, recipe_id);
    };

    public shared func getDocumentId(storeId : Text, vectorId : Text) : async ?Text {
        let db = await getDB();
        return await db.getDocumentId(storeId, vectorId);
    };

    public shared func documentIDToTitle(storeId : Text, recipe_id : Text) : async ?Text {
        let db = await getDB();
        return await db.documentIDToTitle(storeId, recipe_id);
    };

    public shared func titleToDocumentID(storeId : Text, title : Text) : async ?Text {
        let db = await getDB();
        return await db.titleToDocumentID(storeId, title);
    };

    ///////////////////////////
    // HTTP Request
    //////////////////////////

    public func fetchQueryResponse(prompt : Text, context : Text) : async Text {
        return await Request.fetchQueryResponse(prompt, context, transform);
    };
    public func createEmbeddings(words : [Text]) : async Text {
        return await Request.createEmbeddings(words, transform);
    };

    public shared query func transform(args : HTTPTypes.TransformArgs) : async HTTPTypes.HttpResponsePayload {
        {
            status = args.response.status;
            body = args.response.body;
            headers = [
                {
                    name = "Content-Security-Policy";
                    value = "default-src 'self'";
                },
                { name = "Referrer-Policy"; value = "strict-origin" },
                { name = "Permissions-Policy"; value = "geolocation=(self)" },
                {
                    name = "Strict-Transport-Security";
                    value = "max-age=63072000";
                },
                { name = "X-Frame-Options"; value = "DENY" },
                { name = "X-Content-Type-Options"; value = "nosniff" },
            ];
        };
    };

    // Cycles Functions
    public shared ({ caller = caller }) func wallet_receive() : async () {
        ignore Cycles.accept<system>(Cycles.available());
        Debug.print("intital cycles deposited by " # debug_show (caller));
    };

};
