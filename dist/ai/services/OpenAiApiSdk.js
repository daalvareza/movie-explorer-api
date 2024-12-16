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
            const prompt = `
      Based on the movie: "${movieName}". 
      Provide 10 high-quality movie recommendations for someone who enjoyed this movie. 
      Your recommendations should:
      - Be relevant to the genre, theme, or storyline of the given movie.
      - Include movies from the same saga if applicable.
      - Ensure all recommended movies are real and well-known.
    `;
            const format = zod_1.z.object({
                movies: zod_1.z.array(zod_1.z.string()),
            });
            const response = yield this.sendRequest(prompt, format);
            return response;
        });
    }
    getMovieSentiment(movieNotes) {
        return __awaiter(this, void 0, void 0, function* () {
            const formattedReviews = movieNotes.map(note => `- ${note}`).join('\n');
            const prompt = `
      A movie has the following reviews:\n
      ${formattedReviews}\n
      You need to determine the overall sentiment of these reviews. Follow these rules:
      - Begin your response with the number of reviews.
      - Summarize the overall sentiment of these reviews in at most 3 words (e.g., "very positive", "generally mixed", "mostly negative").
      - Highlight the most common subjects or themes mentioned by the reviewers, whether they are positive or negative.
  
      Format your final answer as:
      "Of X review(s), the overall sentiment is Y. Most users highlight Z."
  
      Where:
      - X is the number of reviews provided.
      - Y is the 3-word (or fewer) sentiment summary.
      - Z is the most commonly mentioned subjects/themes.
    `;
            const format = zod_1.z.object({
                sentiment: zod_1.z.string(),
            });
            const response = yield this.sendRequest(prompt, format);
            return response;
        });
    }
}
exports.default = OpenAiApiSdk;
