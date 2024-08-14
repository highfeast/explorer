import Random "mo:base/Random";
import Nat8 "mo:base/Nat8";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
// import Array "mo:base/Array";
module {

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

    public func sliceText(text : Text, start : Nat, end : Nat) : Text {
        var slicedText = "";
        var i = start;
        while (Nat.less(i, end)) {
            let char = Text.fromChar(Text.toArray(text)[i]);
            slicedText := Text.concat(slicedText, char);
            i := Nat.add(i, 1);
        };
        slicedText;
    };

    // public func sliceText(text : Text, start : Nat, end : Nat) : Text {
    //     // Ensure the start and end indices are within bounds
    //     let textSize = Text.size(text);
    //     assert (Nat.lessOrEqual(start, textSize));
    //     assert (Nat.lessOrEqual(end, textSize));
    //     assert (Nat.less(start, end));

    //     // Convert the text to an array of characters
    //     let chars = Text.toArray(text);

    //     // Extract the substring
    //     let slicedChars = Array.slice(chars, start, end);
    //     Text.fromArray(slicedChars);
    // };

};