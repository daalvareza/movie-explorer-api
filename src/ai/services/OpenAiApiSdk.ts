import OpenAiApiBase from "./OpenAiApiBase";
import { z } from "zod";

interface MovieRecommendationsSchema {
  movies: string[];
}

class OpenAiApiSdk extends OpenAiApiBase {
  public async getMovieRecommendations(
    movieName: string
  ): Promise<MovieRecommendationsSchema> {
    const prompt = `
      Based on the movie: "${movieName}". 
      Provide 10 high-quality movie recommendations for someone who enjoyed this movie. 
      Your recommendations should:
      - Be relevant to the genre, theme, or storyline of the given movie.
      - Include movies from the same saga if applicable.
      - Ensure all recommended movies are real and well-known.
    `;

    const format = z.object({
      movies: z.array(z.string()),
    });

    const response = await this.sendRequest(prompt, format);
    return response;
  }
}

export default OpenAiApiSdk;