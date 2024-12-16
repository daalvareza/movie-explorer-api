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
const OpenAiApiSdk_1 = __importDefault(require("../services/OpenAiApiSdk"));
const notesServiceFactory_1 = __importDefault(require("../../user/factories/notesServiceFactory"));
const notesService = notesServiceFactory_1.default.create();
class OpenAIController {
    static getMovieRecommendations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const movieName = req.params.movie;
            const sdk = new OpenAiApiSdk_1.default();
            try {
                const result = yield sdk.getMovieRecommendations(movieName);
                res.status(200).json({ data: result });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static getMovieSentiment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const movieId = req.params.movieId;
            const sdk = new OpenAiApiSdk_1.default();
            try {
                const movieNotes = yield notesService.findAllMovieNotes(movieId);
                if (movieNotes === null) {
                    res.status(200).json({ data: 'This movie does not have notes related' });
                    return;
                }
                console.log(movieNotes);
                const result = yield sdk.getMovieSentiment(movieNotes);
                res.status(200).json({ data: result });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.default = OpenAIController;
