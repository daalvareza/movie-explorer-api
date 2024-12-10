import { Request, Response } from 'express';
import OpenAiApiSdk from "../services/OpenAiApiSdk";

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
}

export default OpenAIController;