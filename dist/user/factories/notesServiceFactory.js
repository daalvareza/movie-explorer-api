"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notesRepository_1 = __importDefault(require("../repositories/notesRepository"));
const notesService_1 = __importDefault(require("../services/notesService"));
class NotesServiceFactory {
    static create() {
        const notesRepository = new notesRepository_1.default();
        return new notesService_1.default(notesRepository);
    }
}
exports.default = NotesServiceFactory;
