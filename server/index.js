const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({
  path: path.join(
    process.cwd(),
    "configuration/flowbot-chatbot-ttt/server/.env"
  )
});


export const conversational = true;
export const pollingInterval = 400;

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

const NO_COVERAGE_MESSAGE = "The documents I have access to don't cover this. Try rephrasing the question please...";
const NO_ANSWER_FALLBACK_MESSAGE = "Sorry, I don't have an answer for that.";

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
  const layoutMatch = String(el?.id ?? "").match(/layout::(\d+)/);
  const pageFromId = layoutMatch ? Number(layoutMatch[1]) + 1 : undefined;
  return {
    pageContent: el?.content,
    metadata: {
      pageNumber: el?.page ?? el?.metadata?.page ?? pageFromId,
      graph_id: el?.graph_id,
      filename: el?.metadata?.filename,
      nodeId: el?.id,
      headingPath: el?.metadata?.heading_path,
    },
  };
};

const responseGenerationPrompt = (userQuery, documentContents) => {
  return `
    You are a document assistant. Answer the user's question using ONLY the provided document excerpts.

    Question: ${userQuery}

    Relevant document excerpts: ${documentContents}

    ## Quick Answer
    Write 1–3 plain-English sentences that directly answer the question.
    - Use simple language a non-expert would understand immediately.
    - Keep it simple, but include important conditions if they affect correctness.
    - If the document content is insufficient to answer, write exactly:
      "${NO_COVERAGE_MESSAGE}"

    ## Additional Context
    _(Only include this section if the quick answer needs elaboration.)_
    Provide additional context, supporting clauses, exceptions, and related information drawn from the document.

    Structure this section with:
    - A short introductory sentence or two
    - Sub-headings (###) where there are distinct aspects (e.g., "### Exceptions", "### How it works")
    - Bullet points for lists of conditions, steps, or rules
    - Keep each bullet to one clear idea

    ## Follow-Up Questions
    List 2–3 short questions the user is likely to ask next, based on the document content and their original question.
    - Each question must use actual terms, names, or conditions from the document — never placeholder text like [term] or [condition].
    - Each question must be answerable from the provided document excerpts.
    - Format as a numbered list.

    Finally, after everything above, add one line by itself at the very end of your entire response — nothing may follow it:
    <!-- ANSWER_STATUS: NO_ANSWER --> if the Quick Answer is the "${NO_COVERAGE_MESSAGE}" sentence, otherwise <!-- ANSWER_STATUS: ANSWERED -->
  `;
}

const refineBotResponse = async (prompt) => {
  try {
    const url = "https://api.openai.com/v1/chat/completions";
    const body = {
      model: "gpt-4",
      temperature: 0.4,
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

    const response = await axios.post(url, body, { headers });
    const structuredData = response.data.choices[0].message;
    const usage = response.data.usage;

    return {
      content: structuredData?.content,
      input_tokens: usage?.prompt_tokens,
      output_tokens: usage?.completion_tokens,
      total_tokens: usage?.total_tokens,
    };
  } catch (error) {
    console.error("Error in ChatGPT Request:", error?.response?.data);
    return {
      content: false,
      input_tokens: 0,
      output_tokens: 0,
      total_tokens: 0,
    };
  }
};

export const start = async (handler, question) => {
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
      const refined = await refineBotResponse(responsePrompt)
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