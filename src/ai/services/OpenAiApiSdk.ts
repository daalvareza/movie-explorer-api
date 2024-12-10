import OpenAiApiBase from "./OpenAiApiBase";
import { z } from "zod";

interface MovieRecommendationsSchema {
  movies: string[];
}

class OpenAiApiSdk extends OpenAiApiBase {
  public async getMovieRecommendations(
    movieName: string
  ): Promise<MovieRecommendationsSchema> {
    const prompt = `Given the movie: "${movieName}". 
        Returns 10 different movies that you can recommend for a person that enjoyed that movie.
        You can return movies of the same saga that the movie belongs if that's the case.`;

    const format = z.object({
      movies: z.array(z.string()),
    });

    const response = await this.sendRequest(prompt, format);
    return response;
  }
}

export default OpenAiApiSdk;