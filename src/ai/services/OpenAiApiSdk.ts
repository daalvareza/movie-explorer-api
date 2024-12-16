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

  public async getMovieSentiment(movieNotes: string[]): Promise<MovieRecommendationsSchema> {
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
  
    const format = z.object({
      sentiment: z.string(),
    });
  
    const response = await this.sendRequest(prompt, format);
    return response;
  }  
}

export default OpenAiApiSdk;