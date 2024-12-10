import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { ChatCompletionMessageParam } from "openai/resources";
import { ZodObject } from "zod";

class OpenAiApiBase {
  private apiKey!: string;
  private client!: OpenAI;

  constructor() {
    this.setupCredentials();
    this.setupClient();
  }

  private setupCredentials(): void {
    this.apiKey = process.env.OPENAI_API_KEY || "";

    if (!this.apiKey) {
      throw new Error("Missing API Key for OpenAI API.");
    }
  }

  private setupClient(): void {
    this.client = new OpenAI({
        apiKey: this.apiKey,
    });
  }

  public async sendRequest<T>(
    prompt: string,
    responseFormat: ZodObject<any>
  ): Promise<any> {
    try {
        const requestPayload = {
        model: "gpt-4o-mini",
        messages: [
            { role: "user", content: prompt } as ChatCompletionMessageParam,
        ],
        response_format: zodResponseFormat(responseFormat, "json_schema"),
        };

        const response = await this.client.chat.completions.create(requestPayload);

        if (!response.choices || response.choices.length === 0) {
            throw new Error("Error getting response from OpenAI API.");
        }

        const content = response.choices[0].message?.content || "";
        const parsedContent = JSON.parse(content);
        return responseFormat.parse(parsedContent);

    } catch (error: any) {
        if (error instanceof SyntaxError) {
            console.error("Error parsing OpenAI API response:", error.message);
        } else if (error.errors) {
            console.error("Validation error:", error.errors);
        } else {
            console.error("Error sending request to OpenAI API:", error.message);
        }
        throw new Error("Error sending request to OpenAI API.");
    }
  }
}

export default OpenAiApiBase;
