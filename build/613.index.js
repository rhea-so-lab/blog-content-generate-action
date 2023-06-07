"use strict";
exports.id = 613;
exports.ids = [613];
exports.modules = {

/***/ 8393:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "F1": () => (/* binding */ calculateMaxTokens),
/* harmony export */   "_i": () => (/* binding */ getModelNameForTiktoken)
/* harmony export */ });
/* unused harmony exports getEmbeddingContextSize, getModelContextSize */
/* harmony import */ var _util_tiktoken_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6040);

// https://www.npmjs.com/package/js-tiktoken
const getModelNameForTiktoken = (modelName) => {
    if (modelName.startsWith("gpt-3.5-turbo-")) {
        return "gpt-3.5-turbo";
    }
    if (modelName.startsWith("gpt-4-32k-")) {
        return "gpt-4-32k";
    }
    if (modelName.startsWith("gpt-4-")) {
        return "gpt-4";
    }
    return modelName;
};
const getEmbeddingContextSize = (modelName) => {
    switch (modelName) {
        case "text-embedding-ada-002":
            return 8191;
        default:
            return 2046;
    }
};
const getModelContextSize = (modelName) => {
    switch (getModelNameForTiktoken(modelName)) {
        case "gpt-3.5-turbo":
            return 4096;
        case "gpt-4-32k":
            return 32768;
        case "gpt-4":
            return 8192;
        case "text-davinci-003":
            return 4097;
        case "text-curie-001":
            return 2048;
        case "text-babbage-001":
            return 2048;
        case "text-ada-001":
            return 2048;
        case "code-davinci-002":
            return 8000;
        case "code-cushman-001":
            return 2048;
        default:
            return 4097;
    }
};
const calculateMaxTokens = async ({ prompt, modelName, }) => {
    // fallback to approximate calculation if tiktoken is not available
    let numTokens = Math.ceil(prompt.length / 4);
    try {
        numTokens = (await (0,_util_tiktoken_js__WEBPACK_IMPORTED_MODULE_0__/* .encodingForModel */ .b)(modelName)).encode(prompt).length;
    }
    catch (error) {
        console.warn("Failed to calculate number of tokens, falling back to approximate count");
    }
    const maxTokens = getModelContextSize(modelName);
    return maxTokens - numTokens;
};


/***/ }),

/***/ 5487:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "qV": () => (/* binding */ BaseLanguageModel)
/* harmony export */ });
/* unused harmony export BaseLangChain */
/* harmony import */ var _util_async_caller_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2723);
/* harmony import */ var _count_tokens_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8393);
/* harmony import */ var _util_tiktoken_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6040);



const getVerbosity = () => false;
/**
 * Base class for language models, chains, tools.
 */
class BaseLangChain {
    constructor(params) {
        /**
         * Whether to print out response text.
         */
        Object.defineProperty(this, "verbose", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "callbacks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.verbose = params.verbose ?? getVerbosity();
        this.callbacks = params.callbacks;
    }
}
/**
 * Base class for language models.
 */
class BaseLanguageModel extends BaseLangChain {
    /**
     * Keys that the language model accepts as call options.
     */
    get callKeys() {
        return ["stop", "timeout", "signal"];
    }
    constructor(params) {
        super({
            verbose: params.verbose,
            callbacks: params.callbacks ?? params.callbackManager,
        });
        /**
         * The async caller should be used by subclasses to make any async calls,
         * which will thus benefit from the concurrency and retry logic.
         */
        Object.defineProperty(this, "caller", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_encoding", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.caller = new _util_async_caller_js__WEBPACK_IMPORTED_MODULE_0__/* .AsyncCaller */ .L(params ?? {});
    }
    async getNumTokens(text) {
        // fallback to approximate calculation if tiktoken is not available
        let numTokens = Math.ceil(text.length / 4);
        if (!this._encoding) {
            try {
                this._encoding = await (0,_util_tiktoken_js__WEBPACK_IMPORTED_MODULE_2__/* .encodingForModel */ .b)("modelName" in this
                    ? (0,_count_tokens_js__WEBPACK_IMPORTED_MODULE_1__/* .getModelNameForTiktoken */ ._i)(this.modelName)
                    : "gpt2");
            }
            catch (error) {
                console.warn("Failed to calculate number of tokens, falling back to approximate count", error);
            }
        }
        if (this._encoding) {
            numTokens = this._encoding.encode(text).length;
        }
        return numTokens;
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
    /**
     * Load an LLM from a json-like object describing it.
     */
    static async deserialize(data) {
        const { _type, _model, ...rest } = data;
        if (_model && _model !== "base_chat_model") {
            throw new Error(`Cannot load LLM with model ${_model}`);
        }
        const Cls = {
            openai: (await __webpack_require__.e(/* import() */ 990).then(__webpack_require__.bind(__webpack_require__, 8990))).ChatOpenAI,
        }[_type];
        if (Cls === undefined) {
            throw new Error(`Cannot load  LLM with type ${_type}`);
        }
        return new Cls(rest);
    }
}
/*
 * Calculate max tokens for given model and prompt.
 * That is the model size - number of tokens in prompt.
 */



/***/ }),

/***/ 4551:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Ye": () => (/* binding */ CallbackManager)
});

// UNUSED EXPORTS: BaseCallbackManager, CallbackManagerForChainRun, CallbackManagerForLLMRun, CallbackManagerForToolRun

// EXTERNAL MODULE: ./node_modules/langchain/node_modules/uuid/dist/index.js
var dist = __webpack_require__(8655);
;// CONCATENATED MODULE: ./node_modules/langchain/node_modules/uuid/wrapper.mjs

const v1 = dist.v1;
const v3 = dist.v3;
const v4 = dist.v4;
const v5 = dist.v5;
const NIL = dist.NIL;
const version = dist.version;
const validate = dist.validate;
const stringify = dist.stringify;
const parse = dist.parse;

;// CONCATENATED MODULE: ./node_modules/langchain/dist/callbacks/base.js

class BaseCallbackHandlerMethodsClass {
}
class BaseCallbackHandler extends BaseCallbackHandlerMethodsClass {
    constructor(input) {
        super();
        Object.defineProperty(this, "ignoreLLM", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "ignoreChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "ignoreAgent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        if (input) {
            this.ignoreLLM = input.ignoreLLM ?? this.ignoreLLM;
            this.ignoreChain = input.ignoreChain ?? this.ignoreChain;
            this.ignoreAgent = input.ignoreAgent ?? this.ignoreAgent;
        }
    }
    copy() {
        return new this.constructor(this);
    }
    static fromMethods(methods) {
        class Handler extends BaseCallbackHandler {
            constructor() {
                super();
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: v4()
                });
                Object.assign(this, methods);
            }
        }
        return new Handler();
    }
}

// EXTERNAL MODULE: ./node_modules/langchain/node_modules/ansi-styles/index.js
var ansi_styles = __webpack_require__(8964);
;// CONCATENATED MODULE: ./node_modules/langchain/dist/callbacks/handlers/tracer.js

