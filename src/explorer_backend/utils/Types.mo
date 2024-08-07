import Map "mo:map/Map";
import Blueband "../blueband";

module Types {

    public type StoreId = Text;
    public type VectorStore = [VectorData];
    public type Metadata = [RecipeInfo];

    public type UserProfile = {
        address : Text;
        name : Text;
        avatarUrl : Text;
        store : StoreId;
    };

    public type SiweProvider = actor {
        get_address : (bytes : [Nat8]) -> async {
            #Ok : (Address : Text);
            #Err : (Error : Text);
        };
    };

    public type GetAddressResponse = {
        #Ok : (Address : Text);
        #Err : (Error : Text);
    };

    public type FoodFolio = Blueband.Collection;

    public type Explorer = {
        stores : Map.Map<StoreId, FoodFolio>;
        profiles : Map.Map<Text, UserProfile>;
    };

    public func empty() : Explorer {
        {
            stores = Map.new<StoreId, FoodFolio>();
            profiles = Map.new<Text, UserProfile>();
        };
    };

    public type TextChunk = {
        text : Text;
        startPos : Nat;
        endPos : Nat;
    };

    public type VectorData = {
        vectorId : Text;
        recipe_id : Text;
        startPos : Int;
        endPos : Int;
        vector : [Float];
    };

    public type RecipeInfo = {
        recipe_id : Text;
        name : Text;
        chunkCount : Nat;
        chunkStartId : Int;
        chunkEndId : Int;
        size : Nat;
        isEmbedded : Bool;
    };

};
