"use strict";
exports.id = 990;
exports.ids = [990];
exports.modules = {

/***/ 8990:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "ChatOpenAI": () => (/* binding */ ChatOpenAI),
  "PromptLayerChatOpenAI": () => (/* binding */ PromptLayerChatOpenAI)
});

// EXTERNAL MODULE: ./node_modules/openai/dist/index.js
var dist = __webpack_require__(9211);
// EXTERNAL MODULE: ./node_modules/langchain/dist/util/env.js
var env = __webpack_require__(5785);
// EXTERNAL MODULE: ./node_modules/langchain/dist/util/axios-fetch-adapter.js + 1 modules
var axios_fetch_adapter = __webpack_require__(43);
// EXTERNAL MODULE: ./node_modules/langchain/dist/schema/index.js
var schema = __webpack_require__(8102);
// EXTERNAL MODULE: ./node_modules/langchain/dist/base_language/index.js
var base_language = __webpack_require__(5487);
// EXTERNAL MODULE: ./node_modules/langchain/dist/callbacks/manager.js + 7 modules
var manager = __webpack_require__(4551);
;// CONCATENATED MODULE: ./node_modules/langchain/dist/chat_models/base.js



class BaseChatModel extends base_language/* BaseLanguageModel */.qV {
    constructor(fields) {
        super(fields);
    }
    async generate(messages, options, callbacks) {
        const generations = [];
        const llmOutputs = [];
        let parsedOptions;
        if (Array.isArray(options)) {
            parsedOptions = { stop: options };
        }
        else if (options?.timeout && !options.signal) {
            parsedOptions = {
                ...options,
                signal: AbortSignal.timeout(options.timeout),
            };
        }
        else {
            parsedOptions = options ?? {};
        }
        const callbackManager_ = await manager/* CallbackManager.configure */.Ye.configure(callbacks, this.callbacks, { verbose: this.verbose });
        const invocationParams = { invocation_params: this?.invocationParams() };
        const runManager = await callbackManager_?.handleChatModelStart({ name: this._llmType() }, messages, undefined, undefined, invocationParams);
        try {
            const results = await Promise.all(messages.map((messageList) => this._generate(messageList, parsedOptions, runManager)));
            for (const result of results) {
                if (result.llmOutput) {
                    llmOutputs.push(result.llmOutput);
                }
                generations.push(result.generations);
            }
        }
        catch (err) {
            await runManager?.handleLLMError(err);
            throw err;
        }
        const output = {
            generations,
            llmOutput: llmOutputs.length
                ? this._combineLLMOutput?.(...llmOutputs)
                : undefined,
        };
        await runManager?.handleLLMEnd(output);
        Object.defineProperty(output, schema/* RUN_KEY */.WH, {
            value: runManager ? { runId: runManager?.runId } : undefined,
            configurable: true,
        });
        return output;
    }
    /**
     * Get the parameters used to invoke the model
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    invocationParams() {
        return {};
    }
    _modelType() {
        return "base_chat_model";
    }
    async generatePrompt(promptValues, options, callbacks) {
        const promptMessages = promptValues.map((promptValue) => promptValue.toChatMessages());
        return this.generate(promptMessages, options, callbacks);
    }
    async call(messages, options, callbacks) {
        const result = await this.generate([messages], options, callbacks);
        const generations = result.generations;
        return generations[0][0].message;
    }
    async callPrompt(promptValue, options, callbacks) {
        const promptMessages = promptValue.toChatMessages();
        return this.call(promptMessages, options, callbacks);
    }
    async predictMessages(messages, options, callbacks) {
        return this.call(messages, options, callbacks);
    }
    async predict(text, options, callbacks) {
        const message = new schema/* HumanChatMessage */.Z(text);
        const result = await this.call([message], options, callbacks);
        return result.text;
    }
}
class SimpleChatModel extends (/* unused pure expression or super */ null && (BaseChatModel)) {
    async _generate(messages, options, runManager) {
        const text = await this._call(messages, options, runManager);
        const message = new AIChatMessage(text);
        return {
            generations: [
                {
                    text: message.text,
                    message,
                },
            ],
        };
    }
}