class BaseTracer extends BaseCallbackHandler {
    constructor() {
        super();
        Object.defineProperty(this, "runMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    copy() {
        return this;
    }
    _addChildRun(parentRun, childRun) {
        parentRun.child_runs.push(childRun);
    }
    _startTrace(run) {
        if (run.parent_run_id !== undefined) {
            const parentRun = this.runMap.get(run.parent_run_id);
            if (parentRun) {
                this._addChildRun(parentRun, run);
            }
        }
        this.runMap.set(run.id, run);
    }
    async _endTrace(run) {
        const parentRun = run.parent_run_id !== undefined && this.runMap.get(run.parent_run_id);
        if (parentRun) {
            parentRun.child_execution_order = Math.max(parentRun.child_execution_order, run.child_execution_order);
        }
        else {
            await this.persistRun(run);
        }
        this.runMap.delete(run.id);
    }
    _getExecutionOrder(parentRunId) {
        const parentRun = parentRunId !== undefined && this.runMap.get(parentRunId);
        // If a run has no parent then execution order is 1
        if (!parentRun) {
            return 1;
        }
        return parentRun.child_execution_order + 1;
    }
    async handleLLMStart(llm, prompts, runId, parentRunId, extraParams) {
        const execution_order = this._getExecutionOrder(parentRunId);
        const run = {
            id: runId,
            name: llm.name,
            parent_run_id: parentRunId,
            start_time: Date.now(),
            serialized: llm,
            inputs: { prompts },
            execution_order,
            child_runs: [],
            child_execution_order: execution_order,
            run_type: "llm",
            extra: extraParams,
        };
        this._startTrace(run);
        await this.onLLMStart?.(run);
    }
    async handleChatModelStart(llm, messages, runId, parentRunId, extraParams) {
        const execution_order = this._getExecutionOrder(parentRunId);
        const run = {
            id: runId,
            name: llm.name,
            parent_run_id: parentRunId,
            start_time: Date.now(),
            serialized: llm,
            inputs: { messages },
            execution_order,
            child_runs: [],
            child_execution_order: execution_order,
            run_type: "llm",
            extra: extraParams,
        };
        this._startTrace(run);
        await this.onLLMStart?.(run);
    }
    async handleLLMEnd(output, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.run_type !== "llm") {
            throw new Error("No LLM run to end.");
        }
        run.end_time = Date.now();
        run.outputs = output;
        await this.onLLMEnd?.(run);
        await this._endTrace(run);
    }
    async handleLLMError(error, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.run_type !== "llm") {
            throw new Error("No LLM run to end.");
        }
        run.end_time = Date.now();
        run.error = error.message;
        await this.onLLMError?.(run);
        await this._endTrace(run);
    }
    async handleChainStart(chain, inputs, runId, parentRunId) {
        const execution_order = this._getExecutionOrder(parentRunId);
        const run = {
            id: runId,
            name: chain.name,
            parent_run_id: parentRunId,
            start_time: Date.now(),
            serialized: chain,
            inputs,
            execution_order,
            child_execution_order: execution_order,
            run_type: "chain",
            child_runs: [],
        };
        this._startTrace(run);
        await this.onChainStart?.(run);
    }
    async handleChainEnd(outputs, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.run_type !== "chain") {
            throw new Error("No chain run to end.");
        }
        run.end_time = Date.now();
        run.outputs = outputs;
        await this.onChainEnd?.(run);
        await this._endTrace(run);
    }
    async handleChainError(error, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.run_type !== "chain") {
            throw new Error("No chain run to end.");
        }
        run.end_time = Date.now();
        run.error = error.message;
        await this.onChainError?.(run);
        await this._endTrace(run);
    }
    async handleToolStart(tool, input, runId, parentRunId) {
        const execution_order = this._getExecutionOrder(parentRunId);
        const run = {
            id: runId,
            name: tool.name,
            parent_run_id: parentRunId,
            start_time: Date.now(),
            serialized: tool,
            inputs: { input },
            execution_order,
            child_execution_order: execution_order,
            run_type: "tool",
            child_runs: [],
        };
        this._startTrace(run);
        await this.onToolStart?.(run);
    }
    async handleToolEnd(output, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.run_type !== "tool") {
            throw new Error("No tool run to end");
        }
        run.end_time = Date.now();
        run.outputs = { output };
        await this.onToolEnd?.(run);
        await this._endTrace(run);
    }
    async handleToolError(error, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.run_type !== "tool") {
            throw new Error("No tool run to end");
        }
        run.end_time = Date.now();
        run.error = error.message;
        await this.onToolError?.(run);
        await this._endTrace(run);
    }
    async handleAgentAction(action, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.run_type !== "chain") {
            return;
        }
        const agentRun = run;
        agentRun.actions = agentRun.actions || [];
        agentRun.actions.push(action);
        await this.onAgentAction?.(run);
    }
}

;// CONCATENATED MODULE: ./node_modules/langchain/dist/callbacks/handlers/console.js


