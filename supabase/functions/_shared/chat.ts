import type { ModelMessage } from "npm:ai";
import { createResponsesCall } from "./responses.ts";

export function streamGatewayChat(
  request: Request,
  config: { baseURL: string; apiKey: string; model: string },
  messages: ModelMessage[],
  instructions?: string,
) {
  return createResponsesCall(request, config, messages, instructions);
}