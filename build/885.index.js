"use strict";
exports.id = 885;
exports.ids = [885];
exports.modules = {

/***/ 6885:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "OpenAI": () => (/* binding */ OpenAI),
  "OpenAIChat": () => (/* reexport */ OpenAIChat),
  "PromptLayerOpenAI": () => (/* binding */ PromptLayerOpenAI),
  "PromptLayerOpenAIChat": () => (/* reexport */ PromptLayerOpenAIChat)
});

// EXTERNAL MODULE: ./node_modules/openai/dist/index.js
var dist = __webpack_require__(9211);
// EXTERNAL MODULE: ./node_modules/langchain/dist/util/env.js
var env = __webpack_require__(5785);
// EXTERNAL MODULE: ./node_modules/langchain/dist/util/axios-fetch-adapter.js + 1 modules
var axios_fetch_adapter = __webpack_require__(43);
;// CONCATENATED MODULE: ./node_modules/langchain/dist/util/chunk.js
const chunkArray = (arr, chunkSize) => arr.reduce((chunks, elem, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    const chunk = chunks[chunkIndex] || [];
    // eslint-disable-next-line no-param-reassign
    chunks[chunkIndex] = chunk.concat([elem]);
    return chunks;
}, []);

// EXTERNAL MODULE: ./node_modules/object-hash/index.js
var object_hash = __webpack_require__(4856);
;// CONCATENATED MODULE: ./node_modules/langchain/dist/cache/base.js

/**
 * This cache key should be consistent across all versions of langchain.
 * It is currently NOT consistent across versions of langchain.
 *
 * A huge benefit of having a remote cache (like redis) is that you can
 * access the cache from different processes/machines. The allows you to
 * seperate concerns and scale horizontally.
 *
 * TODO: Make cache key consistent across versions of langchain.
 */
const getCacheKey = (...strings) => object_hash(strings.join("_"));

// EXTERNAL MODULE: ./node_modules/langchain/dist/schema/index.js
var schema = __webpack_require__(8102);
;// CONCATENATED MODULE: ./node_modules/langchain/dist/cache/index.js


const GLOBAL_MAP = new Map();
class InMemoryCache extends schema/* BaseCache */.H2 {
    constructor(map) {
        super();
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.cache = map ?? new Map();
    }
    lookup(prompt, llmKey) {
        return Promise.resolve(this.cache.get(getCacheKey(prompt, llmKey)) ?? null);
    }
    async update(prompt, llmKey, value) {
        this.cache.set(getCacheKey(prompt, llmKey), value);
    }
    static global() {
        return new InMemoryCache(GLOBAL_MAP);
    }
}

// EXTERNAL MODULE: ./node_modules/langchain/dist/base_language/index.js
var base_language = __webpack_require__(5487);
// EXTERNAL MODULE: ./node_modules/langchain/dist/callbacks/manager.js + 7 modules
var manager = __webpack_require__(4551);
// EXTERNAL MODULE: ./node_modules/langchain/dist/memory/base.js
var base = __webpack_require__(790);
;// CONCATENATED MODULE: ./node_modules/langchain/dist/llms/base.js





/**
 * LLM Wrapper. Provides an {@link call} (an {@link generate}) function that takes in a prompt (or prompts) and returns a string.
 */
