import NotesRepository from "../repositories/notesRepository";

class NotesService {
    private notesRepository: NotesRepository;

    constructor(notesRepository: NotesRepository) {
        this.notesRepository = notesRepository;
    }

    async findAllMovieNotes(movieId: string) {
        return await this.notesRepository.findAllMovieNotes(movieId);
    };
}

export default NotesService;
