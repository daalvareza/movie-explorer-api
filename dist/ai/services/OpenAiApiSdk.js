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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OpenAiApiBase_1 = __importDefault(require("./OpenAiApiBase"));
const zod_1 = require("zod");
class OpenAiApiSdk extends OpenAiApiBase_1.default {
    getMovieRecommendations(movieName) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = `Given the movie: "${movieName}". 
        Returns 10 different movies that you can recommend for a person that enjoyed that movie.
        You can return movies of the same saga that the movie belongs if that's the case.`;
            const format = zod_1.z.object({
                movies: zod_1.z.array(zod_1.z.string()),
            });
            const response = yield this.sendRequest(prompt, format);
            return response;
        });
    }
}
exports.default = OpenAiApiSdk;