class BaseLLM extends base_language/* BaseLanguageModel */.qV {
    constructor({ cache, concurrency, ...rest }) {
        super(concurrency ? { maxConcurrency: concurrency, ...rest } : rest);
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (typeof cache === "object") {
            this.cache = cache;
        }
        else if (cache) {
            this.cache = InMemoryCache.global();
        }
        else {
            this.cache = undefined;
        }
    }
    async generatePrompt(promptValues, options, callbacks) {
        const prompts = promptValues.map((promptValue) => promptValue.toString());
        return this.generate(prompts, options, callbacks);
    }
    /**
     * Get the parameters used to invoke the model
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    invocationParams() {
        return {};
    }
    /** @ignore */
    async _generateUncached(prompts, options, callbacks) {
        const callbackManager_ = await manager/* CallbackManager.configure */.Ye.configure(callbacks, this.callbacks, { verbose: this.verbose });
        const invocationParams = { invocation_params: this?.invocationParams() };
        const runManager = await callbackManager_?.handleLLMStart({ name: this._llmType() }, prompts, undefined, undefined, invocationParams);
        let output;
        try {
            output = await this._generate(prompts, options, runManager);
        }
        catch (err) {
            await runManager?.handleLLMError(err);
            throw err;
        }
        await runManager?.handleLLMEnd(output);
        // This defines RUN_KEY as a non-enumerable property on the output object
        // so that it is not serialized when the output is stringified, and so that
        // it isnt included when listing the keys of the output object.
        Object.defineProperty(output, schema/* RUN_KEY */.WH, {
            value: runManager ? { runId: runManager?.runId } : undefined,
            configurable: true,
        });
        return output;
    }
    /**
     * Run the LLM on the given propmts an input, handling caching.
     */
    async generate(prompts, options, callbacks) {
        if (!Array.isArray(prompts)) {
            throw new Error("Argument 'prompts' is expected to be a string[]");
        }
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
        if (!this.cache) {
            return this._generateUncached(prompts, parsedOptions, callbacks);
        }
        const { cache } = this;
        const params = this.serialize();
        params.stop = parsedOptions.stop ?? params.stop;
        const llmStringKey = `${Object.entries(params).sort()}`;
        const missingPromptIndices = [];
        const generations = await Promise.all(prompts.map(async (prompt, index) => {
            const result = await cache.lookup(prompt, llmStringKey);
            if (!result) {
                missingPromptIndices.push(index);
            }
            return result;
        }));
        let llmOutput = {};
        if (missingPromptIndices.length > 0) {
            const results = await this._generateUncached(missingPromptIndices.map((i) => prompts[i]), parsedOptions, callbacks);
            await Promise.all(results.generations.map(async (generation, index) => {
                const promptIndex = missingPromptIndices[index];
                generations[promptIndex] = generation;
                return cache.update(prompts[promptIndex], llmStringKey, generation);
            }));
            llmOutput = results.llmOutput ?? {};
        }
        return { generations, llmOutput };
    }
    /**
     * Convenience wrapper for {@link generate} that takes in a single string prompt and returns a single string output.
     */
    async call(prompt, options, callbacks) {
        const { generations } = await this.generate([prompt], options ?? {}, callbacks);
        return generations[0][0].text;
    }
    async predict(text, options, callbacks) {
        return this.call(text, options, callbacks);
    }
    async predictMessages(messages, options, callbacks) {
        const text = (0,base/* getBufferString */.zs)(messages);
        const prediction = await this.call(text, options, callbacks);
        return new schema/* AIChatMessage */.Ck(prediction);
    }
    /**
     * Get the identifying parameters of the LLM.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _identifyingParams() {
        return {};
    }
    /**
     * Return a json-like object representing this LLM.
     */
    serialize() {
        return {
            ...this._identifyingParams(),
            _type: this._llmType(),
            _model: this._modelType(),
        };
    }
    _modelType() {
        return "base_llm";
    }
    /**
     * Load an LLM from a json-like object describing it.
     */
    static async deserialize(data) {
        const { _type, _model, ...rest } = data;
        if (_model && _model !== "base_llm") {
            throw new Error(`Cannot load LLM with model ${_model}`);
        }
        const Cls = {
            openai: (await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 6885))).OpenAI,
        }[_type];
        if (Cls === undefined) {
            throw new Error(`Cannot load  LLM with type ${_type}`);
        }
        return new Cls(rest);
    }
}
/**
 * LLM class that provides a simpler interface to subclass than {@link BaseLLM}.
 *
 * Requires only implementing a simpler {@link _call} method instead of {@link _generate}.
 *
 * @augments BaseLLM
 */
class LLM extends BaseLLM {
    async _generate(prompts, options, runManager) {
        const generations = await Promise.all(prompts.map((prompt) => this._call(prompt, options, runManager).then((text) => [{ text }])));
        return { generations };
    }
}

