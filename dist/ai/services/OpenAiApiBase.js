"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("openai");
const zod_1 = require("openai/helpers/zod");
class OpenAiApiBase {
    constructor() {
        this.setupCredentials();
        this.setupClient();
    }
    setupCredentials() {
        this.apiKey = process.env.OPENAI_API_KEY || "";
        if (!this.apiKey) {
            throw new Error("Missing API Key for OpenAI API.");
        }
    }
    setupClient() {
        this.client = new openai_1.OpenAI({
            apiKey: this.apiKey,
        });
    }
    sendRequest(prompt, responseFormat) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const requestPayload = {
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "user", content: prompt },
                    ],
                    response_format: (0, zod_1.zodResponseFormat)(responseFormat, "json_schema"),
                };
                const response = yield this.client.chat.completions.create(requestPayload);
                if (!response.choices || response.choices.length === 0) {
                    throw new Error("Error getting response from OpenAI API.");
                }
                const content = ((_a = response.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) || "";
                const parsedContent = JSON.parse(content);
                return responseFormat.parse(parsedContent);
            }
            catch (error) {
                if (error instanceof SyntaxError) {
                    console.error("Error parsing OpenAI API response:", error.message);
                }
                else if (error.errors) {
                    console.error("Validation error:", error.errors);
                }
                else {
                    console.error("Error sending request to OpenAI API:", error.message);
                }
                throw new Error("Error sending request to OpenAI API.");
            }
        });
    }
}
exports.default = OpenAiApiBase;
