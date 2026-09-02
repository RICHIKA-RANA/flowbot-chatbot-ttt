const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");
const { responseGenerationPrompt, NO_COVERAGE_MESSAGE, NO_ANSWER_FALLBACK_MESSAGE } = require("./prompt");
dotenv.config({
  path: path.join(
    process.cwd(),
    "configuration/flowbot-chatbot-ttt/server/.env"
  )
});


export const conversational = true;
export const pollingInterval = 400;
export const streaming = true;

export const openid = {
  authorization_endpoint: "",
  token_endpoint: "",
  userinfo_endpoint: "",
  scopes_supported: ["openid", "profile", "email"],
  client_id: "",
  realm: "",
};

const GPT_BEARER_TOKEN = process?.env?.GPT_BEARER_TOKEN;
const TTT_URL = process?.env?.TTT_URL;
const MAX_RESULTS_FROM_TTT_PER_REQUEST = 5

const ANSWER_STATUS_LINE_PATTERN = /<!--\s*ANSWER_STATUS:\s*(ANSWERED|NO_ANSWER)\s*-->\s*$/;

const extractAnswerStatus = (text) => {
  if (typeof text !== "string") {
    return { status: null, text };
  }
  const match = text.match(ANSWER_STATUS_LINE_PATTERN);
  if (!match) {
    return { status: null, text };
  }
  return { status: match[1], text: text.slice(0, match.index).trimEnd() };
};

const looksLikeNoAnswerText = (text) =>
  typeof text === "string" &&
  (text.includes(NO_COVERAGE_MESSAGE) || text.includes(NO_ANSWER_FALLBACK_MESSAGE));

const sendRequest = async (handler, question) => {
  try {
    const graphIds = handler?.graphIds
  
    const requestBody = {
      "graph_ids": graphIds,
      "text": question,
      "max_results": MAX_RESULTS_FROM_TTT_PER_REQUEST
    }
    
    const response = await axios.post(
      TTT_URL,
      requestBody,
      {
        headers: {
          Accept: "application/json",
          Authorization: handler?.headers?.authorization,
          "Content-Type": "application/json"
        }
      }
    );
    
    const relevantElements = response?.data?.elements
    if (!Array.isArray(relevantElements) || relevantElements.length === 0) {
      console.log("didn't find any relevant contents")
      return []
    }
    return relevantElements.filter(el => typeof el?.content === 'string' && el.content.trim())
  } catch (err) {
    console.error("TTT request failed", {
      message: err?.message,
      status: err?.response?.status,
      responseData: err?.response?.data
    });
    return []
  }
};

// Shapes a /v1/queries element into the { pageContent, metadata }
const toSourceDocument = (el) => {
  return {
    pageContent: el?.content,
    metadata: {
      pageNumber: el?.page ?? el?.metadata?.page,
      graph_id: el?.graph_id,
      filename: el?.metadata?.filename,
      nodeId: el?.id,
      headingPath: el?.metadata?.heading_path,
    },
  };
};

const refineBotResponse = async (prompt, onToken) => {
  const emit = onToken || (() => {});
  let emitted = 0;
  try {
    const url = "https://api.openai.com/v1/chat/completions";
    const body = {
      model: "gpt-4",
      temperature: 0.4,
      stream: true,
      stream_options: { include_usage: true },
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GPT_BEARER_TOKEN}`,
    };

    const response = await axios.post(url, body, { headers, responseType: "stream" });
    response.data.setEncoding("utf8");

    let content = "";
    let usage = null;
    let buffer = "";

    for await (const chunk of response.data) {
      buffer += chunk;
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data: ")) continue;
        const payload = trimmed.slice(6);
        if (payload === "[DONE]") continue;

        try {
          const parsed = JSON.parse(payload);
          const delta = parsed?.choices?.[0]?.delta?.content;
          if (delta) {
            content += delta;
            const cut = content.indexOf("<!--");
            const safe = cut === -1 ? content.length - 3 : cut;
            if (safe > emitted) {
              emit(content.slice(emitted, safe));
              emitted = safe;
            }
          }
          if (parsed?.usage) {
            usage = parsed.usage;
          }
        } catch (parseErr) {
          console.error("Failed to parse ChatGPT stream chunk", { message: parseErr?.message });
        }
      }
    }

    return {
      content,
      input_tokens: usage?.prompt_tokens,
      output_tokens: usage?.completion_tokens,
      total_tokens: usage?.total_tokens,
    };
  } catch (error) {
    console.error("Error in ChatGPT Request:", error?.response?.data || error?.message);
    // Tokens are already on the wire. Swallowing here would replace the answer the
    // user watched stream in with the NO_ANSWER fallback -- and save that to history.
    if (emitted > 0) throw error;
    return {
      content: false,
      input_tokens: 0,
      output_tokens: 0,
      total_tokens: 0,
    };
  }
};

export const start = async (handler, question, onToken) => {
  if (!question || !question.trim()) {
    return {
      text: "",
      src: "talkingDb",
      currentStep: null,
      hideAnswer: true,
    };
  }

  let finalResponse = ""
  let answerStatus = null
  let tokens = { input_tokens: 0, output_tokens: 0, total_tokens: 0 }
  let sourceDocuments = []
  const graphIds = handler?.graphIds
  if (graphIds && graphIds.length > 0) {
    const relevantElements = await sendRequest(handler, question)
    sourceDocuments = relevantElements.map(toSourceDocument)
    if (relevantElements.length > 0) {
      const tttResponse = relevantElements.map(el => el?.content)
      const responsePrompt = responseGenerationPrompt(question, tttResponse)
      const refined = await refineBotResponse(responsePrompt, onToken)
      const extracted = extractAnswerStatus(refined?.content)
      finalResponse = extracted.text
      answerStatus = extracted.status
      tokens = {
        input_tokens: refined?.input_tokens,
        output_tokens: refined?.output_tokens,
        total_tokens: refined?.total_tokens,
      }
    }
  } else {
    finalResponse = "Please upload a document to train"
  }

  // default fallback message
  if (!finalResponse || finalResponse == "") {
    finalResponse = NO_ANSWER_FALLBACK_MESSAGE
    answerStatus = "NO_ANSWER"
  }

  const isNoAnswer = answerStatus
    ? answerStatus === "NO_ANSWER"
    : looksLikeNoAnswerText(finalResponse)

  if (isNoAnswer) {
    sourceDocuments = []
  }

  return {
    text: String(finalResponse),
    src: "talkingDb",
    sourceDocuments,
    currentStep: {
      id: 1,
      question: question,
      inputType: "text",
      options: [],
    },
    error: false,
    errorMessage: "",
    hideAnswer: false,
    tokens,
  };
};