// EXTERNAL MODULE: ./node_modules/langchain/dist/base_language/count_tokens.js
var count_tokens = __webpack_require__(8393);
// EXTERNAL MODULE: ./node_modules/langchain/dist/util/prompt-layer.js
var prompt_layer = __webpack_require__(2306);
;// CONCATENATED MODULE: ./node_modules/langchain/dist/llms/openai-chat.js





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
 *
 * @augments BaseLLM
 * @augments OpenAIInput
 * @augments AzureOpenAIChatInput
 */
class OpenAIChat extends LLM {
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
        Object.defineProperty(this, "maxTokens", {
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
        Object.defineProperty(this, "prefixMessages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "modelKwargs", {
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
        Object.defineProperty(this, "stop", {
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
        this.prefixMessages = fields?.prefixMessages ?? this.prefixMessages;
        this.modelKwargs = fields?.modelKwargs ?? {};
        this.timeout = fields?.timeout;
        this.temperature = fields?.temperature ?? this.temperature;
        this.topP = fields?.topP ?? this.topP;
        this.frequencyPenalty = fields?.frequencyPenalty ?? this.frequencyPenalty;
        this.presencePenalty = fields?.presencePenalty ?? this.presencePenalty;
        this.n = fields?.n ?? this.n;
        this.logitBias = fields?.logitBias;
        this.maxTokens = fields?.maxTokens;
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
            n: this.n,
            logit_bias: this.logitBias,
            max_tokens: this.maxTokens === -1 ? undefined : this.maxTokens,
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
        return {
            model_name: this.modelName,
            ...this.invocationParams(),
            ...this.clientConfig,
        };
    }
    formatMessages(prompt) {
        const message = {
            role: "user",
            content: prompt,
        };
        return this.prefixMessages ? [...this.prefixMessages, message] : [message];
    }
    /** @ignore */
    async _call(prompt, options, runManager) {
        const { stop } = options;
        const params = this.invocationParams();
        params.stop = stop ?? params.stop;
        const data = params.stream
            ? await new Promise((resolve, reject) => {
                let response;
                let rejected = false;
                let resolved = false;
                this.completionWithRetry({
                    ...params,
                    messages: this.formatMessages(prompt),
                }, {
                    signal: options.signal,
                    ...options.options,
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
                                        response.choices.push(choice);
                                    }
                                    if (!choice.message) {
                                        choice.message = {
                                            role: part.delta
                                                ?.role,
                                            content: part.delta?.content ?? "",
                                        };
                                    }
                                    choice.message.content += part.delta?.content ?? "";
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
                messages: this.formatMessages(prompt),
            }, {
                signal: options.signal,
                ...options.options,
            });
        return data.choices[0].message?.content ?? "";
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
}
/**
 * PromptLayer wrapper to OpenAIChat
 */
class PromptLayerOpenAIChat extends OpenAIChat {
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
        this.plTags = fields?.plTags ?? [];
        this.returnPromptLayerId = fields?.returnPromptLayerId ?? false;
        this.promptLayerApiKey =
            fields?.promptLayerApiKey ??
                (0,env/* getEnvironmentVariable */.lS)("PROMPTLAYER_API_KEY");
        if (!this.promptLayerApiKey) {
            throw new Error("Missing PromptLayer API key");
        }
    }
    async completionWithRetry(request, options) {
        if (request.stream) {
            return super.completionWithRetry(request, options);
        }
        const response = await super.completionWithRetry(request);
        return response;
    }
    async _generate(prompts, options, runManager) {
        let choice;
        const generations = await Promise.all(prompts.map(async (prompt) => {
            const requestStartTime = Date.now();
            const text = await this._call(prompt, options, runManager);
            const requestEndTime = Date.now();
            choice = [{ text }];
            const parsedResp = {
                text,
            };
            const promptLayerRespBody = await (0,prompt_layer/* promptLayerTrackRequest */.r)(this.caller, "langchain.PromptLayerOpenAIChat", [prompt], this._identifyingParams(), this.plTags, parsedResp, requestStartTime, requestEndTime, this.promptLayerApiKey);
            if (this.returnPromptLayerId === true &&
                promptLayerRespBody.success === true) {
                choice[0].generationInfo = {
                    promptLayerRequestId: promptLayerRespBody.request_id,
                };
            }
            return choice;
        }));
        return { generations };
    }
}

;// CONCATENATED MODULE: ./node_modules/langchain/dist/llms/openai.js








/**
 * Wrapper around OpenAI large language models.
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
 * https://platform.openai.com/docs/api-reference/completions/create |
 * `openai.createCompletion`} can be passed through {@link modelKwargs}, even
 * if not explicitly available on this class.
 */
class OpenAI extends BaseLLM {
    get callKeys() {
        return ["stop", "signal", "timeout", "options"];
    }
    constructor(fields, configuration) {
        if (fields?.modelName?.startsWith("gpt-3.5-turbo") ||
            fields?.modelName?.startsWith("gpt-4") ||
            fields?.modelName?.startsWith("gpt-4-32k")) {
            // eslint-disable-next-line no-constructor-return, @typescript-eslint/no-explicit-any
            return new OpenAIChat(fields, configuration);
        }
        super(fields ?? {});
        Object.defineProperty(this, "temperature", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.7
        });
        Object.defineProperty(this, "maxTokens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 256
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
        Object.defineProperty(this, "bestOf", {
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
            value: "text-davinci-003"
        });
        Object.defineProperty(this, "modelKwargs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "batchSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 20
        });
        Object.defineProperty(this, "timeout", {
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
        Object.defineProperty(this, "streaming", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
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
        const azureApiDeploymentName = (fields?.azureOpenAIApiCompletionsDeploymentName ||
            fields?.azureOpenAIApiDeploymentName) ??
            ((0,env/* getEnvironmentVariable */.lS)("AZURE_OPENAI_API_COMPLETIONS_DEPLOYMENT_NAME") ||
                (0,env/* getEnvironmentVariable */.lS)("AZURE_OPENAI_API_DEPLOYMENT_NAME"));
        const azureApiVersion = fields?.azureOpenAIApiVersion ??
            (0,env/* getEnvironmentVariable */.lS)("AZURE_OPENAI_API_VERSION");
        this.modelName = fields?.modelName ?? this.modelName;
        this.modelKwargs = fields?.modelKwargs ?? {};
        this.batchSize = fields?.batchSize ?? this.batchSize;
        this.timeout = fields?.timeout;
        this.temperature = fields?.temperature ?? this.temperature;
        this.maxTokens = fields?.maxTokens ?? this.maxTokens;
        this.topP = fields?.topP ?? this.topP;
        this.frequencyPenalty = fields?.frequencyPenalty ?? this.frequencyPenalty;
        this.presencePenalty = fields?.presencePenalty ?? this.presencePenalty;
        this.n = fields?.n ?? this.n;
        this.bestOf = fields?.bestOf ?? this.bestOf;
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
        if (this.streaming && this.bestOf > 1) {
            throw new Error("Cannot stream results when bestOf > 1");
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
            max_tokens: this.maxTokens,
            top_p: this.topP,
            frequency_penalty: this.frequencyPenalty,
            presence_penalty: this.presencePenalty,
            n: this.n,
            best_of: this.bestOf,
            logit_bias: this.logitBias,
            stop: this.stop,
            stream: this.streaming,
            ...this.modelKwargs,
        };
    }
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
    /**
     * Call out to OpenAI's endpoint with k unique prompts
     *
     * @param [prompts] - The prompts to pass into the model.
     * @param [options] - Optional list of stop words to use when generating.
     * @param [runManager] - Optional callback manager to use when generating.
     *
     * @returns The full LLM output.
     *
     * @example
     * ```ts
     * import { OpenAI } from "langchain/llms/openai";
     * const openai = new OpenAI();
     * const response = await openai.generate(["Tell me a joke."]);
     * ```
     */
    async _generate(prompts, options, runManager) {
        const { stop } = options;
        const subPrompts = chunkArray(prompts, this.batchSize);
        const choices = [];
        const tokenUsage = {};
        if (this.stop && stop) {
            throw new Error("Stop found in input and default params");
        }
        const params = this.invocationParams();
        params.stop = stop ?? params.stop;
        if (params.max_tokens === -1) {
            if (prompts.length !== 1) {
                throw new Error("max_tokens set to -1 not supported for multiple inputs");
            }
            params.max_tokens = await (0,count_tokens/* calculateMaxTokens */.F1)({
                prompt: prompts[0],
                // Cast here to allow for other models that may not fit the union
                modelName: this.modelName,
            });
        }
        for (let i = 0; i < subPrompts.length; i += 1) {
            const data = params.stream
                ? await new Promise((resolve, reject) => {
                    const choices = [];
                    let response;
                    let rejected = false;
                    let resolved = false;
                    this.completionWithRetry({
                        ...params,
                        prompt: subPrompts[i],
                    }, {
                        signal: options.signal,
                        ...options.options,
                        adapter: axios_fetch_adapter/* default */.Z,
                        responseType: "stream",
                        onmessage: (event) => {
                            if (event.data?.trim?.() === "[DONE]") {
                                if (resolved) {
                                    return;
                                }
                                resolved = true;
                                resolve({
                                    ...response,
                                    choices,
                                });
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
                                    };
                                }
                                // on all messages, update choice
                                for (const part of message.choices) {
                                    if (part != null && part.index != null) {
                                        if (!choices[part.index])
                                            choices[part.index] = {};
                                        const choice = choices[part.index];
                                        choice.text = (choice.text ?? "") + (part.text ?? "");
                                        choice.finish_reason = part.finish_reason;
                                        choice.logprobs = part.logprobs;
                                        // TODO this should pass part.index to the callback
                                        // when that's supported there
                                        // eslint-disable-next-line no-void
                                        void runManager?.handleLLMNewToken(part.text ?? "");
                                    }
                                }
                                // when all messages are finished, resolve
                                if (!resolved &&
                                    choices.every((c) => c.finish_reason != null)) {
                                    resolved = true;
                                    resolve({
                                        ...response,
                                        choices,
                                    });
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
                    prompt: subPrompts[i],
                }, {
                    signal: options.signal,
                    ...options.options,
                });
            choices.push(...data.choices);
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
        }
        const generations = chunkArray(choices, this.n).map((promptChoices) => promptChoices.map((choice) => ({
            text: choice.text ?? "",
            generationInfo: {
                finishReason: choice.finish_reason,
                logprobs: choice.logprobs,
            },
        })));
        return {
            generations,
            llmOutput: { tokenUsage },
        };
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
            .call(this.client.createCompletion.bind(this.client), request, axiosOptions)
            .then((res) => res.data);
    }
    _llmType() {
        return "openai";
    }
}
/**
 * PromptLayer wrapper to OpenAI
 * @augments OpenAI
 */
class PromptLayerOpenAI extends OpenAI {
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
        this.plTags = fields?.plTags ?? [];
        this.promptLayerApiKey =
            fields?.promptLayerApiKey ??
                (0,env/* getEnvironmentVariable */.lS)("PROMPTLAYER_API_KEY");
        this.returnPromptLayerId = fields?.returnPromptLayerId;
        if (!this.promptLayerApiKey) {
            throw new Error("Missing PromptLayer API key");
        }
    }
    async completionWithRetry(request, options) {
        if (request.stream) {
            return super.completionWithRetry(request, options);
        }
        const response = await super.completionWithRetry(request);
        return response;
    }
    async _generate(prompts, options, runManager) {
        const requestStartTime = Date.now();
        const generations = await super._generate(prompts, options, runManager);
        for (let i = 0; i < generations.generations.length; i += 1) {
            const requestEndTime = Date.now();
            const parsedResp = {
                text: generations.generations[i][0].text,
                llm_output: generations.llmOutput,
            };
            const promptLayerRespBody = await (0,prompt_layer/* promptLayerTrackRequest */.r)(this.caller, "langchain.PromptLayerOpenAI", [prompts[i]], this._identifyingParams(), this.plTags, parsedResp, requestStartTime, requestEndTime, this.promptLayerApiKey);
            let promptLayerRequestId;
            if (this.returnPromptLayerId === true) {
                if (promptLayerRespBody && promptLayerRespBody.success === true) {
                    promptLayerRequestId = promptLayerRespBody.request_id;
                }
                generations.generations[i][0].generationInfo = {
                    ...generations.generations[i][0].generationInfo,
                    promptLayerRequestId,
                };
            }
        }
        return generations;
    }
}



/***/ })

};
;