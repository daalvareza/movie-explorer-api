import { Request, Response } from 'express';
import OpenAiApiSdk from "../services/OpenAiApiSdk";
import NotesServiceFactory from '../../user/factories/notesServiceFactory';

const notesService = NotesServiceFactory.create();

class OpenAIController {
    static async getMovieRecommendations(
        req: Request<{ movie: string }>,
        res: Response
    ) {
        const movieName = req.params.movie;
        const sdk = new OpenAiApiSdk();

        try {
            const result = await sdk.getMovieRecommendations(movieName);
            res.status(200).json({ data: result });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getMovieSentiment(
        req: Request<{ movieId: string }>,
        res: Response
    ) {
        const movieId = req.params.movieId;
        const sdk = new OpenAiApiSdk();

        try {
            const movieNotes = await notesService.findAllMovieNotes(movieId);
            if (movieNotes === null) {
                res.status(200).json({ data: 'This movie does not have notes related' });
                return;
            }
            console.log(movieNotes);
            const result = await sdk.getMovieSentiment(movieNotes);
            res.status(200).json({ data: result });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default OpenAIController;