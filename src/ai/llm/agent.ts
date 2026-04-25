import { createAgent } from "langchain";
import { groqModel } from "./model";
import { beautyAgentPrompt, nutritionAgentPrompt } from "./prompt";


export const nutritionAgent = createAgent({
    model: groqModel,
    tools: [],
    systemPrompt: nutritionAgentPrompt,
});


export const beautyAgent = createAgent({
    model: groqModel,
    tools: [],
    systemPrompt: beautyAgentPrompt,
});