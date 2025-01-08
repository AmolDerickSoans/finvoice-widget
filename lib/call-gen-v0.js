require('dotenv').config();
const cors = require('cors'); // Import the cors package
const express = require('express');
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { PromptTemplate } = require("@langchain/core/prompts");
const { RunnableSequence } = require("@langchain/core/runnables");
const { StringOutputParser } = require("@langchain/core/output_parsers");

const app = express();
const port = 3080;
app.use(cors());
app.use(express.json());

class TradingStyleAnalyzer {
    constructor(apiKey) {
        this.llm = new ChatGoogleGenerativeAI({
            modelName: "gemini-pro",
            temperature: 0.3,
            apiKey: apiKey
        });

        this.styleAnalysisPrompt = PromptTemplate.fromTemplate(`
            Analyze the writing style of these trade call templates:
            {templates}

            Extract and return only the key style elements as a concise list.
            Focus on: tone, detail level, structure, and specific phrases used.
        `);

        this.tradeCallPrompt = PromptTemplate.fromTemplate(`
            You are a professional trading system. Generate a trade call using this style:
            {style_elements}

            Trade Parameters:
            {trade_params}

            Rules:
            - Stick strictly to the provided parameters
            - Do not add any additional trade suggestions
            - Maintain professional, clear language
            - Focus only on the specific trade details provided
            - DO NOT CHANGE content in trade_params notes , instead add a section called notes and render data from notes directly

            Generate the trade call:
        `);

        this.improvementPrompt = PromptTemplate.fromTemplate(`
            Original trade call:
            {original_call}

            Feedback for improvement:
            {feedback}

            Generate an improved version while maintaining the same core trade parameters.
            Focus only on improving the presentation and clarity.
        `);

         this.templatePrompt = PromptTemplate.fromTemplate(`
            Original trade call :
            {trade_call}

            Generate a generic template  ,Identify and replace stock name with [STOCK NAME], call_type with [TYPE] , target with [TARGET(S)], stoploss with [STOPLOSS] and entry price with [ENTRY PRICE].
            
            `
        );
    }

    async analyzeStyle(templates) {
        const chain = RunnableSequence.from([
          this.styleAnalysisPrompt,
          this.llm,
          new StringOutputParser()
        ]);
        return chain.invoke({ templates: templates.join("\n\n") });
    }

    validateParameters(tradeParams) {
        const requiredFields = ['call_type', 'symbol', 'entry_price', 'stop_loss', 'targets'];

        // Basic validation
        // if (!requiredFields.every(field => tradeParams.hasOwnProperty(field))) {
        //     return false;
        // }

        // // Type validation
        // if (!['BUY', 'SELL', 'UPDATE'].includes(tradeParams.call_type)) {
        //     return false;
        // }

        // // Numeric validation
        // try {
        //     parseFloat(tradeParams.entry_price);
        //     parseFloat(tradeParams.stop_loss);
        //     if (!Array.isArray(tradeParams.targets)) {
        //         return false;
        //     }
        //     tradeParams.targets.forEach(t => parseFloat(t));
        // } catch (ValueError) {
        //     return false;
        // }
        return true;
    }

   async generateTradeCall(templates, tradeParams) {
    console.log(tradeParams)
      if (!this.validateParameters(tradeParams)) {
        throw new Error("Invalid trade parameters provided");
      }

      const styleElements = await this.analyzeStyle(templates);
      const chain = RunnableSequence.from([
        this.tradeCallPrompt,
        this.llm,
          new StringOutputParser()
      ]);

      return chain.invoke({
        style_elements: styleElements,
        trade_params: JSON.stringify(tradeParams),
      });
    }

   async improveTradeCall(originalCall, feedback) {
        const chain = RunnableSequence.from([
        this.improvementPrompt,
          this.llm,
            new StringOutputParser()
      ]);
        return chain.invoke({ original_call: originalCall, feedback: feedback });
    }
    async createTradeTemplate(tradeCall) {
        const chain = RunnableSequence.from([
        this.templatePrompt,
            this.llm,
             new StringOutputParser()
      ]);
        return chain.invoke({ trade_call: tradeCall });
    }
}

const analyzer = new TradingStyleAnalyzer(process.env.GOOGLE_API_KEY);

// --- Endpoint definitions ---

app.post('/analyze-style', async (req, res) => {
    try {
        const { templates } = req.body;
        if (!templates || !Array.isArray(templates)) {
            return res.status(400).send({ error: "Invalid templates provided" });
        }
        const response = await analyzer.analyzeStyle(templates);
        res.send(response);
    } catch (error) {
        console.error("Error during style analysis:", error);
        res.status(500).send({ error: error.message || "Internal Server Error" });
    }
});

app.post('/generate-trade-call', async (req, res) => {
    try {
        const { templates, tradeParams } = req.body;
        if (!templates || !Array.isArray(templates) || !tradeParams) {
            return res.status(400).send({ error: "Invalid request parameters" });
        }
        const response = await analyzer.generateTradeCall(templates, tradeParams);
        res.send(response);
    } catch (error) {
        console.error("Error generating trade call:", error);
        res.status(500).send({ error: error.message || "Internal Server Error" });
    }
});

app.post('/improve-trade-call', async (req, res) => {
    try {
        const { originalCall, feedback } = req.body;
        if (!originalCall || !feedback) {
            return res.status(400).send({ error: "Invalid request parameters" });
        }
        const response = await analyzer.improveTradeCall(originalCall, feedback);
        res.send(response);
    } catch (error) {
        console.error("Error improving trade call:", error);
        res.status(500).send({ error: error.message || "Internal Server Error" });
    }
});

app.post('/create-trade-template', async (req, res) => {
    try {
        const { tradeCall } = req.body;
        if (!tradeCall) {
            return res.status(400).send({ error: "Invalid request parameters" });
        }
        const response = await analyzer.createTradeTemplate(tradeCall);
        res.send(response);
    } catch (error) {
        console.error("Error creating trade template:", error);
        res.status(500).send({ error: error.message || "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});