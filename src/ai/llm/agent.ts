import { createAgent } from "langchain";
import { groqModel } from "./model";
import { nutritionAgentPrompt } from "./prompt";


export const nutritionAgent = createAgent({
    model: groqModel,
    tools: [],
    systemPrompt: nutritionAgentPrompt,
});