import NotesRepository from "../repositories/notesRepository";
import NotesService from "../services/notesService";

class NotesServiceFactory {
    static create() {
        const notesRepository = new NotesRepository();
        return new NotesService(notesRepository);
    }
}

export default NotesServiceFactory;