// EXTERNAL MODULE: ./node_modules/langchain/dist/base_language/count_tokens.js
var count_tokens = __webpack_require__(8393);
// EXTERNAL MODULE: ./node_modules/langchain/dist/util/prompt-layer.js
var prompt_layer = __webpack_require__(2306);
;// CONCATENATED MODULE: ./node_modules/langchain/dist/chat_models/openai.js







function messageTypeToOpenAIRole(type) {
    switch (type) {
        case "system":
            return "system";
        case "ai":
            return "assistant";
        case "human":
            return "user";
        default:
            throw new Error(`Unknown message type: ${type}`);
    }
}
function openAIResponseToChatMessage(role, text) {
    switch (role) {
        case "user":
            return new schema/* HumanChatMessage */.Z(text);
        case "assistant":
            return new schema/* AIChatMessage */.Ck(text);
        case "system":
            return new schema/* SystemChatMessage */.w(text);
        default:
            return new schema/* ChatMessage */.J(text, role ?? "unknown");
    }
}
/**
 * Wrapper around OpenAI large language models that use the Chat endpoint.
 *
 * To use you should have the `openai` package installed, with the
 * `OPENAI_API_KEY` environment variable set.
 *
 * To use with Azure you should have the `openai` package installed, with the
 * `AZURE_OPENAI_API_KEY`,
 * `AZURE_OPENAI_API_INSTANCE_NAME`,
 * `AZURE_OPENAI_API_DEPLOYMENT_NAME`
 * and `AZURE_OPENAI_API_VERSION` environment variable set.
 *
 * @remarks
 * Any parameters that are valid to be passed to {@link
 * https://platform.openai.com/docs/api-reference/chat/create |
 * `openai.createCompletion`} can be passed through {@link modelKwargs}, even
 * if not explicitly available on this class.
 */
