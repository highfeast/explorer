import Cycles "mo:base/ExperimentalCycles";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Array "mo:base/Array";

import HTTPTypes "./utils/HTTPTypes";

module Request {

    type Transform = shared query HTTPTypes.TransformArgs -> async HTTPTypes.HttpResponsePayload;

        public let base_url = "https://ic-gpt-api.vercel.app/";

    public func createEmbeddings(words : [Text], transform : Transform) : async Text {
        let ic : HTTPTypes.IC = actor ("aaaaa-aa");
        let url = base_url # "api/embed";
        let idempotency_key : Text = generateUUID();
        let request_headers = [
            { name = "Content-Type"; value = "application/json" },
            { name = "Idempotency-Key"; value = idempotency_key },
        ];

        // Construct the JSON string representation of the array
        var words_json = "[" # "\"" # words[0] # "\"";
        for (word in Iter.range(1, Array.size(words) - 1)) {
            words_json #= ",\"" # words[word] # "\"";
        };
        words_json #= "]";

        let request_body_json : Text = "{\"words\":" # words_json # "}";
        Debug.print("Request Body JSON: " # request_body_json);

        let request_body_as_Blob : Blob = Text.encodeUtf8(request_body_json);
        let request_body_as_nat8 : [Nat8] = Blob.toArray(request_body_as_Blob);

        // 2.2.1 Transform context
        let transform_context : HTTPTypes.TransformContext = {
            function = transform;
            context = Blob.fromArray([]);
        };

        // 2.3 The HTTP request
        let http_request : HTTPTypes.HttpRequestArgs = {
            url = url;
            max_response_bytes = null;
            headers = request_headers;
            body = ?request_body_as_nat8;
            method = #post;
            transform = ?transform_context;
        };

        //3. ADD CYCLES TO PAY FOR HTTP REQUEST
        Cycles.add<system>(21_850_258_000);

        //4. MAKE HTTP REQUEST AND WAIT FOR RESPONSE
        //Since the cycles were added above, you can just call the management canister with HTTPS outcalls below
        let http_response : HTTPTypes.HttpResponsePayload = await ic.http_request(http_request);

        //5. DECODE THE RESPONSE
        let response_body : Blob = Blob.fromArray(http_response.body);
        let decoded_text : Text = switch (Text.decodeUtf8(response_body)) {
            case (null) { "No value returned" };
            case (?y) { y };
        };
        //6. RETURN RESPONSE OF THE BODY
        let result : Text = decoded_text;
        result;
    };

    public func fetchQueryResponse(prompt : Text, context : Text, transform : Transform) : async Text {
        let ic : HTTPTypes.IC = actor ("aaaaa-aa");
        let url = let url = base_url # "api/query";
        let idempotency_key : Text = generateUUID();
        let request_headers = [
            { name = "Content-Type"; value = "application/json" },
            { name = "Idempotency-Key"; value = idempotency_key },
        ];

        // Construct request body based on context presence
        let request_body_json : Text = if (context == "") {
            "{ \"prompt\" : \"" # prompt # "\" }";
        } else {
            "{ \"prompt\" : \"" # prompt # "\", \"context\" : \"" # context # "\" }";
        };

        Debug.print("query request body: " # request_body_json);

        let request_body_as_Blob : Blob = Text.encodeUtf8(request_body_json);
        let request_body_as_nat8 : [Nat8] = Blob.toArray(request_body_as_Blob);

        // 2.2.1 Transform context
        let transform_context : HTTPTypes.TransformContext = {
            function = transform;
            context = Blob.fromArray([]);
        };

        // 2.3 The HTTP request
        let http_request : HTTPTypes.HttpRequestArgs = {
            url = url;
            max_response_bytes = null;
            headers = request_headers;
            body = ?request_body_as_nat8;
            method = #post;
            transform = ?transform_context;
        };

        //3. ADD CYCLES TO PAY FOR HTTP REQUEST
        Cycles.add<system>(21_850_258_000);

        //4. MAKE HTTP REQUEST AND WAIT FOR RESPONSE
        //Since the cycles were added above, you can just call the management canister with HTTPS outcalls below
        let http_response : HTTPTypes.HttpResponsePayload = await ic.http_request(http_request);

        //5. DECODE THE RESPONSE
        let response_body : Blob = Blob.fromArray(http_response.body);
        let decoded_text : Text = switch (Text.decodeUtf8(response_body)) {
            case (null) { "No value returned" };
            case (?y) { y };
        };
        //6. RETURN RESPONSE OF THE BODY
        let result : Text = decoded_text;
        result;
    };

    func generateUUID() : Text {
        "UUID-123456789";
    };

};