function wrap(style, text) {
    return `${style.open}${text}${style.close}`;
}
function tryJsonStringify(obj, fallback) {
    try {
        return JSON.stringify(obj, null, 2);
    }
    catch (err) {
        return fallback;
    }
}
function elapsed(run) {
    if (!run.end_time)
        return "";
    const elapsed = run.end_time - run.start_time;
    if (elapsed < 1000) {
        return `${elapsed}ms`;
    }
    return `${(elapsed / 1000).toFixed(2)}s`;
}
const { color } = ansi_styles;
class ConsoleCallbackHandler extends BaseTracer {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "console_callback_handler"
        });
    }
    persistRun(_run) {
        return Promise.resolve();
    }
    // utility methods
    getParents(run) {
        const parents = [];
        let currentRun = run;
        while (currentRun.parent_run_id) {
            const parent = this.runMap.get(currentRun.parent_run_id);
            if (parent) {
                parents.push(parent);
                currentRun = parent;
            }
            else {
                break;
            }
        }
        return parents;
    }
    getBreadcrumbs(run) {
        const parents = this.getParents(run).reverse();
        const string = [...parents, run]
            .map((parent, i, arr) => {
            const name = `${parent.execution_order}:${parent.run_type}:${parent.name}`;
            return i === arr.length - 1 ? wrap(ansi_styles.bold, name) : name;
        })
            .join(" > ");
        return wrap(color.grey, string);
    }
    // logging methods
    onChainStart(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.green, "[chain/start]")} [${crumbs}] Entering Chain run with input: ${tryJsonStringify(run.inputs, "[inputs]")}`);
    }
    onChainEnd(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.cyan, "[chain/end]")} [${crumbs}] [${elapsed(run)}] Exiting Chain run with output: ${tryJsonStringify(run.outputs, "[outputs]")}`);
    }
    onChainError(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.red, "[chain/error]")} [${crumbs}] [${elapsed(run)}] Chain run errored with error: ${tryJsonStringify(run.error, "[error]")}`);
    }
    onLLMStart(run) {
        const crumbs = this.getBreadcrumbs(run);
        const inputs = "prompts" in run.inputs
            ? { prompts: run.inputs.prompts.map((p) => p.trim()) }
            : run.inputs;
        console.log(`${wrap(color.green, "[llm/start]")} [${crumbs}] Entering LLM run with input: ${tryJsonStringify(inputs, "[inputs]")}`);
    }
    onLLMEnd(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.cyan, "[llm/end]")} [${crumbs}] [${elapsed(run)}] Exiting LLM run with output: ${tryJsonStringify(run.outputs, "[response]")}`);
    }
    onLLMError(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.red, "[llm/error]")} [${crumbs}] [${elapsed(run)}] LLM run errored with error: ${tryJsonStringify(run.error, "[error]")}`);
    }
    onToolStart(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.green, "[tool/start]")} [${crumbs}] Entering Tool run with input: "${run.inputs.input?.trim()}"`);
    }
    onToolEnd(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.cyan, "[tool/end]")} [${crumbs}] [${elapsed(run)}] Exiting Tool run with output: "${run.outputs?.output?.trim()}"`);
    }
    onToolError(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.red, "[tool/error]")} [${crumbs}] [${elapsed(run)}] Tool run errored with error: ${tryJsonStringify(run.error, "[error]")}`);
    }
    onAgentAction(run) {
        const agentRun = run;
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.blue, "[agent/action]")} [${crumbs}] Agent selected action: ${tryJsonStringify(agentRun.actions[agentRun.actions.length - 1], "[action]")}`);
    }
}

// EXTERNAL MODULE: ./node_modules/langchain/dist/util/async_caller.js
var async_caller = __webpack_require__(2723);
// EXTERNAL MODULE: ./node_modules/langchain/dist/util/env.js
var env = __webpack_require__(5785);
;// CONCATENATED MODULE: ./node_modules/langchain/dist/callbacks/handlers/tracer_langchain.js



class LangChainTracer extends BaseTracer {
    constructor({ exampleId, sessionName, callerParams, timeout, } = {}) {
        super();
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "langchain_tracer"
        });
        Object.defineProperty(this, "endpoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0,env/* getEnvironmentVariable */.lS)("LANGCHAIN_ENDPOINT") || "http://localhost:1984"
        });
        Object.defineProperty(this, "headers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                "Content-Type": "application/json",
            }
        });
        Object.defineProperty(this, "sessionName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "exampleId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "caller", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "timeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 5000
        });
        const apiKey = (0,env/* getEnvironmentVariable */.lS)("LANGCHAIN_API_KEY");
        if (apiKey) {
            this.headers["x-api-key"] = apiKey;
        }
        this.sessionName =
            sessionName ?? (0,env/* getEnvironmentVariable */.lS)("LANGCHAIN_SESSION");
        this.exampleId = exampleId;
        this.timeout = timeout ?? this.timeout;
        this.caller = new async_caller/* AsyncCaller */.L(callerParams ?? { maxRetries: 2 });
    }
    async _convertToCreate(run, example_id = undefined) {
        const runExtra = run.extra ?? {};
        runExtra.runtime = await (0,env/* getRuntimeEnvironment */.sA)();
        const persistedRun = {
            id: run.id,
            name: run.name,
            start_time: run.start_time,
            end_time: run.end_time,
            run_type: run.run_type,
            // example_id is only set for the root run
            reference_example_id: run.parent_run_id ? undefined : example_id,
            extra: runExtra,
            parent_run_id: run.parent_run_id,
            execution_order: run.execution_order,
            serialized: run.serialized,
            error: run.error,
            inputs: run.inputs,
            outputs: run.outputs ?? {},
            session_name: this.sessionName,
            child_runs: [],
        };
        return persistedRun;
    }
    async persistRun(_run) { }
    async _persistRunSingle(run) {
        const persistedRun = await this._convertToCreate(run, this.exampleId);
        const endpoint = `${this.endpoint}/runs`;
        const response = await this.caller.call(fetch, endpoint, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(persistedRun),
            signal: AbortSignal.timeout(this.timeout),
        });
        // consume the response body to release the connection
        // https://undici.nodejs.org/#/?id=garbage-collection
        const body = await response.text();
        if (!response.ok) {
            throw new Error(`Failed to persist run: ${response.status} ${response.statusText} ${body}`);
        }
    }
    async _updateRunSingle(run) {
        const runUpdate = {
            end_time: run.end_time,
            error: run.error,
            outputs: run.outputs,
            parent_run_id: run.parent_run_id,
            reference_example_id: run.reference_example_id,
        };
        const endpoint = `${this.endpoint}/runs/${run.id}`;
        const response = await this.caller.call(fetch, endpoint, {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify(runUpdate),
            signal: AbortSignal.timeout(this.timeout),
        });
        // consume the response body to release the connection
        // https://undici.nodejs.org/#/?id=garbage-collection
        const body = await response.text();
        if (!response.ok) {
            throw new Error(`Failed to update run: ${response.status} ${response.statusText} ${body}`);
        }
    }
    async onLLMStart(run) {
        await this._persistRunSingle(run);
    }
    async onLLMEnd(run) {
        await this._updateRunSingle(run);
    }
    async onLLMError(run) {
        await this._updateRunSingle(run);
    }
    async onChainStart(run) {
        await this._persistRunSingle(run);
    }
    async onChainEnd(run) {
        await this._updateRunSingle(run);
    }
    async onChainError(run) {
        await this._updateRunSingle(run);
    }
    async onToolStart(run) {
        await this._persistRunSingle(run);
    }
    async onToolEnd(run) {
        await this._updateRunSingle(run);
    }
    async onToolError(run) {
        await this._updateRunSingle(run);
    }
}

// EXTERNAL MODULE: ./node_modules/langchain/dist/memory/base.js
var base = __webpack_require__(790);
;// CONCATENATED MODULE: ./node_modules/langchain/dist/callbacks/handlers/tracer_langchain_v1.js



class LangChainTracerV1 extends BaseTracer {
    constructor() {
        super();
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "langchain_tracer"
        });
        Object.defineProperty(this, "endpoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0,env/* getEnvironmentVariable */.lS)("LANGCHAIN_ENDPOINT") || "http://localhost:1984"
        });
        Object.defineProperty(this, "headers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                "Content-Type": "application/json",
            }
        });
        Object.defineProperty(this, "session", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const apiKey = (0,env/* getEnvironmentVariable */.lS)("LANGCHAIN_API_KEY");
        if (apiKey) {
            this.headers["x-api-key"] = apiKey;
        }
    }
    async newSession(sessionName) {
        const sessionCreate = {
            start_time: Date.now(),
            name: sessionName,
        };
        const session = await this.persistSession(sessionCreate);
        this.session = session;
        return session;
    }
    async loadSession(sessionName) {
        const endpoint = `${this.endpoint}/sessions?name=${sessionName}`;
        return this._handleSessionResponse(endpoint);
    }
    async loadDefaultSession() {
        const endpoint = `${this.endpoint}/sessions?name=default`;
        return this._handleSessionResponse(endpoint);
    }
    async convertV2RunToRun(run) {
        const session = this.session ?? (await this.loadDefaultSession());
        const serialized = run.serialized;
        let runResult;
        if (run.run_type === "llm") {
            const prompts = run.inputs.prompts
                ? run.inputs.prompts
                : run.inputs.messages.map((x) => (0,base/* getBufferString */.zs)(x));
            const llmRun = {
                uuid: run.id,
                start_time: run.start_time,
                end_time: run.end_time,
                execution_order: run.execution_order,
                child_execution_order: run.child_execution_order,
                serialized,
                type: run.run_type,
                session_id: session.id,
                prompts,
                response: run.outputs,
            };
            runResult = llmRun;
        }
        else if (run.run_type === "chain") {
            const child_runs = await Promise.all(run.child_runs.map((child_run) => this.convertV2RunToRun(child_run)));
            const chainRun = {
                uuid: run.id,
                start_time: run.start_time,
                end_time: run.end_time,
                execution_order: run.execution_order,
                child_execution_order: run.child_execution_order,
                serialized,
                type: run.run_type,
                session_id: session.id,
                inputs: run.inputs,
                outputs: run.outputs,
                child_llm_runs: child_runs.filter((child_run) => child_run.type === "llm"),
                child_chain_runs: child_runs.filter((child_run) => child_run.type === "chain"),
                child_tool_runs: child_runs.filter((child_run) => child_run.type === "tool"),
            };
            runResult = chainRun;
        }
        else if (run.run_type === "tool") {
            const child_runs = await Promise.all(run.child_runs.map((child_run) => this.convertV2RunToRun(child_run)));
            const toolRun = {
                uuid: run.id,
                start_time: run.start_time,
                end_time: run.end_time,
                execution_order: run.execution_order,
                child_execution_order: run.child_execution_order,
                serialized,
                type: run.run_type,
                session_id: session.id,
                tool_input: run.inputs.input,
                output: run.outputs?.output,
                action: JSON.stringify(serialized),
                child_llm_runs: child_runs.filter((child_run) => child_run.type === "llm"),
                child_chain_runs: child_runs.filter((child_run) => child_run.type === "chain"),
                child_tool_runs: child_runs.filter((child_run) => child_run.type === "tool"),
            };
            runResult = toolRun;
        }
        else {
            throw new Error(`Unknown run type: ${run.run_type}`);
        }
        return runResult;
    }
    async persistRun(run) {
        let endpoint;
        let v1Run;
        if (run.run_type !== undefined) {
            v1Run = await this.convertV2RunToRun(run);
        }
        else {
            v1Run = run;
        }
        if (v1Run.type === "llm") {
            endpoint = `${this.endpoint}/llm-runs`;
        }
        else if (v1Run.type === "chain") {
            endpoint = `${this.endpoint}/chain-runs`;
        }
        else {
            endpoint = `${this.endpoint}/tool-runs`;
        }
        const response = await fetch(endpoint, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(v1Run),
        });
        if (!response.ok) {
            console.error(`Failed to persist run: ${response.status} ${response.statusText}`);
        }
    }
    async persistSession(sessionCreate) {
        const endpoint = `${this.endpoint}/sessions`;
        const response = await fetch(endpoint, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(sessionCreate),
        });
        if (!response.ok) {
            console.error(`Failed to persist session: ${response.status} ${response.statusText}, using default session.`);
            return {
                id: 1,
                ...sessionCreate,
            };
        }
        return {
            id: (await response.json()).id,
            ...sessionCreate,
        };
    }
    async _handleSessionResponse(endpoint) {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: this.headers,
        });
        let tracerSession;
        if (!response.ok) {
            console.error(`Failed to load session: ${response.status} ${response.statusText}`);
            tracerSession = {
                id: 1,
                start_time: Date.now(),
            };
            this.session = tracerSession;
            return tracerSession;
        }
        const resp = (await response.json());
        if (resp.length === 0) {
            tracerSession = {
                id: 1,
                start_time: Date.now(),
            };
            this.session = tracerSession;
            return tracerSession;
        }
        [tracerSession] = resp;
        this.session = tracerSession;
        return tracerSession;
    }
}

;// CONCATENATED MODULE: ./node_modules/langchain/dist/callbacks/handlers/initialize.js


async function getTracingCallbackHandler(session) {
    const tracer = new LangChainTracerV1();
    if (session) {
        await tracer.loadSession(session);
    }
    else {
        await tracer.loadDefaultSession();
    }
    return tracer;
}
async function getTracingV2CallbackHandler() {
    return new LangChainTracer();
}

;// CONCATENATED MODULE: ./node_modules/langchain/dist/callbacks/manager.js






class BaseCallbackManager {
    setHandler(handler) {
        return this.setHandlers([handler]);
    }
}
class BaseRunManager {
    constructor(runId, handlers, inheritableHandlers, _parentRunId) {
        Object.defineProperty(this, "runId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: runId
        });
        Object.defineProperty(this, "handlers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: handlers
        });
        Object.defineProperty(this, "inheritableHandlers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: inheritableHandlers
        });
        Object.defineProperty(this, "_parentRunId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: _parentRunId
        });
    }
    async handleText(text) {
        await Promise.all(this.handlers.map(async (handler) => {
            try {
                await handler.handleText?.(text, this.runId, this._parentRunId);
            }
            catch (err) {
                console.error(`Error in handler ${handler.constructor.name}, handleText: ${err}`);
            }
        }));
    }
}
class CallbackManagerForLLMRun extends BaseRunManager {
    async handleLLMNewToken(token) {
        await Promise.all(this.handlers.map(async (handler) => {
            if (!handler.ignoreLLM) {
                try {
                    await handler.handleLLMNewToken?.(token, this.runId, this._parentRunId);
                }
                catch (err) {
                    console.error(`Error in handler ${handler.constructor.name}, handleLLMNewToken: ${err}`);
                }
            }
        }));
    }
    async handleLLMError(err) {
        await Promise.all(this.handlers.map(async (handler) => {
            if (!handler.ignoreLLM) {
                try {
                    await handler.handleLLMError?.(err, this.runId, this._parentRunId);
                }
                catch (err) {
                    console.error(`Error in handler ${handler.constructor.name}, handleLLMError: ${err}`);
                }
            }
        }));
    }
    async handleLLMEnd(output) {
        await Promise.all(this.handlers.map(async (handler) => {
            if (!handler.ignoreLLM) {
                try {
                    await handler.handleLLMEnd?.(output, this.runId, this._parentRunId);
                }
                catch (err) {
                    console.error(`Error in handler ${handler.constructor.name}, handleLLMEnd: ${err}`);
                }
            }
        }));
    }
}
class CallbackManagerForChainRun extends BaseRunManager {
    getChild() {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const manager = new CallbackManager(this.runId);
        manager.setHandlers(this.inheritableHandlers);
        return manager;
    }
    async handleChainError(err) {
        await Promise.all(this.handlers.map(async (handler) => {
            if (!handler.ignoreChain) {
                try {
                    await handler.handleChainError?.(err, this.runId, this._parentRunId);
                }
                catch (err) {
                    console.error(`Error in handler ${handler.constructor.name}, handleChainError: ${err}`);
                }
            }
        }));
    }
    async handleChainEnd(output) {
        await Promise.all(this.handlers.map(async (handler) => {
            if (!handler.ignoreChain) {
                try {
                    await handler.handleChainEnd?.(output, this.runId, this._parentRunId);
                }
                catch (err) {
                    console.error(`Error in handler ${handler.constructor.name}, handleChainEnd: ${err}`);
                }
            }
        }));
    }
    async handleAgentAction(action) {
        await Promise.all(this.handlers.map(async (handler) => {
            if (!handler.ignoreAgent) {
                try {
                    await handler.handleAgentAction?.(action, this.runId, this._parentRunId);
                }
                catch (err) {
                    console.error(`Error in handler ${handler.constructor.name}, handleAgentAction: ${err}`);
                }
            }
        }));
    }
    async handleAgentEnd(action) {
        await Promise.all(this.handlers.map(async (handler) => {
            if (!handler.ignoreAgent) {
                try {
                    await handler.handleAgentEnd?.(action, this.runId, this._parentRunId);
                }
                catch (err) {
                    console.error(`Error in handler ${handler.constructor.name}, handleAgentEnd: ${err}`);
                }
            }
        }));
    }
}
class CallbackManagerForToolRun extends BaseRunManager {
    getChild() {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const manager = new CallbackManager(this.runId);
        manager.setHandlers(this.inheritableHandlers);
        return manager;
    }
    async handleToolError(err) {
        await Promise.all(this.handlers.map(async (handler) => {
            if (!handler.ignoreAgent) {
                try {
                    await handler.handleToolError?.(err, this.runId, this._parentRunId);
                }
                catch (err) {
                    console.error(`Error in handler ${handler.constructor.name}, handleToolError: ${err}`);
                }
            }
        }));
    }
    async handleToolEnd(output) {
        await Promise.all(this.handlers.map(async (handler) => {
            if (!handler.ignoreAgent) {
                try {
                    await handler.handleToolEnd?.(output, this.runId, this._parentRunId);
                }
                catch (err) {
                    console.error(`Error in handler ${handler.constructor.name}, handleToolEnd: ${err}`);
                }
            }
        }));
    }
}
class CallbackManager extends BaseCallbackManager {
    constructor(parentRunId) {
        super();
        Object.defineProperty(this, "handlers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inheritableHandlers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "callback_manager"
        });
        Object.defineProperty(this, "_parentRunId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.handlers = [];
        this.inheritableHandlers = [];
        this._parentRunId = parentRunId;
    }
    async handleLLMStart(llm, prompts, runId = v4(), _parentRunId = undefined, extraParams = undefined) {
        await Promise.all(this.handlers.map(async (handler) => {
            if (!handler.ignoreLLM) {
                try {
                    await handler.handleLLMStart?.(llm, prompts, runId, this._parentRunId, extraParams);
                }
                catch (err) {
                    console.error(`Error in handler ${handler.constructor.name}, handleLLMStart: ${err}`);
                }
            }
        }));
        return new CallbackManagerForLLMRun(runId, this.handlers, this.inheritableHandlers, this._parentRunId);
    }
    async handleChatModelStart(llm, messages, runId = v4(), _parentRunId = undefined, extraParams = undefined) {
        let messageStrings;
        await Promise.all(this.handlers.map(async (handler) => {
            if (!handler.ignoreLLM) {
                try {
                    if (handler.handleChatModelStart)
                        await handler.handleChatModelStart?.(llm, messages, runId, this._parentRunId, extraParams);
                    else if (handler.handleLLMStart) {
                        messageStrings = messages.map((x) => (0,base/* getBufferString */.zs)(x));
                        await handler.handleLLMStart?.(llm, messageStrings, runId, this._parentRunId, extraParams);
                    }
                }
                catch (err) {
                    console.error(`Error in handler ${handler.constructor.name}, handleLLMStart: ${err}`);
                }
            }
        }));
        return new CallbackManagerForLLMRun(runId, this.handlers, this.inheritableHandlers, this._parentRunId);
    }
    async handleChainStart(chain, inputs, runId = v4()) {
        await Promise.all(this.handlers.map(async (handler) => {
            if (!handler.ignoreChain) {
                try {
                    await handler.handleChainStart?.(chain, inputs, runId, this._parentRunId);
                }
                catch (err) {
                    console.error(`Error in handler ${handler.constructor.name}, handleChainStart: ${err}`);
                }
            }
        }));
        return new CallbackManagerForChainRun(runId, this.handlers, this.inheritableHandlers, this._parentRunId);
    }
    async handleToolStart(tool, input, runId = v4()) {
        await Promise.all(this.handlers.map(async (handler) => {
            if (!handler.ignoreAgent) {
                try {
                    await handler.handleToolStart?.(tool, input, runId, this._parentRunId);
                }
                catch (err) {
                    console.error(`Error in handler ${handler.constructor.name}, handleToolStart: ${err}`);
                }
            }
        }));
        return new CallbackManagerForToolRun(runId, this.handlers, this.inheritableHandlers, this._parentRunId);
    }
    addHandler(handler, inherit = true) {
        this.handlers.push(handler);
        if (inherit) {
            this.inheritableHandlers.push(handler);
        }
    }
    removeHandler(handler) {
        this.handlers = this.handlers.filter((_handler) => _handler !== handler);
        this.inheritableHandlers = this.inheritableHandlers.filter((_handler) => _handler !== handler);
    }
    setHandlers(handlers, inherit = true) {
        this.handlers = [];
        this.inheritableHandlers = [];
        for (const handler of handlers) {
            this.addHandler(handler, inherit);
        }
    }
    copy(additionalHandlers = [], inherit = true) {
        const manager = new CallbackManager(this._parentRunId);
        for (const handler of this.handlers) {
            const inheritable = this.inheritableHandlers.includes(handler);
            manager.addHandler(handler, inheritable);
        }
        for (const handler of additionalHandlers) {
            if (
            // Prevent multiple copies of console_callback_handler
            manager.handlers
                .filter((h) => h.name === "console_callback_handler")
                .some((h) => h.name === handler.name)) {
                continue;
            }
            manager.addHandler(handler, inherit);
        }
        return manager;
    }
    static fromHandlers(handlers) {
        class Handler extends BaseCallbackHandler {
            constructor() {
                super();
                Object.defineProperty(this, "name", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: v4()
                });
                Object.assign(this, handlers);
            }
        }
        const manager = new this();
        manager.addHandler(new Handler());
        return manager;
    }
    static async configure(inheritableHandlers, localHandlers, options) {
        let callbackManager;
        if (inheritableHandlers || localHandlers) {
            if (Array.isArray(inheritableHandlers) || !inheritableHandlers) {
                callbackManager = new CallbackManager();
                callbackManager.setHandlers(inheritableHandlers?.map(ensureHandler) ?? [], true);
            }
            else {
                callbackManager = inheritableHandlers;
            }
            callbackManager = callbackManager.copy(Array.isArray(localHandlers)
                ? localHandlers.map(ensureHandler)
                : localHandlers?.handlers, false);
        }
        const verboseEnabled = (0,env/* getEnvironmentVariable */.lS)("LANGCHAIN_VERBOSE") || options?.verbose;
        const tracingV2Enabled = (0,env/* getEnvironmentVariable */.lS)("LANGCHAIN_TRACING_V2") ?? false;
        const tracingEnabled = tracingV2Enabled ||
            ((0,env/* getEnvironmentVariable */.lS)("LANGCHAIN_TRACING") ?? false);
        if (verboseEnabled || tracingEnabled) {
            if (!callbackManager) {
                callbackManager = new CallbackManager();
            }
            if (verboseEnabled &&
                !callbackManager.handlers.some((handler) => handler.name === ConsoleCallbackHandler.prototype.name)) {
                const consoleHandler = new ConsoleCallbackHandler();
                callbackManager.addHandler(consoleHandler, true);
            }
            if (tracingEnabled &&
                !callbackManager.handlers.some((handler) => handler.name === "langchain_tracer")) {
                if (tracingV2Enabled) {
                    callbackManager.addHandler(await getTracingV2CallbackHandler(), true);
                }
                else {
                    const session = (0,env/* getEnvironmentVariable */.lS)("LANGCHAIN_SESSION");
                    callbackManager.addHandler(await getTracingCallbackHandler(session), true);
                }
            }
        }
        return callbackManager;
    }
}
function ensureHandler(handler) {
    if ("name" in handler) {
        return handler;
    }
    return BaseCallbackHandler.fromMethods(handler);
}


/***/ }),

/***/ 790:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "zs": () => (/* binding */ getBufferString)
/* harmony export */ });
/* unused harmony exports BaseMemory, getInputValue, getPromptInputKey */
class BaseMemory {
}
/**
 * This function is used by memory classes to select the input value
 * to use for the memory. If there is only one input value, it is used.
 * If there are multiple input values, the inputKey must be specified.
 */
const getInputValue = (inputValues, inputKey) => {
    if (inputKey !== undefined) {
        return inputValues[inputKey];
    }
    const keys = Object.keys(inputValues);
    if (keys.length === 1) {
        return inputValues[keys[0]];
    }
    throw new Error(`input values have ${keys.length} keys, you must specify an input key or pass only 1 key as input`);
};
/**
 * This function is used by memory classes to get a string representation
 * of the chat message history, based on the message content and role.
 */
function getBufferString(messages, humanPrefix = "Human", aiPrefix = "AI") {
    const string_messages = [];
    for (const m of messages) {
        let role;
        if (m._getType() === "human") {
            role = humanPrefix;
        }
        else if (m._getType() === "ai") {
            role = aiPrefix;
        }
        else if (m._getType() === "system") {
            role = "System";
        }
        else if (m._getType() === "generic") {
            role = m.role;
        }
        else {
            throw new Error(`Got unsupported message type: ${m}`);
        }
        string_messages.push(`${role}: ${m.text}`);
    }
    return string_messages.join("\n");
}
function getPromptInputKey(inputs, memoryVariables) {
    const promptInputKeys = Object.keys(inputs).filter((key) => !memoryVariables.includes(key) && key !== "stop");
    if (promptInputKeys.length !== 1) {
        throw new Error(`One input key expected, but got ${promptInputKeys.length}`);
    }
    return promptInputKeys[0];
}


/***/ }),

/***/ 8102:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ck": () => (/* binding */ AIChatMessage),
/* harmony export */   "H2": () => (/* binding */ BaseCache),
/* harmony export */   "J": () => (/* binding */ ChatMessage),
/* harmony export */   "WH": () => (/* binding */ RUN_KEY),
/* harmony export */   "Z": () => (/* binding */ HumanChatMessage),
/* harmony export */   "w": () => (/* binding */ SystemChatMessage)
/* harmony export */ });
/* unused harmony exports BaseChatMessage, BasePromptValue, BaseRetriever, BaseChatMessageHistory, BaseListChatMessageHistory, BaseFileStore, BaseEntityStore */
const RUN_KEY = "__run";
class BaseChatMessage {
    constructor(text) {
        /** The text of the message. */
        Object.defineProperty(this, "text", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** The name of the message sender in a multi-user chat. */
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.text = text;
    }
    toJSON() {
        return {
            type: this._getType(),
            data: {
                content: this.text,
                role: "role" in this ? this.role : undefined,
            },
        };
    }
}
class HumanChatMessage extends BaseChatMessage {
    _getType() {
        return "human";
    }
}
class AIChatMessage extends BaseChatMessage {
    _getType() {
        return "ai";
    }
}
class SystemChatMessage extends BaseChatMessage {
    _getType() {
        return "system";
    }
}
class ChatMessage extends BaseChatMessage {
    constructor(text, role) {
        super(text);
        Object.defineProperty(this, "role", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.role = role;
    }
    _getType() {
        return "generic";
    }
}
/**
 * Base PromptValue class. All prompt values should extend this class.
 */
class BasePromptValue {
}
/**
 * Base Index class. All indexes should extend this class.
 */
class BaseRetriever {
}
class BaseChatMessageHistory {
}
class BaseListChatMessageHistory {
    addUserMessage(message) {
        return this.addMessage(new HumanChatMessage(message));
    }
    addAIChatMessage(message) {
        return this.addMessage(new AIChatMessage(message));
    }
}
class BaseCache {
}
class BaseFileStore {
}
class BaseEntityStore {
}


/***/ }),

/***/ 2723:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "L": () => (/* binding */ AsyncCaller)
/* harmony export */ });
/* harmony import */ var p_retry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2548);
/* harmony import */ var p_queue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8983);


const STATUS_NO_RETRY = [
    400,
    401,
    403,
    404,
    405,
    406,
    407,
    408,
    409, // Conflict
];
/**
 * A class that can be used to make async calls with concurrency and retry logic.
 *
 * This is useful for making calls to any kind of "expensive" external resource,
 * be it because it's rate-limited, subject to network issues, etc.
 *
 * Concurrent calls are limited by the `maxConcurrency` parameter, which defaults
 * to `Infinity`. This means that by default, all calls will be made in parallel.
 *
 * Retries are limited by the `maxRetries` parameter, which defaults to 6. This
 * means that by default, each call will be retried up to 6 times, with an
 * exponential backoff between each attempt.
 */
class AsyncCaller {
    constructor(params) {
        Object.defineProperty(this, "maxConcurrency", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "maxRetries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "queue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.maxConcurrency = params.maxConcurrency ?? Infinity;
        this.maxRetries = params.maxRetries ?? 6;
        const PQueue =  true ? p_queue__WEBPACK_IMPORTED_MODULE_1__["default"] : p_queue__WEBPACK_IMPORTED_MODULE_1__;
        this.queue = new PQueue({ concurrency: this.maxConcurrency });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    call(callable, ...args) {
        return this.queue.add(() => p_retry__WEBPACK_IMPORTED_MODULE_0__(() => callable(...args).catch((error) => {
            // eslint-disable-next-line no-instanceof/no-instanceof
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error(error);
            }
        }), {
            onFailedAttempt(error) {
                if (error.message.startsWith("Cancel") ||
                    error.message.startsWith("TimeoutError") ||
                    error.message.startsWith("AbortError")) {
                    throw error;
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (error?.code === "ECONNABORTED") {
                    throw error;
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const status = error?.response?.status;
                if (status && STATUS_NO_RETRY.includes(+status)) {
                    throw error;
                }
            },
            retries: this.maxRetries,
            randomize: true,
            // If needed we can change some of the defaults here,
            // but they're quite sensible.
        }), { throwOnTimeout: true });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callWithOptions(options, callable, ...args) {
        // Note this doesn't cancel the underlying request,
        // when available prefer to use the signal option of the underlying call
        if (options.signal) {
            return Promise.race([
                this.call(callable, ...args),
                new Promise((_, reject) => {
                    options.signal?.addEventListener("abort", () => {
                        reject(new Error("AbortError"));
                    });
                }),
            ]);
        }
        return this.call(callable, ...args);
    }
    fetch(...args) {
        return this.call(() => fetch(...args).then((res) => (res.ok ? res : Promise.reject(res))));
    }
}


/***/ }),

/***/ 43:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ fetchAdapter)
});

// EXTERNAL MODULE: ./node_modules/axios/index.js
var axios = __webpack_require__(6545);
;// CONCATENATED MODULE: ./node_modules/langchain/dist/util/event-source-parse.js
/* eslint-disable prefer-template */
/* eslint-disable default-case */
/* eslint-disable no-plusplus */
// Adapted from https://github.com/gfortaine/fetch-event-source/blob/main/src/parse.ts
// due to a packaging issue in the original.
// MIT License
const EventStreamContentType = "text/event-stream";
/**
 * Converts a ReadableStream into a callback pattern.
 * @param stream The input ReadableStream.
 * @param onChunk A function that will be called on each new byte chunk in the stream.
 * @returns {Promise<void>} A promise that will be resolved when the stream closes.
 */
async function getBytes(stream, onChunk) {
    const reader = stream.getReader();
    // CHANGED: Introduced a "flush" mechanism to process potential pending messages when the stream ends.
    //          This change is essential to ensure that we capture every last piece of information from streams,
    //          such as those from Azure OpenAI, which may not terminate with a blank line. Without this
    //          mechanism, we risk ignoring a possibly significant last message.
    //          See https://github.com/hwchase17/langchainjs/issues/1299 for details.
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const result = await reader.read();
        if (result.done) {
            onChunk(new Uint8Array(), true);
            break;
        }
        onChunk(result.value);
    }
}
/**
 * Parses arbitary byte chunks into EventSource line buffers.
 * Each line should be of the format "field: value" and ends with \r, \n, or \r\n.
 * @param onLine A function that will be called on each new EventSource line.
 * @returns A function that should be called for each incoming byte chunk.
 */
function getLines(onLine) {
    let buffer;
    let position; // current read position
    let fieldLength; // length of the `field` portion of the line
    let discardTrailingNewline = false;
    // return a function that can process each incoming byte chunk:
    return function onChunk(arr, flush) {
        if (flush) {
            onLine(arr, 0, true);
            return;
        }
        if (buffer === undefined) {
            buffer = arr;
            position = 0;
            fieldLength = -1;
        }
        else {
            // we're still parsing the old line. Append the new bytes into buffer:
            buffer = concat(buffer, arr);
        }
        const bufLength = buffer.length;
        let lineStart = 0; // index where the current line starts
        while (position < bufLength) {
            if (discardTrailingNewline) {
                if (buffer[position] === 10 /* ControlChars.NewLine */) {
                    lineStart = ++position; // skip to next char
                }
                discardTrailingNewline = false;
            }
            // start looking forward till the end of line:
            let lineEnd = -1; // index of the \r or \n char
            for (; position < bufLength && lineEnd === -1; ++position) {
                switch (buffer[position]) {
                    case 58 /* ControlChars.Colon */:
                        if (fieldLength === -1) {
                            // first colon in line
                            fieldLength = position - lineStart;
                        }
                        break;
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore:7029 \r case below should fallthrough to \n:
                    case 13 /* ControlChars.CarriageReturn */:
                        discardTrailingNewline = true;
                    // eslint-disable-next-line no-fallthrough
                    case 10 /* ControlChars.NewLine */:
                        lineEnd = position;
                        break;
                }
            }
            if (lineEnd === -1) {
                // We reached the end of the buffer but the line hasn't ended.
                // Wait for the next arr and then continue parsing:
                break;
            }
            // we've reached the line end, send it out:
            onLine(buffer.subarray(lineStart, lineEnd), fieldLength);
            lineStart = position; // we're now on the next line
            fieldLength = -1;
        }
        if (lineStart === bufLength) {
            buffer = undefined; // we've finished reading it
        }
        else if (lineStart !== 0) {
            // Create a new view into buffer beginning at lineStart so we don't
            // need to copy over the previous lines when we get the new arr:
            buffer = buffer.subarray(lineStart);
            position -= lineStart;
        }
    };
}
/**
 * Parses line buffers into EventSourceMessages.
 * @param onId A function that will be called on each `id` field.
 * @param onRetry A function that will be called on each `retry` field.
 * @param onMessage A function that will be called on each message.
 * @returns A function that should be called for each incoming line buffer.
 */
function getMessages(onMessage, onId, onRetry) {
    let message = newMessage();
    const decoder = new TextDecoder();
    // return a function that can process each incoming line buffer:
    return function onLine(line, fieldLength, flush) {
        if (flush) {
            if (!isEmpty(message)) {
                onMessage?.(message);
                message = newMessage();
            }
            return;
        }
        if (line.length === 0) {
            // empty line denotes end of message. Trigger the callback and start a new message:
            onMessage?.(message);
            message = newMessage();
        }
        else if (fieldLength > 0) {
            // exclude comments and lines with no values
            // line is of format "<field>:<value>" or "<field>: <value>"
            // https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation
            const field = decoder.decode(line.subarray(0, fieldLength));
            const valueOffset = fieldLength + (line[fieldLength + 1] === 32 /* ControlChars.Space */ ? 2 : 1);
            const value = decoder.decode(line.subarray(valueOffset));
            switch (field) {
                case "data":
                    // if this message already has data, append the new value to the old.
                    // otherwise, just set to the new value:
                    message.data = message.data ? message.data + "\n" + value : value; // otherwise,
                    break;
                case "event":
                    message.event = value;
                    break;
                case "id":
                    onId?.((message.id = value));
                    break;
                case "retry": {
                    const retry = parseInt(value, 10);
                    if (!Number.isNaN(retry)) {
                        // per spec, ignore non-integers
                        onRetry?.((message.retry = retry));
                    }
                    break;
                }
            }
        }
    };
}
function concat(a, b) {
    const res = new Uint8Array(a.length + b.length);
    res.set(a);
    res.set(b, a.length);
    return res;
}
function newMessage() {
    // data, event, and id must be initialized to empty strings:
    // https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation
    // retry should be initialized to undefined so we return a consistent shape
    // to the js engine all the time: https://mathiasbynens.be/notes/shapes-ics#takeaways
    return {
        data: "",
        event: "",
        id: "",
        retry: undefined,
    };
}
function isEmpty(message) {
    return (message.data === "" &&
        message.event === "" &&
        message.id === "" &&
        message.retry === undefined);
}

;// CONCATENATED MODULE: ./node_modules/langchain/dist/util/axios-fetch-adapter.js
/* eslint-disable no-plusplus */
/* eslint-disable prefer-template */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
/**
 * This is copied from @vespaiach/axios-fetch-adapter, which exposes an ESM
 * module without setting the "type" field in package.json.
 */


function tryJsonStringify(data) {
    try {
        return JSON.stringify(data);
    }
    catch (e) {
        return data;
    }
}
/**
 * In order to avoid import issues with axios 1.x, copying here the internal
 * utility functions that we used to import directly from axios.
 */
// Copied from axios/lib/core/settle.js
function settle(resolve, reject, response) {
    const { validateStatus } = response.config;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
    }
    else {
        reject(createError(`Request failed with status code ${response.status} and body ${typeof response.data === "string"
            ? response.data
            : tryJsonStringify(response.data)}`, response.config, null, response.request, response));
    }
}
// Copied from axios/lib/helpers/isAbsoluteURL.js
function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}
// Copied from axios/lib/helpers/combineURLs.js
function combineURLs(baseURL, relativeURL) {
    return relativeURL
        ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
        : baseURL;
}
// Copied from axios/lib/helpers/buildURL.js
function encode(val) {
    return encodeURIComponent(val)
        .replace(/%3A/gi, ":")
        .replace(/%24/g, "$")
        .replace(/%2C/gi, ",")
        .replace(/%20/g, "+")
        .replace(/%5B/gi, "[")
        .replace(/%5D/gi, "]");
}
function buildURL(url, params, paramsSerializer) {
    if (!params) {
        return url;
    }
    var serializedParams;
    if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
    }
    else if (isURLSearchParams(params)) {
        serializedParams = params.toString();
    }
    else {
        var parts = [];
        forEach(params, function serialize(val, key) {
            if (val === null || typeof val === "undefined") {
                return;
            }
            if (isArray(val)) {
                key = `${key}[]`;
            }
            else {
                val = [val];
            }
            forEach(val, function parseValue(v) {
                if (isDate(v)) {
                    v = v.toISOString();
                }
                else if (isObject(v)) {
                    v = JSON.stringify(v);
                }
                parts.push(`${encode(key)}=${encode(v)}`);
            });
        });
        serializedParams = parts.join("&");
    }
    if (serializedParams) {
        var hashmarkIndex = url.indexOf("#");
        if (hashmarkIndex !== -1) {
            url = url.slice(0, hashmarkIndex);
        }
        url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
}
// Copied from axios/lib/core/buildFullPath.js
function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
}
// Copied from axios/lib/utils.js
function isUndefined(val) {
    return typeof val === "undefined";
}
function isObject(val) {
    return val !== null && typeof val === "object";
}
function isDate(val) {
    return toString.call(val) === "[object Date]";
}
function isURLSearchParams(val) {
    return toString.call(val) === "[object URLSearchParams]";
}
function isArray(val) {
    return Array.isArray(val);
}
function forEach(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === "undefined") {
        return;
    }
    // Force an array if not already something iterable
    if (typeof obj !== "object") {
        obj = [obj];
    }
    if (isArray(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
        }
    }
    else {
        // Iterate over object keys
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                fn.call(null, obj[key], key, obj);
            }
        }
    }
}
function isFormData(val) {
    return toString.call(val) === "[object FormData]";
}
// TODO this needs to be fixed to run in newer browser-like environments
// https://github.com/vespaiach/axios-fetch-adapter/issues/20#issue-1396365322
function isStandardBrowserEnv() {
    if (typeof navigator !== "undefined" &&
        // eslint-disable-next-line no-undef
        (navigator.product === "ReactNative" ||
            // eslint-disable-next-line no-undef
            navigator.product === "NativeScript" ||
            // eslint-disable-next-line no-undef
            navigator.product === "NS")) {
        return false;
    }
    return typeof window !== "undefined" && typeof document !== "undefined";
}
/**
 * - Create a request object
 * - Get response body
 * - Check if timeout
 */
async function fetchAdapter(config) {
    const request = createRequest(config);
    const data = await getResponse(request, config);
    return new Promise((resolve, reject) => {
        if (data instanceof Error) {
            reject(data);
        }
        else {
            // eslint-disable-next-line no-unused-expressions
            Object.prototype.toString.call(config.settle) === "[object Function]"
                ? config.settle(resolve, reject, data)
                : settle(resolve, reject, data);
        }
    });
}
/**
 * Fetch API stage two is to get response body. This funtion tries to retrieve
 * response body based on response's type
 */
async function getResponse(request, config) {
    let stageOne;
    try {
        stageOne = await fetch(request);
    }
    catch (e) {
        if (e && e.name === "AbortError") {
            return createError("Request aborted", config, "ECONNABORTED", request);
        }
        if (e && e.name === "TimeoutError") {
            return createError("Request timeout", config, "ECONNABORTED", request);
        }
        return createError("Network Error", config, "ERR_NETWORK", request);
    }
    const headers = {};
    stageOne.headers.forEach((value, key) => {
        headers[key] = value;
    });
    const response = {
        ok: stageOne.ok,
        status: stageOne.status,
        statusText: stageOne.statusText,
        headers,
        config,
        request,
    };
    if (stageOne.status >= 200 && stageOne.status !== 204) {
        if (config.responseType === "stream") {
            const contentType = stageOne.headers.get("content-type");
            if (!contentType?.startsWith(EventStreamContentType)) {
                // If the content-type is not stream, response is most likely an error
                if (stageOne.status >= 400) {
                    // If the error is a JSON, parse it. Otherwise, return as text
                    if (contentType?.startsWith("application/json")) {
                        response.data = await stageOne.json();
                        return response;
                    }
                    else {
                        response.data = await stageOne.text();
                        return response;
                    }
                }
                // If the non-stream response is also not an error, throw
                throw new Error(`Expected content-type to be ${EventStreamContentType}, Actual: ${contentType}`);
            }
            await getBytes(stageOne.body, getLines(getMessages(config.onmessage)));
        }
        else {
            switch (config.responseType) {
                case "arraybuffer":
                    response.data = await stageOne.arrayBuffer();
                    break;
                case "blob":
                    response.data = await stageOne.blob();
                    break;
                case "json":
                    response.data = await stageOne.json();
                    break;
                case "formData":
                    response.data = await stageOne.formData();
                    break;
                default:
                    response.data = await stageOne.text();
                    break;
            }
        }
    }
    return response;
}
/**
 * This function will create a Request object based on configuration's axios
 */
function createRequest(config) {
    const headers = new Headers(config.headers);
    // HTTP basic authentication
    if (config.auth) {
        const username = config.auth.username || "";
        const password = config.auth.password
            ? decodeURI(encodeURIComponent(config.auth.password))
            : "";
        headers.set("Authorization", `Basic ${btoa(`${username}:${password}`)}`);
    }
    const method = config.method.toUpperCase();
    const options = {
        headers,
        method,
    };
    if (method !== "GET" && method !== "HEAD") {
        options.body = config.data;
        // In these cases the browser will automatically set the correct Content-Type,
        // but only if that header hasn't been set yet. So that's why we're deleting it.
        if (isFormData(options.body) && isStandardBrowserEnv()) {
            headers.delete("Content-Type");
        }
    }
    // Some `fetch` implementations will override the Content-Type to text/plain
    // when body is a string.
    // See https://github.com/hwchase17/langchainjs/issues/1010
    if (typeof options.body === "string") {
        options.body = new TextEncoder().encode(options.body);
    }
    if (config.mode) {
        options.mode = config.mode;
    }
    if (config.cache) {
        options.cache = config.cache;
    }
    if (config.integrity) {
        options.integrity = config.integrity;
    }
    if (config.redirect) {
        options.redirect = config.redirect;
    }
    if (config.referrer) {
        options.referrer = config.referrer;
    }
    if (config.timeout && config.timeout > 0) {
        options.signal = AbortSignal.timeout(config.timeout);
    }
    if (config.signal) {
        // this overrides the timeout signal if both are set
        options.signal = config.signal;
    }
    // This config is similar to XHR’s withCredentials flag, but with three available values instead of two.
    // So if withCredentials is not set, default value 'same-origin' will be used
    if (!isUndefined(config.withCredentials)) {
        options.credentials = config.withCredentials ? "include" : "omit";
    }
    // for streaming
    if (config.responseType === "stream") {
        options.headers.set("Accept", EventStreamContentType);
    }
    const fullPath = buildFullPath(config.baseURL, config.url);
    const url = buildURL(fullPath, config.params, config.paramsSerializer);
    // Expected browser to throw error if there is any wrong configuration value
    return new Request(url, options);
}
/**
 * Note:
 *
 *   From version >= 0.27.0, createError function is replaced by AxiosError class.
 *   So I copy the old createError function here for backward compatible.
 *
 *
 *
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
function createError(message, config, code, request, response) {
    if (axios.AxiosError && typeof axios.AxiosError === "function") {
        return new axios.AxiosError(message, axios.AxiosError[code], config, request, response);
    }
    const error = new Error(message);
    return enhanceError(error, config, code, request, response);
}
/**
 *
 * Note:
 *
 *   This function is for backward compatible.
 *
 *
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
function enhanceError(error, config, code, request, response) {
    error.config = config;
    if (code) {
        error.code = code;
    }
    error.request = request;
    error.response = response;
    error.isAxiosError = true;
    error.toJSON = function toJSON() {
        return {
            // Standard
            message: this.message,
            name: this.name,
            // Microsoft
            description: this.description,
            number: this.number,
            // Mozilla
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            // Axios
            config: this.config,
            code: this.code,
            status: this.response && this.response.status ? this.response.status : null,
        };
    };
    return error;
}


/***/ }),

/***/ 5785:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UG": () => (/* binding */ isNode),
/* harmony export */   "lS": () => (/* binding */ getEnvironmentVariable),
/* harmony export */   "sA": () => (/* binding */ getRuntimeEnvironment)
/* harmony export */ });
/* unused harmony exports isBrowser, isWebWorker, isJsDom, isDeno, getEnv */
const isBrowser = () => typeof window !== "undefined" && typeof window.document !== "undefined";
const isWebWorker = () => typeof globalThis === "object" &&
    globalThis.constructor &&
    globalThis.constructor.name === "DedicatedWorkerGlobalScope";
const isJsDom = () => (typeof window !== "undefined" && window.name === "nodejs") ||
    (typeof navigator !== "undefined" &&
        (navigator.userAgent.includes("Node.js") ||
            navigator.userAgent.includes("jsdom")));
// Supabase Edge Function provides a `Deno` global object
// without `version` property
const isDeno = () => typeof Deno !== "undefined";
// Mark not-as-node if in Supabase Edge Function
const isNode = () => typeof process !== "undefined" &&
    typeof process.versions !== "undefined" &&
    typeof process.versions.node !== "undefined" &&
    !isDeno();
const getEnv = () => {
    let env;
    if (isBrowser()) {
        env = "browser";
    }
    else if (isNode()) {
        env = "node";
    }
    else if (isWebWorker()) {
        env = "webworker";
    }
    else if (isJsDom()) {
        env = "jsdom";
    }
    else if (isDeno()) {
        env = "deno";
    }
    else {
        env = "other";
    }
    return env;
};
let runtimeEnvironment;
async function getRuntimeEnvironment() {
    if (runtimeEnvironment === undefined) {
        const env = getEnv();
        runtimeEnvironment = {
            library: "langchain-js",
            runtime: env,
        };
    }
    return runtimeEnvironment;
}
function getEnvironmentVariable(name) {
    // Certain Deno setups will throw an error if you try to access environment variables
    // https://github.com/hwchase17/langchainjs/issues/1412
    try {
        return typeof process !== "undefined"
            ? // eslint-disable-next-line no-process-env
                process.env?.[name]
            : undefined;
    }
    catch (e) {
        return undefined;
    }
}


/***/ }),

/***/ 2306:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "r": () => (/* binding */ promptLayerTrackRequest)
/* harmony export */ });
const promptLayerTrackRequest = async (callerFunc, functionName, prompt, kwargs, plTags, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
requestResponse, startTime, endTime, apiKey) => {
    // https://github.com/MagnivOrg/promptlayer-js-helper
    const promptLayerResp = await callerFunc.call(fetch, "https://api.promptlayer.com/track-request", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            function_name: functionName,
            provider: "langchain",
            args: prompt,
            kwargs,
            tags: plTags,
            request_response: requestResponse,
            request_start_time: Math.floor(startTime / 1000),
            request_end_time: Math.floor(endTime / 1000),
            api_key: apiKey,
        }),
    });
    return promptLayerResp.json();
};


/***/ }),

/***/ 6040:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "b": () => (/* binding */ encodingForModel)
});

// UNUSED EXPORTS: getEncoding

;// CONCATENATED MODULE: ./node_modules/js-tiktoken/dist/chunk-XXPGZHWZ.js
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};



// EXTERNAL MODULE: ./node_modules/base64-js/index.js
var base64_js = __webpack_require__(6463);
;// CONCATENATED MODULE: ./node_modules/js-tiktoken/dist/chunk-HORODD5P.js



// src/utils.ts
function never(_) {
}
function bytePairMerge(piece, ranks) {
  let parts = Array.from(
    { length: piece.length },
    (_, i) => ({ start: i, end: i + 1 })
  );
  while (parts.length > 1) {
    let minRank = null;
    for (let i = 0; i < parts.length - 1; i++) {
      const slice = piece.slice(parts[i].start, parts[i + 1].end);
      const rank = ranks.get(slice.join(","));
      if (rank == null)
        continue;
      if (minRank == null || rank < minRank[0]) {
        minRank = [rank, i];
      }
    }
    if (minRank != null) {
      const i = minRank[1];
      parts[i] = { start: parts[i].start, end: parts[i + 1].end };
      parts.splice(i + 1, 1);
    } else {
      break;
    }
  }
  return parts;
}
function bytePairEncode(piece, ranks) {
  if (piece.length === 1)
    return [ranks.get(piece.join(","))];
  return bytePairMerge(piece, ranks).map((p) => ranks.get(piece.slice(p.start, p.end).join(","))).filter((x) => x != null);
}
function escapeRegex(str) {
  return str.replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
}
var _Tiktoken = class {
  /** @internal */
  specialTokens;
  /** @internal */
  inverseSpecialTokens;
  /** @internal */
  patStr;
  /** @internal */
  textEncoder = new TextEncoder();
  /** @internal */
  textDecoder = new TextDecoder("utf-8");
  /** @internal */
  rankMap = /* @__PURE__ */ new Map();
  /** @internal */
  textMap = /* @__PURE__ */ new Map();
  constructor(ranks, extendedSpecialTokens) {
    this.patStr = ranks.pat_str;
    const uncompressed = ranks.bpe_ranks.split("\n").filter(Boolean).reduce((memo, x) => {
      const [_, offsetStr, ...tokens] = x.split(" ");
      const offset = Number.parseInt(offsetStr, 10);
      tokens.forEach((token, i) => memo[token] = offset + i);
      return memo;
    }, {});
    for (const [token, rank] of Object.entries(uncompressed)) {
      const bytes = base64_js.toByteArray(token);
      this.rankMap.set(bytes.join(","), rank);
      this.textMap.set(rank, bytes);
    }
    this.specialTokens = { ...ranks.special_tokens, ...extendedSpecialTokens };
    this.inverseSpecialTokens = Object.entries(this.specialTokens).reduce((memo, [text, rank]) => {
      memo[rank] = this.textEncoder.encode(text);
      return memo;
    }, {});
  }
  encode(text, allowedSpecial = [], disallowedSpecial = "all") {
    const regexes = new RegExp(this.patStr, "ug");
    const specialRegex = _Tiktoken.specialTokenRegex(
      Object.keys(this.specialTokens)
    );
    const ret = [];
    const allowedSpecialSet = new Set(
      allowedSpecial === "all" ? Object.keys(this.specialTokens) : allowedSpecial
    );
    const disallowedSpecialSet = new Set(
      disallowedSpecial === "all" ? Object.keys(this.specialTokens).filter(
        (x) => !allowedSpecialSet.has(x)
      ) : disallowedSpecial
    );
    if (disallowedSpecialSet.size > 0) {
      const disallowedSpecialRegex = _Tiktoken.specialTokenRegex([
        ...disallowedSpecialSet
      ]);
      const specialMatch = text.match(disallowedSpecialRegex);
      if (specialMatch != null) {
        throw new Error(
          `The text contains a special token that is not allowed: ${specialMatch[0]}`
        );
      }
    }
    let start = 0;
    while (true) {
      let nextSpecial = null;
      let startFind = start;
      while (true) {
        specialRegex.lastIndex = startFind;
        nextSpecial = specialRegex.exec(text);
        if (nextSpecial == null || allowedSpecialSet.has(nextSpecial[0]))
          break;
        startFind = nextSpecial.index + 1;
      }
      const end = nextSpecial?.index ?? text.length;
      for (const match of text.substring(start, end).matchAll(regexes)) {
        const piece = this.textEncoder.encode(match[0]);
        const token2 = this.rankMap.get(piece.join(","));
        if (token2 != null) {
          ret.push(token2);
          continue;
        }
        ret.push(...bytePairEncode(piece, this.rankMap));
      }
      if (nextSpecial == null)
        break;
      let token = this.specialTokens[nextSpecial[0]];
      ret.push(token);
      start = nextSpecial.index + nextSpecial[0].length;
    }
    return ret;
  }
  decode(tokens) {
    const res = [];
    let length = 0;
    for (let i2 = 0; i2 < tokens.length; ++i2) {
      const token = tokens[i2];
      const bytes = this.textMap.get(token) ?? this.inverseSpecialTokens[token];
      if (bytes != null) {
        res.push(bytes);
        length += bytes.length;
      }
    }
    const mergedArray = new Uint8Array(length);
    let i = 0;
    for (const bytes of res) {
      mergedArray.set(bytes, i);
      i += bytes.length;
    }
    return this.textDecoder.decode(mergedArray);
  }
};
var Tiktoken = _Tiktoken;
__publicField(Tiktoken, "specialTokenRegex", (tokens) => {
  return new RegExp(tokens.map((i) => escapeRegex(i)).join("|"), "g");
});
function getEncodingNameForModel(model) {
  switch (model) {
    case "gpt2": {
      return "gpt2";
    }
    case "code-cushman-001":
    case "code-cushman-002":
    case "code-davinci-001":
    case "code-davinci-002":
    case "cushman-codex":
    case "davinci-codex":
    case "text-davinci-002":
    case "text-davinci-003": {
      return "p50k_base";
    }
    case "code-davinci-edit-001":
    case "text-davinci-edit-001": {
      return "p50k_edit";
    }
    case "ada":
    case "babbage":
    case "code-search-ada-code-001":
    case "code-search-babbage-code-001":
    case "curie":
    case "davinci":
    case "text-ada-001":
    case "text-babbage-001":
    case "text-curie-001":
    case "text-davinci-001":
    case "text-search-ada-doc-001":
    case "text-search-babbage-doc-001":
    case "text-search-curie-doc-001":
    case "text-search-davinci-doc-001":
    case "text-similarity-ada-001":
    case "text-similarity-babbage-001":
    case "text-similarity-curie-001":
    case "text-similarity-davinci-001": {
      return "r50k_base";
    }
    case "gpt-3.5-turbo-0301":
    case "gpt-3.5-turbo":
    case "gpt-4-0314":
    case "gpt-4-32k-0314":
    case "gpt-4-32k":
    case "gpt-4":
    case "text-embedding-ada-002": {
      return "cl100k_base";
    }
    default:
      throw new Error("Unknown model");
  }
}



;// CONCATENATED MODULE: ./node_modules/js-tiktoken/dist/lite.js



// EXTERNAL MODULE: ./node_modules/langchain/dist/util/async_caller.js
var async_caller = __webpack_require__(2723);
;// CONCATENATED MODULE: ./node_modules/langchain/dist/util/tiktoken.js


const cache = {};
const caller = /* #__PURE__ */ new async_caller/* AsyncCaller */.L({});
async function getEncoding(encoding, options) {
    if (!(encoding in cache)) {
        cache[encoding] = caller
            .fetch(`https://tiktoken.pages.dev/js/${encoding}.json`, {
            signal: options?.signal,
        })
            .then((res) => res.json())
            .catch((e) => {
            delete cache[encoding];
            throw e;
        });
    }
    return new Tiktoken(await cache[encoding], options?.extendedSpecialTokens);
}
async function encodingForModel(model, options) {
    return getEncoding(getEncodingNameForModel(model), options);
}


/***/ })

};
;