class ChatOpenAI extends BaseChatModel {
    get callKeys() {
        return ["stop", "signal", "timeout", "options"];
    }
    constructor(fields, configuration) {
        super(fields ?? {});
        Object.defineProperty(this, "temperature", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "topP", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "frequencyPenalty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "presencePenalty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "n", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "logitBias", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "modelName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "gpt-3.5-turbo"
        });
        Object.defineProperty(this, "modelKwargs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "stop", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "timeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "streaming", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "maxTokens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "azureOpenAIApiVersion", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "azureOpenAIApiKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "azureOpenAIApiInstanceName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "azureOpenAIApiDeploymentName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "clientConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const apiKey = fields?.openAIApiKey ?? (0,env/* getEnvironmentVariable */.lS)("OPENAI_API_KEY");
        const azureApiKey = fields?.azureOpenAIApiKey ??
            (0,env/* getEnvironmentVariable */.lS)("AZURE_OPENAI_API_KEY");
        if (!azureApiKey && !apiKey) {
            throw new Error("(Azure) OpenAI API key not found");
        }
        const azureApiInstanceName = fields?.azureOpenAIApiInstanceName ??
            (0,env/* getEnvironmentVariable */.lS)("AZURE_OPENAI_API_INSTANCE_NAME");
        const azureApiDeploymentName = fields?.azureOpenAIApiDeploymentName ??
            (0,env/* getEnvironmentVariable */.lS)("AZURE_OPENAI_API_DEPLOYMENT_NAME");
        const azureApiVersion = fields?.azureOpenAIApiVersion ??
            (0,env/* getEnvironmentVariable */.lS)("AZURE_OPENAI_API_VERSION");
        this.modelName = fields?.modelName ?? this.modelName;
        this.modelKwargs = fields?.modelKwargs ?? {};
        this.timeout = fields?.timeout;
        this.temperature = fields?.temperature ?? this.temperature;
        this.topP = fields?.topP ?? this.topP;
        this.frequencyPenalty = fields?.frequencyPenalty ?? this.frequencyPenalty;
        this.presencePenalty = fields?.presencePenalty ?? this.presencePenalty;
        this.maxTokens = fields?.maxTokens;
        this.n = fields?.n ?? this.n;
        this.logitBias = fields?.logitBias;
        this.stop = fields?.stop;
        this.streaming = fields?.streaming ?? false;
        this.azureOpenAIApiVersion = azureApiVersion;
        this.azureOpenAIApiKey = azureApiKey;
        this.azureOpenAIApiInstanceName = azureApiInstanceName;
        this.azureOpenAIApiDeploymentName = azureApiDeploymentName;
        if (this.streaming && this.n > 1) {
            throw new Error("Cannot stream results when n > 1");
        }
        if (this.azureOpenAIApiKey) {
            if (!this.azureOpenAIApiInstanceName) {
                throw new Error("Azure OpenAI API instance name not found");
            }
            if (!this.azureOpenAIApiDeploymentName) {
                throw new Error("Azure OpenAI API deployment name not found");
            }
            if (!this.azureOpenAIApiVersion) {
                throw new Error("Azure OpenAI API version not found");
            }
        }
        this.clientConfig = {
            apiKey,
            ...configuration,
        };
    }
    /**
     * Get the parameters used to invoke the model
     */
    invocationParams() {
        return {
            model: this.modelName,
            temperature: this.temperature,
            top_p: this.topP,
            frequency_penalty: this.frequencyPenalty,
            presence_penalty: this.presencePenalty,
            max_tokens: this.maxTokens === -1 ? undefined : this.maxTokens,
            n: this.n,
            logit_bias: this.logitBias,
            stop: this.stop,
            stream: this.streaming,
            ...this.modelKwargs,
        };
    }
    /** @ignore */
    _identifyingParams() {
        return {
            model_name: this.modelName,
            ...this.invocationParams(),
            ...this.clientConfig,
        };
    }
    /**
     * Get the identifying parameters for the model
     */
    identifyingParams() {
        return this._identifyingParams();
    }
    /** @ignore */
    async _generate(messages, options, runManager) {
        const tokenUsage = {};
        if (this.stop && options?.stop) {
            throw new Error("Stop found in input and default params");
        }
        const params = this.invocationParams();
        params.stop = options?.stop ?? params.stop;
        const messagesMapped = messages.map((message) => ({
            role: messageTypeToOpenAIRole(message._getType()),
            content: message.text,
            name: message.name,
        }));
        const data = params.stream
            ? await new Promise((resolve, reject) => {
                let response;
                let rejected = false;
                let resolved = false;
                this.completionWithRetry({
                    ...params,
                    messages: messagesMapped,
                }, {
                    signal: options?.signal,
                    ...options?.options,
                    adapter: axios_fetch_adapter/* default */.Z,
                    responseType: "stream",
                    onmessage: (event) => {
                        if (event.data?.trim?.() === "[DONE]") {
                            if (resolved) {
                                return;
                            }
                            resolved = true;
                            resolve(response);
                        }
                        else {
                            const message = JSON.parse(event.data);
                            // on the first message set the response properties
                            if (!response) {
                                response = {
                                    id: message.id,
                                    object: message.object,
                                    created: message.created,
                                    model: message.model,
                                    choices: [],
                                };
                            }
                            // on all messages, update choice
                            for (const part of message.choices) {
                                if (part != null) {
                                    let choice = response.choices.find((c) => c.index === part.index);
                                    if (!choice) {
                                        choice = {
                                            index: part.index,
                                            finish_reason: part.finish_reason ?? undefined,
                                        };
                                        response.choices[part.index] = choice;
                                    }
                                    if (!choice.message) {
                                        choice.message = {
                                            role: part.delta
                                                ?.role,
                                            content: part.delta?.content ?? "",
                                        };
                                    }
                                    choice.message.content += part.delta?.content ?? "";
                                    // TODO this should pass part.index to the callback
                                    // when that's supported there
                                    // eslint-disable-next-line no-void
                                    void runManager?.handleLLMNewToken(part.delta?.content ?? "");
                                }
                            }
                            // when all messages are finished, resolve
                            if (!resolved &&
                                message.choices.every((c) => c.finish_reason != null)) {
                                resolved = true;
                                resolve(response);
                            }
                        }
                    },
                }).catch((error) => {
                    if (!rejected) {
                        rejected = true;
                        reject(error);
                    }
                });
            })
            : await this.completionWithRetry({
                ...params,
                messages: messagesMapped,
            }, {
                signal: options?.signal,
                ...options?.options,
            });
        const { completion_tokens: completionTokens, prompt_tokens: promptTokens, total_tokens: totalTokens, } = data.usage ?? {};
        if (completionTokens) {
            tokenUsage.completionTokens =
                (tokenUsage.completionTokens ?? 0) + completionTokens;
        }
        if (promptTokens) {
            tokenUsage.promptTokens = (tokenUsage.promptTokens ?? 0) + promptTokens;
        }
        if (totalTokens) {
            tokenUsage.totalTokens = (tokenUsage.totalTokens ?? 0) + totalTokens;
        }
        const generations = [];
        for (const part of data.choices) {
            const role = part.message?.role ?? undefined;
            const text = part.message?.content ?? "";
            generations.push({
                text,
                message: openAIResponseToChatMessage(role, text),
            });
        }
        return {
            generations,
            llmOutput: { tokenUsage },
        };
    }
    async getNumTokensFromMessages(messages) {
        let totalCount = 0;
        let tokensPerMessage = 0;
        let tokensPerName = 0;
        // From: https://github.com/openai/openai-cookbook/blob/main/examples/How_to_format_inputs_to_ChatGPT_models.ipynb
        if ((0,count_tokens/* getModelNameForTiktoken */._i)(this.modelName) === "gpt-3.5-turbo") {
            tokensPerMessage = 4;
            tokensPerName = -1;
        }
        else if ((0,count_tokens/* getModelNameForTiktoken */._i)(this.modelName).startsWith("gpt-4")) {
            tokensPerMessage = 3;
            tokensPerName = 1;
        }
        const countPerMessage = await Promise.all(messages.map(async (message) => {
            const textCount = await this.getNumTokens(message.text);
            const roleCount = await this.getNumTokens(messageTypeToOpenAIRole(message._getType()));
            const nameCount = message.name !== undefined
                ? tokensPerName + (await this.getNumTokens(message.name))
                : 0;
            const count = textCount + tokensPerMessage + roleCount + nameCount;
            totalCount += count;
            return count;
        }));
        totalCount += 3; // every reply is primed with <|start|>assistant<|message|>
        return { totalCount, countPerMessage };
    }
    /** @ignore */
    async completionWithRetry(request, options) {
        if (!this.client) {
            const endpoint = this.azureOpenAIApiKey
                ? `https://${this.azureOpenAIApiInstanceName}.openai.azure.com/openai/deployments/${this.azureOpenAIApiDeploymentName}`
                : this.clientConfig.basePath;
            const clientConfig = new dist.Configuration({
                ...this.clientConfig,
                basePath: endpoint,
                baseOptions: {
                    timeout: this.timeout,
                    ...this.clientConfig.baseOptions,
                },
            });
            this.client = new dist.OpenAIApi(clientConfig);
        }
        const axiosOptions = {
            adapter: (0,env/* isNode */.UG)() ? undefined : axios_fetch_adapter/* default */.Z,
            ...this.clientConfig.baseOptions,
            ...options,
        };
        if (this.azureOpenAIApiKey) {
            axiosOptions.headers = {
                "api-key": this.azureOpenAIApiKey,
                ...axiosOptions.headers,
            };
            axiosOptions.params = {
                "api-version": this.azureOpenAIApiVersion,
                ...axiosOptions.params,
            };
        }
        return this.caller
            .call(this.client.createChatCompletion.bind(this.client), request, axiosOptions)
            .then((res) => res.data);
    }
    _llmType() {
        return "openai";
    }
    /** @ignore */
    _combineLLMOutput(...llmOutputs) {
        return llmOutputs.reduce((acc, llmOutput) => {
            if (llmOutput && llmOutput.tokenUsage) {
                acc.tokenUsage.completionTokens +=
                    llmOutput.tokenUsage.completionTokens ?? 0;
                acc.tokenUsage.promptTokens += llmOutput.tokenUsage.promptTokens ?? 0;
                acc.tokenUsage.totalTokens += llmOutput.tokenUsage.totalTokens ?? 0;
            }
            return acc;
        }, {
            tokenUsage: {
                completionTokens: 0,
                promptTokens: 0,
                totalTokens: 0,
            },
        });
    }
}
class PromptLayerChatOpenAI extends ChatOpenAI {
    constructor(fields) {
        super(fields);
        Object.defineProperty(this, "promptLayerApiKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "plTags", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "returnPromptLayerId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.promptLayerApiKey =
            fields?.promptLayerApiKey ??
                (typeof process !== "undefined"
                    ? // eslint-disable-next-line no-process-env
                        process.env?.PROMPTLAYER_API_KEY
                    : undefined);
        this.plTags = fields?.plTags ?? [];
        this.returnPromptLayerId = fields?.returnPromptLayerId ?? false;
    }
    async _generate(messages, options, runManager) {
        const requestStartTime = Date.now();
        let parsedOptions;
        if (Array.isArray(options)) {
            parsedOptions = { stop: options };
        }
        else if (options?.timeout && !options.signal) {
            parsedOptions = {
                ...options,
                signal: AbortSignal.timeout(options.timeout),
            };
        }
        else {
            parsedOptions = options ?? {};
        }
        const generatedResponses = await super._generate(messages, parsedOptions, runManager);
        const requestEndTime = Date.now();
        const _convertMessageToDict = (message) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let messageDict;
            if (message._getType() === "human") {
                messageDict = { role: "user", content: message.text };
            }
            else if (message._getType() === "ai") {
                messageDict = { role: "assistant", content: message.text };
            }
            else if (message._getType() === "system") {
                messageDict = { role: "system", content: message.text };
            }
            else if (message._getType() === "generic") {
                messageDict = {
                    role: message.role,
                    content: message.text,
                };
            }
            else {
                throw new Error(`Got unknown type ${message}`);
            }
            return messageDict;
        };
        const _createMessageDicts = (messages, callOptions) => {
            const params = {
                ...this.invocationParams(),
                model: this.modelName,
            };
            if (callOptions?.stop) {
                if (Object.keys(params).includes("stop")) {
                    throw new Error("`stop` found in both the input and default params.");
                }
            }
            const messageDicts = messages.map((message) => _convertMessageToDict(message));
            return messageDicts;
        };
        for (let i = 0; i < generatedResponses.generations.length; i += 1) {
            const generation = generatedResponses.generations[i];
            const messageDicts = _createMessageDicts(messages, parsedOptions);
            let promptLayerRequestId;
            const parsedResp = [
                {
                    content: generation.text,
                    role: messageTypeToOpenAIRole(generation.message._getType()),
                },
            ];
            const promptLayerRespBody = await (0,prompt_layer/* promptLayerTrackRequest */.r)(this.caller, "langchain.PromptLayerChatOpenAI", messageDicts, this._identifyingParams(), this.plTags, parsedResp, requestStartTime, requestEndTime, this.promptLayerApiKey);
            if (this.returnPromptLayerId === true) {
                if (promptLayerRespBody.success === true) {
                    promptLayerRequestId = promptLayerRespBody.request_id;
                }
                if (!generation.generationInfo ||
                    typeof generation.generationInfo !== "object") {
                    generation.generationInfo = {};
                }
                generation.generationInfo.promptLayerRequestId = promptLayerRequestId;
            }
        }
        return generatedResponses;
    }
}


/***/ })

};
;