import Map "mo:map/Map";
import ServiceTypes "../Types";
import { thash } "mo:map/Map";
import Blob "mo:base/Blob";
import Text "mo:base/Text";
import Error "mo:base/Error";
import Random "mo:base/Random";
import Nat8 "mo:base/Nat8";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

module Profiles {
    type UserProfile = ServiceTypes.UserProfile;

    type SiweProvider = actor {
        get_address : (bytes : [Nat8]) -> async {
            #Ok : (Address : Text);
            #Err : (Error : Text);
        };
    };

    public func getAddress(canister : SiweProvider, caller : Text) : async Text {
        let principal = Principal.fromText(caller);
        let blob = Principal.toBlob(principal);
        // let blob = Blob.fromArray([nat8Value]);

        Debug.print("this is the caller " # debug_show caller);
        Debug.print("this is the converted blob " # debug_show Blob.toArray(blob));
        let response = await canister.get_address(Blob.toArray(blob));
        switch (response) {
            case (#Ok(address)) {
                return address;
            };
            case (#Err(e)) {
                throw Error.reject(e);
            };
        };
    };

    public func getMyProfile(profileStore : Map.Map<Text, UserProfile>, caller : Text) : ?UserProfile {
        return Map.get(profileStore, thash, caller);
    };

    public func listProfiles(profileStore : Map.Map<Text, UserProfile>) : [(Text, UserProfile)] {
        let arrayFromMap = Map.toArray(profileStore);
        arrayFromMap;
    };

    public func saveMyProfile(profileStore : Map.Map<Text, UserProfile>, caller : Text, name : Text, avatarUrl : Text, address : Text, store : Text) : async UserProfile {
        let userProfile : UserProfile = {
            address = address;
            name = name;
            avatarUrl = avatarUrl;
            store = store;
        };
        ignore Map.put(profileStore, thash, caller, userProfile);
        userProfile;
    };

    public func updateMyProfile(profileStore : Map.Map<Text, UserProfile>, caller : Text, name : Text, avatarUrl : Text) : async () {
        let profile = Map.get(profileStore, thash, caller);
        switch (profile) {
            case (?myProfile) {
                let userProfile : UserProfile = {
                    address = myProfile.address;
                    name = name;
                    avatarUrl = avatarUrl;
                    store = myProfile.store;
                };
                ignore Map.put(profileStore, thash, caller, userProfile);
            };
            case null {
                throw Error.reject("Profile does not exist");
            };
        };
    };

    public func generateRandomID(name : Text) : async Text {
        var n : Text = name;
        let entropy = await Random.blob();
        var f = Random.Finite(entropy);
        let count : Nat = 2;
        var i = 1;
        label l loop {
            if (i >= count) break l;
            let b = f.byte();
            switch (b) {
                case (?byte) { n := n # Nat8.toText(byte); i += 1 };
                case null {
                    let entropy = await Random.blob();
                    f := Random.Finite(entropy);
                };
            };
        };
        n;
    };

};

// do you calculation, would it give me the same value the vec29 and the original text I sent to you .
