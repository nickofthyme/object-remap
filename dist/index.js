require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 6180:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUserInputs = exports.getDefinedInputs = void 0;
const change_case_1 = __nccwpck_require__(9091);
const utils_1 = __nccwpck_require__(918);
const validate_1 = __nccwpck_require__(1997);
function getDefinedInputs() {
    var _a;
    const definedInputs = ((_a = Object.entries(process.env)) !== null && _a !== void 0 ? _a : []).reduce((result, [key, value]) => {
        if (!key.startsWith('INPUT___') || value === undefined)
            return result;
        const inputKey = change_case_1.camelCase(key.slice('INPUT___'.length));
        try {
            result[inputKey] = JSON.parse(value);
        }
        catch (_a) {
            result[inputKey] = value;
        }
        return result;
    }, {});
    return validate_1.validateDefinedInputs(definedInputs);
}
exports.getDefinedInputs = getDefinedInputs;
function getUserInputs(keyCase) {
    var _a;
    const casingFunction = utils_1.getCaseFunction(keyCase);
    return ((_a = Object.entries(process.env)) !== null && _a !== void 0 ? _a : []).reduce((result, [key, value]) => {
        if (!key.startsWith('INPUT_') || key.startsWith('INPUT___') || value === undefined) {
            return result;
        }
        // case is obfiscated in process.args assumed as upper snake case
        const inputName = casingFunction(key.slice('INPUT_'.length));
        // All values are stringified from GH, try to parse typed value
        result[inputName] = utils_1.parseValue(value);
        return result;
    }, {});
}
exports.getUserInputs = getUserInputs;
//# sourceMappingURL=inputs.js.map

/***/ }),

/***/ 3109:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.run = void 0;
const core = __importStar(__nccwpck_require__(2186));
const mappings_1 = __nccwpck_require__(9876);
function run() {
    try {
        const newMappings = mappings_1.getMappedValues();
        const json = JSON.stringify(newMappings);
        core.info('--------- Output ---------');
        core.info('Remapped json:');
        core.info(JSON.stringify(newMappings, null, 2));
        core.setOutput('json', json);
    }
    catch (error) {
        core.setFailed(error);
    }
}
exports.run = run;
void run();
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 9876:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getMappedValues = exports.trimByDepth = void 0;
const core = __importStar(__nccwpck_require__(2186));
const lodash_get_1 = __importDefault(__nccwpck_require__(9197));
const lodash_set_1 = __importDefault(__nccwpck_require__(1552));
const inputs_1 = __nccwpck_require__(6180);
const utils_1 = __nccwpck_require__(918);
function trimByDepth(obj, casingFunction, depth, deepCasing) {
    if (deepCasing) {
        renameKeys(obj, casingFunction);
    }
    if (depth === 0 && !deepCasing)
        return obj;
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (Array.isArray(value)) {
                if (depth === 1)
                    delete obj[key];
                else
                    for (const arrValue of value) {
                        if (typeof arrValue === 'object' && typeof arrValue !== null) {
                            trimByDepth(arrValue, casingFunction, depth - 1, deepCasing); // arrays indices don't count on depth
                        }
                    }
            }
            else if (typeof value === 'object' && typeof value !== null) {
                if (depth === 1)
                    delete obj[key];
                else
                    trimByDepth(obj[key], casingFunction, depth - 1, deepCasing);
            }
        }
    }
    return obj;
}
exports.trimByDepth = trimByDepth;
function renameKeys(obj, casingFunction) {
    if (!Array.isArray(obj)) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                delete obj[key];
                obj[casingFunction(key)] = value;
            }
        }
    }
}
function getMappedValues() {
    var _a, _b;
    const { depth, case: keyCase, deepCasing } = inputs_1.getDefinedInputs();
    const inputs = inputs_1.getUserInputs(keyCase);
    const casingFunction = utils_1.getCaseFunction(keyCase);
    const newMappings = {};
    Object.freeze(newMappings.__proto__);
    let count = Object.keys(inputs).length;
    core.info('--------- Inputs ---------');
    for (const inputPath in inputs) {
        count--;
        if (inputs.hasOwnProperty(inputPath)) {
            const casedInputPath = casingFunction(inputPath);
            const re = /(.*?)\.\*\.(.*)/;
            const value = inputs[inputPath];
            core.info(`path: ${casedInputPath}`);
            core.info(`type: ${Array.isArray(value) ? 'array' : typeof value}`);
            core.info(`value: ${JSON.stringify(value)}`);
            if (re.test(casedInputPath)) {
                if (!Array.isArray(value)) {
                    continue;
                }
                const [, first, second] = (_a = re.exec(casedInputPath)) !== null && _a !== void 0 ? _a : [];
                const current = lodash_get_1.default(newMappings, first);
                const newCurrent = (!Array.isArray(current)
                    ? []
                    : (typeof current[0] === 'object' && current[0] !== null
                        ? current
                        : []));
                for (const [index, el] of value.entries()) {
                    if (first === '' || second === '') {
                        core.warning(`Invalid path for '${inputPath}', must specify a key (e.g. 'key1.*.key2')`);
                    }
                    else {
                        const element = (_b = newCurrent[index]) !== null && _b !== void 0 ? _b : {};
                        lodash_set_1.default(element, second, el);
                        newCurrent[index] = element;
                    }
                }
                if (newCurrent.length > 0) {
                    lodash_set_1.default(newMappings, first, newCurrent);
                }
            }
            else {
                lodash_set_1.default(newMappings, casedInputPath, value);
            }
            if (count)
                core.info('--------------------------');
        }
    }
    const casingFunctionDeep = utils_1.getCaseFunction(keyCase, true);
    return trimByDepth(newMappings, casingFunctionDeep, depth, deepCasing);
}
exports.getMappedValues = getMappedValues;
//# sourceMappingURL=mappings.js.map

/***/ }),

/***/ 8164:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KeyCase = void 0;
var KeyCase;
(function (KeyCase) {
    KeyCase["snake"] = "snake";
    KeyCase["camel"] = "camel";
    KeyCase["pascal"] = "pascal";
    KeyCase["upper"] = "upper";
    KeyCase["lower"] = "lower";
    KeyCase["kebab"] = "kebab";
})(KeyCase = exports.KeyCase || (exports.KeyCase = {}));
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 918:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseValue = exports.getCaseFunction = void 0;
const change_case_1 = __nccwpck_require__(9091);
/**
 * Handles splitting top level keys with dot and unfiltering cases
 */
const splitCaseJoin = (caseFunction) => (s) => s
    .split('.')
    .map((p) => (p === '*' ? p : caseFunction(p)))
    .join('.');
const caseMap = {
    snake: (d) => d ? change_case_1.snakeCase : splitCaseJoin(change_case_1.snakeCase),
    camel: (d) => d ? change_case_1.camelCase : splitCaseJoin(change_case_1.camelCase),
    pascal: (d) => d ? change_case_1.pascalCase : splitCaseJoin(change_case_1.pascalCase),
    kebab: (d) => d ? change_case_1.paramCase : splitCaseJoin(change_case_1.paramCase),
    upper: () => (s) => s.toUpperCase(),
    lower: () => (s) => s.toLowerCase(),
};
const getCaseFunction = (keyCase, deep = false) => {
    return caseMap[keyCase](deep);
};
exports.getCaseFunction = getCaseFunction;
function parseValue(value) {
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        }
        catch (_a) {
            return value;
        }
    }
    return value;
}
exports.parseValue = parseValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 1997:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validateDefinedInputs = void 0;
const core = __importStar(__nccwpck_require__(2186));
const joi_1 = __importDefault(__nccwpck_require__(7964));
const types_1 = __nccwpck_require__(8164);
const definedInputSchema = joi_1.default.object({
    depth: joi_1.default.number()
        .label('__depth')
        .min(0)
        .default(0),
    case: joi_1.default.string()
        .label('__case')
        .valid(...Object.values(types_1.KeyCase))
        .default(types_1.KeyCase.camel),
    deepCasing: joi_1.default.boolean()
        .label('__deep_casing')
        .default(false),
});
const definedInputSchemaFailover = joi_1.default.object({
    depth: definedInputSchema.extract('depth').failover(0),
    case: definedInputSchema.extract('case').failover(types_1.KeyCase.camel),
    deepCasing: definedInputSchema.extract('deepCasing').failover(false),
});
function validateDefinedInputs(inputs) {
    const { error } = definedInputSchema.validate(inputs, { abortEarly: false, stripUnknown: true });
    if (error) {
        core.error('-------------- Input errors --------------');
        for (const { message } of error.details) {
            core.error(`${message}. Using default value instead.`);
        }
        core.error('------------------------------------------');
    }
    return definedInputSchemaFailover.validate(inputs, { stripUnknown: true }).value;
}
exports.validateDefinedInputs = validateDefinedInputs;
//# sourceMappingURL=validate.js.map

/***/ }),

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2087));
const path = __importStar(__nccwpck_require__(5622));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(5747));
const os = __importStar(__nccwpck_require__(2087));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(5622));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2087);
const fs_1 = __nccwpck_require__(5747);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(8605));
const https = __importStar(__nccwpck_require__(7211));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
    readBodyBuffer() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const chunks = [];
                this.message.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                this.message.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        try {
            return new URL(proxyVar);
        }
        catch (_a) {
            if (!proxyVar.startsWith('http://') && !proxyVar.startsWith('https://'))
                return new URL(`http://${proxyVar}`);
        }
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const reqHost = reqUrl.hostname;
    if (isLoopbackAddress(reqHost)) {
        return true;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperNoProxyItem === '*' ||
            upperReqHosts.some(x => x === upperNoProxyItem ||
                x.endsWith(`.${upperNoProxyItem}`) ||
                (upperNoProxyItem.startsWith('.') &&
                    x.endsWith(`${upperNoProxyItem}`)))) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
function isLoopbackAddress(host) {
    const hostLower = host.toLowerCase();
    return (hostLower === 'localhost' ||
        hostLower.startsWith('127.') ||
        hostLower.startsWith('[::1]') ||
        hostLower.startsWith('[0:0:0:0:0:0:0:1]'));
}
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 5545:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);
const Clone = __nccwpck_require__(5578);
const Merge = __nccwpck_require__(445);
const Reach = __nccwpck_require__(8891);


const internals = {};


module.exports = function (defaults, source, options = {}) {

    Assert(defaults && typeof defaults === 'object', 'Invalid defaults value: must be an object');
    Assert(!source || source === true || typeof source === 'object', 'Invalid source value: must be true, falsy or an object');
    Assert(typeof options === 'object', 'Invalid options: must be an object');

    if (!source) {                                                  // If no source, return null
        return null;
    }

    if (options.shallow) {
        return internals.applyToDefaultsWithShallow(defaults, source, options);
    }

    const copy = Clone(defaults);

    if (source === true) {                                          // If source is set to true, use defaults
        return copy;
    }

    const nullOverride = options.nullOverride !== undefined ? options.nullOverride : false;
    return Merge(copy, source, { nullOverride, mergeArrays: false });
};


internals.applyToDefaultsWithShallow = function (defaults, source, options) {

    const keys = options.shallow;
    Assert(Array.isArray(keys), 'Invalid keys');

    const seen = new Map();
    const merge = source === true ? null : new Set();

    for (let key of keys) {
        key = Array.isArray(key) ? key : key.split('.');            // Pre-split optimization

        const ref = Reach(defaults, key);
        if (ref &&
            typeof ref === 'object') {

            seen.set(ref, merge && Reach(source, key) || ref);
        }
        else if (merge) {
            merge.add(key);
        }
    }

    const copy = Clone(defaults, {}, seen);

    if (!merge) {
        return copy;
    }

    for (const key of merge) {
        internals.reachCopy(copy, source, key);
    }

    const nullOverride = options.nullOverride !== undefined ? options.nullOverride : false;
    return Merge(copy, source, { nullOverride, mergeArrays: false });
};


internals.reachCopy = function (dst, src, path) {

    for (const segment of path) {
        if (!(segment in src)) {
            return;
        }

        const val = src[segment];

        if (typeof val !== 'object' || val === null) {
            return;
        }

        src = val;
    }

    const value = src;
    let ref = dst;
    for (let i = 0; i < path.length - 1; ++i) {
        const segment = path[i];
        if (typeof ref[segment] !== 'object') {
            ref[segment] = {};
        }

        ref = ref[segment];
    }

    ref[path[path.length - 1]] = value;
};


/***/ }),

/***/ 2718:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const AssertError = __nccwpck_require__(5563);

const internals = {};


module.exports = function (condition, ...args) {

    if (condition) {
        return;
    }

    if (args.length === 1 &&
        args[0] instanceof Error) {

        throw args[0];
    }

    throw new AssertError(args);
};


/***/ }),

/***/ 5578:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Reach = __nccwpck_require__(8891);
const Types = __nccwpck_require__(6657);
const Utils = __nccwpck_require__(417);


const internals = {
    needsProtoHack: new Set([Types.set, Types.map, Types.weakSet, Types.weakMap])
};


module.exports = internals.clone = function (obj, options = {}, _seen = null) {

    if (typeof obj !== 'object' ||
        obj === null) {

        return obj;
    }

    let clone = internals.clone;
    let seen = _seen;

    if (options.shallow) {
        if (options.shallow !== true) {
            return internals.cloneWithShallow(obj, options);
        }

        clone = (value) => value;
    }
    else if (seen) {
        const lookup = seen.get(obj);
        if (lookup) {
            return lookup;
        }
    }
    else {
        seen = new Map();
    }

    // Built-in object types

    const baseProto = Types.getInternalProto(obj);
    if (baseProto === Types.buffer) {
        return Buffer && Buffer.from(obj);              // $lab:coverage:ignore$
    }

    if (baseProto === Types.date) {
        return new Date(obj.getTime());
    }

    if (baseProto === Types.regex) {
        return new RegExp(obj);
    }

    // Generic objects

    const newObj = internals.base(obj, baseProto, options);
    if (newObj === obj) {
        return obj;
    }

    if (seen) {
        seen.set(obj, newObj);                              // Set seen, since obj could recurse
    }

    if (baseProto === Types.set) {
        for (const value of obj) {
            newObj.add(clone(value, options, seen));
        }
    }
    else if (baseProto === Types.map) {
        for (const [key, value] of obj) {
            newObj.set(key, clone(value, options, seen));
        }
    }

    const keys = Utils.keys(obj, options);
    for (const key of keys) {
        if (key === '__proto__') {
            continue;
        }

        if (baseProto === Types.array &&
            key === 'length') {

            newObj.length = obj.length;
            continue;
        }

        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        if (descriptor) {
            if (descriptor.get ||
                descriptor.set) {

                Object.defineProperty(newObj, key, descriptor);
            }
            else if (descriptor.enumerable) {
                newObj[key] = clone(obj[key], options, seen);
            }
            else {
                Object.defineProperty(newObj, key, { enumerable: false, writable: true, configurable: true, value: clone(obj[key], options, seen) });
            }
        }
        else {
            Object.defineProperty(newObj, key, {
                enumerable: true,
                writable: true,
                configurable: true,
                value: clone(obj[key], options, seen)
            });
        }
    }

    return newObj;
};


internals.cloneWithShallow = function (source, options) {

    const keys = options.shallow;
    options = Object.assign({}, options);
    options.shallow = false;

    const seen = new Map();

    for (const key of keys) {
        const ref = Reach(source, key);
        if (typeof ref === 'object' ||
            typeof ref === 'function') {

            seen.set(ref, ref);
        }
    }

    return internals.clone(source, options, seen);
};


internals.base = function (obj, baseProto, options) {

    if (options.prototype === false) {                  // Defaults to true
        if (internals.needsProtoHack.has(baseProto)) {
            return new baseProto.constructor();
        }

        return baseProto === Types.array ? [] : {};
    }

    const proto = Object.getPrototypeOf(obj);
    if (proto &&
        proto.isImmutable) {

        return obj;
    }

    if (baseProto === Types.array) {
        const newObj = [];
        if (proto !== baseProto) {
            Object.setPrototypeOf(newObj, proto);
        }

        return newObj;
    }

    if (internals.needsProtoHack.has(baseProto)) {
        const newObj = new proto.constructor();
        if (proto !== baseProto) {
            Object.setPrototypeOf(newObj, proto);
        }

        return newObj;
    }

    return Object.create(proto);
};


/***/ }),

/***/ 5801:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Types = __nccwpck_require__(6657);


const internals = {
    mismatched: null
};


module.exports = function (obj, ref, options) {

    options = Object.assign({ prototype: true }, options);

    return !!internals.isDeepEqual(obj, ref, options, []);
};


internals.isDeepEqual = function (obj, ref, options, seen) {

    if (obj === ref) {                                                      // Copied from Deep-eql, copyright(c) 2013 Jake Luer, jake@alogicalparadox.com, MIT Licensed, https://github.com/chaijs/deep-eql
        return obj !== 0 || 1 / obj === 1 / ref;
    }

    const type = typeof obj;

    if (type !== typeof ref) {
        return false;
    }

    if (obj === null ||
        ref === null) {

        return false;
    }

    if (type === 'function') {
        if (!options.deepFunction ||
            obj.toString() !== ref.toString()) {

            return false;
        }

        // Continue as object
    }
    else if (type !== 'object') {
        return obj !== obj && ref !== ref;                                  // NaN
    }

    const instanceType = internals.getSharedType(obj, ref, !!options.prototype);
    switch (instanceType) {
        case Types.buffer:
            return Buffer && Buffer.prototype.equals.call(obj, ref);        // $lab:coverage:ignore$
        case Types.promise:
            return obj === ref;
        case Types.regex:
            return obj.toString() === ref.toString();
        case internals.mismatched:
            return false;
    }

    for (let i = seen.length - 1; i >= 0; --i) {
        if (seen[i].isSame(obj, ref)) {
            return true;                                                    // If previous comparison failed, it would have stopped execution
        }
    }

    seen.push(new internals.SeenEntry(obj, ref));

    try {
        return !!internals.isDeepEqualObj(instanceType, obj, ref, options, seen);
    }
    finally {
        seen.pop();
    }
};


internals.getSharedType = function (obj, ref, checkPrototype) {

    if (checkPrototype) {
        if (Object.getPrototypeOf(obj) !== Object.getPrototypeOf(ref)) {
            return internals.mismatched;
        }

        return Types.getInternalProto(obj);
    }

    const type = Types.getInternalProto(obj);
    if (type !== Types.getInternalProto(ref)) {
        return internals.mismatched;
    }

    return type;
};


internals.valueOf = function (obj) {

    const objValueOf = obj.valueOf;
    if (objValueOf === undefined) {
        return obj;
    }

    try {
        return objValueOf.call(obj);
    }
    catch (err) {
        return err;
    }
};


internals.hasOwnEnumerableProperty = function (obj, key) {

    return Object.prototype.propertyIsEnumerable.call(obj, key);
};


internals.isSetSimpleEqual = function (obj, ref) {

    for (const entry of Set.prototype.values.call(obj)) {
        if (!Set.prototype.has.call(ref, entry)) {
            return false;
        }
    }

    return true;
};


internals.isDeepEqualObj = function (instanceType, obj, ref, options, seen) {

    const { isDeepEqual, valueOf, hasOwnEnumerableProperty } = internals;
    const { keys, getOwnPropertySymbols } = Object;

    if (instanceType === Types.array) {
        if (options.part) {

            // Check if any index match any other index

            for (const objValue of obj) {
                for (const refValue of ref) {
                    if (isDeepEqual(objValue, refValue, options, seen)) {
                        return true;
                    }
                }
            }
        }
        else {
            if (obj.length !== ref.length) {
                return false;
            }

            for (let i = 0; i < obj.length; ++i) {
                if (!isDeepEqual(obj[i], ref[i], options, seen)) {
                    return false;
                }
            }

            return true;
        }
    }
    else if (instanceType === Types.set) {
        if (obj.size !== ref.size) {
            return false;
        }

        if (!internals.isSetSimpleEqual(obj, ref)) {

            // Check for deep equality

            const ref2 = new Set(Set.prototype.values.call(ref));
            for (const objEntry of Set.prototype.values.call(obj)) {
                if (ref2.delete(objEntry)) {
                    continue;
                }

                let found = false;
                for (const refEntry of ref2) {
                    if (isDeepEqual(objEntry, refEntry, options, seen)) {
                        ref2.delete(refEntry);
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    return false;
                }
            }
        }
    }
    else if (instanceType === Types.map) {
        if (obj.size !== ref.size) {
            return false;
        }

        for (const [key, value] of Map.prototype.entries.call(obj)) {
            if (value === undefined && !Map.prototype.has.call(ref, key)) {
                return false;
            }

            if (!isDeepEqual(value, Map.prototype.get.call(ref, key), options, seen)) {
                return false;
            }
        }
    }
    else if (instanceType === Types.error) {

        // Always check name and message

        if (obj.name !== ref.name ||
            obj.message !== ref.message) {

            return false;
        }
    }

    // Check .valueOf()

    const valueOfObj = valueOf(obj);
    const valueOfRef = valueOf(ref);
    if ((obj !== valueOfObj || ref !== valueOfRef) &&
        !isDeepEqual(valueOfObj, valueOfRef, options, seen)) {

        return false;
    }

    // Check properties

    const objKeys = keys(obj);
    if (!options.part &&
        objKeys.length !== keys(ref).length &&
        !options.skip) {

        return false;
    }

    let skipped = 0;
    for (const key of objKeys) {
        if (options.skip &&
            options.skip.includes(key)) {

            if (ref[key] === undefined) {
                ++skipped;
            }

            continue;
        }

        if (!hasOwnEnumerableProperty(ref, key)) {
            return false;
        }

        if (!isDeepEqual(obj[key], ref[key], options, seen)) {
            return false;
        }
    }

    if (!options.part &&
        objKeys.length - skipped !== keys(ref).length) {

        return false;
    }

    // Check symbols

    if (options.symbols !== false) {                                // Defaults to true
        const objSymbols = getOwnPropertySymbols(obj);
        const refSymbols = new Set(getOwnPropertySymbols(ref));

        for (const key of objSymbols) {
            if (!options.skip ||
                !options.skip.includes(key)) {

                if (hasOwnEnumerableProperty(obj, key)) {
                    if (!hasOwnEnumerableProperty(ref, key)) {
                        return false;
                    }

                    if (!isDeepEqual(obj[key], ref[key], options, seen)) {
                        return false;
                    }
                }
                else if (hasOwnEnumerableProperty(ref, key)) {
                    return false;
                }
            }

            refSymbols.delete(key);
        }

        for (const key of refSymbols) {
            if (hasOwnEnumerableProperty(ref, key)) {
                return false;
            }
        }
    }

    return true;
};


internals.SeenEntry = class {

    constructor(obj, ref) {

        this.obj = obj;
        this.ref = ref;
    }

    isSame(obj, ref) {

        return this.obj === obj && this.ref === ref;
    }
};


/***/ }),

/***/ 5563:
/***/ ((module, exports, __nccwpck_require__) => {

"use strict";


const Stringify = __nccwpck_require__(7577);


const internals = {};


module.exports = class extends Error {

    constructor(args) {

        const msgs = args
            .filter((arg) => arg !== '')
            .map((arg) => {

                return typeof arg === 'string' ? arg : arg instanceof Error ? arg.message : Stringify(arg);
            });

        super(msgs.join(' ') || 'Unknown error');

        if (typeof Error.captureStackTrace === 'function') {            // $lab:coverage:ignore$
            Error.captureStackTrace(this, exports.assert);
        }
    }
};


/***/ }),

/***/ 4752:
/***/ ((module) => {

"use strict";


const internals = {};


module.exports = function (input) {

    if (!input) {
        return '';
    }

    let escaped = '';

    for (let i = 0; i < input.length; ++i) {

        const charCode = input.charCodeAt(i);

        if (internals.isSafe(charCode)) {
            escaped += input[i];
        }
        else {
            escaped += internals.escapeHtmlChar(charCode);
        }
    }

    return escaped;
};


internals.escapeHtmlChar = function (charCode) {

    const namedEscape = internals.namedHtml[charCode];
    if (typeof namedEscape !== 'undefined') {
        return namedEscape;
    }

    if (charCode >= 256) {
        return '&#' + charCode + ';';
    }

    const hexValue = charCode.toString(16).padStart(2, '0');
    return `&#x${hexValue};`;
};


internals.isSafe = function (charCode) {

    return (typeof internals.safeCharCodes[charCode] !== 'undefined');
};


internals.namedHtml = {
    '38': '&amp;',
    '60': '&lt;',
    '62': '&gt;',
    '34': '&quot;',
    '160': '&nbsp;',
    '162': '&cent;',
    '163': '&pound;',
    '164': '&curren;',
    '169': '&copy;',
    '174': '&reg;'
};


internals.safeCharCodes = (function () {

    const safe = {};

    for (let i = 32; i < 123; ++i) {

        if ((i >= 97) ||                    // a-z
            (i >= 65 && i <= 90) ||         // A-Z
            (i >= 48 && i <= 57) ||         // 0-9
            i === 32 ||                     // space
            i === 46 ||                     // .
            i === 44 ||                     // ,
            i === 45 ||                     // -
            i === 58 ||                     // :
            i === 95) {                     // _

            safe[i] = null;
        }
    }

    return safe;
}());


/***/ }),

/***/ 1965:
/***/ ((module) => {

"use strict";


const internals = {};


module.exports = function (string) {

    // Escape ^$.*+-?=!:|\/()[]{},

    return string.replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, '\\$&');
};


/***/ }),

/***/ 2887:
/***/ ((module) => {

"use strict";


const internals = {};


module.exports = function () { };


/***/ }),

/***/ 445:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);
const Clone = __nccwpck_require__(5578);
const Utils = __nccwpck_require__(417);


const internals = {};


module.exports = internals.merge = function (target, source, options) {

    Assert(target && typeof target === 'object', 'Invalid target value: must be an object');
    Assert(source === null || source === undefined || typeof source === 'object', 'Invalid source value: must be null, undefined, or an object');

    if (!source) {
        return target;
    }

    options = Object.assign({ nullOverride: true, mergeArrays: true }, options);

    if (Array.isArray(source)) {
        Assert(Array.isArray(target), 'Cannot merge array onto an object');
        if (!options.mergeArrays) {
            target.length = 0;                                                          // Must not change target assignment
        }

        for (let i = 0; i < source.length; ++i) {
            target.push(Clone(source[i], { symbols: options.symbols }));
        }

        return target;
    }

    const keys = Utils.keys(source, options);
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        if (key === '__proto__' ||
            !Object.prototype.propertyIsEnumerable.call(source, key)) {

            continue;
        }

        const value = source[key];
        if (value &&
            typeof value === 'object') {

            if (target[key] === value) {
                continue;                                           // Can occur for shallow merges
            }

            if (!target[key] ||
                typeof target[key] !== 'object' ||
                (Array.isArray(target[key]) !== Array.isArray(value)) ||
                value instanceof Date ||
                (Buffer && Buffer.isBuffer(value)) ||               // $lab:coverage:ignore$
                value instanceof RegExp) {

                target[key] = Clone(value, { symbols: options.symbols });
            }
            else {
                internals.merge(target[key], value, options);
            }
        }
        else {
            if (value !== null &&
                value !== undefined) {                              // Explicit to preserve empty strings

                target[key] = value;
            }
            else if (options.nullOverride) {
                target[key] = value;
            }
        }
    }

    return target;
};


/***/ }),

/***/ 8891:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);


const internals = {};


module.exports = function (obj, chain, options) {

    if (chain === false ||
        chain === null ||
        chain === undefined) {

        return obj;
    }

    options = options || {};
    if (typeof options === 'string') {
        options = { separator: options };
    }

    const isChainArray = Array.isArray(chain);

    Assert(!isChainArray || !options.separator, 'Separator option no valid for array-based chain');

    const path = isChainArray ? chain : chain.split(options.separator || '.');
    let ref = obj;
    for (let i = 0; i < path.length; ++i) {
        let key = path[i];
        const type = options.iterables && internals.iterables(ref);

        if (Array.isArray(ref) ||
            type === 'set') {

            const number = Number(key);
            if (Number.isInteger(number)) {
                key = number < 0 ? ref.length + number : number;
            }
        }

        if (!ref ||
            typeof ref === 'function' && options.functions === false ||         // Defaults to true
            !type && ref[key] === undefined) {

            Assert(!options.strict || i + 1 === path.length, 'Missing segment', key, 'in reach path ', chain);
            Assert(typeof ref === 'object' || options.functions === true || typeof ref !== 'function', 'Invalid segment', key, 'in reach path ', chain);
            ref = options.default;
            break;
        }

        if (!type) {
            ref = ref[key];
        }
        else if (type === 'set') {
            ref = [...ref][key];
        }
        else {  // type === 'map'
            ref = ref.get(key);
        }
    }

    return ref;
};


internals.iterables = function (ref) {

    if (ref instanceof Set) {
        return 'set';
    }

    if (ref instanceof Map) {
        return 'map';
    }
};


/***/ }),

/***/ 7577:
/***/ ((module) => {

"use strict";


const internals = {};


module.exports = function (...args) {

    try {
        return JSON.stringify.apply(null, args);
    }
    catch (err) {
        return '[Cannot display object: ' + err.message + ']';
    }
};


/***/ }),

/***/ 6657:
/***/ ((module, exports) => {

"use strict";


const internals = {};


exports = module.exports = {
    array: Array.prototype,
    buffer: Buffer && Buffer.prototype,             // $lab:coverage:ignore$
    date: Date.prototype,
    error: Error.prototype,
    generic: Object.prototype,
    map: Map.prototype,
    promise: Promise.prototype,
    regex: RegExp.prototype,
    set: Set.prototype,
    weakMap: WeakMap.prototype,
    weakSet: WeakSet.prototype
};


internals.typeMap = new Map([
    ['[object Error]', exports.error],
    ['[object Map]', exports.map],
    ['[object Promise]', exports.promise],
    ['[object Set]', exports.set],
    ['[object WeakMap]', exports.weakMap],
    ['[object WeakSet]', exports.weakSet]
]);


exports.getInternalProto = function (obj) {

    if (Array.isArray(obj)) {
        return exports.array;
    }

    if (Buffer && obj instanceof Buffer) {          // $lab:coverage:ignore$
        return exports.buffer;
    }

    if (obj instanceof Date) {
        return exports.date;
    }

    if (obj instanceof RegExp) {
        return exports.regex;
    }

    if (obj instanceof Error) {
        return exports.error;
    }

    const objName = Object.prototype.toString.call(obj);
    return internals.typeMap.get(objName) || exports.generic;
};


/***/ }),

/***/ 417:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


const internals = {};


exports.keys = function (obj, options = {}) {

    return options.symbols !== false ? Reflect.ownKeys(obj) : Object.getOwnPropertyNames(obj);  // Defaults to true
};


/***/ }),

/***/ 8392:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);


const internals = {};


exports.Sorter = class {

    constructor() {

        this._items = [];
        this.nodes = [];
    }

    add(nodes, options) {

        options = options || {};

        // Validate rules

        const before = [].concat(options.before || []);
        const after = [].concat(options.after || []);
        const group = options.group || '?';
        const sort = options.sort || 0;                   // Used for merging only

        Assert(!before.includes(group), `Item cannot come before itself: ${group}`);
        Assert(!before.includes('?'), 'Item cannot come before unassociated items');
        Assert(!after.includes(group), `Item cannot come after itself: ${group}`);
        Assert(!after.includes('?'), 'Item cannot come after unassociated items');

        if (!Array.isArray(nodes)) {
            nodes = [nodes];
        }

        for (const node of nodes) {
            const item = {
                seq: this._items.length,
                sort,
                before,
                after,
                group,
                node
            };

            this._items.push(item);
        }

        // Insert event

        if (!options.manual) {
            const valid = this._sort();
            Assert(valid, 'item', group !== '?' ? `added into group ${group}` : '', 'created a dependencies error');
        }

        return this.nodes;
    }

    merge(others) {

        if (!Array.isArray(others)) {
            others = [others];
        }

        for (const other of others) {
            if (other) {
                for (const item of other._items) {
                    this._items.push(Object.assign({}, item));      // Shallow cloned
                }
            }
        }

        // Sort items

        this._items.sort(internals.mergeSort);
        for (let i = 0; i < this._items.length; ++i) {
            this._items[i].seq = i;
        }

        const valid = this._sort();
        Assert(valid, 'merge created a dependencies error');

        return this.nodes;
    }

    sort() {

        const valid = this._sort();
        Assert(valid, 'sort created a dependencies error');

        return this.nodes;
    }

    _sort() {

        // Construct graph

        const graph = {};
        const graphAfters = Object.create(null);            // A prototype can bungle lookups w/ false positives
        const groups = Object.create(null);

        for (const item of this._items) {
            const seq = item.seq;                           // Unique across all items
            const group = item.group;

            // Determine Groups

            groups[group] = groups[group] || [];
            groups[group].push(seq);

            // Build intermediary graph using 'before'

            graph[seq] = item.before;

            // Build second intermediary graph with 'after'

            for (const after of item.after) {
                graphAfters[after] = graphAfters[after] || [];
                graphAfters[after].push(seq);
            }
        }

        // Expand intermediary graph

        for (const node in graph) {
            const expandedGroups = [];

            for (const graphNodeItem in graph[node]) {
                const group = graph[node][graphNodeItem];
                groups[group] = groups[group] || [];
                expandedGroups.push(...groups[group]);
            }

            graph[node] = expandedGroups;
        }

        // Merge intermediary graph using graphAfters into final graph

        for (const group in graphAfters) {
            if (groups[group]) {
                for (const node of groups[group]) {
                    graph[node].push(...graphAfters[group]);
                }
            }
        }

        // Compile ancestors

        const ancestors = {};
        for (const node in graph) {
            const children = graph[node];
            for (const child of children) {
                ancestors[child] = ancestors[child] || [];
                ancestors[child].push(node);
            }
        }

        // Topo sort

        const visited = {};
        const sorted = [];

        for (let i = 0; i < this._items.length; ++i) {          // Looping through item.seq values out of order
            let next = i;

            if (ancestors[i]) {
                next = null;
                for (let j = 0; j < this._items.length; ++j) {  // As above, these are item.seq values
                    if (visited[j] === true) {
                        continue;
                    }

                    if (!ancestors[j]) {
                        ancestors[j] = [];
                    }

                    const shouldSeeCount = ancestors[j].length;
                    let seenCount = 0;
                    for (let k = 0; k < shouldSeeCount; ++k) {
                        if (visited[ancestors[j][k]]) {
                            ++seenCount;
                        }
                    }

                    if (seenCount === shouldSeeCount) {
                        next = j;
                        break;
                    }
                }
            }

            if (next !== null) {
                visited[next] = true;
                sorted.push(next);
            }
        }

        if (sorted.length !== this._items.length) {
            return false;
        }

        const seqIndex = {};
        for (const item of this._items) {
            seqIndex[item.seq] = item;
        }

        this._items = [];
        this.nodes = [];

        for (const value of sorted) {
            const sortedItem = seqIndex[value];
            this.nodes.push(sortedItem.node);
            this._items.push(sortedItem);
        }

        return true;
    }
};


internals.mergeSort = (a, b) => {

    return a.sort === b.sort ? 0 : (a.sort < b.sort ? -1 : 1);
};


/***/ }),

/***/ 7425:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const Url = __nccwpck_require__(8835);

const Errors = __nccwpck_require__(1594);


const internals = {
    minDomainSegments: 2,
    nonAsciiRx: /[^\x00-\x7f]/,
    domainControlRx: /[\x00-\x20@\:\/\\#!\$&\'\(\)\*\+,;=\?]/,                          // Control + space + separators
    tldSegmentRx: /^[a-zA-Z](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?$/,
    domainSegmentRx: /^[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?$/,
    URL: Url.URL || URL                                                                 // $lab:coverage:ignore$
};


exports.analyze = function (domain, options = {}) {

    if (typeof domain !== 'string') {
        throw new Error('Invalid input: domain must be a string');
    }

    if (!domain) {
        return Errors.code('DOMAIN_NON_EMPTY_STRING');
    }

    if (domain.length > 256) {
        return Errors.code('DOMAIN_TOO_LONG');
    }

    const ascii = !internals.nonAsciiRx.test(domain);
    if (!ascii) {
        if (options.allowUnicode === false) {                                           // Defaults to true
            return Errors.code('DOMAIN_INVALID_UNICODE_CHARS');
        }

        domain = domain.normalize('NFC');
    }

    if (internals.domainControlRx.test(domain)) {
        return Errors.code('DOMAIN_INVALID_CHARS');
    }

    domain = internals.punycode(domain);

    // https://tools.ietf.org/html/rfc1035 section 2.3.1

    const minDomainSegments = options.minDomainSegments || internals.minDomainSegments;

    const segments = domain.split('.');
    if (segments.length < minDomainSegments) {
        return Errors.code('DOMAIN_SEGMENTS_COUNT');
    }

    if (options.maxDomainSegments) {
        if (segments.length > options.maxDomainSegments) {
            return Errors.code('DOMAIN_SEGMENTS_COUNT_MAX');
        }
    }

    const tlds = options.tlds;
    if (tlds) {
        const tld = segments[segments.length - 1].toLowerCase();
        if (tlds.deny && tlds.deny.has(tld) ||
            tlds.allow && !tlds.allow.has(tld)) {

            return Errors.code('DOMAIN_FORBIDDEN_TLDS');
        }
    }

    for (let i = 0; i < segments.length; ++i) {
        const segment = segments[i];

        if (!segment.length) {
            return Errors.code('DOMAIN_EMPTY_SEGMENT');
        }

        if (segment.length > 63) {
            return Errors.code('DOMAIN_LONG_SEGMENT');
        }

        if (i < segments.length - 1) {
            if (!internals.domainSegmentRx.test(segment)) {
                return Errors.code('DOMAIN_INVALID_CHARS');
            }
        }
        else {
            if (!internals.tldSegmentRx.test(segment)) {
                return Errors.code('DOMAIN_INVALID_TLDS_CHARS');
            }
        }
    }

    return null;
};


exports.isValid = function (domain, options) {

    return !exports.analyze(domain, options);
};


internals.punycode = function (domain) {

    try {
        return new internals.URL(`http://${domain}`).host;
    }
    catch (err) {
        return domain;
    }
};


/***/ }),

/***/ 3283:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const Util = __nccwpck_require__(1669);

const Domain = __nccwpck_require__(7425);
const Errors = __nccwpck_require__(1594);


const internals = {
    nonAsciiRx: /[^\x00-\x7f]/,
    encoder: new (Util.TextEncoder || TextEncoder)()                                            // $lab:coverage:ignore$
};


exports.analyze = function (email, options) {

    return internals.email(email, options);
};


exports.isValid = function (email, options) {

    return !internals.email(email, options);
};


internals.email = function (email, options = {}) {

    if (typeof email !== 'string') {
        throw new Error('Invalid input: email must be a string');
    }

    if (!email) {
        return Errors.code('EMPTY_STRING');
    }

    // Unicode

    const ascii = !internals.nonAsciiRx.test(email);
    if (!ascii) {
        if (options.allowUnicode === false) {                                                   // Defaults to true
            return Errors.code('FORBIDDEN_UNICODE');
        }

        email = email.normalize('NFC');
    }

    // Basic structure

    const parts = email.split('@');
    if (parts.length !== 2) {
        return parts.length > 2 ? Errors.code('MULTIPLE_AT_CHAR') : Errors.code('MISSING_AT_CHAR');
    }

    const [local, domain] = parts;

    if (!local) {
        return Errors.code('EMPTY_LOCAL');
    }

    if (!options.ignoreLength) {
        if (email.length > 254) {                                           // http://tools.ietf.org/html/rfc5321#section-4.5.3.1.3
            return Errors.code('ADDRESS_TOO_LONG');
        }

        if (internals.encoder.encode(local).length > 64) {                  // http://tools.ietf.org/html/rfc5321#section-4.5.3.1.1
            return Errors.code('LOCAL_TOO_LONG');
        }
    }

    // Validate parts

    return internals.local(local, ascii) || Domain.analyze(domain, options);
};


internals.local = function (local, ascii) {

    const segments = local.split('.');
    for (const segment of segments) {
        if (!segment.length) {
            return Errors.code('EMPTY_LOCAL_SEGMENT');
        }

        if (ascii) {
            if (!internals.atextRx.test(segment)) {
                return Errors.code('INVALID_LOCAL_CHARS');
            }

            continue;
        }

        for (const char of segment) {
            if (internals.atextRx.test(char)) {
                continue;
            }

            const binary = internals.binary(char);
            if (!internals.atomRx.test(binary)) {
                return Errors.code('INVALID_LOCAL_CHARS');
            }
        }
    }
};


internals.binary = function (char) {

    return Array.from(internals.encoder.encode(char)).map((v) => String.fromCharCode(v)).join('');
};


/*
    From RFC 5321:

        Mailbox         =   Local-part "@" ( Domain / address-literal )

        Local-part      =   Dot-string / Quoted-string
        Dot-string      =   Atom *("."  Atom)
        Atom            =   1*atext
        atext           =   ALPHA / DIGIT / "!" / "#" / "$" / "%" / "&" / "'" / "*" / "+" / "-" / "/" / "=" / "?" / "^" / "_" / "`" / "{" / "|" / "}" / "~"

        Domain          =   sub-domain *("." sub-domain)
        sub-domain      =   Let-dig [Ldh-str]
        Let-dig         =   ALPHA / DIGIT
        Ldh-str         =   *( ALPHA / DIGIT / "-" ) Let-dig

        ALPHA           =   %x41-5A / %x61-7A        ; a-z, A-Z
        DIGIT           =   %x30-39                  ; 0-9

    From RFC 6531:

        sub-domain      =/  U-label
        atext           =/  UTF8-non-ascii

        UTF8-non-ascii  =   UTF8-2 / UTF8-3 / UTF8-4

        UTF8-2          =   %xC2-DF UTF8-tail
        UTF8-3          =   %xE0 %xA0-BF UTF8-tail /
                            %xE1-EC 2( UTF8-tail ) /
                            %xED %x80-9F UTF8-tail /
                            %xEE-EF 2( UTF8-tail )
        UTF8-4          =   %xF0 %x90-BF 2( UTF8-tail ) /
                            %xF1-F3 3( UTF8-tail ) /
                            %xF4 %x80-8F 2( UTF8-tail )

        UTF8-tail       =   %x80-BF

    Note: The following are not supported:

        RFC 5321: address-literal, Quoted-string
        RFC 5322: obs-*, CFWS
*/


internals.atextRx = /^[\w!#\$%&'\*\+\-/=\?\^`\{\|\}~]+$/;               // _ included in \w


internals.atomRx = new RegExp([

    //  %xC2-DF UTF8-tail
    '(?:[\\xc2-\\xdf][\\x80-\\xbf])',

    //  %xE0 %xA0-BF UTF8-tail              %xE1-EC 2( UTF8-tail )            %xED %x80-9F UTF8-tail              %xEE-EF 2( UTF8-tail )
    '(?:\\xe0[\\xa0-\\xbf][\\x80-\\xbf])|(?:[\\xe1-\\xec][\\x80-\\xbf]{2})|(?:\\xed[\\x80-\\x9f][\\x80-\\xbf])|(?:[\\xee-\\xef][\\x80-\\xbf]{2})',

    //  %xF0 %x90-BF 2( UTF8-tail )            %xF1-F3 3( UTF8-tail )            %xF4 %x80-8F 2( UTF8-tail )
    '(?:\\xf0[\\x90-\\xbf][\\x80-\\xbf]{2})|(?:[\\xf1-\\xf3][\\x80-\\xbf]{3})|(?:\\xf4[\\x80-\\x8f][\\x80-\\xbf]{2})'

].join('|'));


/***/ }),

/***/ 1594:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.codes = {
    EMPTY_STRING: 'Address must be a non-empty string',
    FORBIDDEN_UNICODE: 'Address contains forbidden Unicode characters',
    MULTIPLE_AT_CHAR: 'Address cannot contain more than one @ character',
    MISSING_AT_CHAR: 'Address must contain one @ character',
    EMPTY_LOCAL: 'Address local part cannot be empty',
    ADDRESS_TOO_LONG: 'Address too long',
    LOCAL_TOO_LONG: 'Address local part too long',
    EMPTY_LOCAL_SEGMENT: 'Address local part contains empty dot-separated segment',
    INVALID_LOCAL_CHARS: 'Address local part contains invalid character',
    DOMAIN_NON_EMPTY_STRING: 'Domain must be a non-empty string',
    DOMAIN_TOO_LONG: 'Domain too long',
    DOMAIN_INVALID_UNICODE_CHARS: 'Domain contains forbidden Unicode characters',
    DOMAIN_INVALID_CHARS: 'Domain contains invalid character',
    DOMAIN_INVALID_TLDS_CHARS: 'Domain contains invalid tld character',
    DOMAIN_SEGMENTS_COUNT: 'Domain lacks the minimum required number of segments',
    DOMAIN_SEGMENTS_COUNT_MAX: 'Domain contains too many segments',
    DOMAIN_FORBIDDEN_TLDS: 'Domain uses forbidden TLD',
    DOMAIN_EMPTY_SEGMENT: 'Domain contains empty dot-separated segment',
    DOMAIN_LONG_SEGMENT: 'Domain contains dot-separated segment that is too long'
};


exports.code = function (code) {

    return { code, error: exports.codes[code] };
};


/***/ }),

/***/ 2337:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);

const Uri = __nccwpck_require__(4983);


const internals = {};


exports.regex = function (options = {}) {

    // CIDR

    Assert(options.cidr === undefined || typeof options.cidr === 'string', 'options.cidr must be a string');
    const cidr = options.cidr ? options.cidr.toLowerCase() : 'optional';
    Assert(['required', 'optional', 'forbidden'].includes(cidr), 'options.cidr must be one of required, optional, forbidden');

    // Versions

    Assert(options.version === undefined || typeof options.version === 'string' || Array.isArray(options.version), 'options.version must be a string or an array of string');
    let versions = options.version || ['ipv4', 'ipv6', 'ipvfuture'];
    if (!Array.isArray(versions)) {
        versions = [versions];
    }

    Assert(versions.length >= 1, 'options.version must have at least 1 version specified');

    for (let i = 0; i < versions.length; ++i) {
        Assert(typeof versions[i] === 'string', 'options.version must only contain strings');
        versions[i] = versions[i].toLowerCase();
        Assert(['ipv4', 'ipv6', 'ipvfuture'].includes(versions[i]), 'options.version contains unknown version ' + versions[i] + ' - must be one of ipv4, ipv6, ipvfuture');
    }

    versions = Array.from(new Set(versions));

    // Regex

    const parts = versions.map((version) => {

        // Forbidden

        if (cidr === 'forbidden') {
            return Uri.ip[version];
        }

        // Required

        const cidrpart = `\\/${version === 'ipv4' ? Uri.ip.v4Cidr : Uri.ip.v6Cidr}`;

        if (cidr === 'required') {
            return `${Uri.ip[version]}${cidrpart}`;
        }

        // Optional

        return `${Uri.ip[version]}(?:${cidrpart})?`;
    });

    const raw = `(?:${parts.join('|')})`;
    const regex = new RegExp(`^${raw}$`);
    return { cidr, versions, regex, raw };
};


/***/ }),

/***/ 3092:
/***/ ((module) => {

"use strict";


const internals = {};


// http://data.iana.org/TLD/tlds-alpha-by-domain.txt
// # Version 2021020700, Last Updated Sun Feb  7 07: 07: 01 2021 UTC


internals.tlds = [
    'AAA',
    'AARP',
    'ABARTH',
    'ABB',
    'ABBOTT',
    'ABBVIE',
    'ABC',
    'ABLE',
    'ABOGADO',
    'ABUDHABI',
    'AC',
    'ACADEMY',
    'ACCENTURE',
    'ACCOUNTANT',
    'ACCOUNTANTS',
    'ACO',
    'ACTOR',
    'AD',
    'ADAC',
    'ADS',
    'ADULT',
    'AE',
    'AEG',
    'AERO',
    'AETNA',
    'AF',
    'AFAMILYCOMPANY',
    'AFL',
    'AFRICA',
    'AG',
    'AGAKHAN',
    'AGENCY',
    'AI',
    'AIG',
    'AIRBUS',
    'AIRFORCE',
    'AIRTEL',
    'AKDN',
    'AL',
    'ALFAROMEO',
    'ALIBABA',
    'ALIPAY',
    'ALLFINANZ',
    'ALLSTATE',
    'ALLY',
    'ALSACE',
    'ALSTOM',
    'AM',
    'AMAZON',
    'AMERICANEXPRESS',
    'AMERICANFAMILY',
    'AMEX',
    'AMFAM',
    'AMICA',
    'AMSTERDAM',
    'ANALYTICS',
    'ANDROID',
    'ANQUAN',
    'ANZ',
    'AO',
    'AOL',
    'APARTMENTS',
    'APP',
    'APPLE',
    'AQ',
    'AQUARELLE',
    'AR',
    'ARAB',
    'ARAMCO',
    'ARCHI',
    'ARMY',
    'ARPA',
    'ART',
    'ARTE',
    'AS',
    'ASDA',
    'ASIA',
    'ASSOCIATES',
    'AT',
    'ATHLETA',
    'ATTORNEY',
    'AU',
    'AUCTION',
    'AUDI',
    'AUDIBLE',
    'AUDIO',
    'AUSPOST',
    'AUTHOR',
    'AUTO',
    'AUTOS',
    'AVIANCA',
    'AW',
    'AWS',
    'AX',
    'AXA',
    'AZ',
    'AZURE',
    'BA',
    'BABY',
    'BAIDU',
    'BANAMEX',
    'BANANAREPUBLIC',
    'BAND',
    'BANK',
    'BAR',
    'BARCELONA',
    'BARCLAYCARD',
    'BARCLAYS',
    'BAREFOOT',
    'BARGAINS',
    'BASEBALL',
    'BASKETBALL',
    'BAUHAUS',
    'BAYERN',
    'BB',
    'BBC',
    'BBT',
    'BBVA',
    'BCG',
    'BCN',
    'BD',
    'BE',
    'BEATS',
    'BEAUTY',
    'BEER',
    'BENTLEY',
    'BERLIN',
    'BEST',
    'BESTBUY',
    'BET',
    'BF',
    'BG',
    'BH',
    'BHARTI',
    'BI',
    'BIBLE',
    'BID',
    'BIKE',
    'BING',
    'BINGO',
    'BIO',
    'BIZ',
    'BJ',
    'BLACK',
    'BLACKFRIDAY',
    'BLOCKBUSTER',
    'BLOG',
    'BLOOMBERG',
    'BLUE',
    'BM',
    'BMS',
    'BMW',
    'BN',
    'BNPPARIBAS',
    'BO',
    'BOATS',
    'BOEHRINGER',
    'BOFA',
    'BOM',
    'BOND',
    'BOO',
    'BOOK',
    'BOOKING',
    'BOSCH',
    'BOSTIK',
    'BOSTON',
    'BOT',
    'BOUTIQUE',
    'BOX',
    'BR',
    'BRADESCO',
    'BRIDGESTONE',
    'BROADWAY',
    'BROKER',
    'BROTHER',
    'BRUSSELS',
    'BS',
    'BT',
    'BUDAPEST',
    'BUGATTI',
    'BUILD',
    'BUILDERS',
    'BUSINESS',
    'BUY',
    'BUZZ',
    'BV',
    'BW',
    'BY',
    'BZ',
    'BZH',
    'CA',
    'CAB',
    'CAFE',
    'CAL',
    'CALL',
    'CALVINKLEIN',
    'CAM',
    'CAMERA',
    'CAMP',
    'CANCERRESEARCH',
    'CANON',
    'CAPETOWN',
    'CAPITAL',
    'CAPITALONE',
    'CAR',
    'CARAVAN',
    'CARDS',
    'CARE',
    'CAREER',
    'CAREERS',
    'CARS',
    'CASA',
    'CASE',
    'CASEIH',
    'CASH',
    'CASINO',
    'CAT',
    'CATERING',
    'CATHOLIC',
    'CBA',
    'CBN',
    'CBRE',
    'CBS',
    'CC',
    'CD',
    'CENTER',
    'CEO',
    'CERN',
    'CF',
    'CFA',
    'CFD',
    'CG',
    'CH',
    'CHANEL',
    'CHANNEL',
    'CHARITY',
    'CHASE',
    'CHAT',
    'CHEAP',
    'CHINTAI',
    'CHRISTMAS',
    'CHROME',
    'CHURCH',
    'CI',
    'CIPRIANI',
    'CIRCLE',
    'CISCO',
    'CITADEL',
    'CITI',
    'CITIC',
    'CITY',
    'CITYEATS',
    'CK',
    'CL',
    'CLAIMS',
    'CLEANING',
    'CLICK',
    'CLINIC',
    'CLINIQUE',
    'CLOTHING',
    'CLOUD',
    'CLUB',
    'CLUBMED',
    'CM',
    'CN',
    'CO',
    'COACH',
    'CODES',
    'COFFEE',
    'COLLEGE',
    'COLOGNE',
    'COM',
    'COMCAST',
    'COMMBANK',
    'COMMUNITY',
    'COMPANY',
    'COMPARE',
    'COMPUTER',
    'COMSEC',
    'CONDOS',
    'CONSTRUCTION',
    'CONSULTING',
    'CONTACT',
    'CONTRACTORS',
    'COOKING',
    'COOKINGCHANNEL',
    'COOL',
    'COOP',
    'CORSICA',
    'COUNTRY',
    'COUPON',
    'COUPONS',
    'COURSES',
    'CPA',
    'CR',
    'CREDIT',
    'CREDITCARD',
    'CREDITUNION',
    'CRICKET',
    'CROWN',
    'CRS',
    'CRUISE',
    'CRUISES',
    'CSC',
    'CU',
    'CUISINELLA',
    'CV',
    'CW',
    'CX',
    'CY',
    'CYMRU',
    'CYOU',
    'CZ',
    'DABUR',
    'DAD',
    'DANCE',
    'DATA',
    'DATE',
    'DATING',
    'DATSUN',
    'DAY',
    'DCLK',
    'DDS',
    'DE',
    'DEAL',
    'DEALER',
    'DEALS',
    'DEGREE',
    'DELIVERY',
    'DELL',
    'DELOITTE',
    'DELTA',
    'DEMOCRAT',
    'DENTAL',
    'DENTIST',
    'DESI',
    'DESIGN',
    'DEV',
    'DHL',
    'DIAMONDS',
    'DIET',
    'DIGITAL',
    'DIRECT',
    'DIRECTORY',
    'DISCOUNT',
    'DISCOVER',
    'DISH',
    'DIY',
    'DJ',
    'DK',
    'DM',
    'DNP',
    'DO',
    'DOCS',
    'DOCTOR',
    'DOG',
    'DOMAINS',
    'DOT',
    'DOWNLOAD',
    'DRIVE',
    'DTV',
    'DUBAI',
    'DUCK',
    'DUNLOP',
    'DUPONT',
    'DURBAN',
    'DVAG',
    'DVR',
    'DZ',
    'EARTH',
    'EAT',
    'EC',
    'ECO',
    'EDEKA',
    'EDU',
    'EDUCATION',
    'EE',
    'EG',
    'EMAIL',
    'EMERCK',
    'ENERGY',
    'ENGINEER',
    'ENGINEERING',
    'ENTERPRISES',
    'EPSON',
    'EQUIPMENT',
    'ER',
    'ERICSSON',
    'ERNI',
    'ES',
    'ESQ',
    'ESTATE',
    'ET',
    'ETISALAT',
    'EU',
    'EUROVISION',
    'EUS',
    'EVENTS',
    'EXCHANGE',
    'EXPERT',
    'EXPOSED',
    'EXPRESS',
    'EXTRASPACE',
    'FAGE',
    'FAIL',
    'FAIRWINDS',
    'FAITH',
    'FAMILY',
    'FAN',
    'FANS',
    'FARM',
    'FARMERS',
    'FASHION',
    'FAST',
    'FEDEX',
    'FEEDBACK',
    'FERRARI',
    'FERRERO',
    'FI',
    'FIAT',
    'FIDELITY',
    'FIDO',
    'FILM',
    'FINAL',
    'FINANCE',
    'FINANCIAL',
    'FIRE',
    'FIRESTONE',
    'FIRMDALE',
    'FISH',
    'FISHING',
    'FIT',
    'FITNESS',
    'FJ',
    'FK',
    'FLICKR',
    'FLIGHTS',
    'FLIR',
    'FLORIST',
    'FLOWERS',
    'FLY',
    'FM',
    'FO',
    'FOO',
    'FOOD',
    'FOODNETWORK',
    'FOOTBALL',
    'FORD',
    'FOREX',
    'FORSALE',
    'FORUM',
    'FOUNDATION',
    'FOX',
    'FR',
    'FREE',
    'FRESENIUS',
    'FRL',
    'FROGANS',
    'FRONTDOOR',
    'FRONTIER',
    'FTR',
    'FUJITSU',
    'FUJIXEROX',
    'FUN',
    'FUND',
    'FURNITURE',
    'FUTBOL',
    'FYI',
    'GA',
    'GAL',
    'GALLERY',
    'GALLO',
    'GALLUP',
    'GAME',
    'GAMES',
    'GAP',
    'GARDEN',
    'GAY',
    'GB',
    'GBIZ',
    'GD',
    'GDN',
    'GE',
    'GEA',
    'GENT',
    'GENTING',
    'GEORGE',
    'GF',
    'GG',
    'GGEE',
    'GH',
    'GI',
    'GIFT',
    'GIFTS',
    'GIVES',
    'GIVING',
    'GL',
    'GLADE',
    'GLASS',
    'GLE',
    'GLOBAL',
    'GLOBO',
    'GM',
    'GMAIL',
    'GMBH',
    'GMO',
    'GMX',
    'GN',
    'GODADDY',
    'GOLD',
    'GOLDPOINT',
    'GOLF',
    'GOO',
    'GOODYEAR',
    'GOOG',
    'GOOGLE',
    'GOP',
    'GOT',
    'GOV',
    'GP',
    'GQ',
    'GR',
    'GRAINGER',
    'GRAPHICS',
    'GRATIS',
    'GREEN',
    'GRIPE',
    'GROCERY',
    'GROUP',
    'GS',
    'GT',
    'GU',
    'GUARDIAN',
    'GUCCI',
    'GUGE',
    'GUIDE',
    'GUITARS',
    'GURU',
    'GW',
    'GY',
    'HAIR',
    'HAMBURG',
    'HANGOUT',
    'HAUS',
    'HBO',
    'HDFC',
    'HDFCBANK',
    'HEALTH',
    'HEALTHCARE',
    'HELP',
    'HELSINKI',
    'HERE',
    'HERMES',
    'HGTV',
    'HIPHOP',
    'HISAMITSU',
    'HITACHI',
    'HIV',
    'HK',
    'HKT',
    'HM',
    'HN',
    'HOCKEY',
    'HOLDINGS',
    'HOLIDAY',
    'HOMEDEPOT',
    'HOMEGOODS',
    'HOMES',
    'HOMESENSE',
    'HONDA',
    'HORSE',
    'HOSPITAL',
    'HOST',
    'HOSTING',
    'HOT',
    'HOTELES',
    'HOTELS',
    'HOTMAIL',
    'HOUSE',
    'HOW',
    'HR',
    'HSBC',
    'HT',
    'HU',
    'HUGHES',
    'HYATT',
    'HYUNDAI',
    'IBM',
    'ICBC',
    'ICE',
    'ICU',
    'ID',
    'IE',
    'IEEE',
    'IFM',
    'IKANO',
    'IL',
    'IM',
    'IMAMAT',
    'IMDB',
    'IMMO',
    'IMMOBILIEN',
    'IN',
    'INC',
    'INDUSTRIES',
    'INFINITI',
    'INFO',
    'ING',
    'INK',
    'INSTITUTE',
    'INSURANCE',
    'INSURE',
    'INT',
    'INTERNATIONAL',
    'INTUIT',
    'INVESTMENTS',
    'IO',
    'IPIRANGA',
    'IQ',
    'IR',
    'IRISH',
    'IS',
    'ISMAILI',
    'IST',
    'ISTANBUL',
    'IT',
    'ITAU',
    'ITV',
    'IVECO',
    'JAGUAR',
    'JAVA',
    'JCB',
    'JE',
    'JEEP',
    'JETZT',
    'JEWELRY',
    'JIO',
    'JLL',
    'JM',
    'JMP',
    'JNJ',
    'JO',
    'JOBS',
    'JOBURG',
    'JOT',
    'JOY',
    'JP',
    'JPMORGAN',
    'JPRS',
    'JUEGOS',
    'JUNIPER',
    'KAUFEN',
    'KDDI',
    'KE',
    'KERRYHOTELS',
    'KERRYLOGISTICS',
    'KERRYPROPERTIES',
    'KFH',
    'KG',
    'KH',
    'KI',
    'KIA',
    'KIM',
    'KINDER',
    'KINDLE',
    'KITCHEN',
    'KIWI',
    'KM',
    'KN',
    'KOELN',
    'KOMATSU',
    'KOSHER',
    'KP',
    'KPMG',
    'KPN',
    'KR',
    'KRD',
    'KRED',
    'KUOKGROUP',
    'KW',
    'KY',
    'KYOTO',
    'KZ',
    'LA',
    'LACAIXA',
    'LAMBORGHINI',
    'LAMER',
    'LANCASTER',
    'LANCIA',
    'LAND',
    'LANDROVER',
    'LANXESS',
    'LASALLE',
    'LAT',
    'LATINO',
    'LATROBE',
    'LAW',
    'LAWYER',
    'LB',
    'LC',
    'LDS',
    'LEASE',
    'LECLERC',
    'LEFRAK',
    'LEGAL',
    'LEGO',
    'LEXUS',
    'LGBT',
    'LI',
    'LIDL',
    'LIFE',
    'LIFEINSURANCE',
    'LIFESTYLE',
    'LIGHTING',
    'LIKE',
    'LILLY',
    'LIMITED',
    'LIMO',
    'LINCOLN',
    'LINDE',
    'LINK',
    'LIPSY',
    'LIVE',
    'LIVING',
    'LIXIL',
    'LK',
    'LLC',
    'LLP',
    'LOAN',
    'LOANS',
    'LOCKER',
    'LOCUS',
    'LOFT',
    'LOL',
    'LONDON',
    'LOTTE',
    'LOTTO',
    'LOVE',
    'LPL',
    'LPLFINANCIAL',
    'LR',
    'LS',
    'LT',
    'LTD',
    'LTDA',
    'LU',
    'LUNDBECK',
    'LUXE',
    'LUXURY',
    'LV',
    'LY',
    'MA',
    'MACYS',
    'MADRID',
    'MAIF',
    'MAISON',
    'MAKEUP',
    'MAN',
    'MANAGEMENT',
    'MANGO',
    'MAP',
    'MARKET',
    'MARKETING',
    'MARKETS',
    'MARRIOTT',
    'MARSHALLS',
    'MASERATI',
    'MATTEL',
    'MBA',
    'MC',
    'MCKINSEY',
    'MD',
    'ME',
    'MED',
    'MEDIA',
    'MEET',
    'MELBOURNE',
    'MEME',
    'MEMORIAL',
    'MEN',
    'MENU',
    'MERCKMSD',
    'MG',
    'MH',
    'MIAMI',
    'MICROSOFT',
    'MIL',
    'MINI',
    'MINT',
    'MIT',
    'MITSUBISHI',
    'MK',
    'ML',
    'MLB',
    'MLS',
    'MM',
    'MMA',
    'MN',
    'MO',
    'MOBI',
    'MOBILE',
    'MODA',
    'MOE',
    'MOI',
    'MOM',
    'MONASH',
    'MONEY',
    'MONSTER',
    'MORMON',
    'MORTGAGE',
    'MOSCOW',
    'MOTO',
    'MOTORCYCLES',
    'MOV',
    'MOVIE',
    'MP',
    'MQ',
    'MR',
    'MS',
    'MSD',
    'MT',
    'MTN',
    'MTR',
    'MU',
    'MUSEUM',
    'MUTUAL',
    'MV',
    'MW',
    'MX',
    'MY',
    'MZ',
    'NA',
    'NAB',
    'NAGOYA',
    'NAME',
    'NATIONWIDE',
    'NATURA',
    'NAVY',
    'NBA',
    'NC',
    'NE',
    'NEC',
    'NET',
    'NETBANK',
    'NETFLIX',
    'NETWORK',
    'NEUSTAR',
    'NEW',
    'NEWHOLLAND',
    'NEWS',
    'NEXT',
    'NEXTDIRECT',
    'NEXUS',
    'NF',
    'NFL',
    'NG',
    'NGO',
    'NHK',
    'NI',
    'NICO',
    'NIKE',
    'NIKON',
    'NINJA',
    'NISSAN',
    'NISSAY',
    'NL',
    'NO',
    'NOKIA',
    'NORTHWESTERNMUTUAL',
    'NORTON',
    'NOW',
    'NOWRUZ',
    'NOWTV',
    'NP',
    'NR',
    'NRA',
    'NRW',
    'NTT',
    'NU',
    'NYC',
    'NZ',
    'OBI',
    'OBSERVER',
    'OFF',
    'OFFICE',
    'OKINAWA',
    'OLAYAN',
    'OLAYANGROUP',
    'OLDNAVY',
    'OLLO',
    'OM',
    'OMEGA',
    'ONE',
    'ONG',
    'ONL',
    'ONLINE',
    'ONYOURSIDE',
    'OOO',
    'OPEN',
    'ORACLE',
    'ORANGE',
    'ORG',
    'ORGANIC',
    'ORIGINS',
    'OSAKA',
    'OTSUKA',
    'OTT',
    'OVH',
    'PA',
    'PAGE',
    'PANASONIC',
    'PARIS',
    'PARS',
    'PARTNERS',
    'PARTS',
    'PARTY',
    'PASSAGENS',
    'PAY',
    'PCCW',
    'PE',
    'PET',
    'PF',
    'PFIZER',
    'PG',
    'PH',
    'PHARMACY',
    'PHD',
    'PHILIPS',
    'PHONE',
    'PHOTO',
    'PHOTOGRAPHY',
    'PHOTOS',
    'PHYSIO',
    'PICS',
    'PICTET',
    'PICTURES',
    'PID',
    'PIN',
    'PING',
    'PINK',
    'PIONEER',
    'PIZZA',
    'PK',
    'PL',
    'PLACE',
    'PLAY',
    'PLAYSTATION',
    'PLUMBING',
    'PLUS',
    'PM',
    'PN',
    'PNC',
    'POHL',
    'POKER',
    'POLITIE',
    'PORN',
    'POST',
    'PR',
    'PRAMERICA',
    'PRAXI',
    'PRESS',
    'PRIME',
    'PRO',
    'PROD',
    'PRODUCTIONS',
    'PROF',
    'PROGRESSIVE',
    'PROMO',
    'PROPERTIES',
    'PROPERTY',
    'PROTECTION',
    'PRU',
    'PRUDENTIAL',
    'PS',
    'PT',
    'PUB',
    'PW',
    'PWC',
    'PY',
    'QA',
    'QPON',
    'QUEBEC',
    'QUEST',
    'QVC',
    'RACING',
    'RADIO',
    'RAID',
    'RE',
    'READ',
    'REALESTATE',
    'REALTOR',
    'REALTY',
    'RECIPES',
    'RED',
    'REDSTONE',
    'REDUMBRELLA',
    'REHAB',
    'REISE',
    'REISEN',
    'REIT',
    'RELIANCE',
    'REN',
    'RENT',
    'RENTALS',
    'REPAIR',
    'REPORT',
    'REPUBLICAN',
    'REST',
    'RESTAURANT',
    'REVIEW',
    'REVIEWS',
    'REXROTH',
    'RICH',
    'RICHARDLI',
    'RICOH',
    'RIL',
    'RIO',
    'RIP',
    'RMIT',
    'RO',
    'ROCHER',
    'ROCKS',
    'RODEO',
    'ROGERS',
    'ROOM',
    'RS',
    'RSVP',
    'RU',
    'RUGBY',
    'RUHR',
    'RUN',
    'RW',
    'RWE',
    'RYUKYU',
    'SA',
    'SAARLAND',
    'SAFE',
    'SAFETY',
    'SAKURA',
    'SALE',
    'SALON',
    'SAMSCLUB',
    'SAMSUNG',
    'SANDVIK',
    'SANDVIKCOROMANT',
    'SANOFI',
    'SAP',
    'SARL',
    'SAS',
    'SAVE',
    'SAXO',
    'SB',
    'SBI',
    'SBS',
    'SC',
    'SCA',
    'SCB',
    'SCHAEFFLER',
    'SCHMIDT',
    'SCHOLARSHIPS',
    'SCHOOL',
    'SCHULE',
    'SCHWARZ',
    'SCIENCE',
    'SCJOHNSON',
    'SCOT',
    'SD',
    'SE',
    'SEARCH',
    'SEAT',
    'SECURE',
    'SECURITY',
    'SEEK',
    'SELECT',
    'SENER',
    'SERVICES',
    'SES',
    'SEVEN',
    'SEW',
    'SEX',
    'SEXY',
    'SFR',
    'SG',
    'SH',
    'SHANGRILA',
    'SHARP',
    'SHAW',
    'SHELL',
    'SHIA',
    'SHIKSHA',
    'SHOES',
    'SHOP',
    'SHOPPING',
    'SHOUJI',
    'SHOW',
    'SHOWTIME',
    'SI',
    'SILK',
    'SINA',
    'SINGLES',
    'SITE',
    'SJ',
    'SK',
    'SKI',
    'SKIN',
    'SKY',
    'SKYPE',
    'SL',
    'SLING',
    'SM',
    'SMART',
    'SMILE',
    'SN',
    'SNCF',
    'SO',
    'SOCCER',
    'SOCIAL',
    'SOFTBANK',
    'SOFTWARE',
    'SOHU',
    'SOLAR',
    'SOLUTIONS',
    'SONG',
    'SONY',
    'SOY',
    'SPA',
    'SPACE',
    'SPORT',
    'SPOT',
    'SPREADBETTING',
    'SR',
    'SRL',
    'SS',
    'ST',
    'STADA',
    'STAPLES',
    'STAR',
    'STATEBANK',
    'STATEFARM',
    'STC',
    'STCGROUP',
    'STOCKHOLM',
    'STORAGE',
    'STORE',
    'STREAM',
    'STUDIO',
    'STUDY',
    'STYLE',
    'SU',
    'SUCKS',
    'SUPPLIES',
    'SUPPLY',
    'SUPPORT',
    'SURF',
    'SURGERY',
    'SUZUKI',
    'SV',
    'SWATCH',
    'SWIFTCOVER',
    'SWISS',
    'SX',
    'SY',
    'SYDNEY',
    'SYSTEMS',
    'SZ',
    'TAB',
    'TAIPEI',
    'TALK',
    'TAOBAO',
    'TARGET',
    'TATAMOTORS',
    'TATAR',
    'TATTOO',
    'TAX',
    'TAXI',
    'TC',
    'TCI',
    'TD',
    'TDK',
    'TEAM',
    'TECH',
    'TECHNOLOGY',
    'TEL',
    'TEMASEK',
    'TENNIS',
    'TEVA',
    'TF',
    'TG',
    'TH',
    'THD',
    'THEATER',
    'THEATRE',
    'TIAA',
    'TICKETS',
    'TIENDA',
    'TIFFANY',
    'TIPS',
    'TIRES',
    'TIROL',
    'TJ',
    'TJMAXX',
    'TJX',
    'TK',
    'TKMAXX',
    'TL',
    'TM',
    'TMALL',
    'TN',
    'TO',
    'TODAY',
    'TOKYO',
    'TOOLS',
    'TOP',
    'TORAY',
    'TOSHIBA',
    'TOTAL',
    'TOURS',
    'TOWN',
    'TOYOTA',
    'TOYS',
    'TR',
    'TRADE',
    'TRADING',
    'TRAINING',
    'TRAVEL',
    'TRAVELCHANNEL',
    'TRAVELERS',
    'TRAVELERSINSURANCE',
    'TRUST',
    'TRV',
    'TT',
    'TUBE',
    'TUI',
    'TUNES',
    'TUSHU',
    'TV',
    'TVS',
    'TW',
    'TZ',
    'UA',
    'UBANK',
    'UBS',
    'UG',
    'UK',
    'UNICOM',
    'UNIVERSITY',
    'UNO',
    'UOL',
    'UPS',
    'US',
    'UY',
    'UZ',
    'VA',
    'VACATIONS',
    'VANA',
    'VANGUARD',
    'VC',
    'VE',
    'VEGAS',
    'VENTURES',
    'VERISIGN',
    'VERSICHERUNG',
    'VET',
    'VG',
    'VI',
    'VIAJES',
    'VIDEO',
    'VIG',
    'VIKING',
    'VILLAS',
    'VIN',
    'VIP',
    'VIRGIN',
    'VISA',
    'VISION',
    'VIVA',
    'VIVO',
    'VLAANDEREN',
    'VN',
    'VODKA',
    'VOLKSWAGEN',
    'VOLVO',
    'VOTE',
    'VOTING',
    'VOTO',
    'VOYAGE',
    'VU',
    'VUELOS',
    'WALES',
    'WALMART',
    'WALTER',
    'WANG',
    'WANGGOU',
    'WATCH',
    'WATCHES',
    'WEATHER',
    'WEATHERCHANNEL',
    'WEBCAM',
    'WEBER',
    'WEBSITE',
    'WED',
    'WEDDING',
    'WEIBO',
    'WEIR',
    'WF',
    'WHOSWHO',
    'WIEN',
    'WIKI',
    'WILLIAMHILL',
    'WIN',
    'WINDOWS',
    'WINE',
    'WINNERS',
    'WME',
    'WOLTERSKLUWER',
    'WOODSIDE',
    'WORK',
    'WORKS',
    'WORLD',
    'WOW',
    'WS',
    'WTC',
    'WTF',
    'XBOX',
    'XEROX',
    'XFINITY',
    'XIHUAN',
    'XIN',
    'XN--11B4C3D',
    'XN--1CK2E1B',
    'XN--1QQW23A',
    'XN--2SCRJ9C',
    'XN--30RR7Y',
    'XN--3BST00M',
    'XN--3DS443G',
    'XN--3E0B707E',
    'XN--3HCRJ9C',
    'XN--3OQ18VL8PN36A',
    'XN--3PXU8K',
    'XN--42C2D9A',
    'XN--45BR5CYL',
    'XN--45BRJ9C',
    'XN--45Q11C',
    'XN--4GBRIM',
    'XN--54B7FTA0CC',
    'XN--55QW42G',
    'XN--55QX5D',
    'XN--5SU34J936BGSG',
    'XN--5TZM5G',
    'XN--6FRZ82G',
    'XN--6QQ986B3XL',
    'XN--80ADXHKS',
    'XN--80AO21A',
    'XN--80AQECDR1A',
    'XN--80ASEHDB',
    'XN--80ASWG',
    'XN--8Y0A063A',
    'XN--90A3AC',
    'XN--90AE',
    'XN--90AIS',
    'XN--9DBQ2A',
    'XN--9ET52U',
    'XN--9KRT00A',
    'XN--B4W605FERD',
    'XN--BCK1B9A5DRE4C',
    'XN--C1AVG',
    'XN--C2BR7G',
    'XN--CCK2B3B',
    'XN--CCKWCXETD',
    'XN--CG4BKI',
    'XN--CLCHC0EA0B2G2A9GCD',
    'XN--CZR694B',
    'XN--CZRS0T',
    'XN--CZRU2D',
    'XN--D1ACJ3B',
    'XN--D1ALF',
    'XN--E1A4C',
    'XN--ECKVDTC9D',
    'XN--EFVY88H',
    'XN--FCT429K',
    'XN--FHBEI',
    'XN--FIQ228C5HS',
    'XN--FIQ64B',
    'XN--FIQS8S',
    'XN--FIQZ9S',
    'XN--FJQ720A',
    'XN--FLW351E',
    'XN--FPCRJ9C3D',
    'XN--FZC2C9E2C',
    'XN--FZYS8D69UVGM',
    'XN--G2XX48C',
    'XN--GCKR3F0F',
    'XN--GECRJ9C',
    'XN--GK3AT1E',
    'XN--H2BREG3EVE',
    'XN--H2BRJ9C',
    'XN--H2BRJ9C8C',
    'XN--HXT814E',
    'XN--I1B6B1A6A2E',
    'XN--IMR513N',
    'XN--IO0A7I',
    'XN--J1AEF',
    'XN--J1AMH',
    'XN--J6W193G',
    'XN--JLQ480N2RG',
    'XN--JLQ61U9W7B',
    'XN--JVR189M',
    'XN--KCRX77D1X4A',
    'XN--KPRW13D',
    'XN--KPRY57D',
    'XN--KPUT3I',
    'XN--L1ACC',
    'XN--LGBBAT1AD8J',
    'XN--MGB9AWBF',
    'XN--MGBA3A3EJT',
    'XN--MGBA3A4F16A',
    'XN--MGBA7C0BBN0A',
    'XN--MGBAAKC7DVF',
    'XN--MGBAAM7A8H',
    'XN--MGBAB2BD',
    'XN--MGBAH1A3HJKRD',
    'XN--MGBAI9AZGQP6J',
    'XN--MGBAYH7GPA',
    'XN--MGBBH1A',
    'XN--MGBBH1A71E',
    'XN--MGBC0A9AZCG',
    'XN--MGBCA7DZDO',
    'XN--MGBCPQ6GPA1A',
    'XN--MGBERP4A5D4AR',
    'XN--MGBGU82A',
    'XN--MGBI4ECEXP',
    'XN--MGBPL2FH',
    'XN--MGBT3DHD',
    'XN--MGBTX2B',
    'XN--MGBX4CD0AB',
    'XN--MIX891F',
    'XN--MK1BU44C',
    'XN--MXTQ1M',
    'XN--NGBC5AZD',
    'XN--NGBE9E0A',
    'XN--NGBRX',
    'XN--NODE',
    'XN--NQV7F',
    'XN--NQV7FS00EMA',
    'XN--NYQY26A',
    'XN--O3CW4H',
    'XN--OGBPF8FL',
    'XN--OTU796D',
    'XN--P1ACF',
    'XN--P1AI',
    'XN--PGBS0DH',
    'XN--PSSY2U',
    'XN--Q7CE6A',
    'XN--Q9JYB4C',
    'XN--QCKA1PMC',
    'XN--QXA6A',
    'XN--QXAM',
    'XN--RHQV96G',
    'XN--ROVU88B',
    'XN--RVC1E0AM3E',
    'XN--S9BRJ9C',
    'XN--SES554G',
    'XN--T60B56A',
    'XN--TCKWE',
    'XN--TIQ49XQYJ',
    'XN--UNUP4Y',
    'XN--VERMGENSBERATER-CTB',
    'XN--VERMGENSBERATUNG-PWB',
    'XN--VHQUV',
    'XN--VUQ861B',
    'XN--W4R85EL8FHU5DNRA',
    'XN--W4RS40L',
    'XN--WGBH1C',
    'XN--WGBL6A',
    'XN--XHQ521B',
    'XN--XKC2AL3HYE2A',
    'XN--XKC2DL3A5EE0H',
    'XN--Y9A3AQ',
    'XN--YFRO4I67O',
    'XN--YGBI2AMMX',
    'XN--ZFR164B',
    'XXX',
    'XYZ',
    'YACHTS',
    'YAHOO',
    'YAMAXUN',
    'YANDEX',
    'YE',
    'YODOBASHI',
    'YOGA',
    'YOKOHAMA',
    'YOU',
    'YOUTUBE',
    'YT',
    'YUN',
    'ZA',
    'ZAPPOS',
    'ZARA',
    'ZERO',
    'ZIP',
    'ZM',
    'ZONE',
    'ZUERICH',
    'ZW'
];


// Keep as upper-case to make updating from source easier

module.exports = new Set(internals.tlds.map((tld) => tld.toLowerCase()));


/***/ }),

/***/ 4983:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);
const EscapeRegex = __nccwpck_require__(1965);


const internals = {};


internals.generate = function () {

    const rfc3986 = {};

    const hexDigit = '\\dA-Fa-f';                                               // HEXDIG = DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
    const hexDigitOnly = '[' + hexDigit + ']';

    const unreserved = '\\w-\\.~';                                              // unreserved = ALPHA / DIGIT / "-" / "." / "_" / "~"
    const subDelims = '!\\$&\'\\(\\)\\*\\+,;=';                                 // sub-delims = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
    const pctEncoded = '%' + hexDigit;                                          // pct-encoded = "%" HEXDIG HEXDIG
    const pchar = unreserved + pctEncoded + subDelims + ':@';                   // pchar = unreserved / pct-encoded / sub-delims / ":" / "@"
    const pcharOnly = '[' + pchar + ']';
    const decOctect = '(?:0{0,2}\\d|0?[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])';     // dec-octet = DIGIT / %x31-39 DIGIT / "1" 2DIGIT / "2" %x30-34 DIGIT / "25" %x30-35  ; 0-9 / 10-99 / 100-199 / 200-249 / 250-255

    rfc3986.ipv4address = '(?:' + decOctect + '\\.){3}' + decOctect;            // IPv4address = dec-octet "." dec-octet "." dec-octet "." dec-octet

    /*
        h16 = 1*4HEXDIG ; 16 bits of address represented in hexadecimal
        ls32 = ( h16 ":" h16 ) / IPv4address ; least-significant 32 bits of address
        IPv6address =                            6( h16 ":" ) ls32
                    /                       "::" 5( h16 ":" ) ls32
                    / [               h16 ] "::" 4( h16 ":" ) ls32
                    / [ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
                    / [ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
                    / [ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
                    / [ *4( h16 ":" ) h16 ] "::"              ls32
                    / [ *5( h16 ":" ) h16 ] "::"              h16
                    / [ *6( h16 ":" ) h16 ] "::"
    */

    const h16 = hexDigitOnly + '{1,4}';
    const ls32 = '(?:' + h16 + ':' + h16 + '|' + rfc3986.ipv4address + ')';
    const IPv6SixHex = '(?:' + h16 + ':){6}' + ls32;
    const IPv6FiveHex = '::(?:' + h16 + ':){5}' + ls32;
    const IPv6FourHex = '(?:' + h16 + ')?::(?:' + h16 + ':){4}' + ls32;
    const IPv6ThreeHex = '(?:(?:' + h16 + ':){0,1}' + h16 + ')?::(?:' + h16 + ':){3}' + ls32;
    const IPv6TwoHex = '(?:(?:' + h16 + ':){0,2}' + h16 + ')?::(?:' + h16 + ':){2}' + ls32;
    const IPv6OneHex = '(?:(?:' + h16 + ':){0,3}' + h16 + ')?::' + h16 + ':' + ls32;
    const IPv6NoneHex = '(?:(?:' + h16 + ':){0,4}' + h16 + ')?::' + ls32;
    const IPv6NoneHex2 = '(?:(?:' + h16 + ':){0,5}' + h16 + ')?::' + h16;
    const IPv6NoneHex3 = '(?:(?:' + h16 + ':){0,6}' + h16 + ')?::';

    rfc3986.ipv4Cidr = '(?:\\d|[1-2]\\d|3[0-2])';                                           // IPv4 cidr = DIGIT / %x31-32 DIGIT / "3" %x30-32  ; 0-9 / 10-29 / 30-32
    rfc3986.ipv6Cidr = '(?:0{0,2}\\d|0?[1-9]\\d|1[01]\\d|12[0-8])';                         // IPv6 cidr = DIGIT / %x31-39 DIGIT / "1" %x0-1 DIGIT / "12" %x0-8;   0-9 / 10-99 / 100-119 / 120-128
    rfc3986.ipv6address = '(?:' + IPv6SixHex + '|' + IPv6FiveHex + '|' + IPv6FourHex + '|' + IPv6ThreeHex + '|' + IPv6TwoHex + '|' + IPv6OneHex + '|' + IPv6NoneHex + '|' + IPv6NoneHex2 + '|' + IPv6NoneHex3 + ')';
    rfc3986.ipvFuture = 'v' + hexDigitOnly + '+\\.[' + unreserved + subDelims + ':]+';      // IPvFuture = "v" 1*HEXDIG "." 1*( unreserved / sub-delims / ":" )

    rfc3986.scheme = '[a-zA-Z][a-zA-Z\\d+-\\.]*';                                           // scheme = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
    rfc3986.schemeRegex = new RegExp(rfc3986.scheme);

    const userinfo = '[' + unreserved + pctEncoded + subDelims + ':]*';                     // userinfo = *( unreserved / pct-encoded / sub-delims / ":" )
    const IPLiteral = '\\[(?:' + rfc3986.ipv6address + '|' + rfc3986.ipvFuture + ')\\]';    // IP-literal = "[" ( IPv6address / IPvFuture  ) "]"
    const regName = '[' + unreserved + pctEncoded + subDelims + ']{1,255}';                 // reg-name = *( unreserved / pct-encoded / sub-delims )
    const host = '(?:' + IPLiteral + '|' + rfc3986.ipv4address + '|' + regName + ')';       // host = IP-literal / IPv4address / reg-name
    const port = '\\d*';                                                                    // port = *DIGIT
    const authority = '(?:' + userinfo + '@)?' + host + '(?::' + port + ')?';               // authority   = [ userinfo "@" ] host [ ":" port ]
    const authorityCapture = '(?:' + userinfo + '@)?(' + host + ')(?::' + port + ')?';

    /*
        segment       = *pchar
        segment-nz    = 1*pchar
        path          = path-abempty    ; begins with "/" '|' is empty
                    / path-absolute   ; begins with "/" but not "//"
                    / path-noscheme   ; begins with a non-colon segment
                    / path-rootless   ; begins with a segment
                    / path-empty      ; zero characters
        path-abempty  = *( "/" segment )
        path-absolute = "/" [ segment-nz *( "/" segment ) ]
        path-rootless = segment-nz *( "/" segment )
    */

    const segment = pcharOnly + '*';
    const segmentNz = pcharOnly + '+';
    const segmentNzNc = '[' + unreserved + pctEncoded + subDelims + '@' + ']+';
    const pathEmpty = '';
    const pathAbEmpty = '(?:\\/' + segment + ')*';
    const pathAbsolute = '\\/(?:' + segmentNz + pathAbEmpty + ')?';
    const pathRootless = segmentNz + pathAbEmpty;
    const pathNoScheme = segmentNzNc + pathAbEmpty;
    const pathAbNoAuthority = '(?:\\/\\/\\/' + segment + pathAbEmpty + ')';     // Used by file:///

    // hier-part = "//" authority path

    rfc3986.hierPart = '(?:' + '(?:\\/\\/' + authority + pathAbEmpty + ')' + '|' + pathAbsolute + '|' + pathRootless + '|' + pathAbNoAuthority + ')';
    rfc3986.hierPartCapture = '(?:' + '(?:\\/\\/' + authorityCapture + pathAbEmpty + ')' + '|' + pathAbsolute + '|' + pathRootless + ')';

    // relative-part = "//" authority path-abempty / path-absolute / path-noscheme / path-empty

    rfc3986.relativeRef = '(?:' + '(?:\\/\\/' + authority + pathAbEmpty + ')' + '|' + pathAbsolute + '|' + pathNoScheme + '|' + pathEmpty + ')';
    rfc3986.relativeRefCapture = '(?:' + '(?:\\/\\/' + authorityCapture + pathAbEmpty + ')' + '|' + pathAbsolute + '|' + pathNoScheme + '|' + pathEmpty + ')';

    // query = *( pchar / "/" / "?" )
    // query = *( pchar / "[" / "]" / "/" / "?" )

    rfc3986.query = '[' + pchar + '\\/\\?]*(?=#|$)';                            //Finish matching either at the fragment part '|' end of the line.
    rfc3986.queryWithSquareBrackets = '[' + pchar + '\\[\\]\\/\\?]*(?=#|$)';

    // fragment = *( pchar / "/" / "?" )

    rfc3986.fragment = '[' + pchar + '\\/\\?]*';

    return rfc3986;
};

internals.rfc3986 = internals.generate();


exports.ip = {
    v4Cidr: internals.rfc3986.ipv4Cidr,
    v6Cidr: internals.rfc3986.ipv6Cidr,
    ipv4: internals.rfc3986.ipv4address,
    ipv6: internals.rfc3986.ipv6address,
    ipvfuture: internals.rfc3986.ipvFuture
};


internals.createRegex = function (options) {

    const rfc = internals.rfc3986;

    // Construct expression

    const query = options.allowQuerySquareBrackets ? rfc.queryWithSquareBrackets : rfc.query;
    const suffix = '(?:\\?' + query + ')?' + '(?:#' + rfc.fragment + ')?';

    // relative-ref = relative-part [ "?" query ] [ "#" fragment ]

    const relative = options.domain ? rfc.relativeRefCapture : rfc.relativeRef;

    if (options.relativeOnly) {
        return internals.wrap(relative + suffix);
    }

    // Custom schemes

    let customScheme = '';
    if (options.scheme) {
        Assert(options.scheme instanceof RegExp || typeof options.scheme === 'string' || Array.isArray(options.scheme), 'scheme must be a RegExp, String, or Array');

        const schemes = [].concat(options.scheme);
        Assert(schemes.length >= 1, 'scheme must have at least 1 scheme specified');

        // Flatten the array into a string to be used to match the schemes

        const selections = [];
        for (let i = 0; i < schemes.length; ++i) {
            const scheme = schemes[i];
            Assert(scheme instanceof RegExp || typeof scheme === 'string', 'scheme at position ' + i + ' must be a RegExp or String');

            if (scheme instanceof RegExp) {
                selections.push(scheme.source.toString());
            }
            else {
                Assert(rfc.schemeRegex.test(scheme), 'scheme at position ' + i + ' must be a valid scheme');
                selections.push(EscapeRegex(scheme));
            }
        }

        customScheme = selections.join('|');
    }

    // URI = scheme ":" hier-part [ "?" query ] [ "#" fragment ]

    const scheme = customScheme ? '(?:' + customScheme + ')' : rfc.scheme;
    const absolute = '(?:' + scheme + ':' + (options.domain ? rfc.hierPartCapture : rfc.hierPart) + ')';
    const prefix = options.allowRelative ? '(?:' + absolute + '|' + relative + ')' : absolute;
    return internals.wrap(prefix + suffix, customScheme);
};


internals.wrap = function (raw, scheme) {

    raw = `(?=.)(?!https?\:/$)${raw}`;              // Require at least one character and explicitly forbid 'http:/'

    return {
        raw,
        regex: new RegExp(`^${raw}$`),
        scheme
    };
};


internals.uriRegex = internals.createRegex({});


exports.regex = function (options = {}) {

    if (options.scheme ||
        options.allowRelative ||
        options.relativeOnly ||
        options.allowQuerySquareBrackets ||
        options.domain) {

        return internals.createRegex(options);
    }

    return internals.uriRegex;
};


/***/ }),

/***/ 4379:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


const internals = {
    operators: ['!', '^', '*', '/', '%', '+', '-', '<', '<=', '>', '>=', '==', '!=', '&&', '||', '??'],
    operatorCharacters: ['!', '^', '*', '/', '%', '+', '-', '<', '=', '>', '&', '|', '?'],
    operatorsOrder: [['^'], ['*', '/', '%'], ['+', '-'], ['<', '<=', '>', '>='], ['==', '!='], ['&&'], ['||', '??']],
    operatorsPrefix: ['!', 'n'],

    literals: {
        '"': '"',
        '`': '`',
        '\'': '\'',
        '[': ']'
    },

    numberRx: /^(?:[0-9]*(\.[0-9]*)?){1}$/,
    tokenRx: /^[\w\$\#\.\@\:\{\}]+$/,

    symbol: Symbol('formula'),
    settings: Symbol('settings')
};


exports.Parser = class {

    constructor(string, options = {}) {

        if (!options[internals.settings] &&
            options.constants) {

            for (const constant in options.constants) {
                const value = options.constants[constant];
                if (value !== null &&
                    !['boolean', 'number', 'string'].includes(typeof value)) {

                    throw new Error(`Formula constant ${constant} contains invalid ${typeof value} value type`);
                }
            }
        }

        this.settings = options[internals.settings] ? options : Object.assign({ [internals.settings]: true, constants: {}, functions: {} }, options);
        this.single = null;

        this._parts = null;
        this._parse(string);
    }

    _parse(string) {

        let parts = [];
        let current = '';
        let parenthesis = 0;
        let literal = false;

        const flush = (inner) => {

            if (parenthesis) {
                throw new Error('Formula missing closing parenthesis');
            }

            const last = parts.length ? parts[parts.length - 1] : null;

            if (!literal &&
                !current &&
                !inner) {

                return;
            }

            if (last &&
                last.type === 'reference' &&
                inner === ')') {                                                                // Function

                last.type = 'function';
                last.value = this._subFormula(current, last.value);
                current = '';
                return;
            }

            if (inner === ')') {                                                                // Segment
                const sub = new exports.Parser(current, this.settings);
                parts.push({ type: 'segment', value: sub });
            }
            else if (literal) {
                if (literal === ']') {                                                          // Reference
                    parts.push({ type: 'reference', value: current });
                    current = '';
                    return;
                }

                parts.push({ type: 'literal', value: current });                                // Literal
            }
            else if (internals.operatorCharacters.includes(current)) {                          // Operator
                if (last &&
                    last.type === 'operator' &&
                    internals.operators.includes(last.value + current)) {                       // 2 characters operator

                    last.value += current;
                }
                else {
                    parts.push({ type: 'operator', value: current });
                }
            }
            else if (current.match(internals.numberRx)) {                                       // Number
                parts.push({ type: 'constant', value: parseFloat(current) });
            }
            else if (this.settings.constants[current] !== undefined) {                          // Constant
                parts.push({ type: 'constant', value: this.settings.constants[current] });
            }
            else {                                                                              // Reference
                if (!current.match(internals.tokenRx)) {
                    throw new Error(`Formula contains invalid token: ${current}`);
                }

                parts.push({ type: 'reference', value: current });
            }

            current = '';
        };

        for (const c of string) {
            if (literal) {
                if (c === literal) {
                    flush();
                    literal = false;
                }
                else {
                    current += c;
                }
            }
            else if (parenthesis) {
                if (c === '(') {
                    current += c;
                    ++parenthesis;
                }
                else if (c === ')') {
                    --parenthesis;
                    if (!parenthesis) {
                        flush(c);
                    }
                    else {
                        current += c;
                    }
                }
                else {
                    current += c;
                }
            }
            else if (c in internals.literals) {
                literal = internals.literals[c];
            }
            else if (c === '(') {
                flush();
                ++parenthesis;
            }
            else if (internals.operatorCharacters.includes(c)) {
                flush();
                current = c;
                flush();
            }
            else if (c !== ' ') {
                current += c;
            }
            else {
                flush();
            }
        }

        flush();

        // Replace prefix - to internal negative operator

        parts = parts.map((part, i) => {

            if (part.type !== 'operator' ||
                part.value !== '-' ||
                i && parts[i - 1].type !== 'operator') {

                return part;
            }

            return { type: 'operator', value: 'n' };
        });

        // Validate tokens order

        let operator = false;
        for (const part of parts) {
            if (part.type === 'operator') {
                if (internals.operatorsPrefix.includes(part.value)) {
                    continue;
                }

                if (!operator) {
                    throw new Error('Formula contains an operator in invalid position');
                }

                if (!internals.operators.includes(part.value)) {
                    throw new Error(`Formula contains an unknown operator ${part.value}`);
                }
            }
            else if (operator) {
                throw new Error('Formula missing expected operator');
            }

            operator = !operator;
        }

        if (!operator) {
            throw new Error('Formula contains invalid trailing operator');
        }

        // Identify single part

        if (parts.length === 1 &&
            ['reference', 'literal', 'constant'].includes(parts[0].type)) {

            this.single = { type: parts[0].type === 'reference' ? 'reference' : 'value', value: parts[0].value };
        }

        // Process parts

        this._parts = parts.map((part) => {

            // Operators

            if (part.type === 'operator') {
                return internals.operatorsPrefix.includes(part.value) ? part : part.value;
            }

            // Literals, constants, segments

            if (part.type !== 'reference') {
                return part.value;
            }

            // References

            if (this.settings.tokenRx &&
                !this.settings.tokenRx.test(part.value)) {

                throw new Error(`Formula contains invalid reference ${part.value}`);
            }

            if (this.settings.reference) {
                return this.settings.reference(part.value);
            }

            return internals.reference(part.value);
        });
    }

    _subFormula(string, name) {

        const method = this.settings.functions[name];
        if (typeof method !== 'function') {
            throw new Error(`Formula contains unknown function ${name}`);
        }

        let args = [];
        if (string) {
            let current = '';
            let parenthesis = 0;
            let literal = false;

            const flush = () => {

                if (!current) {
                    throw new Error(`Formula contains function ${name} with invalid arguments ${string}`);
                }

                args.push(current);
                current = '';
            };

            for (let i = 0; i < string.length; ++i) {
                const c = string[i];
                if (literal) {
                    current += c;
                    if (c === literal) {
                        literal = false;
                    }
                }
                else if (c in internals.literals &&
                    !parenthesis) {

                    current += c;
                    literal = internals.literals[c];
                }
                else if (c === ',' &&
                    !parenthesis) {

                    flush();
                }
                else {
                    current += c;
                    if (c === '(') {
                        ++parenthesis;
                    }
                    else if (c === ')') {
                        --parenthesis;
                    }
                }
            }

            flush();
        }

        args = args.map((arg) => new exports.Parser(arg, this.settings));

        return function (context) {

            const innerValues = [];
            for (const arg of args) {
                innerValues.push(arg.evaluate(context));
            }

            return method.call(context, ...innerValues);
        };
    }

    evaluate(context) {

        const parts = this._parts.slice();

        // Prefix operators

        for (let i = parts.length - 2; i >= 0; --i) {
            const part = parts[i];
            if (part &&
                part.type === 'operator') {

                const current = parts[i + 1];
                parts.splice(i + 1, 1);
                const value = internals.evaluate(current, context);
                parts[i] = internals.single(part.value, value);
            }
        }

        // Left-right operators

        internals.operatorsOrder.forEach((set) => {

            for (let i = 1; i < parts.length - 1;) {
                if (set.includes(parts[i])) {
                    const operator = parts[i];
                    const left = internals.evaluate(parts[i - 1], context);
                    const right = internals.evaluate(parts[i + 1], context);

                    parts.splice(i, 2);
                    const result = internals.calculate(operator, left, right);
                    parts[i - 1] = result === 0 ? 0 : result;                               // Convert -0
                }
                else {
                    i += 2;
                }
            }
        });

        return internals.evaluate(parts[0], context);
    }
};


exports.Parser.prototype[internals.symbol] = true;


internals.reference = function (name) {

    return function (context) {

        return context && context[name] !== undefined ? context[name] : null;
    };
};


internals.evaluate = function (part, context) {

    if (part === null) {
        return null;
    }

    if (typeof part === 'function') {
        return part(context);
    }

    if (part[internals.symbol]) {
        return part.evaluate(context);
    }

    return part;
};


internals.single = function (operator, value) {

    if (operator === '!') {
        return value ? false : true;
    }

    // operator === 'n'

    const negative = -value;
    if (negative === 0) {       // Override -0
        return 0;
    }

    return negative;
};


internals.calculate = function (operator, left, right) {

    if (operator === '??') {
        return internals.exists(left) ? left : right;
    }

    if (typeof left === 'string' ||
        typeof right === 'string') {

        if (operator === '+') {
            left = internals.exists(left) ? left : '';
            right = internals.exists(right) ? right : '';
            return left + right;
        }
    }
    else {
        switch (operator) {
            case '^': return Math.pow(left, right);
            case '*': return left * right;
            case '/': return left / right;
            case '%': return left % right;
            case '+': return left + right;
            case '-': return left - right;
        }
    }

    switch (operator) {
        case '<': return left < right;
        case '<=': return left <= right;
        case '>': return left > right;
        case '>=': return left >= right;
        case '==': return left === right;
        case '!=': return left !== right;
        case '&&': return left && right;
        case '||': return left || right;
    }

    return null;
};


internals.exists = function (value) {

    return value !== null && value !== undefined;
};


/***/ }),

/***/ 5604:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


const internals = {};


exports.location = function (depth = 0) {

    const orig = Error.prepareStackTrace;
    Error.prepareStackTrace = (ignore, stack) => stack;

    const capture = {};
    Error.captureStackTrace(capture, this);
    const line = capture.stack[depth + 1];

    Error.prepareStackTrace = orig;

    return {
        filename: line.getFileName(),
        line: line.getLineNumber()
    };
};


/***/ }),

/***/ 3638:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.camelCase = exports.camelCaseTransformMerge = exports.camelCaseTransform = void 0;
var tslib_1 = __nccwpck_require__(9646);
var pascal_case_1 = __nccwpck_require__(5995);
function camelCaseTransform(input, index) {
    if (index === 0)
        return input.toLowerCase();
    return pascal_case_1.pascalCaseTransform(input, index);
}
exports.camelCaseTransform = camelCaseTransform;
function camelCaseTransformMerge(input, index) {
    if (index === 0)
        return input.toLowerCase();
    return pascal_case_1.pascalCaseTransformMerge(input);
}
exports.camelCaseTransformMerge = camelCaseTransformMerge;
function camelCase(input, options) {
    if (options === void 0) { options = {}; }
    return pascal_case_1.pascalCase(input, tslib_1.__assign({ transform: camelCaseTransform }, options));
}
exports.camelCase = camelCase;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9646:
/***/ ((module) => {

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __spreadArray;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    /** @deprecated */
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    /** @deprecated */
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __spreadArray = function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__spreadArray", __spreadArray);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});


/***/ }),

/***/ 8824:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.capitalCase = exports.capitalCaseTransform = void 0;
var tslib_1 = __nccwpck_require__(5145);
var no_case_1 = __nccwpck_require__(397);
var upper_case_first_1 = __nccwpck_require__(6256);
function capitalCaseTransform(input) {
    return upper_case_first_1.upperCaseFirst(input.toLowerCase());
}
exports.capitalCaseTransform = capitalCaseTransform;
function capitalCase(input, options) {
    if (options === void 0) { options = {}; }
    return no_case_1.noCase(input, tslib_1.__assign({ delimiter: " ", transform: capitalCaseTransform }, options));
}
exports.capitalCase = capitalCase;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5145:
/***/ ((module) => {

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __spreadArray;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    /** @deprecated */
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    /** @deprecated */
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __spreadArray = function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__spreadArray", __spreadArray);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});


/***/ }),

/***/ 9091:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __nccwpck_require__(9220);
tslib_1.__exportStar(__nccwpck_require__(3638), exports);
tslib_1.__exportStar(__nccwpck_require__(8824), exports);
tslib_1.__exportStar(__nccwpck_require__(6878), exports);
tslib_1.__exportStar(__nccwpck_require__(2246), exports);
tslib_1.__exportStar(__nccwpck_require__(3657), exports);
tslib_1.__exportStar(__nccwpck_require__(397), exports);
tslib_1.__exportStar(__nccwpck_require__(8452), exports);
tslib_1.__exportStar(__nccwpck_require__(5995), exports);
tslib_1.__exportStar(__nccwpck_require__(3553), exports);
tslib_1.__exportStar(__nccwpck_require__(9229), exports);
tslib_1.__exportStar(__nccwpck_require__(6213), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9220:
/***/ ((module) => {

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __spreadArray;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    /** @deprecated */
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    /** @deprecated */
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __spreadArray = function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__spreadArray", __spreadArray);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});


/***/ }),

/***/ 6878:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.constantCase = void 0;
var tslib_1 = __nccwpck_require__(1728);
var no_case_1 = __nccwpck_require__(397);
var upper_case_1 = __nccwpck_require__(5997);
function constantCase(input, options) {
    if (options === void 0) { options = {}; }
    return no_case_1.noCase(input, tslib_1.__assign({ delimiter: "_", transform: upper_case_1.upperCase }, options));
}
exports.constantCase = constantCase;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1728:
/***/ ((module) => {

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __spreadArray;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    /** @deprecated */
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    /** @deprecated */
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __spreadArray = function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__spreadArray", __spreadArray);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});


/***/ }),

/***/ 2246:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dotCase = void 0;
var tslib_1 = __nccwpck_require__(1627);
var no_case_1 = __nccwpck_require__(397);
function dotCase(input, options) {
    if (options === void 0) { options = {}; }
    return no_case_1.noCase(input, tslib_1.__assign({ delimiter: "." }, options));
}
exports.dotCase = dotCase;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1627:
/***/ ((module) => {

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __spreadArray;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    /** @deprecated */
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    /** @deprecated */
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __spreadArray = function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__spreadArray", __spreadArray);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});


/***/ }),

/***/ 3657:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.headerCase = void 0;
var tslib_1 = __nccwpck_require__(6288);
var capital_case_1 = __nccwpck_require__(8824);
function headerCase(input, options) {
    if (options === void 0) { options = {}; }
    return capital_case_1.capitalCase(input, tslib_1.__assign({ delimiter: "-" }, options));
}
exports.headerCase = headerCase;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6288:
/***/ ((module) => {

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __spreadArray;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    /** @deprecated */
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    /** @deprecated */
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __spreadArray = function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__spreadArray", __spreadArray);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});


/***/ }),

/***/ 6014:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const Clone = __nccwpck_require__(5578);

const Common = __nccwpck_require__(2448);


const internals = {
    annotations: Symbol('annotations')
};


exports.error = function (stripColorCodes) {

    if (!this._original ||
        typeof this._original !== 'object') {

        return this.details[0].message;
    }

    const redFgEscape = stripColorCodes ? '' : '\u001b[31m';
    const redBgEscape = stripColorCodes ? '' : '\u001b[41m';
    const endColor = stripColorCodes ? '' : '\u001b[0m';

    const obj = Clone(this._original);

    for (let i = this.details.length - 1; i >= 0; --i) {        // Reverse order to process deepest child first
        const pos = i + 1;
        const error = this.details[i];
        const path = error.path;
        let node = obj;
        for (let j = 0; ; ++j) {
            const seg = path[j];

            if (Common.isSchema(node)) {
                node = node.clone();                              // joi schemas are not cloned by hoek, we have to take this extra step
            }

            if (j + 1 < path.length &&
                typeof node[seg] !== 'string') {

                node = node[seg];
            }
            else {
                const refAnnotations = node[internals.annotations] || { errors: {}, missing: {} };
                node[internals.annotations] = refAnnotations;

                const cacheKey = seg || error.context.key;

                if (node[seg] !== undefined) {
                    refAnnotations.errors[cacheKey] = refAnnotations.errors[cacheKey] || [];
                    refAnnotations.errors[cacheKey].push(pos);
                }
                else {
                    refAnnotations.missing[cacheKey] = pos;
                }

                break;
            }
        }
    }

    const replacers = {
        key: /_\$key\$_([, \d]+)_\$end\$_"/g,
        missing: /"_\$miss\$_([^|]+)\|(\d+)_\$end\$_": "__missing__"/g,
        arrayIndex: /\s*"_\$idx\$_([, \d]+)_\$end\$_",?\n(.*)/g,
        specials: /"\[(NaN|Symbol.*|-?Infinity|function.*|\(.*)]"/g
    };

    let message = internals.safeStringify(obj, 2)
        .replace(replacers.key, ($0, $1) => `" ${redFgEscape}[${$1}]${endColor}`)
        .replace(replacers.missing, ($0, $1, $2) => `${redBgEscape}"${$1}"${endColor}${redFgEscape} [${$2}]: -- missing --${endColor}`)
        .replace(replacers.arrayIndex, ($0, $1, $2) => `\n${$2} ${redFgEscape}[${$1}]${endColor}`)
        .replace(replacers.specials, ($0, $1) => $1);

    message = `${message}\n${redFgEscape}`;

    for (let i = 0; i < this.details.length; ++i) {
        const pos = i + 1;
        message = `${message}\n[${pos}] ${this.details[i].message}`;
    }

    message = message + endColor;

    return message;
};


// Inspired by json-stringify-safe

internals.safeStringify = function (obj, spaces) {

    return JSON.stringify(obj, internals.serializer(), spaces);
};


internals.serializer = function () {

    const keys = [];
    const stack = [];

    const cycleReplacer = (key, value) => {

        if (stack[0] === value) {
            return '[Circular ~]';
        }

        return '[Circular ~.' + keys.slice(0, stack.indexOf(value)).join('.') + ']';
    };

    return function (key, value) {

        if (stack.length > 0) {
            const thisPos = stack.indexOf(this);
            if (~thisPos) {
                stack.length = thisPos + 1;
                keys.length = thisPos + 1;
                keys[thisPos] = key;
            }
            else {
                stack.push(this);
                keys.push(key);
            }

            if (~stack.indexOf(value)) {
                value = cycleReplacer.call(this, key, value);
            }
        }
        else {
            stack.push(value);
        }

        if (value) {
            const annotations = value[internals.annotations];
            if (annotations) {
                if (Array.isArray(value)) {
                    const annotated = [];

                    for (let i = 0; i < value.length; ++i) {
                        if (annotations.errors[i]) {
                            annotated.push(`_$idx$_${annotations.errors[i].sort().join(', ')}_$end$_`);
                        }

                        annotated.push(value[i]);
                    }

                    value = annotated;
                }
                else {
                    for (const errorKey in annotations.errors) {
                        value[`${errorKey}_$key$_${annotations.errors[errorKey].sort().join(', ')}_$end$_`] = value[errorKey];
                        value[errorKey] = undefined;
                    }

                    for (const missingKey in annotations.missing) {
                        value[`_$miss$_${missingKey}|${annotations.missing[missingKey]}_$end$_`] = '__missing__';
                    }
                }

                return value;
            }
        }

        if (value === Infinity ||
            value === -Infinity ||
            Number.isNaN(value) ||
            typeof value === 'function' ||
            typeof value === 'symbol') {

            return '[' + value.toString() + ']';
        }

        return value;
    };
};


/***/ }),

/***/ 5184:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);
const Clone = __nccwpck_require__(5578);
const DeepEqual = __nccwpck_require__(5801);
const Merge = __nccwpck_require__(445);

const Cache = __nccwpck_require__(3355);
const Common = __nccwpck_require__(2448);
const Compile = __nccwpck_require__(3038);
const Errors = __nccwpck_require__(9490);
const Extend = __nccwpck_require__(6680);
const Manifest = __nccwpck_require__(7997);
const Messages = __nccwpck_require__(6103);
const Modify = __nccwpck_require__(1290);
const Ref = __nccwpck_require__(3838);
const Trace = __nccwpck_require__(3171);
const Validator = __nccwpck_require__(1804);
const Values = __nccwpck_require__(1944);


const internals = {};


internals.Base = class {

    constructor(type) {

        // Naming: public, _private, $_extension, $_mutate{action}

        this.type = type;

        this.$_root = null;
        this._definition = {};
        this._reset();
    }

    _reset() {

        this._ids = new Modify.Ids();
        this._preferences = null;
        this._refs = new Ref.Manager();
        this._cache = null;

        this._valids = null;
        this._invalids = null;

        this._flags = {};
        this._rules = [];
        this._singleRules = new Map();              // The rule options passed for non-multi rules

        this.$_terms = {};                          // Hash of arrays of immutable objects (extended by other types)

        this.$_temp = {                             // Runtime state (not cloned)
            ruleset: null,                          // null: use last, false: error, number: start position
            whens: {}                               // Runtime cache of generated whens
        };
    }

    // Manifest

    describe() {

        Assert(typeof Manifest.describe === 'function', 'Manifest functionality disabled');
        return Manifest.describe(this);
    }

    // Rules

    allow(...values) {

        Common.verifyFlat(values, 'allow');
        return this._values(values, '_valids');
    }

    alter(targets) {

        Assert(targets && typeof targets === 'object' && !Array.isArray(targets), 'Invalid targets argument');
        Assert(!this._inRuleset(), 'Cannot set alterations inside a ruleset');

        const obj = this.clone();
        obj.$_terms.alterations = obj.$_terms.alterations || [];
        for (const target in targets) {
            const adjuster = targets[target];
            Assert(typeof adjuster === 'function', 'Alteration adjuster for', target, 'must be a function');
            obj.$_terms.alterations.push({ target, adjuster });
        }

        obj.$_temp.ruleset = false;
        return obj;
    }

    artifact(id) {

        Assert(id !== undefined, 'Artifact cannot be undefined');
        Assert(!this._cache, 'Cannot set an artifact with a rule cache');

        return this.$_setFlag('artifact', id);
    }

    cast(to) {

        Assert(to === false || typeof to === 'string', 'Invalid to value');
        Assert(to === false || this._definition.cast[to], 'Type', this.type, 'does not support casting to', to);

        return this.$_setFlag('cast', to === false ? undefined : to);
    }

    default(value, options) {

        return this._default('default', value, options);
    }

    description(desc) {

        Assert(desc && typeof desc === 'string', 'Description must be a non-empty string');

        return this.$_setFlag('description', desc);
    }

    empty(schema) {

        const obj = this.clone();

        if (schema !== undefined) {
            schema = obj.$_compile(schema, { override: false });
        }

        return obj.$_setFlag('empty', schema, { clone: false });
    }

    error(err) {

        Assert(err, 'Missing error');
        Assert(err instanceof Error || typeof err === 'function', 'Must provide a valid Error object or a function');

        return this.$_setFlag('error', err);
    }

    example(example, options = {}) {

        Assert(example !== undefined, 'Missing example');
        Common.assertOptions(options, ['override']);

        return this._inner('examples', example, { single: true, override: options.override });
    }

    external(method, description) {

        if (typeof method === 'object') {
            Assert(!description, 'Cannot combine options with description');
            description = method.description;
            method = method.method;
        }

        Assert(typeof method === 'function', 'Method must be a function');
        Assert(description === undefined || description && typeof description === 'string', 'Description must be a non-empty string');

        return this._inner('externals', { method, description }, { single: true });
    }

    failover(value, options) {

        return this._default('failover', value, options);
    }

    forbidden() {

        return this.presence('forbidden');
    }

    id(id) {

        if (!id) {
            return this.$_setFlag('id', undefined);
        }

        Assert(typeof id === 'string', 'id must be a non-empty string');
        Assert(/^[^\.]+$/.test(id), 'id cannot contain period character');

        return this.$_setFlag('id', id);
    }

    invalid(...values) {

        return this._values(values, '_invalids');
    }

    label(name) {

        Assert(name && typeof name === 'string', 'Label name must be a non-empty string');

        return this.$_setFlag('label', name);
    }

    meta(meta) {

        Assert(meta !== undefined, 'Meta cannot be undefined');

        return this._inner('metas', meta, { single: true });
    }

    note(...notes) {

        Assert(notes.length, 'Missing notes');
        for (const note of notes) {
            Assert(note && typeof note === 'string', 'Notes must be non-empty strings');
        }

        return this._inner('notes', notes);
    }

    only(mode = true) {

        Assert(typeof mode === 'boolean', 'Invalid mode:', mode);

        return this.$_setFlag('only', mode);
    }

    optional() {

        return this.presence('optional');
    }

    prefs(prefs) {

        Assert(prefs, 'Missing preferences');
        Assert(prefs.context === undefined, 'Cannot override context');
        Assert(prefs.externals === undefined, 'Cannot override externals');
        Assert(prefs.warnings === undefined, 'Cannot override warnings');
        Assert(prefs.debug === undefined, 'Cannot override debug');

        Common.checkPreferences(prefs);

        const obj = this.clone();
        obj._preferences = Common.preferences(obj._preferences, prefs);
        return obj;
    }

    presence(mode) {

        Assert(['optional', 'required', 'forbidden'].includes(mode), 'Unknown presence mode', mode);

        return this.$_setFlag('presence', mode);
    }

    raw(enabled = true) {

        return this.$_setFlag('result', enabled ? 'raw' : undefined);
    }

    result(mode) {

        Assert(['raw', 'strip'].includes(mode), 'Unknown result mode', mode);

        return this.$_setFlag('result', mode);
    }

    required() {

        return this.presence('required');
    }

    strict(enabled) {

        const obj = this.clone();

        const convert = enabled === undefined ? false : !enabled;
        obj._preferences = Common.preferences(obj._preferences, { convert });
        return obj;
    }

    strip(enabled = true) {

        return this.$_setFlag('result', enabled ? 'strip' : undefined);
    }

    tag(...tags) {

        Assert(tags.length, 'Missing tags');
        for (const tag of tags) {
            Assert(tag && typeof tag === 'string', 'Tags must be non-empty strings');
        }

        return this._inner('tags', tags);
    }

    unit(name) {

        Assert(name && typeof name === 'string', 'Unit name must be a non-empty string');

        return this.$_setFlag('unit', name);
    }

    valid(...values) {

        Common.verifyFlat(values, 'valid');

        const obj = this.allow(...values);
        obj.$_setFlag('only', !!obj._valids, { clone: false });
        return obj;
    }

    when(condition, options) {

        const obj = this.clone();

        if (!obj.$_terms.whens) {
            obj.$_terms.whens = [];
        }

        const when = Compile.when(obj, condition, options);
        if (!['any', 'link'].includes(obj.type)) {
            const conditions = when.is ? [when] : when.switch;
            for (const item of conditions) {
                Assert(!item.then || item.then.type === 'any' || item.then.type === obj.type, 'Cannot combine', obj.type, 'with', item.then && item.then.type);
                Assert(!item.otherwise || item.otherwise.type === 'any' || item.otherwise.type === obj.type, 'Cannot combine', obj.type, 'with', item.otherwise && item.otherwise.type);

            }
        }

        obj.$_terms.whens.push(when);
        return obj.$_mutateRebuild();
    }

    // Helpers

    cache(cache) {

        Assert(!this._inRuleset(), 'Cannot set caching inside a ruleset');
        Assert(!this._cache, 'Cannot override schema cache');
        Assert(this._flags.artifact === undefined, 'Cannot cache a rule with an artifact');

        const obj = this.clone();
        obj._cache = cache || Cache.provider.provision();
        obj.$_temp.ruleset = false;
        return obj;
    }

    clone() {

        const obj = Object.create(Object.getPrototypeOf(this));
        return this._assign(obj);
    }

    concat(source) {

        Assert(Common.isSchema(source), 'Invalid schema object');
        Assert(this.type === 'any' || source.type === 'any' || source.type === this.type, 'Cannot merge type', this.type, 'with another type:', source.type);
        Assert(!this._inRuleset(), 'Cannot concatenate onto a schema with open ruleset');
        Assert(!source._inRuleset(), 'Cannot concatenate a schema with open ruleset');

        let obj = this.clone();

        if (this.type === 'any' &&
            source.type !== 'any') {

            // Change obj to match source type

            const tmpObj = source.clone();
            for (const key of Object.keys(obj)) {
                if (key !== 'type') {
                    tmpObj[key] = obj[key];
                }
            }

            obj = tmpObj;
        }

        obj._ids.concat(source._ids);
        obj._refs.register(source, Ref.toSibling);

        obj._preferences = obj._preferences ? Common.preferences(obj._preferences, source._preferences) : source._preferences;
        obj._valids = Values.merge(obj._valids, source._valids, source._invalids);
        obj._invalids = Values.merge(obj._invalids, source._invalids, source._valids);

        // Remove unique rules present in source

        for (const name of source._singleRules.keys()) {
            if (obj._singleRules.has(name)) {
                obj._rules = obj._rules.filter((target) => target.keep || target.name !== name);
                obj._singleRules.delete(name);
            }
        }

        // Rules

        for (const test of source._rules) {
            if (!source._definition.rules[test.method].multi) {
                obj._singleRules.set(test.name, test);
            }

            obj._rules.push(test);
        }

        // Flags

        if (obj._flags.empty &&
            source._flags.empty) {

            obj._flags.empty = obj._flags.empty.concat(source._flags.empty);
            const flags = Object.assign({}, source._flags);
            delete flags.empty;
            Merge(obj._flags, flags);
        }
        else if (source._flags.empty) {
            obj._flags.empty = source._flags.empty;
            const flags = Object.assign({}, source._flags);
            delete flags.empty;
            Merge(obj._flags, flags);
        }
        else {
            Merge(obj._flags, source._flags);
        }

        // Terms

        for (const key in source.$_terms) {
            const terms = source.$_terms[key];
            if (!terms) {
                if (!obj.$_terms[key]) {
                    obj.$_terms[key] = terms;
                }

                continue;
            }

            if (!obj.$_terms[key]) {
                obj.$_terms[key] = terms.slice();
                continue;
            }

            obj.$_terms[key] = obj.$_terms[key].concat(terms);
        }

        // Tracing

        if (this.$_root._tracer) {
            this.$_root._tracer._combine(obj, [this, source]);
        }

        // Rebuild

        return obj.$_mutateRebuild();
    }

    extend(options) {

        Assert(!options.base, 'Cannot extend type with another base');

        return Extend.type(this, options);
    }

    extract(path) {

        path = Array.isArray(path) ? path : path.split('.');
        return this._ids.reach(path);
    }

    fork(paths, adjuster) {

        Assert(!this._inRuleset(), 'Cannot fork inside a ruleset');

        let obj = this;                                             // eslint-disable-line consistent-this
        for (let path of [].concat(paths)) {
            path = Array.isArray(path) ? path : path.split('.');
            obj = obj._ids.fork(path, adjuster, obj);
        }

        obj.$_temp.ruleset = false;
        return obj;
    }

    rule(options) {

        const def = this._definition;
        Common.assertOptions(options, Object.keys(def.modifiers));

        Assert(this.$_temp.ruleset !== false, 'Cannot apply rules to empty ruleset or the last rule added does not support rule properties');
        const start = this.$_temp.ruleset === null ? this._rules.length - 1 : this.$_temp.ruleset;
        Assert(start >= 0 && start < this._rules.length, 'Cannot apply rules to empty ruleset');

        const obj = this.clone();

        for (let i = start; i < obj._rules.length; ++i) {
            const original = obj._rules[i];
            const rule = Clone(original);

            for (const name in options) {
                def.modifiers[name](rule, options[name]);
                Assert(rule.name === original.name, 'Cannot change rule name');
            }

            obj._rules[i] = rule;

            if (obj._singleRules.get(rule.name) === original) {
                obj._singleRules.set(rule.name, rule);
            }
        }

        obj.$_temp.ruleset = false;
        return obj.$_mutateRebuild();
    }

    get ruleset() {

        Assert(!this._inRuleset(), 'Cannot start a new ruleset without closing the previous one');

        const obj = this.clone();
        obj.$_temp.ruleset = obj._rules.length;
        return obj;
    }

    get $() {

        return this.ruleset;
    }

    tailor(targets) {

        targets = [].concat(targets);

        Assert(!this._inRuleset(), 'Cannot tailor inside a ruleset');

        let obj = this;                                                     // eslint-disable-line consistent-this

        if (this.$_terms.alterations) {
            for (const { target, adjuster } of this.$_terms.alterations) {
                if (targets.includes(target)) {
                    obj = adjuster(obj);
                    Assert(Common.isSchema(obj), 'Alteration adjuster for', target, 'failed to return a schema object');
                }
            }
        }

        obj = obj.$_modify({ each: (item) => item.tailor(targets), ref: false });
        obj.$_temp.ruleset = false;
        return obj.$_mutateRebuild();
    }

    tracer() {

        return Trace.location ? Trace.location(this) : this;                // $lab:coverage:ignore$
    }

    validate(value, options) {

        return Validator.entry(value, this, options);
    }

    validateAsync(value, options) {

        return Validator.entryAsync(value, this, options);
    }

    // Extensions

    $_addRule(options) {

        // Normalize rule

        if (typeof options === 'string') {
            options = { name: options };
        }

        Assert(options && typeof options === 'object', 'Invalid options');
        Assert(options.name && typeof options.name === 'string', 'Invalid rule name');

        for (const key in options) {
            Assert(key[0] !== '_', 'Cannot set private rule properties');
        }

        const rule = Object.assign({}, options);        // Shallow cloned
        rule._resolve = [];
        rule.method = rule.method || rule.name;

        const definition = this._definition.rules[rule.method];
        const args = rule.args;

        Assert(definition, 'Unknown rule', rule.method);

        // Args

        const obj = this.clone();

        if (args) {
            Assert(Object.keys(args).length === 1 || Object.keys(args).length === this._definition.rules[rule.name].args.length, 'Invalid rule definition for', this.type, rule.name);

            for (const key in args) {
                let arg = args[key];
                if (arg === undefined) {
                    delete args[key];
                    continue;
                }

                if (definition.argsByName) {
                    const resolver = definition.argsByName.get(key);

                    if (resolver.ref &&
                        Common.isResolvable(arg)) {

                        rule._resolve.push(key);
                        obj.$_mutateRegister(arg);
                    }
                    else {
                        if (resolver.normalize) {
                            arg = resolver.normalize(arg);
                            args[key] = arg;
                        }

                        if (resolver.assert) {
                            const error = Common.validateArg(arg, key, resolver);
                            Assert(!error, error, 'or reference');
                        }
                    }
                }

                args[key] = arg;
            }
        }

        // Unique rules

        if (!definition.multi) {
            obj._ruleRemove(rule.name, { clone: false });
            obj._singleRules.set(rule.name, rule);
        }

        if (obj.$_temp.ruleset === false) {
            obj.$_temp.ruleset = null;
        }

        if (definition.priority) {
            obj._rules.unshift(rule);
        }
        else {
            obj._rules.push(rule);
        }

        return obj;
    }

    $_compile(schema, options) {

        return Compile.schema(this.$_root, schema, options);
    }

    $_createError(code, value, local, state, prefs, options = {}) {

        const flags = options.flags !== false ? this._flags : {};
        const messages = options.messages ? Messages.merge(this._definition.messages, options.messages) : this._definition.messages;
        return new Errors.Report(code, value, local, flags, messages, state, prefs);
    }

    $_getFlag(name) {

        return this._flags[name];
    }

    $_getRule(name) {

        return this._singleRules.get(name);
    }

    $_mapLabels(path) {

        path = Array.isArray(path) ? path : path.split('.');
        return this._ids.labels(path);
    }

    $_match(value, state, prefs, overrides) {

        prefs = Object.assign({}, prefs);       // Shallow cloned
        prefs.abortEarly = true;
        prefs._externals = false;

        state.snapshot();
        const result = !Validator.validate(value, this, state, prefs, overrides).errors;
        state.restore();

        return result;
    }

    $_modify(options) {

        Common.assertOptions(options, ['each', 'once', 'ref', 'schema']);
        return Modify.schema(this, options) || this;
    }

    $_mutateRebuild() {

        Assert(!this._inRuleset(), 'Cannot add this rule inside a ruleset');

        this._refs.reset();
        this._ids.reset();

        const each = (item, { source, name, path, key }) => {

            const family = this._definition[source][name] && this._definition[source][name].register;
            if (family !== false) {
                this.$_mutateRegister(item, { family, key });
            }
        };

        this.$_modify({ each });

        if (this._definition.rebuild) {
            this._definition.rebuild(this);
        }

        this.$_temp.ruleset = false;
        return this;
    }

    $_mutateRegister(schema, { family, key } = {}) {

        this._refs.register(schema, family);
        this._ids.register(schema, { key });
    }

    $_property(name) {

        return this._definition.properties[name];
    }

    $_reach(path) {

        return this._ids.reach(path);
    }

    $_rootReferences() {

        return this._refs.roots();
    }

    $_setFlag(name, value, options = {}) {

        Assert(name[0] === '_' || !this._inRuleset(), 'Cannot set flag inside a ruleset');

        const flag = this._definition.flags[name] || {};
        if (DeepEqual(value, flag.default)) {
            value = undefined;
        }

        if (DeepEqual(value, this._flags[name])) {
            return this;
        }

        const obj = options.clone !== false ? this.clone() : this;

        if (value !== undefined) {
            obj._flags[name] = value;
            obj.$_mutateRegister(value);
        }
        else {
            delete obj._flags[name];
        }

        if (name[0] !== '_') {
            obj.$_temp.ruleset = false;
        }

        return obj;
    }

    $_parent(method, ...args) {

        return this[method][Common.symbols.parent].call(this, ...args);
    }

    $_validate(value, state, prefs) {

        return Validator.validate(value, this, state, prefs);
    }

    // Internals

    _assign(target) {

        target.type = this.type;

        target.$_root = this.$_root;

        target.$_temp = Object.assign({}, this.$_temp);
        target.$_temp.whens = {};

        target._ids = this._ids.clone();
        target._preferences = this._preferences;
        target._valids = this._valids && this._valids.clone();
        target._invalids = this._invalids && this._invalids.clone();
        target._rules = this._rules.slice();
        target._singleRules = Clone(this._singleRules, { shallow: true });
        target._refs = this._refs.clone();
        target._flags = Object.assign({}, this._flags);
        target._cache = null;

        target.$_terms = {};
        for (const key in this.$_terms) {
            target.$_terms[key] = this.$_terms[key] ? this.$_terms[key].slice() : null;
        }

        // Backwards compatibility

        target.$_super = {};
        for (const override in this.$_super) {
            target.$_super[override] = this._super[override].bind(target);
        }

        return target;
    }

    _bare() {

        const obj = this.clone();
        obj._reset();

        const terms = obj._definition.terms;
        for (const name in terms) {
            const term = terms[name];
            obj.$_terms[name] = term.init;
        }

        return obj.$_mutateRebuild();
    }

    _default(flag, value, options = {}) {

        Common.assertOptions(options, 'literal');

        Assert(value !== undefined, 'Missing', flag, 'value');
        Assert(typeof value === 'function' || !options.literal, 'Only function value supports literal option');

        if (typeof value === 'function' &&
            options.literal) {

            value = {
                [Common.symbols.literal]: true,
                literal: value
            };
        }

        const obj = this.$_setFlag(flag, value);
        return obj;
    }

    _generate(value, state, prefs) {

        if (!this.$_terms.whens) {
            return { schema: this };
        }

        // Collect matching whens

        const whens = [];
        const ids = [];
        for (let i = 0; i < this.$_terms.whens.length; ++i) {
            const when = this.$_terms.whens[i];

            if (when.concat) {
                whens.push(when.concat);
                ids.push(`${i}.concat`);
                continue;
            }

            const input = when.ref ? when.ref.resolve(value, state, prefs) : value;
            const tests = when.is ? [when] : when.switch;
            const before = ids.length;

            for (let j = 0; j < tests.length; ++j) {
                const { is, then, otherwise } = tests[j];

                const baseId = `${i}${when.switch ? '.' + j : ''}`;
                if (is.$_match(input, state.nest(is, `${baseId}.is`), prefs)) {
                    if (then) {
                        const localState = state.localize([...state.path, `${baseId}.then`], state.ancestors, state.schemas);
                        const { schema: generated, id } = then._generate(value, localState, prefs);
                        whens.push(generated);
                        ids.push(`${baseId}.then${id ? `(${id})` : ''}`);
                        break;
                    }
                }
                else if (otherwise) {
                    const localState = state.localize([...state.path, `${baseId}.otherwise`], state.ancestors, state.schemas);
                    const { schema: generated, id } = otherwise._generate(value, localState, prefs);
                    whens.push(generated);
                    ids.push(`${baseId}.otherwise${id ? `(${id})` : ''}`);
                    break;
                }
            }

            if (when.break &&
                ids.length > before) {          // Something matched

                break;
            }
        }

        // Check cache

        const id = ids.join(', ');
        state.mainstay.tracer.debug(state, 'rule', 'when', id);

        if (!id) {
            return { schema: this };
        }

        if (!state.mainstay.tracer.active &&
            this.$_temp.whens[id]) {

            return { schema: this.$_temp.whens[id], id };
        }

        // Generate dynamic schema

        let obj = this;                                             // eslint-disable-line consistent-this
        if (this._definition.generate) {
            obj = this._definition.generate(this, value, state, prefs);
        }

        // Apply whens

        for (const when of whens) {
            obj = obj.concat(when);
        }

        // Tracing

        if (this.$_root._tracer) {
            this.$_root._tracer._combine(obj, [this, ...whens]);
        }

        // Cache result

        this.$_temp.whens[id] = obj;
        return { schema: obj, id };
    }

    _inner(type, values, options = {}) {

        Assert(!this._inRuleset(), `Cannot set ${type} inside a ruleset`);

        const obj = this.clone();
        if (!obj.$_terms[type] ||
            options.override) {

            obj.$_terms[type] = [];
        }

        if (options.single) {
            obj.$_terms[type].push(values);
        }
        else {
            obj.$_terms[type].push(...values);
        }

        obj.$_temp.ruleset = false;
        return obj;
    }

    _inRuleset() {

        return this.$_temp.ruleset !== null && this.$_temp.ruleset !== false;
    }

    _ruleRemove(name, options = {}) {

        if (!this._singleRules.has(name)) {
            return this;
        }

        const obj = options.clone !== false ? this.clone() : this;

        obj._singleRules.delete(name);

        const filtered = [];
        for (let i = 0; i < obj._rules.length; ++i) {
            const test = obj._rules[i];
            if (test.name === name &&
                !test.keep) {

                if (obj._inRuleset() &&
                    i < obj.$_temp.ruleset) {

                    --obj.$_temp.ruleset;
                }

                continue;
            }

            filtered.push(test);
        }

        obj._rules = filtered;
        return obj;
    }

    _values(values, key) {

        Common.verifyFlat(values, key.slice(1, -1));

        const obj = this.clone();

        const override = values[0] === Common.symbols.override;
        if (override) {
            values = values.slice(1);
        }

        if (!obj[key] &&
            values.length) {

            obj[key] = new Values();
        }
        else if (override) {
            obj[key] = values.length ? new Values() : null;
            obj.$_mutateRebuild();
        }

        if (!obj[key]) {
            return obj;
        }

        if (override) {
            obj[key].override();
        }

        for (const value of values) {
            Assert(value !== undefined, 'Cannot call allow/valid/invalid with undefined');
            Assert(value !== Common.symbols.override, 'Override must be the first value');

            const other = key === '_invalids' ? '_valids' : '_invalids';
            if (obj[other]) {
                obj[other].remove(value);
                if (!obj[other].length) {
                    Assert(key === '_valids' || !obj._flags.only, 'Setting invalid value', value, 'leaves schema rejecting all values due to previous valid rule');
                    obj[other] = null;
                }
            }

            obj[key].add(value, obj._refs);
        }

        return obj;
    }
};


internals.Base.prototype[Common.symbols.any] = {
    version: Common.version,
    compile: Compile.compile,
    root: '$_root'
};


internals.Base.prototype.isImmutable = true;                // Prevents Hoek from deep cloning schema objects (must be on prototype)


// Aliases

internals.Base.prototype.deny = internals.Base.prototype.invalid;
internals.Base.prototype.disallow = internals.Base.prototype.invalid;
internals.Base.prototype.equal = internals.Base.prototype.valid;
internals.Base.prototype.exist = internals.Base.prototype.required;
internals.Base.prototype.not = internals.Base.prototype.invalid;
internals.Base.prototype.options = internals.Base.prototype.prefs;
internals.Base.prototype.preferences = internals.Base.prototype.prefs;


module.exports = new internals.Base();


/***/ }),

/***/ 3355:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);
const Clone = __nccwpck_require__(5578);

const Common = __nccwpck_require__(2448);


const internals = {
    max: 1000,
    supported: new Set(['undefined', 'boolean', 'number', 'string'])
};


exports.provider = {

    provision(options) {

        return new internals.Cache(options);
    }
};


// Least Recently Used (LRU) Cache

internals.Cache = class {

    constructor(options = {}) {

        Common.assertOptions(options, ['max']);
        Assert(options.max === undefined || options.max && options.max > 0 && isFinite(options.max), 'Invalid max cache size');

        this._max = options.max || internals.max;

        this._map = new Map();                          // Map of nodes by key
        this._list = new internals.List();              // List of nodes (most recently used in head)
    }

    get length() {

        return this._map.size;
    }

    set(key, value) {

        if (key !== null &&
            !internals.supported.has(typeof key)) {

            return;
        }

        let node = this._map.get(key);
        if (node) {
            node.value = value;
            this._list.first(node);
            return;
        }

        node = this._list.unshift({ key, value });
        this._map.set(key, node);
        this._compact();
    }

    get(key) {

        const node = this._map.get(key);
        if (node) {
            this._list.first(node);
            return Clone(node.value);
        }
    }

    _compact() {

        if (this._map.size > this._max) {
            const node = this._list.pop();
            this._map.delete(node.key);
        }
    }
};


internals.List = class {

    constructor() {

        this.tail = null;
        this.head = null;
    }

    unshift(node) {

        node.next = null;
        node.prev = this.head;

        if (this.head) {
            this.head.next = node;
        }

        this.head = node;

        if (!this.tail) {
            this.tail = node;
        }

        return node;
    }

    first(node) {

        if (node === this.head) {
            return;
        }

        this._remove(node);
        this.unshift(node);
    }

    pop() {

        return this._remove(this.tail);
    }

    _remove(node) {

        const { next, prev } = node;

        next.prev = prev;

        if (prev) {
            prev.next = next;
        }

        if (node === this.tail) {
            this.tail = next;
        }

        node.prev = null;
        node.next = null;

        return node;
    }
};


/***/ }),

/***/ 2448:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);
const AssertError = __nccwpck_require__(5563);

const Pkg = __nccwpck_require__(6741);

let Messages;
let Schemas;


const internals = {
    isoDate: /^(?:[-+]\d{2})?(?:\d{4}(?!\d{2}\b))(?:(-?)(?:(?:0[1-9]|1[0-2])(?:\1(?:[12]\d|0[1-9]|3[01]))?|W(?:[0-4]\d|5[0-2])(?:-?[1-7])?|(?:00[1-9]|0[1-9]\d|[12]\d{2}|3(?:[0-5]\d|6[1-6])))(?![T]$|[T][\d]+Z$)(?:[T\s](?:(?:(?:[01]\d|2[0-3])(?:(:?)[0-5]\d)?|24\:?00)(?:[.,]\d+(?!:))?)(?:\2[0-5]\d(?:[.,]\d+)?)?(?:[Z]|(?:[+-])(?:[01]\d|2[0-3])(?::?[0-5]\d)?)?)?)?$/
};


exports.version = Pkg.version;


exports.defaults = {
    abortEarly: true,
    allowUnknown: false,
    artifacts: false,
    cache: true,
    context: null,
    convert: true,
    dateFormat: 'iso',
    errors: {
        escapeHtml: false,
        label: 'path',
        language: null,
        render: true,
        stack: false,
        wrap: {
            label: '"',
            array: '[]'
        }
    },
    externals: true,
    messages: {},
    nonEnumerables: false,
    noDefaults: false,
    presence: 'optional',
    skipFunctions: false,
    stripUnknown: false,
    warnings: false
};


exports.symbols = {
    any: Symbol.for('@hapi/joi/schema'),            // Used to internally identify any-based types (shared with other joi versions)
    arraySingle: Symbol('arraySingle'),
    deepDefault: Symbol('deepDefault'),
    errors: Symbol('errors'),
    literal: Symbol('literal'),
    override: Symbol('override'),
    parent: Symbol('parent'),
    prefs: Symbol('prefs'),
    ref: Symbol('ref'),
    template: Symbol('template'),
    values: Symbol('values')
};


exports.assertOptions = function (options, keys, name = 'Options') {

    Assert(options && typeof options === 'object' && !Array.isArray(options), 'Options must be of type object');
    const unknownKeys = Object.keys(options).filter((k) => !keys.includes(k));
    Assert(unknownKeys.length === 0, `${name} contain unknown keys: ${unknownKeys}`);
};


exports.checkPreferences = function (prefs) {

    Schemas = Schemas || __nccwpck_require__(5614);

    const result = Schemas.preferences.validate(prefs);

    if (result.error) {
        throw new AssertError([result.error.details[0].message]);
    }
};


exports.compare = function (a, b, operator) {

    switch (operator) {
        case '=': return a === b;
        case '>': return a > b;
        case '<': return a < b;
        case '>=': return a >= b;
        case '<=': return a <= b;
    }
};


exports.default = function (value, defaultValue) {

    return value === undefined ? defaultValue : value;
};


exports.isIsoDate = function (date) {

    return internals.isoDate.test(date);
};


exports.isNumber = function (value) {

    return typeof value === 'number' && !isNaN(value);
};


exports.isResolvable = function (obj) {

    if (!obj) {
        return false;
    }

    return obj[exports.symbols.ref] || obj[exports.symbols.template];
};


exports.isSchema = function (schema, options = {}) {

    const any = schema && schema[exports.symbols.any];
    if (!any) {
        return false;
    }

    Assert(options.legacy || any.version === exports.version, 'Cannot mix different versions of joi schemas');
    return true;
};


exports.isValues = function (obj) {

    return obj[exports.symbols.values];
};


exports.limit = function (value) {

    return Number.isSafeInteger(value) && value >= 0;
};


exports.preferences = function (target, source) {

    Messages = Messages || __nccwpck_require__(6103);

    target = target || {};
    source = source || {};

    const merged = Object.assign({}, target, source);
    if (source.errors &&
        target.errors) {

        merged.errors = Object.assign({}, target.errors, source.errors);
        merged.errors.wrap = Object.assign({}, target.errors.wrap, source.errors.wrap);
    }

    if (source.messages) {
        merged.messages = Messages.compile(source.messages, target.messages);
    }

    delete merged[exports.symbols.prefs];
    return merged;
};


exports.tryWithPath = function (fn, key, options = {}) {

    try {
        return fn();
    }
    catch (err) {
        if (err.path !== undefined) {
            err.path = key + '.' + err.path;
        }
        else {
            err.path = key;
        }

        if (options.append) {
            err.message = `${err.message} (${err.path})`;
        }

        throw err;
    }
};


exports.validateArg = function (value, label, { assert, message }) {

    if (exports.isSchema(assert)) {
        const result = assert.validate(value);
        if (!result.error) {
            return;
        }

        return result.error.message;
    }
    else if (!assert(value)) {
        return label ? `${label} ${message}` : message;
    }
};


exports.verifyFlat = function (args, method) {

    for (const arg of args) {
        Assert(!Array.isArray(arg), 'Method no longer accepts array arguments:', method);
    }
};


/***/ }),

/***/ 3038:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);

const Common = __nccwpck_require__(2448);
const Ref = __nccwpck_require__(3838);


const internals = {};


exports.schema = function (Joi, config, options = {}) {

    Common.assertOptions(options, ['appendPath', 'override']);

    try {
        return internals.schema(Joi, config, options);
    }
    catch (err) {
        if (options.appendPath &&
            err.path !== undefined) {

            err.message = `${err.message} (${err.path})`;
        }

        throw err;
    }
};


internals.schema = function (Joi, config, options) {

    Assert(config !== undefined, 'Invalid undefined schema');

    if (Array.isArray(config)) {
        Assert(config.length, 'Invalid empty array schema');

        if (config.length === 1) {
            config = config[0];
        }
    }

    const valid = (base, ...values) => {

        if (options.override !== false) {
            return base.valid(Joi.override, ...values);
        }

        return base.valid(...values);
    };

    if (internals.simple(config)) {
        return valid(Joi, config);
    }

    if (typeof config === 'function') {
        return Joi.custom(config);
    }

    Assert(typeof config === 'object', 'Invalid schema content:', typeof config);

    if (Common.isResolvable(config)) {
        return valid(Joi, config);
    }

    if (Common.isSchema(config)) {
        return config;
    }

    if (Array.isArray(config)) {
        for (const item of config) {
            if (!internals.simple(item)) {
                return Joi.alternatives().try(...config);
            }
        }

        return valid(Joi, ...config);
    }

    if (config instanceof RegExp) {
        return Joi.string().regex(config);
    }

    if (config instanceof Date) {
        return valid(Joi.date(), config);
    }

    Assert(Object.getPrototypeOf(config) === Object.getPrototypeOf({}), 'Schema can only contain plain objects');

    return Joi.object().keys(config);
};


exports.ref = function (id, options) {

    return Ref.isRef(id) ? id : Ref.create(id, options);
};


exports.compile = function (root, schema, options = {}) {

    Common.assertOptions(options, ['legacy']);

    // Compiled by any supported version

    const any = schema && schema[Common.symbols.any];
    if (any) {
        Assert(options.legacy || any.version === Common.version, 'Cannot mix different versions of joi schemas:', any.version, Common.version);
        return schema;
    }

    // Uncompiled root

    if (typeof schema !== 'object' ||
        !options.legacy) {

        return exports.schema(root, schema, { appendPath: true });          // Will error if schema contains other versions
    }

    // Scan schema for compiled parts

    const compiler = internals.walk(schema);
    if (!compiler) {
        return exports.schema(root, schema, { appendPath: true });
    }

    return compiler.compile(compiler.root, schema);
};


internals.walk = function (schema) {

    if (typeof schema !== 'object') {
        return null;
    }

    if (Array.isArray(schema)) {
        for (const item of schema) {
            const compiler = internals.walk(item);
            if (compiler) {
                return compiler;
            }
        }

        return null;
    }

    const any = schema[Common.symbols.any];
    if (any) {
        return { root: schema[any.root], compile: any.compile };
    }

    Assert(Object.getPrototypeOf(schema) === Object.getPrototypeOf({}), 'Schema can only contain plain objects');

    for (const key in schema) {
        const compiler = internals.walk(schema[key]);
        if (compiler) {
            return compiler;
        }
    }

    return null;
};


internals.simple = function (value) {

    return value === null || ['boolean', 'string', 'number'].includes(typeof value);
};


exports.when = function (schema, condition, options) {

    if (options === undefined) {
        Assert(condition && typeof condition === 'object', 'Missing options');

        options = condition;
        condition = Ref.create('.');
    }

    if (Array.isArray(options)) {
        options = { switch: options };
    }

    Common.assertOptions(options, ['is', 'not', 'then', 'otherwise', 'switch', 'break']);

    // Schema condition

    if (Common.isSchema(condition)) {
        Assert(options.is === undefined, '"is" can not be used with a schema condition');
        Assert(options.not === undefined, '"not" can not be used with a schema condition');
        Assert(options.switch === undefined, '"switch" can not be used with a schema condition');

        return internals.condition(schema, { is: condition, then: options.then, otherwise: options.otherwise, break: options.break });
    }

    // Single condition

    Assert(Ref.isRef(condition) || typeof condition === 'string', 'Invalid condition:', condition);
    Assert(options.not === undefined || options.is === undefined, 'Cannot combine "is" with "not"');

    if (options.switch === undefined) {
        let rule = options;
        if (options.not !== undefined) {
            rule = { is: options.not, then: options.otherwise, otherwise: options.then, break: options.break };
        }

        let is = rule.is !== undefined ? schema.$_compile(rule.is) : schema.$_root.invalid(null, false, 0, '').required();
        Assert(rule.then !== undefined || rule.otherwise !== undefined, 'options must have at least one of "then", "otherwise", or "switch"');
        Assert(rule.break === undefined || rule.then === undefined || rule.otherwise === undefined, 'Cannot specify then, otherwise, and break all together');

        if (options.is !== undefined &&
            !Ref.isRef(options.is) &&
            !Common.isSchema(options.is)) {

            is = is.required();                     // Only apply required if this wasn't already a schema or a ref
        }

        return internals.condition(schema, { ref: exports.ref(condition), is, then: rule.then, otherwise: rule.otherwise, break: rule.break });
    }

    // Switch statement

    Assert(Array.isArray(options.switch), '"switch" must be an array');
    Assert(options.is === undefined, 'Cannot combine "switch" with "is"');
    Assert(options.not === undefined, 'Cannot combine "switch" with "not"');
    Assert(options.then === undefined, 'Cannot combine "switch" with "then"');

    const rule = {
        ref: exports.ref(condition),
        switch: [],
        break: options.break
    };

    for (let i = 0; i < options.switch.length; ++i) {
        const test = options.switch[i];
        const last = i === options.switch.length - 1;

        Common.assertOptions(test, last ? ['is', 'then', 'otherwise'] : ['is', 'then']);

        Assert(test.is !== undefined, 'Switch statement missing "is"');
        Assert(test.then !== undefined, 'Switch statement missing "then"');

        const item = {
            is: schema.$_compile(test.is),
            then: schema.$_compile(test.then)
        };

        if (!Ref.isRef(test.is) &&
            !Common.isSchema(test.is)) {

            item.is = item.is.required();           // Only apply required if this wasn't already a schema or a ref
        }

        if (last) {
            Assert(options.otherwise === undefined || test.otherwise === undefined, 'Cannot specify "otherwise" inside and outside a "switch"');
            const otherwise = options.otherwise !== undefined ? options.otherwise : test.otherwise;
            if (otherwise !== undefined) {
                Assert(rule.break === undefined, 'Cannot specify both otherwise and break');
                item.otherwise = schema.$_compile(otherwise);
            }
        }

        rule.switch.push(item);
    }

    return rule;
};


internals.condition = function (schema, condition) {

    for (const key of ['then', 'otherwise']) {
        if (condition[key] === undefined) {
            delete condition[key];
        }
        else {
            condition[key] = schema.$_compile(condition[key]);
        }
    }

    return condition;
};


/***/ }),

/***/ 9490:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const Annotate = __nccwpck_require__(6014);
const Common = __nccwpck_require__(2448);
const Template = __nccwpck_require__(1396);


const internals = {};


exports.Report = class {

    constructor(code, value, local, flags, messages, state, prefs) {

        this.code = code;
        this.flags = flags;
        this.messages = messages;
        this.path = state.path;
        this.prefs = prefs;
        this.state = state;
        this.value = value;

        this.message = null;
        this.template = null;

        this.local = local || {};
        this.local.label = exports.label(this.flags, this.state, this.prefs, this.messages);

        if (this.value !== undefined &&
            !this.local.hasOwnProperty('value')) {

            this.local.value = this.value;
        }

        if (this.path.length) {
            const key = this.path[this.path.length - 1];
            if (typeof key !== 'object') {
                this.local.key = key;
            }
        }
    }

    _setTemplate(template) {

        this.template = template;

        if (!this.flags.label &&
            this.path.length === 0) {

            const localized = this._template(this.template, 'root');
            if (localized) {
                this.local.label = localized;
            }
        }
    }

    toString() {

        if (this.message) {
            return this.message;
        }

        const code = this.code;

        if (!this.prefs.errors.render) {
            return this.code;
        }

        const template = this._template(this.template) ||
            this._template(this.prefs.messages) ||
            this._template(this.messages);

        if (template === undefined) {
            return `Error code "${code}" is not defined, your custom type is missing the correct messages definition`;
        }

        // Render and cache result

        this.message = template.render(this.value, this.state, this.prefs, this.local, { errors: this.prefs.errors, messages: [this.prefs.messages, this.messages] });
        if (!this.prefs.errors.label) {
            this.message = this.message.replace(/^"" /, '').trim();
        }

        return this.message;
    }

    _template(messages, code) {

        return exports.template(this.value, messages, code || this.code, this.state, this.prefs);
    }
};


exports.path = function (path) {

    let label = '';
    for (const segment of path) {
        if (typeof segment === 'object') {          // Exclude array single path segment
            continue;
        }

        if (typeof segment === 'string') {
            if (label) {
                label += '.';
            }

            label += segment;
        }
        else {
            label += `[${segment}]`;
        }
    }

    return label;
};


exports.template = function (value, messages, code, state, prefs) {

    if (!messages) {
        return;
    }

    if (Template.isTemplate(messages)) {
        return code !== 'root' ? messages : null;
    }

    let lang = prefs.errors.language;
    if (Common.isResolvable(lang)) {
        lang = lang.resolve(value, state, prefs);
    }

    if (lang &&
        messages[lang] &&
        messages[lang][code] !== undefined) {

        return messages[lang][code];
    }

    return messages[code];
};


exports.label = function (flags, state, prefs, messages) {

    if (flags.label) {
        return flags.label;
    }

    if (!prefs.errors.label) {
        return '';
    }

    let path = state.path;
    if (prefs.errors.label === 'key' &&
        state.path.length > 1) {

        path = state.path.slice(-1);
    }

    const normalized = exports.path(path);
    if (normalized) {
        return normalized;
    }

    return exports.template(null, prefs.messages, 'root', state, prefs) ||
        messages && exports.template(null, messages, 'root', state, prefs) ||
        'value';
};


exports.process = function (errors, original, prefs) {

    if (!errors) {
        return null;
    }

    const { override, message, details } = exports.details(errors);
    if (override) {
        return override;
    }

    if (prefs.errors.stack) {
        return new exports.ValidationError(message, details, original);
    }

    const limit = Error.stackTraceLimit;
    Error.stackTraceLimit = 0;
    const validationError = new exports.ValidationError(message, details, original);
    Error.stackTraceLimit = limit;
    return validationError;
};


exports.details = function (errors, options = {}) {

    let messages = [];
    const details = [];

    for (const item of errors) {

        // Override

        if (item instanceof Error) {
            if (options.override !== false) {
                return { override: item };
            }

            const message = item.toString();
            messages.push(message);

            details.push({
                message,
                type: 'override',
                context: { error: item }
            });

            continue;
        }

        // Report

        const message = item.toString();
        messages.push(message);

        details.push({
            message,
            path: item.path.filter((v) => typeof v !== 'object'),
            type: item.code,
            context: item.local
        });
    }

    if (messages.length > 1) {
        messages = [...new Set(messages)];
    }

    return { message: messages.join('. '), details };
};


exports.ValidationError = class extends Error {

    constructor(message, details, original) {

        super(message);
        this._original = original;
        this.details = details;
    }

    static isError(err) {

        return err instanceof exports.ValidationError;
    }
};


exports.ValidationError.prototype.isJoi = true;

exports.ValidationError.prototype.name = 'ValidationError';

exports.ValidationError.prototype.annotate = Annotate.error;


/***/ }),

/***/ 6680:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);
const Clone = __nccwpck_require__(5578);

const Common = __nccwpck_require__(2448);
const Messages = __nccwpck_require__(6103);


const internals = {};


exports.type = function (from, options) {

    const base = Object.getPrototypeOf(from);
    const prototype = Clone(base);
    const schema = from._assign(Object.create(prototype));
    const def = Object.assign({}, options);                                 // Shallow cloned
    delete def.base;

    prototype._definition = def;

    const parent = base._definition || {};
    def.messages = Messages.merge(parent.messages, def.messages);
    def.properties = Object.assign({}, parent.properties, def.properties);

    // Type

    schema.type = def.type;

    // Flags

    def.flags = Object.assign({}, parent.flags, def.flags);

    // Terms

    const terms = Object.assign({}, parent.terms);
    if (def.terms) {
        for (const name in def.terms) {                                     // Only apply own terms
            const term = def.terms[name];
            Assert(schema.$_terms[name] === undefined, 'Invalid term override for', def.type, name);
            schema.$_terms[name] = term.init;
            terms[name] = term;
        }
    }

    def.terms = terms;

    // Constructor arguments

    if (!def.args) {
        def.args = parent.args;
    }

    // Prepare

    def.prepare = internals.prepare(def.prepare, parent.prepare);

    // Coerce

    if (def.coerce) {
        if (typeof def.coerce === 'function') {
            def.coerce = { method: def.coerce };
        }

        if (def.coerce.from &&
            !Array.isArray(def.coerce.from)) {

            def.coerce = { method: def.coerce.method, from: [].concat(def.coerce.from) };
        }
    }

    def.coerce = internals.coerce(def.coerce, parent.coerce);

    // Validate

    def.validate = internals.validate(def.validate, parent.validate);

    // Rules

    const rules = Object.assign({}, parent.rules);
    if (def.rules) {
        for (const name in def.rules) {
            const rule = def.rules[name];
            Assert(typeof rule === 'object', 'Invalid rule definition for', def.type, name);

            let method = rule.method;
            if (method === undefined) {
                method = function () {

                    return this.$_addRule(name);
                };
            }

            if (method) {
                Assert(!prototype[name], 'Rule conflict in', def.type, name);
                prototype[name] = method;
            }

            Assert(!rules[name], 'Rule conflict in', def.type, name);
            rules[name] = rule;

            if (rule.alias) {
                const aliases = [].concat(rule.alias);
                for (const alias of aliases) {
                    prototype[alias] = rule.method;
                }
            }

            if (rule.args) {
                rule.argsByName = new Map();
                rule.args = rule.args.map((arg) => {

                    if (typeof arg === 'string') {
                        arg = { name: arg };
                    }

                    Assert(!rule.argsByName.has(arg.name), 'Duplicated argument name', arg.name);

                    if (Common.isSchema(arg.assert)) {
                        arg.assert = arg.assert.strict().label(arg.name);
                    }

                    rule.argsByName.set(arg.name, arg);
                    return arg;
                });
            }
        }
    }

    def.rules = rules;

    // Modifiers

    const modifiers = Object.assign({}, parent.modifiers);
    if (def.modifiers) {
        for (const name in def.modifiers) {
            Assert(!prototype[name], 'Rule conflict in', def.type, name);

            const modifier = def.modifiers[name];
            Assert(typeof modifier === 'function', 'Invalid modifier definition for', def.type, name);

            const method = function (arg) {

                return this.rule({ [name]: arg });
            };

            prototype[name] = method;
            modifiers[name] = modifier;
        }
    }

    def.modifiers = modifiers;

    // Overrides

    if (def.overrides) {
        prototype._super = base;
        schema.$_super = {};                                                            // Backwards compatibility
        for (const override in def.overrides) {
            Assert(base[override], 'Cannot override missing', override);
            def.overrides[override][Common.symbols.parent] = base[override];
            schema.$_super[override] = base[override].bind(schema);                     // Backwards compatibility
        }

        Object.assign(prototype, def.overrides);
    }

    // Casts

    def.cast = Object.assign({}, parent.cast, def.cast);

    // Manifest

    const manifest = Object.assign({}, parent.manifest, def.manifest);
    manifest.build = internals.build(def.manifest && def.manifest.build, parent.manifest && parent.manifest.build);
    def.manifest = manifest;

    // Rebuild

    def.rebuild = internals.rebuild(def.rebuild, parent.rebuild);

    return schema;
};


// Helpers

internals.build = function (child, parent) {

    if (!child ||
        !parent) {

        return child || parent;
    }

    return function (obj, desc) {

        return parent(child(obj, desc), desc);
    };
};


internals.coerce = function (child, parent) {

    if (!child ||
        !parent) {

        return child || parent;
    }

    return {
        from: child.from && parent.from ? [...new Set([...child.from, ...parent.from])] : null,
        method(value, helpers) {

            let coerced;
            if (!parent.from ||
                parent.from.includes(typeof value)) {

                coerced = parent.method(value, helpers);
                if (coerced) {
                    if (coerced.errors ||
                        coerced.value === undefined) {

                        return coerced;
                    }

                    value = coerced.value;
                }
            }

            if (!child.from ||
                child.from.includes(typeof value)) {

                const own = child.method(value, helpers);
                if (own) {
                    return own;
                }
            }

            return coerced;
        }
    };
};


internals.prepare = function (child, parent) {

    if (!child ||
        !parent) {

        return child || parent;
    }

    return function (value, helpers) {

        const prepared = child(value, helpers);
        if (prepared) {
            if (prepared.errors ||
                prepared.value === undefined) {

                return prepared;
            }

            value = prepared.value;
        }

        return parent(value, helpers) || prepared;
    };
};


internals.rebuild = function (child, parent) {

    if (!child ||
        !parent) {

        return child || parent;
    }

    return function (schema) {

        parent(schema);
        child(schema);
    };
};


internals.validate = function (child, parent) {

    if (!child ||
        !parent) {

        return child || parent;
    }

    return function (value, helpers) {

        const result = parent(value, helpers);
        if (result) {
            if (result.errors &&
                (!Array.isArray(result.errors) || result.errors.length)) {

                return result;
            }

            value = result.value;
        }

        return child(value, helpers) || result;
    };
};


/***/ }),

/***/ 7964:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);
const Clone = __nccwpck_require__(5578);

const Cache = __nccwpck_require__(3355);
const Common = __nccwpck_require__(2448);
const Compile = __nccwpck_require__(3038);
const Errors = __nccwpck_require__(9490);
const Extend = __nccwpck_require__(6680);
const Manifest = __nccwpck_require__(7997);
const Ref = __nccwpck_require__(3838);
const Template = __nccwpck_require__(1396);
const Trace = __nccwpck_require__(3171);

let Schemas;


const internals = {
    types: {
        alternatives: __nccwpck_require__(6867),
        any: __nccwpck_require__(9512),
        array: __nccwpck_require__(270),
        boolean: __nccwpck_require__(7489),
        date: __nccwpck_require__(6624),
        function: __nccwpck_require__(2269),
        link: __nccwpck_require__(9869),
        number: __nccwpck_require__(5855),
        object: __nccwpck_require__(6077),
        string: __nccwpck_require__(2260),
        symbol: __nccwpck_require__(971)
    },
    aliases: {
        alt: 'alternatives',
        bool: 'boolean',
        func: 'function'
    }
};


if (Buffer) {                                                           // $lab:coverage:ignore$
    internals.types.binary = __nccwpck_require__(4288);
}


internals.root = function () {

    const root = {
        _types: new Set(Object.keys(internals.types))
    };

    // Types

    for (const type of root._types) {
        root[type] = function (...args) {

            Assert(!args.length || ['alternatives', 'link', 'object'].includes(type), 'The', type, 'type does not allow arguments');
            return internals.generate(this, internals.types[type], args);
        };
    }

    // Shortcuts

    for (const method of ['allow', 'custom', 'disallow', 'equal', 'exist', 'forbidden', 'invalid', 'not', 'only', 'optional', 'options', 'prefs', 'preferences', 'required', 'strip', 'valid', 'when']) {
        root[method] = function (...args) {

            return this.any()[method](...args);
        };
    }

    // Methods

    Object.assign(root, internals.methods);

    // Aliases

    for (const alias in internals.aliases) {
        const target = internals.aliases[alias];
        root[alias] = root[target];
    }

    root.x = root.expression;

    // Trace

    if (Trace.setup) {                                          // $lab:coverage:ignore$
        Trace.setup(root);
    }

    return root;
};


internals.methods = {

    ValidationError: Errors.ValidationError,
    version: Common.version,
    cache: Cache.provider,

    assert(value, schema, ...args /* [message], [options] */) {

        internals.assert(value, schema, true, args);
    },

    attempt(value, schema, ...args /* [message], [options] */) {

        return internals.assert(value, schema, false, args);
    },

    build(desc) {

        Assert(typeof Manifest.build === 'function', 'Manifest functionality disabled');
        return Manifest.build(this, desc);
    },

    checkPreferences(prefs) {

        Common.checkPreferences(prefs);
    },

    compile(schema, options) {

        return Compile.compile(this, schema, options);
    },

    defaults(modifier) {

        Assert(typeof modifier === 'function', 'modifier must be a function');

        const joi = Object.assign({}, this);
        for (const type of joi._types) {
            const schema = modifier(joi[type]());
            Assert(Common.isSchema(schema), 'modifier must return a valid schema object');

            joi[type] = function (...args) {

                return internals.generate(this, schema, args);
            };
        }

        return joi;
    },

    expression(...args) {

        return new Template(...args);
    },

    extend(...extensions) {

        Common.verifyFlat(extensions, 'extend');

        Schemas = Schemas || __nccwpck_require__(5614);

        Assert(extensions.length, 'You need to provide at least one extension');
        this.assert(extensions, Schemas.extensions);

        const joi = Object.assign({}, this);
        joi._types = new Set(joi._types);

        for (let extension of extensions) {
            if (typeof extension === 'function') {
                extension = extension(joi);
            }

            this.assert(extension, Schemas.extension);

            const expanded = internals.expandExtension(extension, joi);
            for (const item of expanded) {
                Assert(joi[item.type] === undefined || joi._types.has(item.type), 'Cannot override name', item.type);

                const base = item.base || this.any();
                const schema = Extend.type(base, item);

                joi._types.add(item.type);
                joi[item.type] = function (...args) {

                    return internals.generate(this, schema, args);
                };
            }
        }

        return joi;
    },

    isError: Errors.ValidationError.isError,
    isExpression: Template.isTemplate,
    isRef: Ref.isRef,
    isSchema: Common.isSchema,

    in(...args) {

        return Ref.in(...args);
    },

    override: Common.symbols.override,

    ref(...args) {

        return Ref.create(...args);
    },

    types() {

        const types = {};
        for (const type of this._types) {
            types[type] = this[type]();
        }

        for (const target in internals.aliases) {
            types[target] = this[target]();
        }

        return types;
    }
};


// Helpers

internals.assert = function (value, schema, annotate, args /* [message], [options] */) {

    const message = args[0] instanceof Error || typeof args[0] === 'string' ? args[0] : null;
    const options = message ? args[1] : args[0];
    const result = schema.validate(value, Common.preferences({ errors: { stack: true } }, options || {}));

    let error = result.error;
    if (!error) {
        return result.value;
    }

    if (message instanceof Error) {
        throw message;
    }

    const display = annotate && typeof error.annotate === 'function' ? error.annotate() : error.message;

    if (error instanceof Errors.ValidationError === false) {
        error = Clone(error);
    }

    error.message = message ? `${message} ${display}` : display;
    throw error;
};


internals.generate = function (root, schema, args) {

    Assert(root, 'Must be invoked on a Joi instance.');

    schema.$_root = root;

    if (!schema._definition.args ||
        !args.length) {

        return schema;
    }

    return schema._definition.args(schema, ...args);
};


internals.expandExtension = function (extension, joi) {

    if (typeof extension.type === 'string') {
        return [extension];
    }

    const extended = [];
    for (const type of joi._types) {
        if (extension.type.test(type)) {
            const item = Object.assign({}, extension);
            item.type = type;
            item.base = joi[type]();
            extended.push(item);
        }
    }

    return extended;
};


module.exports = internals.root();


/***/ }),

/***/ 7997:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);
const Clone = __nccwpck_require__(5578);

const Common = __nccwpck_require__(2448);
const Messages = __nccwpck_require__(6103);
const Ref = __nccwpck_require__(3838);
const Template = __nccwpck_require__(1396);

let Schemas;


const internals = {};


exports.describe = function (schema) {

    const def = schema._definition;

    // Type

    const desc = {
        type: schema.type,
        flags: {},
        rules: []
    };

    // Flags

    for (const flag in schema._flags) {
        if (flag[0] !== '_') {
            desc.flags[flag] = internals.describe(schema._flags[flag]);
        }
    }

    if (!Object.keys(desc.flags).length) {
        delete desc.flags;
    }

    // Preferences

    if (schema._preferences) {
        desc.preferences = Clone(schema._preferences, { shallow: ['messages'] });
        delete desc.preferences[Common.symbols.prefs];
        if (desc.preferences.messages) {
            desc.preferences.messages = Messages.decompile(desc.preferences.messages);
        }
    }

    // Allow / Invalid

    if (schema._valids) {
        desc.allow = schema._valids.describe();
    }

    if (schema._invalids) {
        desc.invalid = schema._invalids.describe();
    }

    // Rules

    for (const rule of schema._rules) {
        const ruleDef = def.rules[rule.name];
        if (ruleDef.manifest === false) {                           // Defaults to true
            continue;
        }

        const item = { name: rule.name };

        for (const custom in def.modifiers) {
            if (rule[custom] !== undefined) {
                item[custom] = internals.describe(rule[custom]);
            }
        }

        if (rule.args) {
            item.args = {};
            for (const key in rule.args) {
                const arg = rule.args[key];
                if (key === 'options' &&
                    !Object.keys(arg).length) {

                    continue;
                }

                item.args[key] = internals.describe(arg, { assign: key });
            }

            if (!Object.keys(item.args).length) {
                delete item.args;
            }
        }

        desc.rules.push(item);
    }

    if (!desc.rules.length) {
        delete desc.rules;
    }

    // Terms (must be last to verify no name conflicts)

    for (const term in schema.$_terms) {
        if (term[0] === '_') {
            continue;
        }

        Assert(!desc[term], 'Cannot describe schema due to internal name conflict with', term);

        const items = schema.$_terms[term];
        if (!items) {
            continue;
        }

        if (items instanceof Map) {
            if (items.size) {
                desc[term] = [...items.entries()];
            }

            continue;
        }

        if (Common.isValues(items)) {
            desc[term] = items.describe();
            continue;
        }

        Assert(def.terms[term], 'Term', term, 'missing configuration');
        const manifest = def.terms[term].manifest;
        const mapped = typeof manifest === 'object';
        if (!items.length &&
            !mapped) {

            continue;
        }

        const normalized = [];
        for (const item of items) {
            normalized.push(internals.describe(item));
        }

        // Mapped

        if (mapped) {
            const { from, to } = manifest.mapped;
            desc[term] = {};
            for (const item of normalized) {
                desc[term][item[to]] = item[from];
            }

            continue;
        }

        // Single

        if (manifest === 'single') {
            Assert(normalized.length === 1, 'Term', term, 'contains more than one item');
            desc[term] = normalized[0];
            continue;
        }

        // Array

        desc[term] = normalized;
    }

    internals.validate(schema.$_root, desc);
    return desc;
};


internals.describe = function (item, options = {}) {

    if (Array.isArray(item)) {
        return item.map(internals.describe);
    }

    if (item === Common.symbols.deepDefault) {
        return { special: 'deep' };
    }

    if (typeof item !== 'object' ||
        item === null) {

        return item;
    }

    if (options.assign === 'options') {
        return Clone(item);
    }

    if (Buffer && Buffer.isBuffer(item)) {                          // $lab:coverage:ignore$
        return { buffer: item.toString('binary') };
    }

    if (item instanceof Date) {
        return item.toISOString();
    }

    if (item instanceof Error) {
        return item;
    }

    if (item instanceof RegExp) {
        if (options.assign === 'regex') {
            return item.toString();
        }

        return { regex: item.toString() };
    }

    if (item[Common.symbols.literal]) {
        return { function: item.literal };
    }

    if (typeof item.describe === 'function') {
        if (options.assign === 'ref') {
            return item.describe().ref;
        }

        return item.describe();
    }

    const normalized = {};
    for (const key in item) {
        const value = item[key];
        if (value === undefined) {
            continue;
        }

        normalized[key] = internals.describe(value, { assign: key });
    }

    return normalized;
};


exports.build = function (joi, desc) {

    const builder = new internals.Builder(joi);
    return builder.parse(desc);
};


internals.Builder = class {

    constructor(joi) {

        this.joi = joi;
    }

    parse(desc) {

        internals.validate(this.joi, desc);

        // Type

        let schema = this.joi[desc.type]()._bare();
        const def = schema._definition;

        // Flags

        if (desc.flags) {
            for (const flag in desc.flags) {
                const setter = def.flags[flag] && def.flags[flag].setter || flag;
                Assert(typeof schema[setter] === 'function', 'Invalid flag', flag, 'for type', desc.type);
                schema = schema[setter](this.build(desc.flags[flag]));
            }
        }

        // Preferences

        if (desc.preferences) {
            schema = schema.preferences(this.build(desc.preferences));
        }

        // Allow / Invalid

        if (desc.allow) {
            schema = schema.allow(...this.build(desc.allow));
        }

        if (desc.invalid) {
            schema = schema.invalid(...this.build(desc.invalid));
        }

        // Rules

        if (desc.rules) {
            for (const rule of desc.rules) {
                Assert(typeof schema[rule.name] === 'function', 'Invalid rule', rule.name, 'for type', desc.type);

                const args = [];
                if (rule.args) {
                    const built = {};
                    for (const key in rule.args) {
                        built[key] = this.build(rule.args[key], { assign: key });
                    }

                    const keys = Object.keys(built);
                    const definition = def.rules[rule.name].args;
                    if (definition) {
                        Assert(keys.length <= definition.length, 'Invalid number of arguments for', desc.type, rule.name, '(expected up to', definition.length, ', found', keys.length, ')');
                        for (const { name } of definition) {
                            args.push(built[name]);
                        }
                    }
                    else {
                        Assert(keys.length === 1, 'Invalid number of arguments for', desc.type, rule.name, '(expected up to 1, found', keys.length, ')');
                        args.push(built[keys[0]]);
                    }
                }

                // Apply

                schema = schema[rule.name](...args);

                // Ruleset

                const options = {};
                for (const custom in def.modifiers) {
                    if (rule[custom] !== undefined) {
                        options[custom] = this.build(rule[custom]);
                    }
                }

                if (Object.keys(options).length) {
                    schema = schema.rule(options);
                }
            }
        }

        // Terms

        const terms = {};
        for (const key in desc) {
            if (['allow', 'flags', 'invalid', 'whens', 'preferences', 'rules', 'type'].includes(key)) {
                continue;
            }

            Assert(def.terms[key], 'Term', key, 'missing configuration');
            const manifest = def.terms[key].manifest;

            if (manifest === 'schema') {
                terms[key] = desc[key].map((item) => this.parse(item));
                continue;
            }

            if (manifest === 'values') {
                terms[key] = desc[key].map((item) => this.build(item));
                continue;
            }

            if (manifest === 'single') {
                terms[key] = this.build(desc[key]);
                continue;
            }

            if (typeof manifest === 'object') {
                terms[key] = {};
                for (const name in desc[key]) {
                    const value = desc[key][name];
                    terms[key][name] = this.parse(value);
                }

                continue;
            }

            terms[key] = this.build(desc[key]);
        }

        if (desc.whens) {
            terms.whens = desc.whens.map((when) => this.build(when));
        }

        schema = def.manifest.build(schema, terms);
        schema.$_temp.ruleset = false;
        return schema;
    }

    build(desc, options = {}) {

        if (desc === null) {
            return null;
        }

        if (Array.isArray(desc)) {
            return desc.map((item) => this.build(item));
        }

        if (desc instanceof Error) {
            return desc;
        }

        if (options.assign === 'options') {
            return Clone(desc);
        }

        if (options.assign === 'regex') {
            return internals.regex(desc);
        }

        if (options.assign === 'ref') {
            return Ref.build(desc);
        }

        if (typeof desc !== 'object') {
            return desc;
        }

        if (Object.keys(desc).length === 1) {
            if (desc.buffer) {
                Assert(Buffer, 'Buffers are not supported');
                return Buffer && Buffer.from(desc.buffer, 'binary');                    // $lab:coverage:ignore$
            }

            if (desc.function) {
                return { [Common.symbols.literal]: true, literal: desc.function };
            }

            if (desc.override) {
                return Common.symbols.override;
            }

            if (desc.ref) {
                return Ref.build(desc.ref);
            }

            if (desc.regex) {
                return internals.regex(desc.regex);
            }

            if (desc.special) {
                Assert(['deep'].includes(desc.special), 'Unknown special value', desc.special);
                return Common.symbols.deepDefault;
            }

            if (desc.value) {
                return Clone(desc.value);
            }
        }

        if (desc.type) {
            return this.parse(desc);
        }

        if (desc.template) {
            return Template.build(desc);
        }

        const normalized = {};
        for (const key in desc) {
            normalized[key] = this.build(desc[key], { assign: key });
        }

        return normalized;
    }
};


internals.regex = function (string) {

    const end = string.lastIndexOf('/');
    const exp = string.slice(1, end);
    const flags = string.slice(end + 1);
    return new RegExp(exp, flags);
};


internals.validate = function (joi, desc) {

    Schemas = Schemas || __nccwpck_require__(5614);

    joi.assert(desc, Schemas.description);
};


/***/ }),

/***/ 6103:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);
const Clone = __nccwpck_require__(5578);

const Template = __nccwpck_require__(1396);


const internals = {};


exports.compile = function (messages, target) {

    // Single value string ('plain error message', 'template {error} message')

    if (typeof messages === 'string') {
        Assert(!target, 'Cannot set single message string');
        return new Template(messages);
    }

    // Single value template

    if (Template.isTemplate(messages)) {
        Assert(!target, 'Cannot set single message template');
        return messages;
    }

    // By error code { 'number.min': <string | template> }

    Assert(typeof messages === 'object' && !Array.isArray(messages), 'Invalid message options');

    target = target ? Clone(target) : {};

    for (let code in messages) {
        const message = messages[code];

        if (code === 'root' ||
            Template.isTemplate(message)) {

            target[code] = message;
            continue;
        }

        if (typeof message === 'string') {
            target[code] = new Template(message);
            continue;
        }

        // By language { english: { 'number.min': <string | template> } }

        Assert(typeof message === 'object' && !Array.isArray(message), 'Invalid message for', code);

        const language = code;
        target[language] = target[language] || {};

        for (code in message) {
            const localized = message[code];

            if (code === 'root' ||
                Template.isTemplate(localized)) {

                target[language][code] = localized;
                continue;
            }

            Assert(typeof localized === 'string', 'Invalid message for', code, 'in', language);
            target[language][code] = new Template(localized);
        }
    }

    return target;
};


exports.decompile = function (messages) {

    // By error code { 'number.min': <string | template> }

    const target = {};
    for (let code in messages) {
        const message = messages[code];

        if (code === 'root') {
            target[code] = message;
            continue;
        }

        if (Template.isTemplate(message)) {
            target[code] = message.describe({ compact: true });
            continue;
        }

        // By language { english: { 'number.min': <string | template> } }

        const language = code;
        target[language] = {};

        for (code in message) {
            const localized = message[code];

            if (code === 'root') {
                target[language][code] = localized;
                continue;
            }

            target[language][code] = localized.describe({ compact: true });
        }
    }

    return target;
};


exports.merge = function (base, extended) {

    if (!base) {
        return exports.compile(extended);
    }

    if (!extended) {
        return base;
    }

    // Single value string

    if (typeof extended === 'string') {
        return new Template(extended);
    }

    // Single value template

    if (Template.isTemplate(extended)) {
        return extended;
    }

    // By error code { 'number.min': <string | template> }

    const target = Clone(base);

    for (let code in extended) {
        const message = extended[code];

        if (code === 'root' ||
            Template.isTemplate(message)) {

            target[code] = message;
            continue;
        }

        if (typeof message === 'string') {
            target[code] = new Template(message);
            continue;
        }

        // By language { english: { 'number.min': <string | template> } }

        Assert(typeof message === 'object' && !Array.isArray(message), 'Invalid message for', code);

        const language = code;
        target[language] = target[language] || {};

        for (code in message) {
            const localized = message[code];

            if (code === 'root' ||
                Template.isTemplate(localized)) {

                target[language][code] = localized;
                continue;
            }

            Assert(typeof localized === 'string', 'Invalid message for', code, 'in', language);
            target[language][code] = new Template(localized);
        }
    }

    return target;
};


/***/ }),

/***/ 1290:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);

const Common = __nccwpck_require__(2448);
const Ref = __nccwpck_require__(3838);


const internals = {};



exports.Ids = internals.Ids = class {

    constructor() {

        this._byId = new Map();
        this._byKey = new Map();
        this._schemaChain = false;
    }

    clone() {

        const clone = new internals.Ids();
        clone._byId = new Map(this._byId);
        clone._byKey = new Map(this._byKey);
        clone._schemaChain = this._schemaChain;
        return clone;
    }

    concat(source) {

        if (source._schemaChain) {
            this._schemaChain = true;
        }

        for (const [id, value] of source._byId.entries()) {
            Assert(!this._byKey.has(id), 'Schema id conflicts with existing key:', id);
            this._byId.set(id, value);
        }

        for (const [key, value] of source._byKey.entries()) {
            Assert(!this._byId.has(key), 'Schema key conflicts with existing id:', key);
            this._byKey.set(key, value);
        }
    }

    fork(path, adjuster, root) {

        const chain = this._collect(path);
        chain.push({ schema: root });
        const tail = chain.shift();
        let adjusted = { id: tail.id, schema: adjuster(tail.schema) };

        Assert(Common.isSchema(adjusted.schema), 'adjuster function failed to return a joi schema type');

        for (const node of chain) {
            adjusted = { id: node.id, schema: internals.fork(node.schema, adjusted.id, adjusted.schema) };
        }

        return adjusted.schema;
    }

    labels(path, behind = []) {

        const current = path[0];
        const node = this._get(current);
        if (!node) {
            return [...behind, ...path].join('.');
        }

        const forward = path.slice(1);
        behind = [...behind, node.schema._flags.label || current];
        if (!forward.length) {
            return behind.join('.');
        }

        return node.schema._ids.labels(forward, behind);
    }

    reach(path, behind = []) {

        const current = path[0];
        const node = this._get(current);
        Assert(node, 'Schema does not contain path', [...behind, ...path].join('.'));

        const forward = path.slice(1);
        if (!forward.length) {
            return node.schema;
        }

        return node.schema._ids.reach(forward, [...behind, current]);
    }

    register(schema, { key } = {}) {

        if (!schema ||
            !Common.isSchema(schema)) {

            return;
        }

        if (schema.$_property('schemaChain') ||
            schema._ids._schemaChain) {

            this._schemaChain = true;
        }

        const id = schema._flags.id;
        if (id) {
            const existing = this._byId.get(id);
            Assert(!existing || existing.schema === schema, 'Cannot add different schemas with the same id:', id);
            Assert(!this._byKey.has(id), 'Schema id conflicts with existing key:', id);

            this._byId.set(id, { schema, id });
        }

        if (key) {
            Assert(!this._byKey.has(key), 'Schema already contains key:', key);
            Assert(!this._byId.has(key), 'Schema key conflicts with existing id:', key);

            this._byKey.set(key, { schema, id: key });
        }
    }

    reset() {

        this._byId = new Map();
        this._byKey = new Map();
        this._schemaChain = false;
    }

    _collect(path, behind = [], nodes = []) {

        const current = path[0];
        const node = this._get(current);
        Assert(node, 'Schema does not contain path', [...behind, ...path].join('.'));

        nodes = [node, ...nodes];

        const forward = path.slice(1);
        if (!forward.length) {
            return nodes;
        }

        return node.schema._ids._collect(forward, [...behind, current], nodes);
    }

    _get(id) {

        return this._byId.get(id) || this._byKey.get(id);
    }
};


internals.fork = function (schema, id, replacement) {

    const each = (item, { key }) => {

        if (id === (item._flags.id || key)) {
            return replacement;
        }
    };

    const obj = exports.schema(schema, { each, ref: false });
    return obj ? obj.$_mutateRebuild() : schema;
};


exports.schema = function (schema, options) {

    let obj;

    for (const name in schema._flags) {
        if (name[0] === '_') {
            continue;
        }

        const result = internals.scan(schema._flags[name], { source: 'flags', name }, options);
        if (result !== undefined) {
            obj = obj || schema.clone();
            obj._flags[name] = result;
        }
    }

    for (let i = 0; i < schema._rules.length; ++i) {
        const rule = schema._rules[i];
        const result = internals.scan(rule.args, { source: 'rules', name: rule.name }, options);
        if (result !== undefined) {
            obj = obj || schema.clone();
            const clone = Object.assign({}, rule);
            clone.args = result;
            obj._rules[i] = clone;

            const existingUnique = obj._singleRules.get(rule.name);
            if (existingUnique === rule) {
                obj._singleRules.set(rule.name, clone);
            }
        }
    }

    for (const name in schema.$_terms) {
        if (name[0] === '_') {
            continue;
        }

        const result = internals.scan(schema.$_terms[name], { source: 'terms', name }, options);
        if (result !== undefined) {
            obj = obj || schema.clone();
            obj.$_terms[name] = result;
        }
    }

    return obj;
};


internals.scan = function (item, source, options, _path, _key) {

    const path = _path || [];

    if (item === null ||
        typeof item !== 'object') {

        return;
    }

    let clone;

    if (Array.isArray(item)) {
        for (let i = 0; i < item.length; ++i) {
            const key = source.source === 'terms' && source.name === 'keys' && item[i].key;
            const result = internals.scan(item[i], source, options, [i, ...path], key);
            if (result !== undefined) {
                clone = clone || item.slice();
                clone[i] = result;
            }
        }

        return clone;
    }

    if (options.schema !== false && Common.isSchema(item) ||
        options.ref !== false && Ref.isRef(item)) {

        const result = options.each(item, { ...source, path, key: _key });
        if (result === item) {
            return;
        }

        return result;
    }

    for (const key in item) {
        if (key[0] === '_') {
            continue;
        }

        const result = internals.scan(item[key], source, options, [key, ...path], _key);
        if (result !== undefined) {
            clone = clone || Object.assign({}, item);
            clone[key] = result;
        }
    }

    return clone;
};


/***/ }),

/***/ 3838:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);
const Clone = __nccwpck_require__(5578);
const Reach = __nccwpck_require__(8891);

const Common = __nccwpck_require__(2448);

let Template;


const internals = {
    symbol: Symbol('ref'),      // Used to internally identify references (shared with other joi versions)
    defaults: {
        adjust: null,
        in: false,
        iterables: null,
        map: null,
        separator: '.',
        type: 'value'
    }
};


exports.create = function (key, options = {}) {

    Assert(typeof key === 'string', 'Invalid reference key:', key);
    Common.assertOptions(options, ['adjust', 'ancestor', 'in', 'iterables', 'map', 'prefix', 'render', 'separator']);
    Assert(!options.prefix || typeof options.prefix === 'object', 'options.prefix must be of type object');

    const ref = Object.assign({}, internals.defaults, options);
    delete ref.prefix;

    const separator = ref.separator;
    const context = internals.context(key, separator, options.prefix);
    ref.type = context.type;
    key = context.key;

    if (ref.type === 'value') {
        if (context.root) {
            Assert(!separator || key[0] !== separator, 'Cannot specify relative path with root prefix');
            ref.ancestor = 'root';
            if (!key) {
                key = null;
            }
        }

        if (separator &&
            separator === key) {

            key = null;
            ref.ancestor = 0;
        }
        else {
            if (ref.ancestor !== undefined) {
                Assert(!separator || !key || key[0] !== separator, 'Cannot combine prefix with ancestor option');
            }
            else {
                const [ancestor, slice] = internals.ancestor(key, separator);
                if (slice) {
                    key = key.slice(slice);
                    if (key === '') {
                        key = null;
                    }
                }

                ref.ancestor = ancestor;
            }
        }
    }

    ref.path = separator ? (key === null ? [] : key.split(separator)) : [key];

    return new internals.Ref(ref);
};


exports.in = function (key, options = {}) {

    return exports.create(key, { ...options, in: true });
};


exports.isRef = function (ref) {

    return ref ? !!ref[Common.symbols.ref] : false;
};


internals.Ref = class {

    constructor(options) {

        Assert(typeof options === 'object', 'Invalid reference construction');
        Common.assertOptions(options, [
            'adjust', 'ancestor', 'in', 'iterables', 'map', 'path', 'render', 'separator', 'type',  // Copied
            'depth', 'key', 'root', 'display'                                                       // Overridden
        ]);

        Assert([false, undefined].includes(options.separator) || typeof options.separator === 'string' && options.separator.length === 1, 'Invalid separator');
        Assert(!options.adjust || typeof options.adjust === 'function', 'options.adjust must be a function');
        Assert(!options.map || Array.isArray(options.map), 'options.map must be an array');
        Assert(!options.map || !options.adjust, 'Cannot set both map and adjust options');

        Object.assign(this, internals.defaults, options);

        Assert(this.type === 'value' || this.ancestor === undefined, 'Non-value references cannot reference ancestors');

        if (Array.isArray(this.map)) {
            this.map = new Map(this.map);
        }

        this.depth = this.path.length;
        this.key = this.path.length ? this.path.join(this.separator) : null;
        this.root = this.path[0];

        this.updateDisplay();
    }

    resolve(value, state, prefs, local, options = {}) {

        Assert(!this.in || options.in, 'Invalid in() reference usage');

        if (this.type === 'global') {
            return this._resolve(prefs.context, state, options);
        }

        if (this.type === 'local') {
            return this._resolve(local, state, options);
        }

        if (!this.ancestor) {
            return this._resolve(value, state, options);
        }

        if (this.ancestor === 'root') {
            return this._resolve(state.ancestors[state.ancestors.length - 1], state, options);
        }

        Assert(this.ancestor <= state.ancestors.length, 'Invalid reference exceeds the schema root:', this.display);
        return this._resolve(state.ancestors[this.ancestor - 1], state, options);
    }

    _resolve(target, state, options) {

        let resolved;

        if (this.type === 'value' &&
            state.mainstay.shadow &&
            options.shadow !== false) {

            resolved = state.mainstay.shadow.get(this.absolute(state));
        }

        if (resolved === undefined) {
            resolved = Reach(target, this.path, { iterables: this.iterables, functions: true });
        }

        if (this.adjust) {
            resolved = this.adjust(resolved);
        }

        if (this.map) {
            const mapped = this.map.get(resolved);
            if (mapped !== undefined) {
                resolved = mapped;
            }
        }

        if (state.mainstay) {
            state.mainstay.tracer.resolve(state, this, resolved);
        }

        return resolved;
    }

    toString() {

        return this.display;
    }

    absolute(state) {

        return [...state.path.slice(0, -this.ancestor), ...this.path];
    }

    clone() {

        return new internals.Ref(this);
    }

    describe() {

        const ref = { path: this.path };

        if (this.type !== 'value') {
            ref.type = this.type;
        }

        if (this.separator !== '.') {
            ref.separator = this.separator;
        }

        if (this.type === 'value' &&
            this.ancestor !== 1) {

            ref.ancestor = this.ancestor;
        }

        if (this.map) {
            ref.map = [...this.map];
        }

        for (const key of ['adjust', 'iterables', 'render']) {
            if (this[key] !== null &&
                this[key] !== undefined) {

                ref[key] = this[key];
            }
        }

        if (this.in !== false) {
            ref.in = true;
        }

        return { ref };
    }

    updateDisplay() {

        const key = this.key !== null ? this.key : '';
        if (this.type !== 'value') {
            this.display = `ref:${this.type}:${key}`;
            return;
        }

        if (!this.separator) {
            this.display = `ref:${key}`;
            return;
        }

        if (!this.ancestor) {
            this.display = `ref:${this.separator}${key}`;
            return;
        }

        if (this.ancestor === 'root') {
            this.display = `ref:root:${key}`;
            return;
        }

        if (this.ancestor === 1) {
            this.display = `ref:${key || '..'}`;
            return;
        }

        const lead = new Array(this.ancestor + 1).fill(this.separator).join('');
        this.display = `ref:${lead}${key || ''}`;
    }
};


internals.Ref.prototype[Common.symbols.ref] = true;


exports.build = function (desc) {

    desc = Object.assign({}, internals.defaults, desc);
    if (desc.type === 'value' &&
        desc.ancestor === undefined) {

        desc.ancestor = 1;
    }

    return new internals.Ref(desc);
};


internals.context = function (key, separator, prefix = {}) {

    key = key.trim();

    if (prefix) {
        const globalp = prefix.global === undefined ? '$' : prefix.global;
        if (globalp !== separator &&
            key.startsWith(globalp)) {

            return { key: key.slice(globalp.length), type: 'global' };
        }

        const local = prefix.local === undefined ? '#' : prefix.local;
        if (local !== separator &&
            key.startsWith(local)) {

            return { key: key.slice(local.length), type: 'local' };
        }

        const root = prefix.root === undefined ? '/' : prefix.root;
        if (root !== separator &&
            key.startsWith(root)) {

            return { key: key.slice(root.length), type: 'value', root: true };
        }
    }

    return { key, type: 'value' };
};


internals.ancestor = function (key, separator) {

    if (!separator) {
        return [1, 0];              // 'a_b' -> 1 (parent)
    }

    if (key[0] !== separator) {     // 'a.b' -> 1 (parent)
        return [1, 0];
    }

    if (key[1] !== separator) {     // '.a.b' -> 0 (self)
        return [0, 1];
    }

    let i = 2;
    while (key[i] === separator) {
        ++i;
    }

    return [i - 1, i];              // '...a.b.' -> 2 (grandparent)
};


exports.toSibling = 0;

exports.toParent = 1;


exports.Manager = class {

    constructor() {

        this.refs = [];                     // 0: [self refs], 1: [parent refs], 2: [grandparent refs], ...
    }

    register(source, target) {

        if (!source) {
            return;
        }

        target = target === undefined ? exports.toParent : target;

        // Array

        if (Array.isArray(source)) {
            for (const ref of source) {
                this.register(ref, target);
            }

            return;
        }

        // Schema

        if (Common.isSchema(source)) {
            for (const item of source._refs.refs) {
                if (item.ancestor - target >= 0) {
                    this.refs.push({ ancestor: item.ancestor - target, root: item.root });
                }
            }

            return;
        }

        // Reference

        if (exports.isRef(source) &&
            source.type === 'value' &&
            source.ancestor - target >= 0) {

            this.refs.push({ ancestor: source.ancestor - target, root: source.root });
        }

        // Template

        Template = Template || __nccwpck_require__(1396);

        if (Template.isTemplate(source)) {
            this.register(source.refs(), target);
        }
    }

    get length() {

        return this.refs.length;
    }

    clone() {

        const copy = new exports.Manager();
        copy.refs = Clone(this.refs);
        return copy;
    }

    reset() {

        this.refs = [];
    }

    roots() {

        return this.refs.filter((ref) => !ref.ancestor).map((ref) => ref.root);
    }
};


/***/ }),

/***/ 5614:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const Joi = __nccwpck_require__(7964);


const internals = {};


// Preferences

internals.wrap = Joi.string()
    .min(1)
    .max(2)
    .allow(false);


exports.preferences = Joi.object({
    allowUnknown: Joi.boolean(),
    abortEarly: Joi.boolean(),
    artifacts: Joi.boolean(),
    cache: Joi.boolean(),
    context: Joi.object(),
    convert: Joi.boolean(),
    dateFormat: Joi.valid('date', 'iso', 'string', 'time', 'utc'),
    debug: Joi.boolean(),
    errors: {
        escapeHtml: Joi.boolean(),
        label: Joi.valid('path', 'key', false),
        language: [
            Joi.string(),
            Joi.object().ref()
        ],
        render: Joi.boolean(),
        stack: Joi.boolean(),
        wrap: {
            label: internals.wrap,
            array: internals.wrap
        }
    },
    externals: Joi.boolean(),
    messages: Joi.object(),
    noDefaults: Joi.boolean(),
    nonEnumerables: Joi.boolean(),
    presence: Joi.valid('required', 'optional', 'forbidden'),
    skipFunctions: Joi.boolean(),
    stripUnknown: Joi.object({
        arrays: Joi.boolean(),
        objects: Joi.boolean()
    })
        .or('arrays', 'objects')
        .allow(true, false),
    warnings: Joi.boolean()
})
    .strict();


// Extensions

internals.nameRx = /^[a-zA-Z0-9]\w*$/;


internals.rule = Joi.object({
    alias: Joi.array().items(Joi.string().pattern(internals.nameRx)).single(),
    args: Joi.array().items(
        Joi.string(),
        Joi.object({
            name: Joi.string().pattern(internals.nameRx).required(),
            ref: Joi.boolean(),
            assert: Joi.alternatives([
                Joi.function(),
                Joi.object().schema()
            ])
                .conditional('ref', { is: true, then: Joi.required() }),
            normalize: Joi.function(),
            message: Joi.string().when('assert', { is: Joi.function(), then: Joi.required() })
        })
    ),
    convert: Joi.boolean(),
    manifest: Joi.boolean(),
    method: Joi.function().allow(false),
    multi: Joi.boolean(),
    validate: Joi.function()
});


exports.extension = Joi.object({
    type: Joi.alternatives([
        Joi.string(),
        Joi.object().regex()
    ])
        .required(),
    args: Joi.function(),
    cast: Joi.object().pattern(internals.nameRx, Joi.object({
        from: Joi.function().maxArity(1).required(),
        to: Joi.function().minArity(1).maxArity(2).required()
    })),
    base: Joi.object().schema()
        .when('type', { is: Joi.object().regex(), then: Joi.forbidden() }),
    coerce: [
        Joi.function().maxArity(3),
        Joi.object({ method: Joi.function().maxArity(3).required(), from: Joi.array().items(Joi.string()).single() })
    ],
    flags: Joi.object().pattern(internals.nameRx, Joi.object({
        setter: Joi.string(),
        default: Joi.any()
    })),
    manifest: {
        build: Joi.function().arity(2)
    },
    messages: [Joi.object(), Joi.string()],
    modifiers: Joi.object().pattern(internals.nameRx, Joi.function().minArity(1).maxArity(2)),
    overrides: Joi.object().pattern(internals.nameRx, Joi.function()),
    prepare: Joi.function().maxArity(3),
    rebuild: Joi.function().arity(1),
    rules: Joi.object().pattern(internals.nameRx, internals.rule),
    terms: Joi.object().pattern(internals.nameRx, Joi.object({
        init: Joi.array().allow(null).required(),
        manifest: Joi.object().pattern(/.+/, [
            Joi.valid('schema', 'single'),
            Joi.object({
                mapped: Joi.object({
                    from: Joi.string().required(),
                    to: Joi.string().required()
                })
                    .required()
            })
        ])
    })),
    validate: Joi.function().maxArity(3)
})
    .strict();


exports.extensions = Joi.array().items(Joi.object(), Joi.function().arity(1)).strict();


// Manifest

internals.desc = {

    buffer: Joi.object({
        buffer: Joi.string()
    }),

    func: Joi.object({
        function: Joi.function().required(),
        options: {
            literal: true
        }
    }),

    override: Joi.object({
        override: true
    }),

    ref: Joi.object({
        ref: Joi.object({
            type: Joi.valid('value', 'global', 'local'),
            path: Joi.array().required(),
            separator: Joi.string().length(1).allow(false),
            ancestor: Joi.number().min(0).integer().allow('root'),
            map: Joi.array().items(Joi.array().length(2)).min(1),
            adjust: Joi.function(),
            iterables: Joi.boolean(),
            in: Joi.boolean(),
            render: Joi.boolean()
        })
            .required()
    }),

    regex: Joi.object({
        regex: Joi.string().min(3)
    }),

    special: Joi.object({
        special: Joi.valid('deep').required()
    }),

    template: Joi.object({
        template: Joi.string().required(),
        options: Joi.object()
    }),

    value: Joi.object({
        value: Joi.alternatives([Joi.object(), Joi.array()]).required()
    })
};


internals.desc.entity = Joi.alternatives([
    Joi.array().items(Joi.link('...')),
    Joi.boolean(),
    Joi.function(),
    Joi.number(),
    Joi.string(),
    internals.desc.buffer,
    internals.desc.func,
    internals.desc.ref,
    internals.desc.regex,
    internals.desc.special,
    internals.desc.template,
    internals.desc.value,
    Joi.link('/')
]);


internals.desc.values = Joi.array()
    .items(
        null,
        Joi.boolean(),
        Joi.function(),
        Joi.number().allow(Infinity, -Infinity),
        Joi.string().allow(''),
        Joi.symbol(),
        internals.desc.buffer,
        internals.desc.func,
        internals.desc.override,
        internals.desc.ref,
        internals.desc.regex,
        internals.desc.template,
        internals.desc.value
    );


internals.desc.messages = Joi.object()
    .pattern(/.+/, [
        Joi.string(),
        internals.desc.template,
        Joi.object().pattern(/.+/, [Joi.string(), internals.desc.template])
    ]);


exports.description = Joi.object({
    type: Joi.string().required(),
    flags: Joi.object({
        cast: Joi.string(),
        default: Joi.any(),
        description: Joi.string(),
        empty: Joi.link('/'),
        failover: internals.desc.entity,
        id: Joi.string(),
        label: Joi.string(),
        only: true,
        presence: ['optional', 'required', 'forbidden'],
        result: ['raw', 'strip'],
        strip: Joi.boolean(),
        unit: Joi.string()
    })
        .unknown(),
    preferences: {
        allowUnknown: Joi.boolean(),
        abortEarly: Joi.boolean(),
        artifacts: Joi.boolean(),
        cache: Joi.boolean(),
        convert: Joi.boolean(),
        dateFormat: ['date', 'iso', 'string', 'time', 'utc'],
        errors: {
            escapeHtml: Joi.boolean(),
            label: ['path', 'key'],
            language: [
                Joi.string(),
                internals.desc.ref
            ],
            wrap: {
                label: internals.wrap,
                array: internals.wrap
            }
        },
        externals: Joi.boolean(),
        messages: internals.desc.messages,
        noDefaults: Joi.boolean(),
        nonEnumerables: Joi.boolean(),
        presence: ['required', 'optional', 'forbidden'],
        skipFunctions: Joi.boolean(),
        stripUnknown: Joi.object({
            arrays: Joi.boolean(),
            objects: Joi.boolean()
        })
            .or('arrays', 'objects')
            .allow(true, false),
        warnings: Joi.boolean()
    },
    allow: internals.desc.values,
    invalid: internals.desc.values,
    rules: Joi.array().min(1).items({
        name: Joi.string().required(),
        args: Joi.object().min(1),
        keep: Joi.boolean(),
        message: [
            Joi.string(),
            internals.desc.messages
        ],
        warn: Joi.boolean()
    }),

    // Terms

    keys: Joi.object().pattern(/.*/, Joi.link('/')),
    link: internals.desc.ref
})
    .pattern(/^[a-z]\w*$/, Joi.any());


/***/ }),

/***/ 3634:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Clone = __nccwpck_require__(5578);
const Reach = __nccwpck_require__(8891);

const Common = __nccwpck_require__(2448);


const internals = {
    value: Symbol('value')
};


module.exports = internals.State = class {

    constructor(path, ancestors, state) {

        this.path = path;
        this.ancestors = ancestors;                 // [parent, ..., root]

        this.mainstay = state.mainstay;
        this.schemas = state.schemas;               // [current, ..., root]
        this.debug = null;
    }

    localize(path, ancestors = null, schema = null) {

        const state = new internals.State(path, ancestors, this);

        if (schema &&
            state.schemas) {

            state.schemas = [internals.schemas(schema), ...state.schemas];
        }

        return state;
    }

    nest(schema, debug) {

        const state = new internals.State(this.path, this.ancestors, this);
        state.schemas = state.schemas && [internals.schemas(schema), ...state.schemas];
        state.debug = debug;
        return state;
    }

    shadow(value, reason) {

        this.mainstay.shadow = this.mainstay.shadow || new internals.Shadow();
        this.mainstay.shadow.set(this.path, value, reason);
    }

    snapshot() {

        if (this.mainstay.shadow) {
            this._snapshot = Clone(this.mainstay.shadow.node(this.path));
        }
    }

    restore() {

        if (this.mainstay.shadow) {
            this.mainstay.shadow.override(this.path, this._snapshot);
            this._snapshot = undefined;
        }
    }
};


internals.schemas = function (schema) {

    if (Common.isSchema(schema)) {
        return { schema };
    }

    return schema;
};


internals.Shadow = class {

    constructor() {

        this._values = null;
    }

    set(path, value, reason) {

        if (!path.length) {                                     // No need to store root value
            return;
        }

        if (reason === 'strip' &&
            typeof path[path.length - 1] === 'number') {        // Cannot store stripped array values (due to shift)

            return;
        }

        this._values = this._values || new Map();

        let node = this._values;
        for (let i = 0; i < path.length; ++i) {
            const segment = path[i];
            let next = node.get(segment);
            if (!next) {
                next = new Map();
                node.set(segment, next);
            }

            node = next;
        }

        node[internals.value] = value;
    }

    get(path) {

        const node = this.node(path);
        if (node) {
            return node[internals.value];
        }
    }

    node(path) {

        if (!this._values) {
            return;
        }

        return Reach(this._values, path, { iterables: true });
    }

    override(path, node) {

        if (!this._values) {
            return;
        }

        const parents = path.slice(0, -1);
        const own = path[path.length - 1];
        const parent = Reach(this._values, parents, { iterables: true });

        if (node) {
            parent.set(own, node);
            return;
        }

        if (parent) {
            parent.delete(own);
        }
    }
};


/***/ }),

/***/ 1396:
/***/ ((module, exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);
const Clone = __nccwpck_require__(5578);
const EscapeHtml = __nccwpck_require__(4752);
const Formula = __nccwpck_require__(4379);

const Common = __nccwpck_require__(2448);
const Errors = __nccwpck_require__(9490);
const Ref = __nccwpck_require__(3838);


const internals = {
    symbol: Symbol('template'),

    opens: new Array(1000).join('\u0000'),
    closes: new Array(1000).join('\u0001'),

    dateFormat: {
        date: Date.prototype.toDateString,
        iso: Date.prototype.toISOString,
        string: Date.prototype.toString,
        time: Date.prototype.toTimeString,
        utc: Date.prototype.toUTCString
    }
};


module.exports = exports = internals.Template = class {

    constructor(source, options) {

        Assert(typeof source === 'string', 'Template source must be a string');
        Assert(!source.includes('\u0000') && !source.includes('\u0001'), 'Template source cannot contain reserved control characters');

        this.source = source;
        this.rendered = source;

        this._template = null;
        this._settings = Clone(options);

        this._parse();
    }

    _parse() {

        // 'text {raw} {{ref}} \\{{ignore}} {{ignore\\}} {{ignore {{ignore}'

        if (!this.source.includes('{')) {
            return;
        }

        // Encode escaped \\{{{{{

        const encoded = internals.encode(this.source);

        // Split on first { in each set

        const parts = internals.split(encoded);

        // Process parts

        let refs = false;
        const processed = [];
        const head = parts.shift();
        if (head) {
            processed.push(head);
        }

        for (const part of parts) {
            const raw = part[0] !== '{';
            const ender = raw ? '}' : '}}';
            const end = part.indexOf(ender);
            if (end === -1 ||                               // Ignore non-matching closing
                part[1] === '{') {                          // Ignore more than two {

                processed.push(`{${internals.decode(part)}`);
                continue;
            }

            let variable = part.slice(raw ? 0 : 1, end);
            const wrapped = variable[0] === ':';
            if (wrapped) {
                variable = variable.slice(1);
            }

            const dynamic = this._ref(internals.decode(variable), { raw, wrapped });
            processed.push(dynamic);
            if (typeof dynamic !== 'string') {
                refs = true;
            }

            const rest = part.slice(end + ender.length);
            if (rest) {
                processed.push(internals.decode(rest));
            }
        }

        if (!refs) {
            this.rendered = processed.join('');
            return;
        }

        this._template = processed;
    }

    static date(date, prefs) {

        return internals.dateFormat[prefs.dateFormat].call(date);
    }

    describe(options = {}) {

        if (!this._settings &&
            options.compact) {

            return this.source;
        }

        const desc = { template: this.source };
        if (this._settings) {
            desc.options = this._settings;
        }

        return desc;
    }

    static build(desc) {

        return new internals.Template(desc.template, desc.options);
    }

    isDynamic() {

        return !!this._template;
    }

    static isTemplate(template) {

        return template ? !!template[Common.symbols.template] : false;
    }

    refs() {

        if (!this._template) {
            return;
        }

        const refs = [];
        for (const part of this._template) {
            if (typeof part !== 'string') {
                refs.push(...part.refs);
            }
        }

        return refs;
    }

    resolve(value, state, prefs, local) {

        if (this._template &&
            this._template.length === 1) {

            return this._part(this._template[0], /* context -> [*/ value, state, prefs, local, {} /*] */);
        }

        return this.render(value, state, prefs, local);
    }

    _part(part, ...args) {

        if (part.ref) {
            return part.ref.resolve(...args);
        }

        return part.formula.evaluate(args);
    }

    render(value, state, prefs, local, options = {}) {

        if (!this.isDynamic()) {
            return this.rendered;
        }

        const parts = [];
        for (const part of this._template) {
            if (typeof part === 'string') {
                parts.push(part);
            }
            else {
                const rendered = this._part(part, /* context -> [*/ value, state, prefs, local, options /*] */);
                const string = internals.stringify(rendered, value, state, prefs, local, options);
                if (string !== undefined) {
                    const result = part.raw || (options.errors && options.errors.escapeHtml) === false ? string : EscapeHtml(string);
                    parts.push(internals.wrap(result, part.wrapped && prefs.errors.wrap.label));
                }
            }
        }

        return parts.join('');
    }

    _ref(content, { raw, wrapped }) {

        const refs = [];
        const reference = (variable) => {

            const ref = Ref.create(variable, this._settings);
            refs.push(ref);
            return (context) => ref.resolve(...context);
        };

        try {
            var formula = new Formula.Parser(content, { reference, functions: internals.functions, constants: internals.constants });
        }
        catch (err) {
            err.message = `Invalid template variable "${content}" fails due to: ${err.message}`;
            throw err;
        }

        if (formula.single) {
            if (formula.single.type === 'reference') {
                const ref = refs[0];
                return { ref, raw, refs, wrapped: wrapped || ref.type === 'local' && ref.key === 'label' };
            }

            return internals.stringify(formula.single.value);
        }

        return { formula, raw, refs };
    }

    toString() {

        return this.source;
    }
};


internals.Template.prototype[Common.symbols.template] = true;
internals.Template.prototype.isImmutable = true;                // Prevents Hoek from deep cloning schema objects


internals.encode = function (string) {

    return string
        .replace(/\\(\{+)/g, ($0, $1) => {

            return internals.opens.slice(0, $1.length);
        })
        .replace(/\\(\}+)/g, ($0, $1) => {

            return internals.closes.slice(0, $1.length);
        });
};


internals.decode = function (string) {

    return string
        .replace(/\u0000/g, '{')
        .replace(/\u0001/g, '}');
};


internals.split = function (string) {

    const parts = [];
    let current = '';

    for (let i = 0; i < string.length; ++i) {
        const char = string[i];

        if (char === '{') {
            let next = '';
            while (i + 1 < string.length &&
                string[i + 1] === '{') {

                next += '{';
                ++i;
            }

            parts.push(current);
            current = next;
        }
        else {
            current += char;
        }
    }

    parts.push(current);
    return parts;
};


internals.wrap = function (value, ends) {

    if (!ends) {
        return value;
    }

    if (ends.length === 1) {
        return `${ends}${value}${ends}`;
    }

    return `${ends[0]}${value}${ends[1]}`;
};


internals.stringify = function (value, original, state, prefs, local, options) {

    const type = typeof value;

    let skipWrap = false;
    if (Ref.isRef(value) &&
        value.render) {

        skipWrap = value.in;
        value = value.resolve(original, state, prefs, local, { in: value.in, ...options });
    }

    if (value === null) {
        return 'null';
    }

    if (type === 'string') {
        return value;
    }

    if (type === 'number' ||
        type === 'function' ||
        type === 'symbol') {

        return value.toString();
    }

    if (type !== 'object') {
        return JSON.stringify(value);
    }

    if (value instanceof Date) {
        return internals.Template.date(value, prefs);
    }

    if (value instanceof Map) {
        const pairs = [];
        for (const [key, sym] of value.entries()) {
            pairs.push(`${key.toString()} -> ${sym.toString()}`);
        }

        value = pairs;
    }

    if (!Array.isArray(value)) {
        return value.toString();
    }

    let partial = '';
    for (const item of value) {
        partial = partial + (partial.length ? ', ' : '') + internals.stringify(item, original, state, prefs, local, options);
    }

    if (skipWrap) {
        return partial;
    }

    return internals.wrap(partial, prefs.errors.wrap.array);
};


internals.constants = {

    true: true,
    false: false,
    null: null,

    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000
};


internals.functions = {

    if(condition, then, otherwise) {

        return condition ? then : otherwise;
    },

    msg(code) {

        const [value, state, prefs, local, options] = this;
        const messages = options.messages;
        if (!messages) {
            return '';
        }

        const template = Errors.template(value, messages[0], code, state, prefs) || Errors.template(value, messages[1], code, state, prefs);
        if (!template) {
            return '';
        }

        return template.render(value, state, prefs, local, options);
    },

    number(value) {

        if (typeof value === 'number') {
            return value;
        }

        if (typeof value === 'string') {
            return parseFloat(value);
        }

        if (typeof value === 'boolean') {
            return value ? 1 : 0;
        }

        if (value instanceof Date) {
            return value.getTime();
        }

        return null;
    }
};


/***/ }),

/***/ 3171:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const DeepEqual = __nccwpck_require__(5801);
const Pinpoint = __nccwpck_require__(5604);

const Errors = __nccwpck_require__(9490);


const internals = {
    codes: {
        error: 1,
        pass: 2,
        full: 3
    },
    labels: {
        0: 'never used',
        1: 'always error',
        2: 'always pass'
    }
};


exports.setup = function (root) {

    const trace = function () {

        root._tracer = root._tracer || new internals.Tracer();
        return root._tracer;
    };

    root.trace = trace;
    root[Symbol.for('@hapi/lab/coverage/initialize')] = trace;

    root.untrace = () => {

        root._tracer = null;
    };
};


exports.location = function (schema) {

    return schema.$_setFlag('_tracerLocation', Pinpoint.location(2));                       // base.tracer(), caller
};


internals.Tracer = class {

    constructor() {

        this.name = 'Joi';
        this._schemas = new Map();
    }

    _register(schema) {

        const existing = this._schemas.get(schema);
        if (existing) {
            return existing.store;
        }

        const store = new internals.Store(schema);
        const { filename, line } = schema._flags._tracerLocation || Pinpoint.location(5);   // internals.tracer(), internals.entry(), exports.entry(), validate(), caller
        this._schemas.set(schema, { filename, line, store });
        return store;
    }

    _combine(merged, sources) {

        for (const { store } of this._schemas.values()) {
            store._combine(merged, sources);
        }
    }

    report(file) {

        const coverage = [];

        // Process each registered schema

        for (const { filename, line, store } of this._schemas.values()) {
            if (file &&
                file !== filename) {

                continue;
            }

            // Process sub schemas of the registered root

            const missing = [];
            const skipped = [];

            for (const [schema, log] of store._sources.entries()) {

                // Check if sub schema parent skipped

                if (internals.sub(log.paths, skipped)) {
                    continue;
                }

                // Check if sub schema reached

                if (!log.entry) {
                    missing.push({
                        status: 'never reached',
                        paths: [...log.paths]
                    });

                    skipped.push(...log.paths);
                    continue;
                }

                // Check values

                for (const type of ['valid', 'invalid']) {
                    const set = schema[`_${type}s`];
                    if (!set) {
                        continue;
                    }

                    const values = new Set(set._values);
                    const refs = new Set(set._refs);
                    for (const { value, ref } of log[type]) {
                        values.delete(value);
                        refs.delete(ref);
                    }

                    if (values.size ||
                        refs.size) {

                        missing.push({
                            status: [...values, ...[...refs].map((ref) => ref.display)],
                            rule: `${type}s`
                        });
                    }
                }

                // Check rules status

                const rules = schema._rules.map((rule) => rule.name);
                for (const type of ['default', 'failover']) {
                    if (schema._flags[type] !== undefined) {
                        rules.push(type);
                    }
                }

                for (const name of rules) {
                    const status = internals.labels[log.rule[name] || 0];
                    if (status) {
                        const report = { rule: name, status };
                        if (log.paths.size) {
                            report.paths = [...log.paths];
                        }

                        missing.push(report);
                    }
                }
            }

            if (missing.length) {
                coverage.push({
                    filename,
                    line,
                    missing,
                    severity: 'error',
                    message: `Schema missing tests for ${missing.map(internals.message).join(', ')}`
                });
            }
        }

        return coverage.length ? coverage : null;
    }
};


internals.Store = class {

    constructor(schema) {

        this.active = true;
        this._sources = new Map();          // schema -> { paths, entry, rule, valid, invalid }
        this._combos = new Map();           // merged -> [sources]
        this._scan(schema);
    }

    debug(state, source, name, result) {

        state.mainstay.debug && state.mainstay.debug.push({ type: source, name, result, path: state.path });
    }

    entry(schema, state) {

        internals.debug(state, { type: 'entry' });

        this._record(schema, (log) => {

            log.entry = true;
        });
    }

    filter(schema, state, source, value) {

        internals.debug(state, { type: source, ...value });

        this._record(schema, (log) => {

            log[source].add(value);
        });
    }

    log(schema, state, source, name, result) {

        internals.debug(state, { type: source, name, result: result === 'full' ? 'pass' : result });

        this._record(schema, (log) => {

            log[source][name] = log[source][name] || 0;
            log[source][name] |= internals.codes[result];
        });
    }

    resolve(state, ref, to) {

        if (!state.mainstay.debug) {
            return;
        }

        const log = { type: 'resolve', ref: ref.display, to, path: state.path };
        state.mainstay.debug.push(log);
    }

    value(state, by, from, to, name) {

        if (!state.mainstay.debug ||
            DeepEqual(from, to)) {

            return;
        }

        const log = { type: 'value', by, from, to, path: state.path };
        if (name) {
            log.name = name;
        }

        state.mainstay.debug.push(log);
    }

    _record(schema, each) {

        const log = this._sources.get(schema);
        if (log) {
            each(log);
            return;
        }

        const sources = this._combos.get(schema);
        for (const source of sources) {
            this._record(source, each);
        }
    }

    _scan(schema, _path) {

        const path = _path || [];

        let log = this._sources.get(schema);
        if (!log) {
            log = {
                paths: new Set(),
                entry: false,
                rule: {},
                valid: new Set(),
                invalid: new Set()
            };

            this._sources.set(schema, log);
        }

        if (path.length) {
            log.paths.add(path);
        }

        const each = (sub, source) => {

            const subId = internals.id(sub, source);
            this._scan(sub, path.concat(subId));
        };

        schema.$_modify({ each, ref: false });
    }

    _combine(merged, sources) {

        this._combos.set(merged, sources);
    }
};


internals.message = function (item) {

    const path = item.paths ? Errors.path(item.paths[0]) + (item.rule ? ':' : '') : '';
    return `${path}${item.rule || ''} (${item.status})`;
};


internals.id = function (schema, { source, name, path, key }) {

    if (schema._flags.id) {
        return schema._flags.id;
    }

    if (key) {
        return key;
    }

    name = `@${name}`;

    if (source === 'terms') {
        return [name, path[Math.min(path.length - 1, 1)]];
    }

    return name;
};


internals.sub = function (paths, skipped) {

    for (const path of paths) {
        for (const skip of skipped) {
            if (DeepEqual(path.slice(0, skip.length), skip)) {
                return true;
            }
        }
    }

    return false;
};


internals.debug = function (state, event) {

    if (state.mainstay.debug) {
        event.path = state.debug ? [...state.path, state.debug] : state.path;
        state.mainstay.debug.push(event);
    }
};


/***/ }),

/***/ 6867:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);
const Merge = __nccwpck_require__(445);

const Any = __nccwpck_require__(9512);
const Common = __nccwpck_require__(2448);
const Compile = __nccwpck_require__(3038);
const Errors = __nccwpck_require__(9490);
const Ref = __nccwpck_require__(3838);


const internals = {};


module.exports = Any.extend({

    type: 'alternatives',

    flags: {

        match: { default: 'any' }                 // 'any', 'one', 'all'
    },

    terms: {

        matches: { init: [], register: Ref.toSibling }
    },

    args(schema, ...schemas) {

        if (schemas.length === 1) {
            if (Array.isArray(schemas[0])) {
                return schema.try(...schemas[0]);
            }
        }

        return schema.try(...schemas);
    },

    validate(value, helpers) {

        const { schema, error, state, prefs } = helpers;

        // Match all or one

        if (schema._flags.match) {
            const matched = [];

            for (let i = 0; i < schema.$_terms.matches.length; ++i) {
                const item = schema.$_terms.matches[i];
                const localState = state.nest(item.schema, `match.${i}`);
                localState.snapshot();

                const result = item.schema.$_validate(value, localState, prefs);
                if (!result.errors) {
                    matched.push(result.value);
                }
                else {
                    localState.restore();
                }
            }

            if (matched.length === 0) {
                return { errors: error('alternatives.any') };
            }

            if (schema._flags.match === 'one') {
                return matched.length === 1 ? { value: matched[0] } : { errors: error('alternatives.one') };
            }

            if (matched.length !== schema.$_terms.matches.length) {
                return { errors: error('alternatives.all') };
            }

            const allobj = schema.$_terms.matches.reduce((acc, v) => acc && v.schema.type === 'object', true);
            return allobj ? { value: matched.reduce((acc, v) => Merge(acc, v, { mergeArrays: false })) } : { value: matched[matched.length - 1] };
        }

        // Match any

        const errors = [];
        for (let i = 0; i < schema.$_terms.matches.length; ++i) {
            const item = schema.$_terms.matches[i];

            // Try

            if (item.schema) {
                const localState = state.nest(item.schema, `match.${i}`);
                localState.snapshot();

                const result = item.schema.$_validate(value, localState, prefs);
                if (!result.errors) {
                    return result;
                }

                localState.restore();
                errors.push({ schema: item.schema, reports: result.errors });
                continue;
            }

            // Conditional

            const input = item.ref ? item.ref.resolve(value, state, prefs) : value;
            const tests = item.is ? [item] : item.switch;

            for (let j = 0; j < tests.length; ++j) {
                const test = tests[j];
                const { is, then, otherwise } = test;

                const id = `match.${i}${item.switch ? '.' + j : ''}`;
                if (!is.$_match(input, state.nest(is, `${id}.is`), prefs)) {
                    if (otherwise) {
                        return otherwise.$_validate(value, state.nest(otherwise, `${id}.otherwise`), prefs);
                    }
                }
                else if (then) {
                    return then.$_validate(value, state.nest(then, `${id}.then`), prefs);
                }
            }
        }

        return internals.errors(errors, helpers);
    },

    rules: {

        conditional: {
            method(condition, options) {

                Assert(!this._flags._endedSwitch, 'Unreachable condition');
                Assert(!this._flags.match, 'Cannot combine match mode', this._flags.match, 'with conditional rule');
                Assert(options.break === undefined, 'Cannot use break option with alternatives conditional');

                const obj = this.clone();

                const match = Compile.when(obj, condition, options);
                const conditions = match.is ? [match] : match.switch;
                for (const item of conditions) {
                    if (item.then &&
                        item.otherwise) {

                        obj.$_setFlag('_endedSwitch', true, { clone: false });
                        break;
                    }
                }

                obj.$_terms.matches.push(match);
                return obj.$_mutateRebuild();
            }
        },

        match: {
            method(mode) {

                Assert(['any', 'one', 'all'].includes(mode), 'Invalid alternatives match mode', mode);

                if (mode !== 'any') {
                    for (const match of this.$_terms.matches) {
                        Assert(match.schema, 'Cannot combine match mode', mode, 'with conditional rules');
                    }
                }

                return this.$_setFlag('match', mode);
            }
        },

        try: {
            method(...schemas) {

                Assert(schemas.length, 'Missing alternative schemas');
                Common.verifyFlat(schemas, 'try');

                Assert(!this._flags._endedSwitch, 'Unreachable condition');

                const obj = this.clone();
                for (const schema of schemas) {
                    obj.$_terms.matches.push({ schema: obj.$_compile(schema) });
                }

                return obj.$_mutateRebuild();
            }
        }
    },

    overrides: {

        label(name) {

            const obj = this.$_parent('label', name);
            const each = (item, source) => (source.path[0] !== 'is' ? item.label(name) : undefined);
            return obj.$_modify({ each, ref: false });
        }
    },

    rebuild(schema) {

        // Flag when an alternative type is an array

        const each = (item) => {

            if (Common.isSchema(item) &&
                item.type === 'array') {

                schema.$_setFlag('_arrayItems', true, { clone: false });
            }
        };

        schema.$_modify({ each });
    },

    manifest: {

        build(obj, desc) {

            if (desc.matches) {
                for (const match of desc.matches) {
                    const { schema, ref, is, not, then, otherwise } = match;
                    if (schema) {
                        obj = obj.try(schema);
                    }
                    else if (ref) {
                        obj = obj.conditional(ref, { is, then, not, otherwise, switch: match.switch });
                    }
                    else {
                        obj = obj.conditional(is, { then, otherwise });
                    }
                }
            }

            return obj;
        }
    },

    messages: {
        'alternatives.all': '{{#label}} does not match all of the required types',
        'alternatives.any': '{{#label}} does not match any of the allowed types',
        'alternatives.match': '{{#label}} does not match any of the allowed types',
        'alternatives.one': '{{#label}} matches more than one allowed type',
        'alternatives.types': '{{#label}} must be one of {{#types}}'
    }
});


// Helpers

internals.errors = function (failures, { error, state }) {

    // Nothing matched due to type criteria rules

    if (!failures.length) {
        return { errors: error('alternatives.any') };
    }

    // Single error

    if (failures.length === 1) {
        return { errors: failures[0].reports };
    }

    // Analyze reasons

    const valids = new Set();
    const complex = [];

    for (const { reports, schema } of failures) {

        // Multiple errors (!abortEarly)

        if (reports.length > 1) {
            return internals.unmatched(failures, error);
        }

        // Custom error

        const report = reports[0];
        if (report instanceof Errors.Report === false) {
            return internals.unmatched(failures, error);
        }

        // Internal object or array error

        if (report.state.path.length !== state.path.length) {
            complex.push({ type: schema.type, report });
            continue;
        }

        // Valids

        if (report.code === 'any.only') {
            for (const valid of report.local.valids) {
                valids.add(valid);
            }

            continue;
        }

        // Base type

        const [type, code] = report.code.split('.');
        if (code !== 'base') {
            complex.push({ type: schema.type, report });
            continue;
        }

        valids.add(type);
    }

    // All errors are base types or valids

    if (!complex.length) {
        return { errors: error('alternatives.types', { types: [...valids] }) };
    }

    // Single complex error

    if (complex.length === 1) {
        return { errors: complex[0].report };
    }

    return internals.unmatched(failures, error);
};


internals.unmatched = function (failures, error) {

    const errors = [];
    for (const failure of failures) {
        errors.push(...failure.reports);
    }

    return { errors: error('alternatives.match', Errors.details(errors, { override: false })) };
};


/***/ }),

/***/ 9512:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);

const Base = __nccwpck_require__(5184);
const Common = __nccwpck_require__(2448);
const Messages = __nccwpck_require__(6103);


const internals = {};


module.exports = Base.extend({

    type: 'any',

    flags: {

        only: { default: false }
    },

    terms: {

        alterations: { init: null },
        examples: { init: null },
        externals: { init: null },
        metas: { init: [] },
        notes: { init: [] },
        shared: { init: null },
        tags: { init: [] },
        whens: { init: null }
    },

    rules: {

        custom: {
            method(method, description) {

                Assert(typeof method === 'function', 'Method must be a function');
                Assert(description === undefined || description && typeof description === 'string', 'Description must be a non-empty string');

                return this.$_addRule({ name: 'custom', args: { method, description } });
            },
            validate(value, helpers, { method }) {

                try {
                    return method(value, helpers);
                }
                catch (err) {
                    return helpers.error('any.custom', { error: err });
                }
            },
            args: ['method', 'description'],
            multi: true
        },

        messages: {
            method(messages) {

                return this.prefs({ messages });
            }
        },

        shared: {
            method(schema) {

                Assert(Common.isSchema(schema) && schema._flags.id, 'Schema must be a schema with an id');

                const obj = this.clone();
                obj.$_terms.shared = obj.$_terms.shared || [];
                obj.$_terms.shared.push(schema);
                obj.$_mutateRegister(schema);
                return obj;
            }
        },

        warning: {
            method(code, local) {

                Assert(code && typeof code === 'string', 'Invalid warning code');

                return this.$_addRule({ name: 'warning', args: { code, local }, warn: true });
            },
            validate(value, helpers, { code, local }) {

                return helpers.error(code, local);
            },
            args: ['code', 'local'],
            multi: true
        }
    },

    modifiers: {

        keep(rule, enabled = true) {

            rule.keep = enabled;
        },

        message(rule, message) {

            rule.message = Messages.compile(message);
        },

        warn(rule, enabled = true) {

            rule.warn = enabled;
        }
    },

    manifest: {

        build(obj, desc) {

            for (const key in desc) {
                const values = desc[key];

                if (['examples', 'externals', 'metas', 'notes', 'tags'].includes(key)) {
                    for (const value of values) {
                        obj = obj[key.slice(0, -1)](value);
                    }

                    continue;
                }

                if (key === 'alterations') {
                    const alter = {};
                    for (const { target, adjuster } of values) {
                        alter[target] = adjuster;
                    }

                    obj = obj.alter(alter);
                    continue;
                }

                if (key === 'whens') {
                    for (const value of values) {
                        const { ref, is, not, then, otherwise, concat } = value;
                        if (concat) {
                            obj = obj.concat(concat);
                        }
                        else if (ref) {
                            obj = obj.when(ref, { is, not, then, otherwise, switch: value.switch, break: value.break });
                        }
                        else {
                            obj = obj.when(is, { then, otherwise, break: value.break });
                        }
                    }

                    continue;
                }

                if (key === 'shared') {
                    for (const value of values) {
                        obj = obj.shared(value);
                    }
                }
            }

            return obj;
        }
    },

    messages: {
        'any.custom': '{{#label}} failed custom validation because {{#error.message}}',
        'any.default': '{{#label}} threw an error when running default method',
        'any.failover': '{{#label}} threw an error when running failover method',
        'any.invalid': '{{#label}} contains an invalid value',
        'any.only': '{{#label}} must be {if(#valids.length == 1, "", "one of ")}{{#valids}}',
        'any.ref': '{{#label}} {{#arg}} references {{:#ref}} which {{#reason}}',
        'any.required': '{{#label}} is required',
        'any.unknown': '{{#label}} is not allowed'
    }
});


/***/ }),

/***/ 270:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);
const DeepEqual = __nccwpck_require__(5801);
const Reach = __nccwpck_require__(8891);

const Any = __nccwpck_require__(9512);
const Common = __nccwpck_require__(2448);
const Compile = __nccwpck_require__(3038);


const internals = {};


module.exports = Any.extend({

    type: 'array',

    flags: {

        single: { default: false },
        sparse: { default: false }
    },

    terms: {

        items: { init: [], manifest: 'schema' },
        ordered: { init: [], manifest: 'schema' },

        _exclusions: { init: [] },
        _inclusions: { init: [] },
        _requireds: { init: [] }
    },

    coerce: {
        from: 'object',
        method(value, { schema, state, prefs }) {

            if (!Array.isArray(value)) {
                return;
            }

            const sort = schema.$_getRule('sort');
            if (!sort) {
                return;
            }

            return internals.sort(schema, value, sort.args.options, state, prefs);
        }
    },

    validate(value, { schema, error }) {

        if (!Array.isArray(value)) {
            if (schema._flags.single) {
                const single = [value];
                single[Common.symbols.arraySingle] = true;
                return { value: single };
            }

            return { errors: error('array.base') };
        }

        if (!schema.$_getRule('items') &&
            !schema.$_terms.externals) {

            return;
        }

        return { value: value.slice() };        // Clone the array so that we don't modify the original
    },

    rules: {

        has: {
            method(schema) {

                schema = this.$_compile(schema, { appendPath: true });
                const obj = this.$_addRule({ name: 'has', args: { schema } });
                obj.$_mutateRegister(schema);
                return obj;
            },
            validate(value, { state, prefs, error }, { schema: has }) {

                const ancestors = [value, ...state.ancestors];
                for (let i = 0; i < value.length; ++i) {
                    const localState = state.localize([...state.path, i], ancestors, has);
                    if (has.$_match(value[i], localState, prefs)) {
                        return value;
                    }
                }

                const patternLabel = has._flags.label;
                if (patternLabel) {
                    return error('array.hasKnown', { patternLabel });
                }

                return error('array.hasUnknown', null);
            },
            multi: true
        },

        items: {
            method(...schemas) {

                Common.verifyFlat(schemas, 'items');

                const obj = this.$_addRule('items');

                for (let i = 0; i < schemas.length; ++i) {
                    const type = Common.tryWithPath(() => this.$_compile(schemas[i]), i, { append: true });
                    obj.$_terms.items.push(type);
                }

                return obj.$_mutateRebuild();
            },
            validate(value, { schema, error, state, prefs, errorsArray }) {

                const requireds = schema.$_terms._requireds.slice();
                const ordereds = schema.$_terms.ordered.slice();
                const inclusions = [...schema.$_terms._inclusions, ...requireds];

                const wasArray = !value[Common.symbols.arraySingle];
                delete value[Common.symbols.arraySingle];

                const errors = errorsArray();

                let il = value.length;
                for (let i = 0; i < il; ++i) {
                    const item = value[i];

                    let errored = false;
                    let isValid = false;

                    const key = wasArray ? i : new Number(i);       // eslint-disable-line no-new-wrappers
                    const path = [...state.path, key];

                    // Sparse

                    if (!schema._flags.sparse &&
                        item === undefined) {

                        errors.push(error('array.sparse', { key, path, pos: i, value: undefined }, state.localize(path)));
                        if (prefs.abortEarly) {
                            return errors;
                        }

                        ordereds.shift();
                        continue;
                    }

                    // Exclusions

                    const ancestors = [value, ...state.ancestors];

                    for (const exclusion of schema.$_terms._exclusions) {
                        if (!exclusion.$_match(item, state.localize(path, ancestors, exclusion), prefs, { presence: 'ignore' })) {
                            continue;
                        }

                        errors.push(error('array.excludes', { pos: i, value: item }, state.localize(path)));
                        if (prefs.abortEarly) {
                            return errors;
                        }

                        errored = true;
                        ordereds.shift();
                        break;
                    }

                    if (errored) {
                        continue;
                    }

                    // Ordered

                    if (schema.$_terms.ordered.length) {
                        if (ordereds.length) {
                            const ordered = ordereds.shift();
                            const res = ordered.$_validate(item, state.localize(path, ancestors, ordered), prefs);
                            if (!res.errors) {
                                if (ordered._flags.result === 'strip') {
                                    internals.fastSplice(value, i);
                                    --i;
                                    --il;
                                }
                                else if (!schema._flags.sparse && res.value === undefined) {
                                    errors.push(error('array.sparse', { key, path, pos: i, value: undefined }, state.localize(path)));
                                    if (prefs.abortEarly) {
                                        return errors;
                                    }

                                    continue;
                                }
                                else {
                                    value[i] = res.value;
                                }
                            }
                            else {
                                errors.push(...res.errors);
                                if (prefs.abortEarly) {
                                    return errors;
                                }
                            }

                            continue;
                        }
                        else if (!schema.$_terms.items.length) {
                            errors.push(error('array.orderedLength', { pos: i, limit: schema.$_terms.ordered.length }));
                            if (prefs.abortEarly) {
                                return errors;
                            }

                            break;      // No reason to continue since there are no other rules to validate other than array.orderedLength
                        }
                    }

                    // Requireds

                    const requiredChecks = [];
                    let jl = requireds.length;
                    for (let j = 0; j < jl; ++j) {
                        const localState = state.localize(path, ancestors, requireds[j]);
                        localState.snapshot();

                        const res = requireds[j].$_validate(item, localState, prefs);
                        requiredChecks[j] = res;

                        if (!res.errors) {
                            value[i] = res.value;
                            isValid = true;
                            internals.fastSplice(requireds, j);
                            --j;
                            --jl;

                            if (!schema._flags.sparse &&
                                res.value === undefined) {

                                errors.push(error('array.sparse', { key, path, pos: i, value: undefined }, state.localize(path)));
                                if (prefs.abortEarly) {
                                    return errors;
                                }
                            }

                            break;
                        }

                        localState.restore();
                    }

                    if (isValid) {
                        continue;
                    }

                    // Inclusions

                    const stripUnknown = prefs.stripUnknown && !!prefs.stripUnknown.arrays || false;

                    jl = inclusions.length;
                    for (const inclusion of inclusions) {

                        // Avoid re-running requireds that already didn't match in the previous loop

                        let res;
                        const previousCheck = requireds.indexOf(inclusion);
                        if (previousCheck !== -1) {
                            res = requiredChecks[previousCheck];
                        }
                        else {
                            const localState = state.localize(path, ancestors, inclusion);
                            localState.snapshot();

                            res = inclusion.$_validate(item, localState, prefs);
                            if (!res.errors) {
                                if (inclusion._flags.result === 'strip') {
                                    internals.fastSplice(value, i);
                                    --i;
                                    --il;
                                }
                                else if (!schema._flags.sparse &&
                                    res.value === undefined) {

                                    errors.push(error('array.sparse', { key, path, pos: i, value: undefined }, state.localize(path)));
                                    errored = true;
                                }
                                else {
                                    value[i] = res.value;
                                }

                                isValid = true;
                                break;
                            }

                            localState.restore();
                        }

                        // Return the actual error if only one inclusion defined

                        if (jl === 1) {
                            if (stripUnknown) {
                                internals.fastSplice(value, i);
                                --i;
                                --il;
                                isValid = true;
                                break;
                            }

                            errors.push(...res.errors);
                            if (prefs.abortEarly) {
                                return errors;
                            }

                            errored = true;
                            break;
                        }
                    }

                    if (errored) {
                        continue;
                    }

                    if ((schema.$_terms._inclusions.length || schema.$_terms._requireds.length) &&
                        !isValid) {

                        if (stripUnknown) {
                            internals.fastSplice(value, i);
                            --i;
                            --il;
                            continue;
                        }

                        errors.push(error('array.includes', { pos: i, value: item }, state.localize(path)));
                        if (prefs.abortEarly) {
                            return errors;
                        }
                    }
                }

                if (requireds.length) {
                    internals.fillMissedErrors(schema, errors, requireds, value, state, prefs);
                }

                if (ordereds.length) {
                    internals.fillOrderedErrors(schema, errors, ordereds, value, state, prefs);

                    if (!errors.length) {
                        internals.fillDefault(ordereds, value, state, prefs);
                    }
                }

                return errors.length ? errors : value;
            },

            priority: true,
            manifest: false
        },

        length: {
            method(limit) {

                return this.$_addRule({ name: 'length', args: { limit }, operator: '=' });
            },
            validate(value, helpers, { limit }, { name, operator, args }) {

                if (Common.compare(value.length, limit, operator)) {
                    return value;
                }

                return helpers.error('array.' + name, { limit: args.limit, value });
            },
            args: [
                {
                    name: 'limit',
                    ref: true,
                    assert: Common.limit,
                    message: 'must be a positive integer'
                }
            ]
        },

        max: {
            method(limit) {

                return this.$_addRule({ name: 'max', method: 'length', args: { limit }, operator: '<=' });
            }
        },

        min: {
            method(limit) {

                return this.$_addRule({ name: 'min', method: 'length', args: { limit }, operator: '>=' });
            }
        },

        ordered: {
            method(...schemas) {

                Common.verifyFlat(schemas, 'ordered');

                const obj = this.$_addRule('items');

                for (let i = 0; i < schemas.length; ++i) {
                    const type = Common.tryWithPath(() => this.$_compile(schemas[i]), i, { append: true });
                    internals.validateSingle(type, obj);

                    obj.$_mutateRegister(type);
                    obj.$_terms.ordered.push(type);
                }

                return obj.$_mutateRebuild();
            }
        },

        single: {
            method(enabled) {

                const value = enabled === undefined ? true : !!enabled;
                Assert(!value || !this._flags._arrayItems, 'Cannot specify single rule when array has array items');

                return this.$_setFlag('single', value);
            }
        },

        sort: {
            method(options = {}) {

                Common.assertOptions(options, ['by', 'order']);

                const settings = {
                    order: options.order || 'ascending'
                };

                if (options.by) {
                    settings.by = Compile.ref(options.by, { ancestor: 0 });
                    Assert(!settings.by.ancestor, 'Cannot sort by ancestor');
                }

                return this.$_addRule({ name: 'sort', args: { options: settings } });
            },
            validate(value, { error, state, prefs, schema }, { options }) {

                const { value: sorted, errors } = internals.sort(schema, value, options, state, prefs);
                if (errors) {
                    return errors;
                }

                for (let i = 0; i < value.length; ++i) {
                    if (value[i] !== sorted[i]) {
                        return error('array.sort', { order: options.order, by: options.by ? options.by.key : 'value' });
                    }
                }

                return value;
            },
            convert: true
        },

        sparse: {
            method(enabled) {

                const value = enabled === undefined ? true : !!enabled;

                if (this._flags.sparse === value) {
                    return this;
                }

                const obj = value ? this.clone() : this.$_addRule('items');
                return obj.$_setFlag('sparse', value, { clone: false });
            }
        },

        unique: {
            method(comparator, options = {}) {

                Assert(!comparator || typeof comparator === 'function' || typeof comparator === 'string', 'comparator must be a function or a string');
                Common.assertOptions(options, ['ignoreUndefined', 'separator']);

                const rule = { name: 'unique', args: { options, comparator } };

                if (comparator) {
                    if (typeof comparator === 'string') {
                        const separator = Common.default(options.separator, '.');
                        rule.path = separator ? comparator.split(separator) : [comparator];
                    }
                    else {
                        rule.comparator = comparator;
                    }
                }

                return this.$_addRule(rule);
            },
            validate(value, { state, error, schema }, { comparator: raw, options }, { comparator, path }) {

                const found = {
                    string: Object.create(null),
                    number: Object.create(null),
                    undefined: Object.create(null),
                    boolean: Object.create(null),
                    object: new Map(),
                    function: new Map(),
                    custom: new Map()
                };

                const compare = comparator || DeepEqual;
                const ignoreUndefined = options.ignoreUndefined;

                for (let i = 0; i < value.length; ++i) {
                    const item = path ? Reach(value[i], path) : value[i];
                    const records = comparator ? found.custom : found[typeof item];
                    Assert(records, 'Failed to find unique map container for type', typeof item);

                    if (records instanceof Map) {
                        const entries = records.entries();
                        let current;
                        while (!(current = entries.next()).done) {
                            if (compare(current.value[0], item)) {
                                const localState = state.localize([...state.path, i], [value, ...state.ancestors]);
                                const context = {
                                    pos: i,
                                    value: value[i],
                                    dupePos: current.value[1],
                                    dupeValue: value[current.value[1]]
                                };

                                if (path) {
                                    context.path = raw;
                                }

                                return error('array.unique', context, localState);
                            }
                        }

                        records.set(item, i);
                    }
                    else {
                        if ((!ignoreUndefined || item !== undefined) &&
                            records[item] !== undefined) {

                            const context = {
                                pos: i,
                                value: value[i],
                                dupePos: records[item],
                                dupeValue: value[records[item]]
                            };

                            if (path) {
                                context.path = raw;
                            }

                            const localState = state.localize([...state.path, i], [value, ...state.ancestors]);
                            return error('array.unique', context, localState);
                        }

                        records[item] = i;
                    }
                }

                return value;
            },
            args: ['comparator', 'options'],
            multi: true
        }
    },

    cast: {
        set: {
            from: Array.isArray,
            to(value, helpers) {

                return new Set(value);
            }
        }
    },

    rebuild(schema) {

        schema.$_terms._inclusions = [];
        schema.$_terms._exclusions = [];
        schema.$_terms._requireds = [];

        for (const type of schema.$_terms.items) {
            internals.validateSingle(type, schema);

            if (type._flags.presence === 'required') {
                schema.$_terms._requireds.push(type);
            }
            else if (type._flags.presence === 'forbidden') {
                schema.$_terms._exclusions.push(type);
            }
            else {
                schema.$_terms._inclusions.push(type);
            }
        }

        for (const type of schema.$_terms.ordered) {
            internals.validateSingle(type, schema);
        }
    },

    manifest: {

        build(obj, desc) {

            if (desc.items) {
                obj = obj.items(...desc.items);
            }

            if (desc.ordered) {
                obj = obj.ordered(...desc.ordered);
            }

            return obj;
        }
    },

    messages: {
        'array.base': '{{#label}} must be an array',
        'array.excludes': '{{#label}} contains an excluded value',
        'array.hasKnown': '{{#label}} does not contain at least one required match for type {:#patternLabel}',
        'array.hasUnknown': '{{#label}} does not contain at least one required match',
        'array.includes': '{{#label}} does not match any of the allowed types',
        'array.includesRequiredBoth': '{{#label}} does not contain {{#knownMisses}} and {{#unknownMisses}} other required value(s)',
        'array.includesRequiredKnowns': '{{#label}} does not contain {{#knownMisses}}',
        'array.includesRequiredUnknowns': '{{#label}} does not contain {{#unknownMisses}} required value(s)',
        'array.length': '{{#label}} must contain {{#limit}} items',
        'array.max': '{{#label}} must contain less than or equal to {{#limit}} items',
        'array.min': '{{#label}} must contain at least {{#limit}} items',
        'array.orderedLength': '{{#label}} must contain at most {{#limit}} items',
        'array.sort': '{{#label}} must be sorted in {#order} order by {{#by}}',
        'array.sort.mismatching': '{{#label}} cannot be sorted due to mismatching types',
        'array.sort.unsupported': '{{#label}} cannot be sorted due to unsupported type {#type}',
        'array.sparse': '{{#label}} must not be a sparse array item',
        'array.unique': '{{#label}} contains a duplicate value'
    }
});


// Helpers

internals.fillMissedErrors = function (schema, errors, requireds, value, state, prefs) {

    const knownMisses = [];
    let unknownMisses = 0;
    for (const required of requireds) {
        const label = required._flags.label;
        if (label) {
            knownMisses.push(label);
        }
        else {
            ++unknownMisses;
        }
    }

    if (knownMisses.length) {
        if (unknownMisses) {
            errors.push(schema.$_createError('array.includesRequiredBoth', value, { knownMisses, unknownMisses }, state, prefs));
        }
        else {
            errors.push(schema.$_createError('array.includesRequiredKnowns', value, { knownMisses }, state, prefs));
        }
    }
    else {
        errors.push(schema.$_createError('array.includesRequiredUnknowns', value, { unknownMisses }, state, prefs));
    }
};


internals.fillOrderedErrors = function (schema, errors, ordereds, value, state, prefs) {

    const requiredOrdereds = [];

    for (const ordered of ordereds) {
        if (ordered._flags.presence === 'required') {
            requiredOrdereds.push(ordered);
        }
    }

    if (requiredOrdereds.length) {
        internals.fillMissedErrors(schema, errors, requiredOrdereds, value, state, prefs);
    }
};


internals.fillDefault = function (ordereds, value, state, prefs) {

    const overrides = [];
    let trailingUndefined = true;

    for (let i = ordereds.length - 1; i >= 0; --i) {
        const ordered = ordereds[i];
        const ancestors = [value, ...state.ancestors];
        const override = ordered.$_validate(undefined, state.localize(state.path, ancestors, ordered), prefs).value;

        if (trailingUndefined) {
            if (override === undefined) {
                continue;
            }

            trailingUndefined = false;
        }

        overrides.unshift(override);
    }

    if (overrides.length) {
        value.push(...overrides);
    }
};


internals.fastSplice = function (arr, i) {

    let pos = i;
    while (pos < arr.length) {
        arr[pos++] = arr[pos];
    }

    --arr.length;
};


internals.validateSingle = function (type, obj) {

    if (type.type === 'array' ||
        type._flags._arrayItems) {

        Assert(!obj._flags.single, 'Cannot specify array item with single rule enabled');
        obj.$_setFlag('_arrayItems', true, { clone: false });
    }
};


internals.sort = function (schema, value, settings, state, prefs) {

    const order = settings.order === 'ascending' ? 1 : -1;
    const aFirst = -1 * order;
    const bFirst = order;

    const sort = (a, b) => {

        let compare = internals.compare(a, b, aFirst, bFirst);
        if (compare !== null) {
            return compare;
        }

        if (settings.by) {
            a = settings.by.resolve(a, state, prefs);
            b = settings.by.resolve(b, state, prefs);
        }

        compare = internals.compare(a, b, aFirst, bFirst);
        if (compare !== null) {
            return compare;
        }

        const type = typeof a;
        if (type !== typeof b) {
            throw schema.$_createError('array.sort.mismatching', value, null, state, prefs);
        }

        if (type !== 'number' &&
            type !== 'string') {

            throw schema.$_createError('array.sort.unsupported', value, { type }, state, prefs);
        }

        if (type === 'number') {
            return (a - b) * order;
        }

        return a < b ? aFirst : bFirst;
    };

    try {
        return { value: value.slice().sort(sort) };
    }
    catch (err) {
        return { errors: err };
    }
};


internals.compare = function (a, b, aFirst, bFirst) {

    if (a === b) {
        return 0;
    }

    if (a === undefined) {
        return 1;           // Always last regardless of sort order
    }

    if (b === undefined) {
        return -1;           // Always last regardless of sort order
    }

    if (a === null) {
        return bFirst;
    }

    if (b === null) {
        return aFirst;
    }

    return null;
};


/***/ }),

/***/ 4288:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);

const Any = __nccwpck_require__(9512);
const Common = __nccwpck_require__(2448);


const internals = {};


module.exports = Any.extend({

    type: 'binary',

    coerce: {
        from: 'string',
        method(value, { schema }) {

            try {
                return { value: Buffer.from(value, schema._flags.encoding) };
            }
            catch (ignoreErr) { }
        }
    },

    validate(value, { error }) {

        if (!Buffer.isBuffer(value)) {
            return { value, errors: error('binary.base') };
        }
    },

    rules: {
        encoding: {
            method(encoding) {

                Assert(Buffer.isEncoding(encoding), 'Invalid encoding:', encoding);

                return this.$_setFlag('encoding', encoding);
            }
        },

        length: {
            method(limit) {

                return this.$_addRule({ name: 'length', method: 'length', args: { limit }, operator: '=' });
            },
            validate(value, helpers, { limit }, { name, operator, args }) {

                if (Common.compare(value.length, limit, operator)) {
                    return value;
                }

                return helpers.error('binary.' + name, { limit: args.limit, value });
            },
            args: [
                {
                    name: 'limit',
                    ref: true,
                    assert: Common.limit,
                    message: 'must be a positive integer'
                }
            ]
        },

        max: {
            method(limit) {

                return this.$_addRule({ name: 'max', method: 'length', args: { limit }, operator: '<=' });
            }
        },

        min: {
            method(limit) {

                return this.$_addRule({ name: 'min', method: 'length', args: { limit }, operator: '>=' });
            }
        }
    },

    cast: {
        string: {
            from: (value) => Buffer.isBuffer(value),
            to(value, helpers) {

                return value.toString();
            }
        }
    },

    messages: {
        'binary.base': '{{#label}} must be a buffer or a string',
        'binary.length': '{{#label}} must be {{#limit}} bytes',
        'binary.max': '{{#label}} must be less than or equal to {{#limit}} bytes',
        'binary.min': '{{#label}} must be at least {{#limit}} bytes'
    }
});


/***/ }),

/***/ 7489:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);

const Any = __nccwpck_require__(9512);
const Common = __nccwpck_require__(2448);
const Values = __nccwpck_require__(1944);


const internals = {};


internals.isBool = function (value) {

    return typeof value === 'boolean';
};


module.exports = Any.extend({

    type: 'boolean',

    flags: {

        sensitive: { default: false }
    },

    terms: {

        falsy: {
            init: null,
            manifest: 'values'
        },

        truthy: {
            init: null,
            manifest: 'values'
        }
    },

    coerce(value, { schema }) {

        if (typeof value === 'boolean') {
            return;
        }

        if (typeof value === 'string') {
            const normalized = schema._flags.sensitive ? value : value.toLowerCase();
            value = normalized === 'true' ? true : (normalized === 'false' ? false : value);
        }

        if (typeof value !== 'boolean') {
            value = schema.$_terms.truthy && schema.$_terms.truthy.has(value, null, null, !schema._flags.sensitive) ||
                (schema.$_terms.falsy && schema.$_terms.falsy.has(value, null, null, !schema._flags.sensitive) ? false : value);
        }

        return { value };
    },

    validate(value, { error }) {

        if (typeof value !== 'boolean') {
            return { value, errors: error('boolean.base') };
        }
    },

    rules: {
        truthy: {
            method(...values) {

                Common.verifyFlat(values, 'truthy');

                const obj = this.clone();
                obj.$_terms.truthy = obj.$_terms.truthy || new Values();

                for (let i = 0; i < values.length; ++i) {
                    const value = values[i];

                    Assert(value !== undefined, 'Cannot call truthy with undefined');
                    obj.$_terms.truthy.add(value);
                }

                return obj;
            }
        },

        falsy: {
            method(...values) {

                Common.verifyFlat(values, 'falsy');

                const obj = this.clone();
                obj.$_terms.falsy = obj.$_terms.falsy || new Values();

                for (let i = 0; i < values.length; ++i) {
                    const value = values[i];

                    Assert(value !== undefined, 'Cannot call falsy with undefined');
                    obj.$_terms.falsy.add(value);
                }

                return obj;
            }
        },

        sensitive: {
            method(enabled = true) {

                return this.$_setFlag('sensitive', enabled);
            }
        }
    },

    cast: {
        number: {
            from: internals.isBool,
            to(value, helpers) {

                return value ? 1 : 0;
            }
        },
        string: {
            from: internals.isBool,
            to(value, helpers) {

                return value ? 'true' : 'false';
            }
        }
    },

    manifest: {

        build(obj, desc) {

            if (desc.truthy) {
                obj = obj.truthy(...desc.truthy);
            }

            if (desc.falsy) {
                obj = obj.falsy(...desc.falsy);
            }

            return obj;
        }
    },

    messages: {
        'boolean.base': '{{#label}} must be a boolean'
    }
});


/***/ }),

/***/ 6624:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);

const Any = __nccwpck_require__(9512);
const Common = __nccwpck_require__(2448);
const Template = __nccwpck_require__(1396);


const internals = {};


internals.isDate = function (value) {

    return value instanceof Date;
};


module.exports = Any.extend({

    type: 'date',

    coerce: {
        from: ['number', 'string'],
        method(value, { schema }) {

            return { value: internals.parse(value, schema._flags.format) || value };
        }
    },

    validate(value, { schema, error, prefs }) {

        if (value instanceof Date &&
            !isNaN(value.getTime())) {

            return;
        }

        const format = schema._flags.format;

        if (!prefs.convert ||
            !format ||
            typeof value !== 'string') {

            return { value, errors: error('date.base') };
        }

        return { value, errors: error('date.format', { format }) };
    },

    rules: {

        compare: {
            method: false,
            validate(value, helpers, { date }, { name, operator, args }) {

                const to = date === 'now' ? Date.now() : date.getTime();
                if (Common.compare(value.getTime(), to, operator)) {
                    return value;
                }

                return helpers.error('date.' + name, { limit: args.date, value });
            },
            args: [
                {
                    name: 'date',
                    ref: true,
                    normalize: (date) => {

                        return date === 'now' ? date : internals.parse(date);
                    },
                    assert: (date) => date !== null,
                    message: 'must have a valid date format'
                }
            ]
        },

        format: {
            method(format) {

                Assert(['iso', 'javascript', 'unix'].includes(format), 'Unknown date format', format);

                return this.$_setFlag('format', format);
            }
        },

        greater: {
            method(date) {

                return this.$_addRule({ name: 'greater', method: 'compare', args: { date }, operator: '>' });
            }
        },

        iso: {
            method() {

                return this.format('iso');
            }
        },

        less: {
            method(date) {

                return this.$_addRule({ name: 'less', method: 'compare', args: { date }, operator: '<' });
            }
        },

        max: {
            method(date) {

                return this.$_addRule({ name: 'max', method: 'compare', args: { date }, operator: '<=' });
            }
        },

        min: {
            method(date) {

                return this.$_addRule({ name: 'min', method: 'compare', args: { date }, operator: '>=' });
            }
        },

        timestamp: {
            method(type = 'javascript') {

                Assert(['javascript', 'unix'].includes(type), '"type" must be one of "javascript, unix"');

                return this.format(type);
            }
        }
    },

    cast: {
        number: {
            from: internals.isDate,
            to(value, helpers) {

                return value.getTime();
            }
        },
        string: {
            from: internals.isDate,
            to(value, { prefs }) {

                return Template.date(value, prefs);
            }
        }
    },

    messages: {
        'date.base': '{{#label}} must be a valid date',
        'date.format': '{{#label}} must be in {msg("date.format." + #format) || #format} format',
        'date.greater': '{{#label}} must be greater than {{:#limit}}',
        'date.less': '{{#label}} must be less than {{:#limit}}',
        'date.max': '{{#label}} must be less than or equal to {{:#limit}}',
        'date.min': '{{#label}} must be greater than or equal to {{:#limit}}',

        // Messages used in date.format

        'date.format.iso': 'ISO 8601 date',
        'date.format.javascript': 'timestamp or number of milliseconds',
        'date.format.unix': 'timestamp or number of seconds'
    }
});


// Helpers

internals.parse = function (value, format) {

    if (value instanceof Date) {
        return value;
    }

    if (typeof value !== 'string' &&
        (isNaN(value) || !isFinite(value))) {

        return null;
    }

    if (/^\s*$/.test(value)) {
        return null;
    }

    // ISO

    if (format === 'iso') {
        if (!Common.isIsoDate(value)) {
            return null;
        }

        return internals.date(value.toString());
    }

    // Normalize number string

    const original = value;
    if (typeof value === 'string' &&
        /^[+-]?\d+(\.\d+)?$/.test(value)) {

        value = parseFloat(value);
    }

    // Timestamp

    if (format) {
        if (format === 'javascript') {
            return internals.date(1 * value);        // Casting to number
        }

        if (format === 'unix') {
            return internals.date(1000 * value);
        }

        if (typeof original === 'string') {
            return null;
        }
    }

    // Plain

    return internals.date(value);
};


internals.date = function (value) {

    const date = new Date(value);
    if (!isNaN(date.getTime())) {
        return date;
    }

    return null;
};


/***/ }),

/***/ 2269:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);

const Keys = __nccwpck_require__(9130);


const internals = {};


module.exports = Keys.extend({

    type: 'function',

    properties: {
        typeof: 'function'
    },

    rules: {
        arity: {
            method(n) {

                Assert(Number.isSafeInteger(n) && n >= 0, 'n must be a positive integer');

                return this.$_addRule({ name: 'arity', args: { n } });
            },
            validate(value, helpers, { n }) {

                if (value.length === n) {
                    return value;
                }

                return helpers.error('function.arity', { n });
            }
        },

        class: {
            method() {

                return this.$_addRule('class');
            },
            validate(value, helpers) {

                if ((/^\s*class\s/).test(value.toString())) {
                    return value;
                }

                return helpers.error('function.class', { value });
            }
        },

        minArity: {
            method(n) {

                Assert(Number.isSafeInteger(n) && n > 0, 'n must be a strict positive integer');

                return this.$_addRule({ name: 'minArity', args: { n } });
            },
            validate(value, helpers, { n }) {

                if (value.length >= n) {
                    return value;
                }

                return helpers.error('function.minArity', { n });
            }
        },

        maxArity: {
            method(n) {

                Assert(Number.isSafeInteger(n) && n >= 0, 'n must be a positive integer');

                return this.$_addRule({ name: 'maxArity', args: { n } });
            },
            validate(value, helpers, { n }) {

                if (value.length <= n) {
                    return value;
                }

                return helpers.error('function.maxArity', { n });
            }
        }
    },

    messages: {
        'function.arity': '{{#label}} must have an arity of {{#n}}',
        'function.class': '{{#label}} must be a class',
        'function.maxArity': '{{#label}} must have an arity lesser or equal to {{#n}}',
        'function.minArity': '{{#label}} must have an arity greater or equal to {{#n}}'
    }
});


/***/ }),

/***/ 9130:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const ApplyToDefaults = __nccwpck_require__(5545);
const Assert = __nccwpck_require__(2718);
const Clone = __nccwpck_require__(5578);
const Topo = __nccwpck_require__(8392);

const Any = __nccwpck_require__(9512);
const Common = __nccwpck_require__(2448);
const Compile = __nccwpck_require__(3038);
const Errors = __nccwpck_require__(9490);
const Ref = __nccwpck_require__(3838);
const Template = __nccwpck_require__(1396);


const internals = {
    renameDefaults: {
        alias: false,                   // Keep old value in place
        multiple: false,                // Allow renaming multiple keys into the same target
        override: false                 // Overrides an existing key
    }
};


module.exports = Any.extend({

    type: '_keys',

    properties: {

        typeof: 'object'
    },

    flags: {

        unknown: { default: false }
    },

    terms: {

        dependencies: { init: null },
        keys: { init: null, manifest: { mapped: { from: 'schema', to: 'key' } } },
        patterns: { init: null },
        renames: { init: null }
    },

    args(schema, keys) {

        return schema.keys(keys);
    },

    validate(value, { schema, error, state, prefs }) {

        if (!value ||
            typeof value !== schema.$_property('typeof') ||
            Array.isArray(value)) {

            return { value, errors: error('object.base', { type: schema.$_property('typeof') }) };
        }

        // Skip if there are no other rules to test

        if (!schema.$_terms.renames &&
            !schema.$_terms.dependencies &&
            !schema.$_terms.keys &&                       // null allows any keys
            !schema.$_terms.patterns &&
            !schema.$_terms.externals) {

            return;
        }

        // Shallow clone value

        value = internals.clone(value, prefs);
        const errors = [];

        // Rename keys

        if (schema.$_terms.renames &&
            !internals.rename(schema, value, state, prefs, errors)) {

            return { value, errors };
        }

        // Anything allowed

        if (!schema.$_terms.keys &&                       // null allows any keys
            !schema.$_terms.patterns &&
            !schema.$_terms.dependencies) {

            return { value, errors };
        }

        // Defined keys

        const unprocessed = new Set(Object.keys(value));

        if (schema.$_terms.keys) {
            const ancestors = [value, ...state.ancestors];

            for (const child of schema.$_terms.keys) {
                const key = child.key;
                const item = value[key];

                unprocessed.delete(key);

                const localState = state.localize([...state.path, key], ancestors, child);
                const result = child.schema.$_validate(item, localState, prefs);

                if (result.errors) {
                    if (prefs.abortEarly) {
                        return { value, errors: result.errors };
                    }

                    if (result.value !== undefined) {
                        value[key] = result.value;
                    }

                    errors.push(...result.errors);
                }
                else if (child.schema._flags.result === 'strip' ||
                    result.value === undefined && item !== undefined) {

                    delete value[key];
                }
                else if (result.value !== undefined) {
                    value[key] = result.value;
                }
            }
        }

        // Unknown keys

        if (unprocessed.size ||
            schema._flags._hasPatternMatch) {

            const early = internals.unknown(schema, value, unprocessed, errors, state, prefs);
            if (early) {
                return early;
            }
        }

        // Validate dependencies

        if (schema.$_terms.dependencies) {
            for (const dep of schema.$_terms.dependencies) {
                if (dep.key &&
                    dep.key.resolve(value, state, prefs, null, { shadow: false }) === undefined) {

                    continue;
                }

                const failed = internals.dependencies[dep.rel](schema, dep, value, state, prefs);
                if (failed) {
                    const report = schema.$_createError(failed.code, value, failed.context, state, prefs);
                    if (prefs.abortEarly) {
                        return { value, errors: report };
                    }

                    errors.push(report);
                }
            }
        }

        return { value, errors };
    },

    rules: {

        and: {
            method(...peers /*, [options] */) {

                Common.verifyFlat(peers, 'and');

                return internals.dependency(this, 'and', null, peers);
            }
        },

        append: {
            method(schema) {

                if (schema === null ||
                    schema === undefined ||
                    Object.keys(schema).length === 0) {

                    return this;
                }

                return this.keys(schema);
            }
        },

        assert: {
            method(subject, schema, message) {

                if (!Template.isTemplate(subject)) {
                    subject = Compile.ref(subject);
                }

                Assert(message === undefined || typeof message === 'string', 'Message must be a string');

                schema = this.$_compile(schema, { appendPath: true });

                const obj = this.$_addRule({ name: 'assert', args: { subject, schema, message } });
                obj.$_mutateRegister(subject);
                obj.$_mutateRegister(schema);
                return obj;
            },
            validate(value, { error, prefs, state }, { subject, schema, message }) {

                const about = subject.resolve(value, state, prefs);
                const path = Ref.isRef(subject) ? subject.absolute(state) : [];
                if (schema.$_match(about, state.localize(path, [value, ...state.ancestors], schema), prefs)) {
                    return value;
                }

                return error('object.assert', { subject, message });
            },
            args: ['subject', 'schema', 'message'],
            multi: true
        },

        instance: {
            method(constructor, name) {

                Assert(typeof constructor === 'function', 'constructor must be a function');

                name = name || constructor.name;

                return this.$_addRule({ name: 'instance', args: { constructor, name } });
            },
            validate(value, helpers, { constructor, name }) {

                if (value instanceof constructor) {
                    return value;
                }

                return helpers.error('object.instance', { type: name, value });
            },
            args: ['constructor', 'name']
        },

        keys: {
            method(schema) {

                Assert(schema === undefined || typeof schema === 'object', 'Object schema must be a valid object');
                Assert(!Common.isSchema(schema), 'Object schema cannot be a joi schema');

                const obj = this.clone();

                if (!schema) {                                      // Allow all
                    obj.$_terms.keys = null;
                }
                else if (!Object.keys(schema).length) {             // Allow none
                    obj.$_terms.keys = new internals.Keys();
                }
                else {
                    obj.$_terms.keys = obj.$_terms.keys ? obj.$_terms.keys.filter((child) => !schema.hasOwnProperty(child.key)) : new internals.Keys();
                    for (const key in schema) {
                        Common.tryWithPath(() => obj.$_terms.keys.push({ key, schema: this.$_compile(schema[key]) }), key);
                    }
                }

                return obj.$_mutateRebuild();
            }
        },

        length: {
            method(limit) {

                return this.$_addRule({ name: 'length', args: { limit }, operator: '=' });
            },
            validate(value, helpers, { limit }, { name, operator, args }) {

                if (Common.compare(Object.keys(value).length, limit, operator)) {
                    return value;
                }

                return helpers.error('object.' + name, { limit: args.limit, value });
            },
            args: [
                {
                    name: 'limit',
                    ref: true,
                    assert: Common.limit,
                    message: 'must be a positive integer'
                }
            ]
        },

        max: {
            method(limit) {

                return this.$_addRule({ name: 'max', method: 'length', args: { limit }, operator: '<=' });
            }
        },

        min: {
            method(limit) {

                return this.$_addRule({ name: 'min', method: 'length', args: { limit }, operator: '>=' });
            }
        },

        nand: {
            method(...peers /*, [options] */) {

                Common.verifyFlat(peers, 'nand');

                return internals.dependency(this, 'nand', null, peers);
            }
        },

        or: {
            method(...peers /*, [options] */) {

                Common.verifyFlat(peers, 'or');

                return internals.dependency(this, 'or', null, peers);
            }
        },

        oxor: {
            method(...peers /*, [options] */) {

                return internals.dependency(this, 'oxor', null, peers);
            }
        },

        pattern: {
            method(pattern, schema, options = {}) {

                const isRegExp = pattern instanceof RegExp;
                if (!isRegExp) {
                    pattern = this.$_compile(pattern, { appendPath: true });
                }

                Assert(schema !== undefined, 'Invalid rule');
                Common.assertOptions(options, ['fallthrough', 'matches']);

                if (isRegExp) {
                    Assert(!pattern.flags.includes('g') && !pattern.flags.includes('y'), 'pattern should not use global or sticky mode');
                }

                schema = this.$_compile(schema, { appendPath: true });

                const obj = this.clone();
                obj.$_terms.patterns = obj.$_terms.patterns || [];
                const config = { [isRegExp ? 'regex' : 'schema']: pattern, rule: schema };
                if (options.matches) {
                    config.matches = this.$_compile(options.matches);
                    if (config.matches.type !== 'array') {
                        config.matches = config.matches.$_root.array().items(config.matches);
                    }

                    obj.$_mutateRegister(config.matches);
                    obj.$_setFlag('_hasPatternMatch', true, { clone: false });
                }

                if (options.fallthrough) {
                    config.fallthrough = true;
                }

                obj.$_terms.patterns.push(config);
                obj.$_mutateRegister(schema);
                return obj;
            }
        },

        ref: {
            method() {

                return this.$_addRule('ref');
            },
            validate(value, helpers) {

                if (Ref.isRef(value)) {
                    return value;
                }

                return helpers.error('object.refType', { value });
            }
        },

        regex: {
            method() {

                return this.$_addRule('regex');
            },
            validate(value, helpers) {

                if (value instanceof RegExp) {
                    return value;
                }

                return helpers.error('object.regex', { value });
            }
        },

        rename: {
            method(from, to, options = {}) {

                Assert(typeof from === 'string' || from instanceof RegExp, 'Rename missing the from argument');
                Assert(typeof to === 'string' || to instanceof Template, 'Invalid rename to argument');
                Assert(to !== from, 'Cannot rename key to same name:', from);

                Common.assertOptions(options, ['alias', 'ignoreUndefined', 'override', 'multiple']);

                const obj = this.clone();

                obj.$_terms.renames = obj.$_terms.renames || [];
                for (const rename of obj.$_terms.renames) {
                    Assert(rename.from !== from, 'Cannot rename the same key multiple times');
                }

                if (to instanceof Template) {
                    obj.$_mutateRegister(to);
                }

                obj.$_terms.renames.push({
                    from,
                    to,
                    options: ApplyToDefaults(internals.renameDefaults, options)
                });

                return obj;
            }
        },

        schema: {
            method(type = 'any') {

                return this.$_addRule({ name: 'schema', args: { type } });
            },
            validate(value, helpers, { type }) {

                if (Common.isSchema(value) &&
                    (type === 'any' || value.type === type)) {

                    return value;
                }

                return helpers.error('object.schema', { type });
            }
        },

        unknown: {
            method(allow) {

                return this.$_setFlag('unknown', allow !== false);
            }
        },

        with: {
            method(key, peers, options = {}) {

                return internals.dependency(this, 'with', key, peers, options);
            }
        },

        without: {
            method(key, peers, options = {}) {

                return internals.dependency(this, 'without', key, peers, options);
            }
        },

        xor: {
            method(...peers /*, [options] */) {

                Common.verifyFlat(peers, 'xor');

                return internals.dependency(this, 'xor', null, peers);
            }
        }
    },

    overrides: {

        default(value, options) {

            if (value === undefined) {
                value = Common.symbols.deepDefault;
            }

            return this.$_parent('default', value, options);
        }
    },

    rebuild(schema) {

        if (schema.$_terms.keys) {
            const topo = new Topo.Sorter();
            for (const child of schema.$_terms.keys) {
                Common.tryWithPath(() => topo.add(child, { after: child.schema.$_rootReferences(), group: child.key }), child.key);
            }

            schema.$_terms.keys = new internals.Keys(...topo.nodes);
        }
    },

    manifest: {

        build(obj, desc) {

            if (desc.keys) {
                obj = obj.keys(desc.keys);
            }

            if (desc.dependencies) {
                for (const { rel, key = null, peers, options } of desc.dependencies) {
                    obj = internals.dependency(obj, rel, key, peers, options);
                }
            }

            if (desc.patterns) {
                for (const { regex, schema, rule, fallthrough, matches } of desc.patterns) {
                    obj = obj.pattern(regex || schema, rule, { fallthrough, matches });
                }
            }

            if (desc.renames) {
                for (const { from, to, options } of desc.renames) {
                    obj = obj.rename(from, to, options);
                }
            }

            return obj;
        }
    },

    messages: {
        'object.and': '{{#label}} contains {{#presentWithLabels}} without its required peers {{#missingWithLabels}}',
        'object.assert': '{{#label}} is invalid because {if(#subject.key, `"` + #subject.key + `" failed to ` + (#message || "pass the assertion test"), #message || "the assertion failed")}',
        'object.base': '{{#label}} must be of type {{#type}}',
        'object.instance': '{{#label}} must be an instance of {{:#type}}',
        'object.length': '{{#label}} must have {{#limit}} key{if(#limit == 1, "", "s")}',
        'object.max': '{{#label}} must have less than or equal to {{#limit}} key{if(#limit == 1, "", "s")}',
        'object.min': '{{#label}} must have at least {{#limit}} key{if(#limit == 1, "", "s")}',
        'object.missing': '{{#label}} must contain at least one of {{#peersWithLabels}}',
        'object.nand': '{{:#mainWithLabel}} must not exist simultaneously with {{#peersWithLabels}}',
        'object.oxor': '{{#label}} contains a conflict between optional exclusive peers {{#peersWithLabels}}',
        'object.pattern.match': '{{#label}} keys failed to match pattern requirements',
        'object.refType': '{{#label}} must be a Joi reference',
        'object.regex': '{{#label}} must be a RegExp object',
        'object.rename.multiple': '{{#label}} cannot rename {{:#from}} because multiple renames are disabled and another key was already renamed to {{:#to}}',
        'object.rename.override': '{{#label}} cannot rename {{:#from}} because override is disabled and target {{:#to}} exists',
        'object.schema': '{{#label}} must be a Joi schema of {{#type}} type',
        'object.unknown': '{{#label}} is not allowed',
        'object.with': '{{:#mainWithLabel}} missing required peer {{:#peerWithLabel}}',
        'object.without': '{{:#mainWithLabel}} conflict with forbidden peer {{:#peerWithLabel}}',
        'object.xor': '{{#label}} contains a conflict between exclusive peers {{#peersWithLabels}}'
    }
});


// Helpers

internals.clone = function (value, prefs) {

    // Object

    if (typeof value === 'object') {
        if (prefs.nonEnumerables) {
            return Clone(value, { shallow: true });
        }

        const clone = Object.create(Object.getPrototypeOf(value));
        Object.assign(clone, value);
        return clone;
    }

    // Function

    const clone = function (...args) {

        return value.apply(this, args);
    };

    clone.prototype = Clone(value.prototype);
    Object.defineProperty(clone, 'name', { value: value.name, writable: false });
    Object.defineProperty(clone, 'length', { value: value.length, writable: false });
    Object.assign(clone, value);
    return clone;
};


internals.dependency = function (schema, rel, key, peers, options) {

    Assert(key === null || typeof key === 'string', rel, 'key must be a strings');

    // Extract options from peers array

    if (!options) {
        options = peers.length > 1 && typeof peers[peers.length - 1] === 'object' ? peers.pop() : {};
    }

    Common.assertOptions(options, ['separator']);

    peers = [].concat(peers);

    // Cast peer paths

    const separator = Common.default(options.separator, '.');
    const paths = [];
    for (const peer of peers) {
        Assert(typeof peer === 'string', rel, 'peers must be strings');
        paths.push(Compile.ref(peer, { separator, ancestor: 0, prefix: false }));
    }

    // Cast key

    if (key !== null) {
        key = Compile.ref(key, { separator, ancestor: 0, prefix: false });
    }

    // Add rule

    const obj = schema.clone();
    obj.$_terms.dependencies = obj.$_terms.dependencies || [];
    obj.$_terms.dependencies.push(new internals.Dependency(rel, key, paths, peers));
    return obj;
};


internals.dependencies = {

    and(schema, dep, value, state, prefs) {

        const missing = [];
        const present = [];
        const count = dep.peers.length;
        for (const peer of dep.peers) {
            if (peer.resolve(value, state, prefs, null, { shadow: false }) === undefined) {
                missing.push(peer.key);
            }
            else {
                present.push(peer.key);
            }
        }

        if (missing.length !== count &&
            present.length !== count) {

            return {
                code: 'object.and',
                context: {
                    present,
                    presentWithLabels: internals.keysToLabels(schema, present),
                    missing,
                    missingWithLabels: internals.keysToLabels(schema, missing)
                }
            };
        }
    },

    nand(schema, dep, value, state, prefs) {

        const present = [];
        for (const peer of dep.peers) {
            if (peer.resolve(value, state, prefs, null, { shadow: false }) !== undefined) {
                present.push(peer.key);
            }
        }

        if (present.length !== dep.peers.length) {
            return;
        }

        const main = dep.paths[0];
        const values = dep.paths.slice(1);
        return {
            code: 'object.nand',
            context: {
                main,
                mainWithLabel: internals.keysToLabels(schema, main),
                peers: values,
                peersWithLabels: internals.keysToLabels(schema, values)
            }
        };
    },

    or(schema, dep, value, state, prefs) {

        for (const peer of dep.peers) {
            if (peer.resolve(value, state, prefs, null, { shadow: false }) !== undefined) {
                return;
            }
        }

        return {
            code: 'object.missing',
            context: {
                peers: dep.paths,
                peersWithLabels: internals.keysToLabels(schema, dep.paths)
            }
        };
    },

    oxor(schema, dep, value, state, prefs) {

        const present = [];
        for (const peer of dep.peers) {
            if (peer.resolve(value, state, prefs, null, { shadow: false }) !== undefined) {
                present.push(peer.key);
            }
        }

        if (!present.length ||
            present.length === 1) {

            return;
        }

        const context = { peers: dep.paths, peersWithLabels: internals.keysToLabels(schema, dep.paths) };
        context.present = present;
        context.presentWithLabels = internals.keysToLabels(schema, present);
        return { code: 'object.oxor', context };
    },

    with(schema, dep, value, state, prefs) {

        for (const peer of dep.peers) {
            if (peer.resolve(value, state, prefs, null, { shadow: false }) === undefined) {
                return {
                    code: 'object.with',
                    context: {
                        main: dep.key.key,
                        mainWithLabel: internals.keysToLabels(schema, dep.key.key),
                        peer: peer.key,
                        peerWithLabel: internals.keysToLabels(schema, peer.key)
                    }
                };
            }
        }
    },

    without(schema, dep, value, state, prefs) {

        for (const peer of dep.peers) {
            if (peer.resolve(value, state, prefs, null, { shadow: false }) !== undefined) {
                return {
                    code: 'object.without',
                    context: {
                        main: dep.key.key,
                        mainWithLabel: internals.keysToLabels(schema, dep.key.key),
                        peer: peer.key,
                        peerWithLabel: internals.keysToLabels(schema, peer.key)
                    }
                };
            }
        }
    },

    xor(schema, dep, value, state, prefs) {

        const present = [];
        for (const peer of dep.peers) {
            if (peer.resolve(value, state, prefs, null, { shadow: false }) !== undefined) {
                present.push(peer.key);
            }
        }

        if (present.length === 1) {
            return;
        }

        const context = { peers: dep.paths, peersWithLabels: internals.keysToLabels(schema, dep.paths) };
        if (present.length === 0) {
            return { code: 'object.missing', context };
        }

        context.present = present;
        context.presentWithLabels = internals.keysToLabels(schema, present);
        return { code: 'object.xor', context };
    }
};


internals.keysToLabels = function (schema, keys) {

    if (Array.isArray(keys)) {
        return keys.map((key) => schema.$_mapLabels(key));
    }

    return schema.$_mapLabels(keys);
};


internals.rename = function (schema, value, state, prefs, errors) {

    const renamed = {};
    for (const rename of schema.$_terms.renames) {
        const matches = [];
        const pattern = typeof rename.from !== 'string';

        if (!pattern) {
            if (Object.prototype.hasOwnProperty.call(value, rename.from) &&
                (value[rename.from] !== undefined || !rename.options.ignoreUndefined)) {

                matches.push(rename);
            }
        }
        else {
            for (const from in value) {
                if (value[from] === undefined &&
                    rename.options.ignoreUndefined) {

                    continue;
                }

                if (from === rename.to) {
                    continue;
                }

                const match = rename.from.exec(from);
                if (!match) {
                    continue;
                }

                matches.push({ from, to: rename.to, match });
            }
        }

        for (const match of matches) {
            const from = match.from;
            let to = match.to;
            if (to instanceof Template) {
                to = to.render(value, state, prefs, match.match);
            }

            if (from === to) {
                continue;
            }

            if (!rename.options.multiple &&
                renamed[to]) {

                errors.push(schema.$_createError('object.rename.multiple', value, { from, to, pattern }, state, prefs));
                if (prefs.abortEarly) {
                    return false;
                }
            }

            if (Object.prototype.hasOwnProperty.call(value, to) &&
                !rename.options.override &&
                !renamed[to]) {

                errors.push(schema.$_createError('object.rename.override', value, { from, to, pattern }, state, prefs));
                if (prefs.abortEarly) {
                    return false;
                }
            }

            if (value[from] === undefined) {
                delete value[to];
            }
            else {
                value[to] = value[from];
            }

            renamed[to] = true;

            if (!rename.options.alias) {
                delete value[from];
            }
        }
    }

    return true;
};


internals.unknown = function (schema, value, unprocessed, errors, state, prefs) {

    if (schema.$_terms.patterns) {
        let hasMatches = false;
        const matches = schema.$_terms.patterns.map((pattern) => {

            if (pattern.matches) {
                hasMatches = true;
                return [];
            }
        });

        const ancestors = [value, ...state.ancestors];

        for (const key of unprocessed) {
            const item = value[key];
            const path = [...state.path, key];

            for (let i = 0; i < schema.$_terms.patterns.length; ++i) {
                const pattern = schema.$_terms.patterns[i];
                if (pattern.regex) {
                    const match = pattern.regex.test(key);
                    state.mainstay.tracer.debug(state, 'rule', `pattern.${i}`, match ? 'pass' : 'error');
                    if (!match) {
                        continue;
                    }
                }
                else {
                    if (!pattern.schema.$_match(key, state.nest(pattern.schema, `pattern.${i}`), prefs)) {
                        continue;
                    }
                }

                unprocessed.delete(key);

                const localState = state.localize(path, ancestors, { schema: pattern.rule, key });
                const result = pattern.rule.$_validate(item, localState, prefs);
                if (result.errors) {
                    if (prefs.abortEarly) {
                        return { value, errors: result.errors };
                    }

                    errors.push(...result.errors);
                }

                if (pattern.matches) {
                    matches[i].push(key);
                }

                value[key] = result.value;
                if (!pattern.fallthrough) {
                    break;
                }
            }
        }

        // Validate pattern matches rules

        if (hasMatches) {
            for (let i = 0; i < matches.length; ++i) {
                const match = matches[i];
                if (!match) {
                    continue;
                }

                const stpm = schema.$_terms.patterns[i].matches;
                const localState = state.localize(state.path, ancestors, stpm);
                const result = stpm.$_validate(match, localState, prefs);
                if (result.errors) {
                    const details = Errors.details(result.errors, { override: false });
                    details.matches = match;
                    const report = schema.$_createError('object.pattern.match', value, details, state, prefs);
                    if (prefs.abortEarly) {
                        return { value, errors: report };
                    }

                    errors.push(report);
                }
            }
        }
    }

    if (!unprocessed.size ||
        !schema.$_terms.keys && !schema.$_terms.patterns) {     // If no keys or patterns specified, unknown keys allowed

        return;
    }

    if (prefs.stripUnknown && !schema._flags.unknown ||
        prefs.skipFunctions) {

        const stripUnknown = prefs.stripUnknown ? (prefs.stripUnknown === true ? true : !!prefs.stripUnknown.objects) : false;

        for (const key of unprocessed) {
            if (stripUnknown) {
                delete value[key];
                unprocessed.delete(key);
            }
            else if (typeof value[key] === 'function') {
                unprocessed.delete(key);
            }
        }
    }

    const forbidUnknown = !Common.default(schema._flags.unknown, prefs.allowUnknown);
    if (forbidUnknown) {
        for (const unprocessedKey of unprocessed) {
            const localState = state.localize([...state.path, unprocessedKey], []);
            const report = schema.$_createError('object.unknown', value[unprocessedKey], { child: unprocessedKey }, localState, prefs, { flags: false });
            if (prefs.abortEarly) {
                return { value, errors: report };
            }

            errors.push(report);
        }
    }
};


internals.Dependency = class {

    constructor(rel, key, peers, paths) {

        this.rel = rel;
        this.key = key;
        this.peers = peers;
        this.paths = paths;
    }

    describe() {

        const desc = {
            rel: this.rel,
            peers: this.paths
        };

        if (this.key !== null) {
            desc.key = this.key.key;
        }

        if (this.peers[0].separator !== '.') {
            desc.options = { separator: this.peers[0].separator };
        }

        return desc;
    }
};


internals.Keys = class extends Array {

    concat(source) {

        const result = this.slice();

        const keys = new Map();
        for (let i = 0; i < result.length; ++i) {
            keys.set(result[i].key, i);
        }

        for (const item of source) {
            const key = item.key;
            const pos = keys.get(key);
            if (pos !== undefined) {
                result[pos] = { key, schema: result[pos].schema.concat(item.schema) };
            }
            else {
                result.push(item);
            }
        }

        return result;
    }
};


/***/ }),

/***/ 9869:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);

const Any = __nccwpck_require__(9512);
const Common = __nccwpck_require__(2448);
const Compile = __nccwpck_require__(3038);
const Errors = __nccwpck_require__(9490);


const internals = {};


module.exports = Any.extend({

    type: 'link',

    properties: {
        schemaChain: true
    },

    terms: {

        link: { init: null, manifest: 'single', register: false }
    },

    args(schema, ref) {

        return schema.ref(ref);
    },

    validate(value, { schema, state, prefs }) {

        Assert(schema.$_terms.link, 'Uninitialized link schema');

        const linked = internals.generate(schema, value, state, prefs);
        const ref = schema.$_terms.link[0].ref;
        return linked.$_validate(value, state.nest(linked, `link:${ref.display}:${linked.type}`), prefs);
    },

    generate(schema, value, state, prefs) {

        return internals.generate(schema, value, state, prefs);
    },

    rules: {

        ref: {
            method(ref) {

                Assert(!this.$_terms.link, 'Cannot reinitialize schema');

                ref = Compile.ref(ref);

                Assert(ref.type === 'value' || ref.type === 'local', 'Invalid reference type:', ref.type);
                Assert(ref.type === 'local' || ref.ancestor === 'root' || ref.ancestor > 0, 'Link cannot reference itself');

                const obj = this.clone();
                obj.$_terms.link = [{ ref }];
                return obj;
            }
        },

        relative: {
            method(enabled = true) {

                return this.$_setFlag('relative', enabled);
            }
        }
    },

    overrides: {

        concat(source) {

            Assert(this.$_terms.link, 'Uninitialized link schema');
            Assert(Common.isSchema(source), 'Invalid schema object');
            Assert(source.type !== 'link', 'Cannot merge type link with another link');

            const obj = this.clone();

            if (!obj.$_terms.whens) {
                obj.$_terms.whens = [];
            }

            obj.$_terms.whens.push({ concat: source });
            return obj.$_mutateRebuild();
        }
    },

    manifest: {

        build(obj, desc) {

            Assert(desc.link, 'Invalid link description missing link');
            return obj.ref(desc.link);
        }
    }
});


// Helpers

internals.generate = function (schema, value, state, prefs) {

    let linked = state.mainstay.links.get(schema);
    if (linked) {
        return linked._generate(value, state, prefs).schema;
    }

    const ref = schema.$_terms.link[0].ref;
    const { perspective, path } = internals.perspective(ref, state);
    internals.assert(perspective, 'which is outside of schema boundaries', ref, schema, state, prefs);

    try {
        linked = path.length ? perspective.$_reach(path) : perspective;
    }
    catch (ignoreErr) {
        internals.assert(false, 'to non-existing schema', ref, schema, state, prefs);
    }

    internals.assert(linked.type !== 'link', 'which is another link', ref, schema, state, prefs);

    if (!schema._flags.relative) {
        state.mainstay.links.set(schema, linked);
    }

    return linked._generate(value, state, prefs).schema;
};


internals.perspective = function (ref, state) {

    if (ref.type === 'local') {
        for (const { schema, key } of state.schemas) {                              // From parent to root
            const id = schema._flags.id || key;
            if (id === ref.path[0]) {
                return { perspective: schema, path: ref.path.slice(1) };
            }

            if (schema.$_terms.shared) {
                for (const shared of schema.$_terms.shared) {
                    if (shared._flags.id === ref.path[0]) {
                        return { perspective: shared, path: ref.path.slice(1) };
                    }
                }
            }
        }

        return { perspective: null, path: null };
    }

    if (ref.ancestor === 'root') {
        return { perspective: state.schemas[state.schemas.length - 1].schema, path: ref.path };
    }

    return { perspective: state.schemas[ref.ancestor] && state.schemas[ref.ancestor].schema, path: ref.path };
};


internals.assert = function (condition, message, ref, schema, state, prefs) {

    if (condition) {                // Manual check to avoid generating error message on success
        return;
    }

    Assert(false, `"${Errors.label(schema._flags, state, prefs)}" contains link reference "${ref.display}" ${message}`);
};


/***/ }),

/***/ 5855:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);

const Any = __nccwpck_require__(9512);
const Common = __nccwpck_require__(2448);


const internals = {
    numberRx: /^\s*[+-]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e([+-]?\d+))?\s*$/i,
    precisionRx: /(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/
};


module.exports = Any.extend({

    type: 'number',

    flags: {

        unsafe: { default: false }
    },

    coerce: {
        from: 'string',
        method(value, { schema, error }) {

            const matches = value.match(internals.numberRx);
            if (!matches) {
                return;
            }

            value = value.trim();
            const result = { value: parseFloat(value) };

            if (result.value === 0) {
                result.value = 0;           // -0
            }

            if (!schema._flags.unsafe) {
                if (value.match(/e/i)) {
                    const constructed = internals.normalizeExponent(`${result.value / Math.pow(10, matches[1])}e${matches[1]}`);
                    if (constructed !== internals.normalizeExponent(value)) {
                        result.errors = error('number.unsafe');
                        return result;
                    }
                }
                else {
                    const string = result.value.toString();
                    if (string.match(/e/i)) {
                        return result;
                    }

                    if (string !== internals.normalizeDecimal(value)) {
                        result.errors = error('number.unsafe');
                        return result;
                    }
                }
            }

            return result;
        }
    },

    validate(value, { schema, error, prefs }) {

        if (value === Infinity ||
            value === -Infinity) {

            return { value, errors: error('number.infinity') };
        }

        if (!Common.isNumber(value)) {
            return { value, errors: error('number.base') };
        }

        const result = { value };

        if (prefs.convert) {
            const rule = schema.$_getRule('precision');
            if (rule) {
                const precision = Math.pow(10, rule.args.limit);                    // This is conceptually equivalent to using toFixed but it should be much faster
                result.value = Math.round(result.value * precision) / precision;
            }
        }

        if (result.value === 0) {
            result.value = 0;           // -0
        }

        if (!schema._flags.unsafe &&
            (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER)) {

            result.errors = error('number.unsafe');
        }

        return result;
    },

    rules: {

        compare: {
            method: false,
            validate(value, helpers, { limit }, { name, operator, args }) {

                if (Common.compare(value, limit, operator)) {
                    return value;
                }

                return helpers.error('number.' + name, { limit: args.limit, value });
            },
            args: [
                {
                    name: 'limit',
                    ref: true,
                    assert: Common.isNumber,
                    message: 'must be a number'
                }
            ]
        },

        greater: {
            method(limit) {

                return this.$_addRule({ name: 'greater', method: 'compare', args: { limit }, operator: '>' });
            }
        },

        integer: {
            method() {

                return this.$_addRule('integer');
            },
            validate(value, helpers) {

                if (Math.trunc(value) - value === 0) {
                    return value;
                }

                return helpers.error('number.integer');
            }
        },

        less: {
            method(limit) {

                return this.$_addRule({ name: 'less', method: 'compare', args: { limit }, operator: '<' });
            }
        },

        max: {
            method(limit) {

                return this.$_addRule({ name: 'max', method: 'compare', args: { limit }, operator: '<=' });
            }
        },

        min: {
            method(limit) {

                return this.$_addRule({ name: 'min', method: 'compare', args: { limit }, operator: '>=' });
            }
        },

        multiple: {
            method(base) {

                return this.$_addRule({ name: 'multiple', args: { base } });
            },
            validate(value, helpers, { base }, options) {

                if (value % base === 0) {
                    return value;
                }

                return helpers.error('number.multiple', { multiple: options.args.base, value });
            },
            args: [
                {
                    name: 'base',
                    ref: true,
                    assert: (value) => typeof value === 'number' && isFinite(value) && value > 0,
                    message: 'must be a positive number'
                }
            ],
            multi: true
        },

        negative: {
            method() {

                return this.sign('negative');
            }
        },

        port: {
            method() {

                return this.$_addRule('port');
            },
            validate(value, helpers) {

                if (Number.isSafeInteger(value) &&
                    value >= 0 &&
                    value <= 65535) {

                    return value;
                }

                return helpers.error('number.port');
            }
        },

        positive: {
            method() {

                return this.sign('positive');
            }
        },

        precision: {
            method(limit) {

                Assert(Number.isSafeInteger(limit), 'limit must be an integer');

                return this.$_addRule({ name: 'precision', args: { limit } });
            },
            validate(value, helpers, { limit }) {

                const places = value.toString().match(internals.precisionRx);
                const decimals = Math.max((places[1] ? places[1].length : 0) - (places[2] ? parseInt(places[2], 10) : 0), 0);
                if (decimals <= limit) {
                    return value;
                }

                return helpers.error('number.precision', { limit, value });
            },
            convert: true
        },

        sign: {
            method(sign) {

                Assert(['negative', 'positive'].includes(sign), 'Invalid sign', sign);

                return this.$_addRule({ name: 'sign', args: { sign } });
            },
            validate(value, helpers, { sign }) {

                if (sign === 'negative' && value < 0 ||
                    sign === 'positive' && value > 0) {

                    return value;
                }

                return helpers.error(`number.${sign}`);
            }
        },

        unsafe: {
            method(enabled = true) {

                Assert(typeof enabled === 'boolean', 'enabled must be a boolean');

                return this.$_setFlag('unsafe', enabled);
            }
        }
    },

    cast: {
        string: {
            from: (value) => typeof value === 'number',
            to(value, helpers) {

                return value.toString();
            }
        }
    },

    messages: {
        'number.base': '{{#label}} must be a number',
        'number.greater': '{{#label}} must be greater than {{#limit}}',
        'number.infinity': '{{#label}} cannot be infinity',
        'number.integer': '{{#label}} must be an integer',
        'number.less': '{{#label}} must be less than {{#limit}}',
        'number.max': '{{#label}} must be less than or equal to {{#limit}}',
        'number.min': '{{#label}} must be greater than or equal to {{#limit}}',
        'number.multiple': '{{#label}} must be a multiple of {{#multiple}}',
        'number.negative': '{{#label}} must be a negative number',
        'number.port': '{{#label}} must be a valid port',
        'number.positive': '{{#label}} must be a positive number',
        'number.precision': '{{#label}} must have no more than {{#limit}} decimal places',
        'number.unsafe': '{{#label}} must be a safe number'
    }
});


// Helpers

internals.normalizeExponent = function (str) {

    return str
        .replace(/E/, 'e')
        .replace(/\.(\d*[1-9])?0+e/, '.$1e')
        .replace(/\.e/, 'e')
        .replace(/e\+/, 'e')
        .replace(/^\+/, '')
        .replace(/^(-?)0+([1-9])/, '$1$2');
};


internals.normalizeDecimal = function (str) {

    str = str
        // Remove leading plus signs
        .replace(/^\+/, '')
        // Remove trailing zeros if there is a decimal point and unecessary decimal points
        .replace(/\.0*$/, '')
        // Add a integer 0 if the numbers starts with a decimal point
        .replace(/^(-?)\.([^\.]*)$/, '$10.$2')
        // Remove leading zeros
        .replace(/^(-?)0+([0-9])/, '$1$2');

    if (str.includes('.') &&
        str.endsWith('0')) {

        str = str.replace(/0+$/, '');
    }

    if (str === '-0') {
        return '0';
    }

    return str;
};


/***/ }),

/***/ 6077:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Keys = __nccwpck_require__(9130);


const internals = {};


module.exports = Keys.extend({

    type: 'object',

    cast: {
        map: {
            from: (value) => value && typeof value === 'object',
            to(value, helpers) {

                return new Map(Object.entries(value));
            }
        }
    }
});


/***/ }),

/***/ 2260:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);
const Domain = __nccwpck_require__(7425);
const Email = __nccwpck_require__(3283);
const Ip = __nccwpck_require__(2337);
const EscapeRegex = __nccwpck_require__(1965);
const Tlds = __nccwpck_require__(3092);
const Uri = __nccwpck_require__(4983);

const Any = __nccwpck_require__(9512);
const Common = __nccwpck_require__(2448);


const internals = {
    tlds: Tlds instanceof Set ? { tlds: { allow: Tlds, deny: null } } : false,              // $lab:coverage:ignore$
    base64Regex: {
        // paddingRequired
        true: {
            // urlSafe
            true: /^(?:[\w\-]{2}[\w\-]{2})*(?:[\w\-]{2}==|[\w\-]{3}=)?$/,
            false: /^(?:[A-Za-z0-9+\/]{2}[A-Za-z0-9+\/]{2})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/
        },
        false: {
            true: /^(?:[\w\-]{2}[\w\-]{2})*(?:[\w\-]{2}(==)?|[\w\-]{3}=?)?$/,
            false: /^(?:[A-Za-z0-9+\/]{2}[A-Za-z0-9+\/]{2})*(?:[A-Za-z0-9+\/]{2}(==)?|[A-Za-z0-9+\/]{3}=?)?$/
        }
    },
    dataUriRegex: /^data:[\w+.-]+\/[\w+.-]+;((charset=[\w-]+|base64),)?(.*)$/,
    hexRegex: /^[a-f0-9]+$/i,
    ipRegex: Ip.regex().regex,
    isoDurationRegex: /^P(?!$)(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?$/,

    guidBrackets: {
        '{': '}', '[': ']', '(': ')', '': ''
    },
    guidVersions: {
        uuidv1: '1',
        uuidv2: '2',
        uuidv3: '3',
        uuidv4: '4',
        uuidv5: '5'
    },
    guidSeparators: new Set([undefined, true, false, '-', ':']),

    normalizationForms: ['NFC', 'NFD', 'NFKC', 'NFKD']
};


module.exports = Any.extend({

    type: 'string',

    flags: {

        insensitive: { default: false },
        truncate: { default: false }
    },

    terms: {

        replacements: { init: null }
    },

    coerce: {
        from: 'string',
        method(value, { schema, state, prefs }) {

            const normalize = schema.$_getRule('normalize');
            if (normalize) {
                value = value.normalize(normalize.args.form);
            }

            const casing = schema.$_getRule('case');
            if (casing) {
                value = casing.args.direction === 'upper' ? value.toLocaleUpperCase() : value.toLocaleLowerCase();
            }

            const trim = schema.$_getRule('trim');
            if (trim &&
                trim.args.enabled) {

                value = value.trim();
            }

            if (schema.$_terms.replacements) {
                for (const replacement of schema.$_terms.replacements) {
                    value = value.replace(replacement.pattern, replacement.replacement);
                }
            }

            const hex = schema.$_getRule('hex');
            if (hex &&
                hex.args.options.byteAligned &&
                value.length % 2 !== 0) {

                value = `0${value}`;
            }

            if (schema.$_getRule('isoDate')) {
                const iso = internals.isoDate(value);
                if (iso) {
                    value = iso;
                }
            }

            if (schema._flags.truncate) {
                const rule = schema.$_getRule('max');
                if (rule) {
                    let limit = rule.args.limit;
                    if (Common.isResolvable(limit)) {
                        limit = limit.resolve(value, state, prefs);
                        if (!Common.limit(limit)) {
                            return { value, errors: schema.$_createError('any.ref', limit, { ref: rule.args.limit, arg: 'limit', reason: 'must be a positive integer' }, state, prefs) };
                        }
                    }

                    value = value.slice(0, limit);
                }
            }

            return { value };
        }
    },

    validate(value, { error }) {

        if (typeof value !== 'string') {
            return { value, errors: error('string.base') };
        }

        if (value === '') {
            return { value, errors: error('string.empty') };
        }
    },

    rules: {

        alphanum: {
            method() {

                return this.$_addRule('alphanum');
            },
            validate(value, helpers) {

                if (/^[a-zA-Z0-9]+$/.test(value)) {
                    return value;
                }

                return helpers.error('string.alphanum');
            }
        },

        base64: {
            method(options = {}) {

                Common.assertOptions(options, ['paddingRequired', 'urlSafe']);

                options = { urlSafe: false, paddingRequired: true, ...options };
                Assert(typeof options.paddingRequired === 'boolean', 'paddingRequired must be boolean');
                Assert(typeof options.urlSafe === 'boolean', 'urlSafe must be boolean');

                return this.$_addRule({ name: 'base64', args: { options } });
            },
            validate(value, helpers, { options }) {

                const regex = internals.base64Regex[options.paddingRequired][options.urlSafe];
                if (regex.test(value)) {
                    return value;
                }

                return helpers.error('string.base64');
            }
        },

        case: {
            method(direction) {

                Assert(['lower', 'upper'].includes(direction), 'Invalid case:', direction);

                return this.$_addRule({ name: 'case', args: { direction } });
            },
            validate(value, helpers, { direction }) {

                if (direction === 'lower' && value === value.toLocaleLowerCase() ||
                    direction === 'upper' && value === value.toLocaleUpperCase()) {

                    return value;
                }

                return helpers.error(`string.${direction}case`);
            },
            convert: true
        },

        creditCard: {
            method() {

                return this.$_addRule('creditCard');
            },
            validate(value, helpers) {

                let i = value.length;
                let sum = 0;
                let mul = 1;

                while (i--) {
                    const char = value.charAt(i) * mul;
                    sum = sum + (char - (char > 9) * 9);
                    mul = mul ^ 3;
                }

                if (sum > 0 &&
                    sum % 10 === 0) {

                    return value;
                }

                return helpers.error('string.creditCard');
            }
        },

        dataUri: {
            method(options = {}) {

                Common.assertOptions(options, ['paddingRequired']);

                options = { paddingRequired: true, ...options };
                Assert(typeof options.paddingRequired === 'boolean', 'paddingRequired must be boolean');

                return this.$_addRule({ name: 'dataUri', args: { options } });
            },
            validate(value, helpers, { options }) {

                const matches = value.match(internals.dataUriRegex);

                if (matches) {
                    if (!matches[2]) {
                        return value;
                    }

                    if (matches[2] !== 'base64') {
                        return value;
                    }

                    const base64regex = internals.base64Regex[options.paddingRequired].false;
                    if (base64regex.test(matches[3])) {
                        return value;
                    }
                }

                return helpers.error('string.dataUri');
            }
        },

        domain: {
            method(options) {

                if (options) {
                    Common.assertOptions(options, ['allowUnicode', 'maxDomainSegments', 'minDomainSegments', 'tlds']);
                }

                const address = internals.addressOptions(options);
                return this.$_addRule({ name: 'domain', args: { options }, address });
            },
            validate(value, helpers, args, { address }) {

                if (Domain.isValid(value, address)) {
                    return value;
                }

                return helpers.error('string.domain');
            }
        },

        email: {
            method(options = {}) {

                Common.assertOptions(options, ['allowUnicode', 'ignoreLength', 'maxDomainSegments', 'minDomainSegments', 'multiple', 'separator', 'tlds']);
                Assert(options.multiple === undefined || typeof options.multiple === 'boolean', 'multiple option must be an boolean');

                const address = internals.addressOptions(options);
                const regex = new RegExp(`\\s*[${options.separator ? EscapeRegex(options.separator) : ','}]\\s*`);

                return this.$_addRule({ name: 'email', args: { options }, regex, address });
            },
            validate(value, helpers, { options }, { regex, address }) {

                const emails = options.multiple ? value.split(regex) : [value];
                const invalids = [];
                for (const email of emails) {
                    if (!Email.isValid(email, address)) {
                        invalids.push(email);
                    }
                }

                if (!invalids.length) {
                    return value;
                }

                return helpers.error('string.email', { value, invalids });
            }
        },

        guid: {
            alias: 'uuid',
            method(options = {}) {

                Common.assertOptions(options, ['version', 'separator']);

                let versionNumbers = '';

                if (options.version) {
                    const versions = [].concat(options.version);

                    Assert(versions.length >= 1, 'version must have at least 1 valid version specified');
                    const set = new Set();

                    for (let i = 0; i < versions.length; ++i) {
                        const version = versions[i];
                        Assert(typeof version === 'string', 'version at position ' + i + ' must be a string');
                        const versionNumber = internals.guidVersions[version.toLowerCase()];
                        Assert(versionNumber, 'version at position ' + i + ' must be one of ' + Object.keys(internals.guidVersions).join(', '));
                        Assert(!set.has(versionNumber), 'version at position ' + i + ' must not be a duplicate');

                        versionNumbers += versionNumber;
                        set.add(versionNumber);
                    }
                }

                Assert(internals.guidSeparators.has(options.separator), 'separator must be one of true, false, "-", or ":"');
                const separator = options.separator === undefined ? '[:-]?' :
                    options.separator === true ? '[:-]' :
                        options.separator === false ? '[]?' : `\\${options.separator}`;

                const regex = new RegExp(`^([\\[{\\(]?)[0-9A-F]{8}(${separator})[0-9A-F]{4}\\2?[${versionNumbers || '0-9A-F'}][0-9A-F]{3}\\2?[${versionNumbers ? '89AB' : '0-9A-F'}][0-9A-F]{3}\\2?[0-9A-F]{12}([\\]}\\)]?)$`, 'i');

                return this.$_addRule({ name: 'guid', args: { options }, regex });
            },
            validate(value, helpers, args, { regex }) {

                const results = regex.exec(value);

                if (!results) {
                    return helpers.error('string.guid');
                }

                // Matching braces

                if (internals.guidBrackets[results[1]] !== results[results.length - 1]) {
                    return helpers.error('string.guid');
                }

                return value;
            }
        },

        hex: {
            method(options = {}) {

                Common.assertOptions(options, ['byteAligned']);

                options = { byteAligned: false, ...options };
                Assert(typeof options.byteAligned === 'boolean', 'byteAligned must be boolean');

                return this.$_addRule({ name: 'hex', args: { options } });
            },
            validate(value, helpers, { options }) {

                if (!internals.hexRegex.test(value)) {
                    return helpers.error('string.hex');
                }

                if (options.byteAligned &&
                    value.length % 2 !== 0) {

                    return helpers.error('string.hexAlign');
                }

                return value;
            }
        },

        hostname: {
            method() {

                return this.$_addRule('hostname');
            },
            validate(value, helpers) {

                if (Domain.isValid(value, { minDomainSegments: 1 }) ||
                    internals.ipRegex.test(value)) {

                    return value;
                }

                return helpers.error('string.hostname');
            }
        },

        insensitive: {
            method() {

                return this.$_setFlag('insensitive', true);
            }
        },

        ip: {
            method(options = {}) {

                Common.assertOptions(options, ['cidr', 'version']);

                const { cidr, versions, regex } = Ip.regex(options);
                const version = options.version ? versions : undefined;
                return this.$_addRule({ name: 'ip', args: { options: { cidr, version } }, regex });
            },
            validate(value, helpers, { options }, { regex }) {

                if (regex.test(value)) {
                    return value;
                }

                if (options.version) {
                    return helpers.error('string.ipVersion', { value, cidr: options.cidr, version: options.version });
                }

                return helpers.error('string.ip', { value, cidr: options.cidr });
            }
        },

        isoDate: {
            method() {

                return this.$_addRule('isoDate');
            },
            validate(value, { error }) {

                if (internals.isoDate(value)) {
                    return value;
                }

                return error('string.isoDate');
            }
        },

        isoDuration: {
            method() {

                return this.$_addRule('isoDuration');
            },
            validate(value, helpers) {

                if (internals.isoDurationRegex.test(value)) {
                    return value;
                }

                return helpers.error('string.isoDuration');
            }
        },

        length: {
            method(limit, encoding) {

                return internals.length(this, 'length', limit, '=', encoding);
            },
            validate(value, helpers, { limit, encoding }, { name, operator, args }) {

                const length = encoding ? Buffer && Buffer.byteLength(value, encoding) : value.length;      // $lab:coverage:ignore$
                if (Common.compare(length, limit, operator)) {
                    return value;
                }

                return helpers.error('string.' + name, { limit: args.limit, value, encoding });
            },
            args: [
                {
                    name: 'limit',
                    ref: true,
                    assert: Common.limit,
                    message: 'must be a positive integer'
                },
                'encoding'
            ]
        },

        lowercase: {
            method() {

                return this.case('lower');
            }
        },

        max: {
            method(limit, encoding) {

                return internals.length(this, 'max', limit, '<=', encoding);
            },
            args: ['limit', 'encoding']
        },

        min: {
            method(limit, encoding) {

                return internals.length(this, 'min', limit, '>=', encoding);
            },
            args: ['limit', 'encoding']
        },

        normalize: {
            method(form = 'NFC') {

                Assert(internals.normalizationForms.includes(form), 'normalization form must be one of ' + internals.normalizationForms.join(', '));

                return this.$_addRule({ name: 'normalize', args: { form } });
            },
            validate(value, { error }, { form }) {

                if (value === value.normalize(form)) {
                    return value;
                }

                return error('string.normalize', { value, form });
            },
            convert: true
        },

        pattern: {
            alias: 'regex',
            method(regex, options = {}) {

                Assert(regex instanceof RegExp, 'regex must be a RegExp');
                Assert(!regex.flags.includes('g') && !regex.flags.includes('y'), 'regex should not use global or sticky mode');

                if (typeof options === 'string') {
                    options = { name: options };
                }

                Common.assertOptions(options, ['invert', 'name']);

                const errorCode = ['string.pattern', options.invert ? '.invert' : '', options.name ? '.name' : '.base'].join('');
                return this.$_addRule({ name: 'pattern', args: { regex, options }, errorCode });
            },
            validate(value, helpers, { regex, options }, { errorCode }) {

                const patternMatch = regex.test(value);

                if (patternMatch ^ options.invert) {
                    return value;
                }

                return helpers.error(errorCode, { name: options.name, regex, value });
            },
            args: ['regex', 'options'],
            multi: true
        },

        replace: {
            method(pattern, replacement) {

                if (typeof pattern === 'string') {
                    pattern = new RegExp(EscapeRegex(pattern), 'g');
                }

                Assert(pattern instanceof RegExp, 'pattern must be a RegExp');
                Assert(typeof replacement === 'string', 'replacement must be a String');

                const obj = this.clone();

                if (!obj.$_terms.replacements) {
                    obj.$_terms.replacements = [];
                }

                obj.$_terms.replacements.push({ pattern, replacement });
                return obj;
            }
        },

        token: {
            method() {

                return this.$_addRule('token');
            },
            validate(value, helpers) {

                if (/^\w+$/.test(value)) {
                    return value;
                }

                return helpers.error('string.token');
            }
        },

        trim: {
            method(enabled = true) {

                Assert(typeof enabled === 'boolean', 'enabled must be a boolean');

                return this.$_addRule({ name: 'trim', args: { enabled } });
            },
            validate(value, helpers, { enabled }) {

                if (!enabled ||
                    value === value.trim()) {

                    return value;
                }

                return helpers.error('string.trim');
            },
            convert: true
        },

        truncate: {
            method(enabled = true) {

                Assert(typeof enabled === 'boolean', 'enabled must be a boolean');

                return this.$_setFlag('truncate', enabled);
            }
        },

        uppercase: {
            method() {

                return this.case('upper');
            }
        },

        uri: {
            method(options = {}) {

                Common.assertOptions(options, ['allowRelative', 'allowQuerySquareBrackets', 'domain', 'relativeOnly', 'scheme']);

                if (options.domain) {
                    Common.assertOptions(options.domain, ['allowUnicode', 'maxDomainSegments', 'minDomainSegments', 'tlds']);
                }

                const { regex, scheme } = Uri.regex(options);
                const domain = options.domain ? internals.addressOptions(options.domain) : null;
                return this.$_addRule({ name: 'uri', args: { options }, regex, domain, scheme });
            },
            validate(value, helpers, { options }, { regex, domain, scheme }) {

                if (['http:/', 'https:/'].includes(value)) {            // scheme:/ is technically valid but makes no sense
                    return helpers.error('string.uri');
                }

                const match = regex.exec(value);
                if (match) {
                    const matched = match[1] || match[2];
                    if (domain &&
                        (!options.allowRelative || matched) &&
                        !Domain.isValid(matched, domain)) {

                        return helpers.error('string.domain', { value: matched });
                    }

                    return value;
                }

                if (options.relativeOnly) {
                    return helpers.error('string.uriRelativeOnly');
                }

                if (options.scheme) {
                    return helpers.error('string.uriCustomScheme', { scheme, value });
                }

                return helpers.error('string.uri');
            }
        }
    },

    manifest: {

        build(obj, desc) {

            if (desc.replacements) {
                for (const { pattern, replacement } of desc.replacements) {
                    obj = obj.replace(pattern, replacement);
                }
            }

            return obj;
        }
    },

    messages: {
        'string.alphanum': '{{#label}} must only contain alpha-numeric characters',
        'string.base': '{{#label}} must be a string',
        'string.base64': '{{#label}} must be a valid base64 string',
        'string.creditCard': '{{#label}} must be a credit card',
        'string.dataUri': '{{#label}} must be a valid dataUri string',
        'string.domain': '{{#label}} must contain a valid domain name',
        'string.email': '{{#label}} must be a valid email',
        'string.empty': '{{#label}} is not allowed to be empty',
        'string.guid': '{{#label}} must be a valid GUID',
        'string.hex': '{{#label}} must only contain hexadecimal characters',
        'string.hexAlign': '{{#label}} hex decoded representation must be byte aligned',
        'string.hostname': '{{#label}} must be a valid hostname',
        'string.ip': '{{#label}} must be a valid ip address with a {{#cidr}} CIDR',
        'string.ipVersion': '{{#label}} must be a valid ip address of one of the following versions {{#version}} with a {{#cidr}} CIDR',
        'string.isoDate': '{{#label}} must be in iso format',
        'string.isoDuration': '{{#label}} must be a valid ISO 8601 duration',
        'string.length': '{{#label}} length must be {{#limit}} characters long',
        'string.lowercase': '{{#label}} must only contain lowercase characters',
        'string.max': '{{#label}} length must be less than or equal to {{#limit}} characters long',
        'string.min': '{{#label}} length must be at least {{#limit}} characters long',
        'string.normalize': '{{#label}} must be unicode normalized in the {{#form}} form',
        'string.token': '{{#label}} must only contain alpha-numeric and underscore characters',
        'string.pattern.base': '{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}',
        'string.pattern.name': '{{#label}} with value {:[.]} fails to match the {{#name}} pattern',
        'string.pattern.invert.base': '{{#label}} with value {:[.]} matches the inverted pattern: {{#regex}}',
        'string.pattern.invert.name': '{{#label}} with value {:[.]} matches the inverted {{#name}} pattern',
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
        'string.uri': '{{#label}} must be a valid uri',
        'string.uriCustomScheme': '{{#label}} must be a valid uri with a scheme matching the {{#scheme}} pattern',
        'string.uriRelativeOnly': '{{#label}} must be a valid relative uri',
        'string.uppercase': '{{#label}} must only contain uppercase characters'
    }
});


// Helpers

internals.addressOptions = function (options) {

    if (!options) {
        return options;
    }

    // minDomainSegments

    Assert(options.minDomainSegments === undefined ||
        Number.isSafeInteger(options.minDomainSegments) && options.minDomainSegments > 0, 'minDomainSegments must be a positive integer');

    // maxDomainSegments

    Assert(options.maxDomainSegments === undefined ||
        Number.isSafeInteger(options.maxDomainSegments) && options.maxDomainSegments > 0, 'maxDomainSegments must be a positive integer');

    // tlds

    if (options.tlds === false) {
        return options;
    }

    if (options.tlds === true ||
        options.tlds === undefined) {

        Assert(internals.tlds, 'Built-in TLD list disabled');
        return Object.assign({}, options, internals.tlds);
    }

    Assert(typeof options.tlds === 'object', 'tlds must be true, false, or an object');

    const deny = options.tlds.deny;
    if (deny) {
        if (Array.isArray(deny)) {
            options = Object.assign({}, options, { tlds: { deny: new Set(deny) } });
        }

        Assert(options.tlds.deny instanceof Set, 'tlds.deny must be an array, Set, or boolean');
        Assert(!options.tlds.allow, 'Cannot specify both tlds.allow and tlds.deny lists');
        internals.validateTlds(options.tlds.deny, 'tlds.deny');
        return options;
    }

    const allow = options.tlds.allow;
    if (!allow) {
        return options;
    }

    if (allow === true) {
        Assert(internals.tlds, 'Built-in TLD list disabled');
        return Object.assign({}, options, internals.tlds);
    }

    if (Array.isArray(allow)) {
        options = Object.assign({}, options, { tlds: { allow: new Set(allow) } });
    }

    Assert(options.tlds.allow instanceof Set, 'tlds.allow must be an array, Set, or boolean');
    internals.validateTlds(options.tlds.allow, 'tlds.allow');
    return options;
};


internals.validateTlds = function (set, source) {

    for (const tld of set) {
        Assert(Domain.isValid(tld, { minDomainSegments: 1, maxDomainSegments: 1 }), `${source} must contain valid top level domain names`);
    }
};


internals.isoDate = function (value) {

    if (!Common.isIsoDate(value)) {
        return null;
    }

    if (/.*T.*[+-]\d\d$/.test(value)) {             // Add missing trailing zeros to timeshift
        value += '00';
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
        return null;
    }

    return date.toISOString();
};


internals.length = function (schema, name, limit, operator, encoding) {

    Assert(!encoding || Buffer && Buffer.isEncoding(encoding), 'Invalid encoding:', encoding);      // $lab:coverage:ignore$

    return schema.$_addRule({ name, method: 'length', args: { limit, encoding }, operator });
};


/***/ }),

/***/ 971:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);

const Any = __nccwpck_require__(9512);


const internals = {};


internals.Map = class extends Map {

    slice() {

        return new internals.Map(this);
    }
};


module.exports = Any.extend({

    type: 'symbol',

    terms: {

        map: { init: new internals.Map() }
    },

    coerce: {
        method(value, { schema, error }) {

            const lookup = schema.$_terms.map.get(value);
            if (lookup) {
                value = lookup;
            }

            if (!schema._flags.only ||
                typeof value === 'symbol') {

                return { value };
            }

            return { value, errors: error('symbol.map', { map: schema.$_terms.map }) };
        }
    },

    validate(value, { error }) {

        if (typeof value !== 'symbol') {
            return { value, errors: error('symbol.base') };
        }
    },

    rules: {
        map: {
            method(iterable) {

                if (iterable &&
                    !iterable[Symbol.iterator] &&
                    typeof iterable === 'object') {

                    iterable = Object.entries(iterable);
                }

                Assert(iterable && iterable[Symbol.iterator], 'Iterable must be an iterable or object');

                const obj = this.clone();

                const symbols = [];
                for (const entry of iterable) {
                    Assert(entry && entry[Symbol.iterator], 'Entry must be an iterable');
                    const [key, value] = entry;

                    Assert(typeof key !== 'object' && typeof key !== 'function' && typeof key !== 'symbol', 'Key must not be of type object, function, or Symbol');
                    Assert(typeof value === 'symbol', 'Value must be a Symbol');

                    obj.$_terms.map.set(key, value);
                    symbols.push(value);
                }

                return obj.valid(...symbols);
            }
        }
    },

    manifest: {

        build(obj, desc) {

            if (desc.map) {
                obj = obj.map(desc.map);
            }

            return obj;
        }
    },

    messages: {
        'symbol.base': '{{#label}} must be a symbol',
        'symbol.map': '{{#label}} must be one of {{#map}}'
    }
});


/***/ }),

/***/ 1804:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);
const Clone = __nccwpck_require__(5578);
const Ignore = __nccwpck_require__(2887);
const Reach = __nccwpck_require__(8891);

const Common = __nccwpck_require__(2448);
const Errors = __nccwpck_require__(9490);
const State = __nccwpck_require__(3634);


const internals = {
    result: Symbol('result')
};


exports.entry = function (value, schema, prefs) {

    let settings = Common.defaults;
    if (prefs) {
        Assert(prefs.warnings === undefined, 'Cannot override warnings preference in synchronous validation');
        Assert(prefs.artifacts === undefined, 'Cannot override artifacts preference in synchronous validation');
        settings = Common.preferences(Common.defaults, prefs);
    }

    const result = internals.entry(value, schema, settings);
    Assert(!result.mainstay.externals.length, 'Schema with external rules must use validateAsync()');
    const outcome = { value: result.value };

    if (result.error) {
        outcome.error = result.error;
    }

    if (result.mainstay.warnings.length) {
        outcome.warning = Errors.details(result.mainstay.warnings);
    }

    if (result.mainstay.debug) {
        outcome.debug = result.mainstay.debug;
    }

    if (result.mainstay.artifacts) {
        outcome.artifacts = result.mainstay.artifacts;
    }

    return outcome;
};


exports.entryAsync = async function (value, schema, prefs) {

    let settings = Common.defaults;
    if (prefs) {
        settings = Common.preferences(Common.defaults, prefs);
    }

    const result = internals.entry(value, schema, settings);
    const mainstay = result.mainstay;
    if (result.error) {
        if (mainstay.debug) {
            result.error.debug = mainstay.debug;
        }

        throw result.error;
    }

    if (mainstay.externals.length) {
        let root = result.value;
        for (const { method, path, label } of mainstay.externals) {
            let node = root;
            let key;
            let parent;

            if (path.length) {
                key = path[path.length - 1];
                parent = Reach(root, path.slice(0, -1));
                node = parent[key];
            }

            try {
                const output = await method(node, { prefs });
                if (output === undefined ||
                    output === node) {

                    continue;
                }

                if (parent) {
                    parent[key] = output;
                }
                else {
                    root = output;
                }
            }
            catch (err) {
                err.message += ` (${label})`;       // Change message to include path
                throw err;
            }
        }

        result.value = root;
    }

    if (!settings.warnings &&
        !settings.debug &&
        !settings.artifacts) {

        return result.value;
    }

    const outcome = { value: result.value };
    if (mainstay.warnings.length) {
        outcome.warning = Errors.details(mainstay.warnings);
    }

    if (mainstay.debug) {
        outcome.debug = mainstay.debug;
    }

    if (mainstay.artifacts) {
        outcome.artifacts = mainstay.artifacts;
    }

    return outcome;
};


internals.entry = function (value, schema, prefs) {

    // Prepare state

    const { tracer, cleanup } = internals.tracer(schema, prefs);
    const debug = prefs.debug ? [] : null;
    const links = schema._ids._schemaChain ? new Map() : null;
    const mainstay = { externals: [], warnings: [], tracer, debug, links };
    const schemas = schema._ids._schemaChain ? [{ schema }] : null;
    const state = new State([], [], { mainstay, schemas });

    // Validate value

    const result = exports.validate(value, schema, state, prefs);

    // Process value and errors

    if (cleanup) {
        schema.$_root.untrace();
    }

    const error = Errors.process(result.errors, value, prefs);
    return { value: result.value, error, mainstay };
};


internals.tracer = function (schema, prefs) {

    if (schema.$_root._tracer) {
        return { tracer: schema.$_root._tracer._register(schema) };
    }

    if (prefs.debug) {
        Assert(schema.$_root.trace, 'Debug mode not supported');
        return { tracer: schema.$_root.trace()._register(schema), cleanup: true };
    }

    return { tracer: internals.ignore };
};


exports.validate = function (value, schema, state, prefs, overrides = {}) {

    if (schema.$_terms.whens) {
        schema = schema._generate(value, state, prefs).schema;
    }

    // Setup state and settings

    if (schema._preferences) {
        prefs = internals.prefs(schema, prefs);
    }

    // Cache

    if (schema._cache &&
        prefs.cache) {

        const result = schema._cache.get(value);
        state.mainstay.tracer.debug(state, 'validate', 'cached', !!result);
        if (result) {
            return result;
        }
    }

    // Helpers

    const createError = (code, local, localState) => schema.$_createError(code, value, local, localState || state, prefs);
    const helpers = {
        original: value,
        prefs,
        schema,
        state,
        error: createError,
        errorsArray: internals.errorsArray,
        warn: (code, local, localState) => state.mainstay.warnings.push(createError(code, local, localState)),
        message: (messages, local) => schema.$_createError('custom', value, local, state, prefs, { messages })
    };

    // Prepare

    state.mainstay.tracer.entry(schema, state);

    const def = schema._definition;
    if (def.prepare &&
        value !== undefined &&
        prefs.convert) {

        const prepared = def.prepare(value, helpers);
        if (prepared) {
            state.mainstay.tracer.value(state, 'prepare', value, prepared.value);
            if (prepared.errors) {
                return internals.finalize(prepared.value, [].concat(prepared.errors), helpers);         // Prepare error always aborts early
            }

            value = prepared.value;
        }
    }

    // Type coercion

    if (def.coerce &&
        value !== undefined &&
        prefs.convert &&
        (!def.coerce.from || def.coerce.from.includes(typeof value))) {

        const coerced = def.coerce.method(value, helpers);
        if (coerced) {
            state.mainstay.tracer.value(state, 'coerced', value, coerced.value);
            if (coerced.errors) {
                return internals.finalize(coerced.value, [].concat(coerced.errors), helpers);           // Coerce error always aborts early
            }

            value = coerced.value;
        }
    }

    // Empty value

    const empty = schema._flags.empty;
    if (empty &&
        empty.$_match(internals.trim(value, schema), state.nest(empty), Common.defaults)) {

        state.mainstay.tracer.value(state, 'empty', value, undefined);
        value = undefined;
    }

    // Presence requirements (required, optional, forbidden)

    const presence = overrides.presence || schema._flags.presence || (schema._flags._endedSwitch ? null : prefs.presence);
    if (value === undefined) {
        if (presence === 'forbidden') {
            return internals.finalize(value, null, helpers);
        }

        if (presence === 'required') {
            return internals.finalize(value, [schema.$_createError('any.required', value, null, state, prefs)], helpers);
        }

        if (presence === 'optional') {
            if (schema._flags.default !== Common.symbols.deepDefault) {
                return internals.finalize(value, null, helpers);
            }

            state.mainstay.tracer.value(state, 'default', value, {});
            value = {};
        }
    }
    else if (presence === 'forbidden') {
        return internals.finalize(value, [schema.$_createError('any.unknown', value, null, state, prefs)], helpers);
    }

    // Allowed values

    const errors = [];

    if (schema._valids) {
        const match = schema._valids.get(value, state, prefs, schema._flags.insensitive);
        if (match) {
            if (prefs.convert) {
                state.mainstay.tracer.value(state, 'valids', value, match.value);
                value = match.value;
            }

            state.mainstay.tracer.filter(schema, state, 'valid', match);
            return internals.finalize(value, null, helpers);
        }

        if (schema._flags.only) {
            const report = schema.$_createError('any.only', value, { valids: schema._valids.values({ display: true }) }, state, prefs);
            if (prefs.abortEarly) {
                return internals.finalize(value, [report], helpers);
            }

            errors.push(report);
        }
    }

    // Denied values

    if (schema._invalids) {
        const match = schema._invalids.get(value, state, prefs, schema._flags.insensitive);
        if (match) {
            state.mainstay.tracer.filter(schema, state, 'invalid', match);
            const report = schema.$_createError('any.invalid', value, { invalids: schema._invalids.values({ display: true }) }, state, prefs);
            if (prefs.abortEarly) {
                return internals.finalize(value, [report], helpers);
            }

            errors.push(report);
        }
    }

    // Base type

    if (def.validate) {
        const base = def.validate(value, helpers);
        if (base) {
            state.mainstay.tracer.value(state, 'base', value, base.value);
            value = base.value;

            if (base.errors) {
                if (!Array.isArray(base.errors)) {
                    errors.push(base.errors);
                    return internals.finalize(value, errors, helpers);          // Base error always aborts early
                }

                if (base.errors.length) {
                    errors.push(...base.errors);
                    return internals.finalize(value, errors, helpers);          // Base error always aborts early
                }
            }
        }
    }

    // Validate tests

    if (!schema._rules.length) {
        return internals.finalize(value, errors, helpers);
    }

    return internals.rules(value, errors, helpers);
};


internals.rules = function (value, errors, helpers) {

    const { schema, state, prefs } = helpers;

    for (const rule of schema._rules) {
        const definition = schema._definition.rules[rule.method];

        // Skip rules that are also applied in coerce step

        if (definition.convert &&
            prefs.convert) {

            state.mainstay.tracer.log(schema, state, 'rule', rule.name, 'full');
            continue;
        }

        // Resolve references

        let ret;
        let args = rule.args;
        if (rule._resolve.length) {
            args = Object.assign({}, args);                                     // Shallow copy
            for (const key of rule._resolve) {
                const resolver = definition.argsByName.get(key);

                const resolved = args[key].resolve(value, state, prefs);
                const normalized = resolver.normalize ? resolver.normalize(resolved) : resolved;

                const invalid = Common.validateArg(normalized, null, resolver);
                if (invalid) {
                    ret = schema.$_createError('any.ref', resolved, { arg: key, ref: args[key], reason: invalid }, state, prefs);
                    break;
                }

                args[key] = normalized;
            }
        }

        // Test rule

        ret = ret || definition.validate(value, helpers, args, rule);           // Use ret if already set to reference error

        const result = internals.rule(ret, rule);
        if (result.errors) {
            state.mainstay.tracer.log(schema, state, 'rule', rule.name, 'error');

            if (rule.warn) {
                state.mainstay.warnings.push(...result.errors);
                continue;
            }

            if (prefs.abortEarly) {
                return internals.finalize(value, result.errors, helpers);
            }

            errors.push(...result.errors);
        }
        else {
            state.mainstay.tracer.log(schema, state, 'rule', rule.name, 'pass');
            state.mainstay.tracer.value(state, 'rule', value, result.value, rule.name);
            value = result.value;
        }
    }

    return internals.finalize(value, errors, helpers);
};


internals.rule = function (ret, rule) {

    if (ret instanceof Errors.Report) {
        internals.error(ret, rule);
        return { errors: [ret], value: null };
    }

    if (Array.isArray(ret) &&
        ret[Common.symbols.errors]) {

        ret.forEach((report) => internals.error(report, rule));
        return { errors: ret, value: null };
    }

    return { errors: null, value: ret };
};


internals.error = function (report, rule) {

    if (rule.message) {
        report._setTemplate(rule.message);
    }

    return report;
};


internals.finalize = function (value, errors, helpers) {

    errors = errors || [];
    const { schema, state, prefs } = helpers;

    // Failover value

    if (errors.length) {
        const failover = internals.default('failover', undefined, errors, helpers);
        if (failover !== undefined) {
            state.mainstay.tracer.value(state, 'failover', value, failover);
            value = failover;
            errors = [];
        }
    }

    // Error override

    if (errors.length &&
        schema._flags.error) {

        if (typeof schema._flags.error === 'function') {
            errors = schema._flags.error(errors);
            if (!Array.isArray(errors)) {
                errors = [errors];
            }

            for (const error of errors) {
                Assert(error instanceof Error || error instanceof Errors.Report, 'error() must return an Error object');
            }
        }
        else {
            errors = [schema._flags.error];
        }
    }

    // Default

    if (value === undefined) {
        const defaulted = internals.default('default', value, errors, helpers);
        state.mainstay.tracer.value(state, 'default', value, defaulted);
        value = defaulted;
    }

    // Cast

    if (schema._flags.cast &&
        value !== undefined) {

        const caster = schema._definition.cast[schema._flags.cast];
        if (caster.from(value)) {
            const casted = caster.to(value, helpers);
            state.mainstay.tracer.value(state, 'cast', value, casted, schema._flags.cast);
            value = casted;
        }
    }

    // Externals

    if (schema.$_terms.externals &&
        prefs.externals &&
        prefs._externals !== false) {                       // Disabled for matching

        for (const { method } of schema.$_terms.externals) {
            state.mainstay.externals.push({ method, path: state.path, label: Errors.label(schema._flags, state, prefs) });
        }
    }

    // Result

    const result = { value, errors: errors.length ? errors : null };

    if (schema._flags.result) {
        result.value = schema._flags.result === 'strip' ? undefined : /* raw */ helpers.original;
        state.mainstay.tracer.value(state, schema._flags.result, value, result.value);
        state.shadow(value, schema._flags.result);
    }

    // Cache

    if (schema._cache &&
        prefs.cache !== false &&
        !schema._refs.length) {

        schema._cache.set(helpers.original, result);
    }

    // Artifacts

    if (value !== undefined &&
        !result.errors &&
        schema._flags.artifact !== undefined) {

        state.mainstay.artifacts = state.mainstay.artifacts || new Map();
        if (!state.mainstay.artifacts.has(schema._flags.artifact)) {
            state.mainstay.artifacts.set(schema._flags.artifact, []);
        }

        state.mainstay.artifacts.get(schema._flags.artifact).push(state.path);
    }

    return result;
};


internals.prefs = function (schema, prefs) {

    const isDefaultOptions = prefs === Common.defaults;
    if (isDefaultOptions &&
        schema._preferences[Common.symbols.prefs]) {

        return schema._preferences[Common.symbols.prefs];
    }

    prefs = Common.preferences(prefs, schema._preferences);
    if (isDefaultOptions) {
        schema._preferences[Common.symbols.prefs] = prefs;
    }

    return prefs;
};


internals.default = function (flag, value, errors, helpers) {

    const { schema, state, prefs } = helpers;
    const source = schema._flags[flag];
    if (prefs.noDefaults ||
        source === undefined) {

        return value;
    }

    state.mainstay.tracer.log(schema, state, 'rule', flag, 'full');

    if (!source) {
        return source;
    }

    if (typeof source === 'function') {
        const args = source.length ? [Clone(state.ancestors[0]), helpers] : [];

        try {
            return source(...args);
        }
        catch (err) {
            errors.push(schema.$_createError(`any.${flag}`, null, { error: err }, state, prefs));
            return;
        }
    }

    if (typeof source !== 'object') {
        return source;
    }

    if (source[Common.symbols.literal]) {
        return source.literal;
    }

    if (Common.isResolvable(source)) {
        return source.resolve(value, state, prefs);
    }

    return Clone(source);
};


internals.trim = function (value, schema) {

    if (typeof value !== 'string') {
        return value;
    }

    const trim = schema.$_getRule('trim');
    if (!trim ||
        !trim.args.enabled) {

        return value;
    }

    return value.trim();
};


internals.ignore = {
    active: false,
    debug: Ignore,
    entry: Ignore,
    filter: Ignore,
    log: Ignore,
    resolve: Ignore,
    value: Ignore
};


internals.errorsArray = function () {

    const errors = [];
    errors[Common.symbols.errors] = true;
    return errors;
};


/***/ }),

/***/ 1944:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const Assert = __nccwpck_require__(2718);
const DeepEqual = __nccwpck_require__(5801);

const Common = __nccwpck_require__(2448);


const internals = {};


module.exports = internals.Values = class {

    constructor(values, refs) {

        this._values = new Set(values);
        this._refs = new Set(refs);
        this._lowercase = internals.lowercases(values);

        this._override = false;
    }

    get length() {

        return this._values.size + this._refs.size;
    }

    add(value, refs) {

        // Reference

        if (Common.isResolvable(value)) {
            if (!this._refs.has(value)) {
                this._refs.add(value);

                if (refs) {                     // Skipped in a merge
                    refs.register(value);
                }
            }

            return;
        }

        // Value

        if (!this.has(value, null, null, false)) {
            this._values.add(value);

            if (typeof value === 'string') {
                this._lowercase.set(value.toLowerCase(), value);
            }
        }
    }

    static merge(target, source, remove) {

        target = target || new internals.Values();

        if (source) {
            if (source._override) {
                return source.clone();
            }

            for (const item of [...source._values, ...source._refs]) {
                target.add(item);
            }
        }

        if (remove) {
            for (const item of [...remove._values, ...remove._refs]) {
                target.remove(item);
            }
        }

        return target.length ? target : null;
    }

    remove(value) {

        // Reference

        if (Common.isResolvable(value)) {
            this._refs.delete(value);
            return;
        }

        // Value

        this._values.delete(value);

        if (typeof value === 'string') {
            this._lowercase.delete(value.toLowerCase());
        }
    }

    has(value, state, prefs, insensitive) {

        return !!this.get(value, state, prefs, insensitive);
    }

    get(value, state, prefs, insensitive) {

        if (!this.length) {
            return false;
        }

        // Simple match

        if (this._values.has(value)) {
            return { value };
        }

        // Case insensitive string match

        if (typeof value === 'string' &&
            value &&
            insensitive) {

            const found = this._lowercase.get(value.toLowerCase());
            if (found) {
                return { value: found };
            }
        }

        if (!this._refs.size &&
            typeof value !== 'object') {

            return false;
        }

        // Objects

        if (typeof value === 'object') {
            for (const item of this._values) {
                if (DeepEqual(item, value)) {
                    return { value: item };
                }
            }
        }

        // References

        if (state) {
            for (const ref of this._refs) {
                const resolved = ref.resolve(value, state, prefs, null, { in: true });
                if (resolved === undefined) {
                    continue;
                }

                const items = !ref.in || typeof resolved !== 'object'
                    ? [resolved]
                    : Array.isArray(resolved) ? resolved : Object.keys(resolved);

                for (const item of items) {
                    if (typeof item !== typeof value) {
                        continue;
                    }

                    if (insensitive &&
                        value &&
                        typeof value === 'string') {

                        if (item.toLowerCase() === value.toLowerCase()) {
                            return { value: item, ref };
                        }
                    }
                    else {
                        if (DeepEqual(item, value)) {
                            return { value: item, ref };
                        }
                    }
                }
            }
        }

        return false;
    }

    override() {

        this._override = true;
    }

    values(options) {

        if (options &&
            options.display) {

            const values = [];

            for (const item of [...this._values, ...this._refs]) {
                if (item !== undefined) {
                    values.push(item);
                }
            }

            return values;
        }

        return Array.from([...this._values, ...this._refs]);
    }

    clone() {

        const set = new internals.Values(this._values, this._refs);
        set._override = this._override;
        return set;
    }

    concat(source) {

        Assert(!source._override, 'Cannot concat override set of values');

        const set = new internals.Values([...this._values, ...source._values], [...this._refs, ...source._refs]);
        set._override = this._override;
        return set;
    }

    describe() {

        const normalized = [];

        if (this._override) {
            normalized.push({ override: true });
        }

        for (const value of this._values.values()) {
            normalized.push(value && typeof value === 'object' ? { value } : value);
        }

        for (const value of this._refs.values()) {
            normalized.push(value.describe());
        }

        return normalized;
    }
};


internals.Values.prototype[Common.symbols.values] = true;


// Aliases

internals.Values.prototype.slice = internals.Values.prototype.clone;


// Helpers

internals.lowercases = function (from) {

    const map = new Map();

    if (from) {
        for (const value of from) {
            if (typeof value === 'string') {
                map.set(value.toLowerCase(), value);
            }
        }
    }

    return map;
};


/***/ }),

/***/ 9197:
/***/ ((module) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),

/***/ 1552:
/***/ ((module) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = isKey(path, object) ? [path] : castPath(path);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

module.exports = set;


/***/ }),

/***/ 8387:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lowerCase = exports.localeLowerCase = void 0;
/**
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 */
var SUPPORTED_LOCALE = {
    tr: {
        regexp: /\u0130|\u0049|\u0049\u0307/g,
        map: {
            İ: "\u0069",
            I: "\u0131",
            İ: "\u0069",
        },
    },
    az: {
        regexp: /\u0130/g,
        map: {
            İ: "\u0069",
            I: "\u0131",
            İ: "\u0069",
        },
    },
    lt: {
        regexp: /\u0049|\u004A|\u012E|\u00CC|\u00CD|\u0128/g,
        map: {
            I: "\u0069\u0307",
            J: "\u006A\u0307",
            Į: "\u012F\u0307",
            Ì: "\u0069\u0307\u0300",
            Í: "\u0069\u0307\u0301",
            Ĩ: "\u0069\u0307\u0303",
        },
    },
};
/**
 * Localized lower case.
 */
function localeLowerCase(str, locale) {
    var lang = SUPPORTED_LOCALE[locale.toLowerCase()];
    if (lang)
        return lowerCase(str.replace(lang.regexp, function (m) { return lang.map[m]; }));
    return lowerCase(str);
}
exports.localeLowerCase = localeLowerCase;
/**
 * Lower case as a function.
 */
function lowerCase(str) {
    return str.toLowerCase();
}
exports.lowerCase = lowerCase;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 397:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.noCase = void 0;
var lower_case_1 = __nccwpck_require__(8387);
// Support camel case ("camelCase" -> "camel Case" and "CAMELCase" -> "CAMEL Case").
var DEFAULT_SPLIT_REGEXP = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g];
// Remove all non-word characters.
var DEFAULT_STRIP_REGEXP = /[^A-Z0-9]+/gi;
/**
 * Normalize the string into something other libraries can manipulate easier.
 */
function noCase(input, options) {
    if (options === void 0) { options = {}; }
    var _a = options.splitRegexp, splitRegexp = _a === void 0 ? DEFAULT_SPLIT_REGEXP : _a, _b = options.stripRegexp, stripRegexp = _b === void 0 ? DEFAULT_STRIP_REGEXP : _b, _c = options.transform, transform = _c === void 0 ? lower_case_1.lowerCase : _c, _d = options.delimiter, delimiter = _d === void 0 ? " " : _d;
    var result = replace(replace(input, splitRegexp, "$1\0$2"), stripRegexp, "\0");
    var start = 0;
    var end = result.length;
    // Trim the delimiter from around the output string.
    while (result.charAt(start) === "\0")
        start++;
    while (result.charAt(end - 1) === "\0")
        end--;
    // Transform each token independently.
    return result.slice(start, end).split("\0").map(transform).join(delimiter);
}
exports.noCase = noCase;
/**
 * Replace `re` in the input string with the replacement value.
 */
function replace(input, re, value) {
    if (re instanceof RegExp)
        return input.replace(re, value);
    return re.reduce(function (input, re) { return input.replace(re, value); }, input);
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8452:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.paramCase = void 0;
var tslib_1 = __nccwpck_require__(1472);
var dot_case_1 = __nccwpck_require__(2246);
function paramCase(input, options) {
    if (options === void 0) { options = {}; }
    return dot_case_1.dotCase(input, tslib_1.__assign({ delimiter: "-" }, options));
}
exports.paramCase = paramCase;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1472:
/***/ ((module) => {

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __spreadArray;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    /** @deprecated */
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    /** @deprecated */
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __spreadArray = function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__spreadArray", __spreadArray);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});


/***/ }),

/***/ 5995:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pascalCase = exports.pascalCaseTransformMerge = exports.pascalCaseTransform = void 0;
var tslib_1 = __nccwpck_require__(1769);
var no_case_1 = __nccwpck_require__(397);
function pascalCaseTransform(input, index) {
    var firstChar = input.charAt(0);
    var lowerChars = input.substr(1).toLowerCase();
    if (index > 0 && firstChar >= "0" && firstChar <= "9") {
        return "_" + firstChar + lowerChars;
    }
    return "" + firstChar.toUpperCase() + lowerChars;
}
exports.pascalCaseTransform = pascalCaseTransform;
function pascalCaseTransformMerge(input) {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}
exports.pascalCaseTransformMerge = pascalCaseTransformMerge;
function pascalCase(input, options) {
    if (options === void 0) { options = {}; }
    return no_case_1.noCase(input, tslib_1.__assign({ delimiter: "", transform: pascalCaseTransform }, options));
}
exports.pascalCase = pascalCase;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1769:
/***/ ((module) => {

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __spreadArray;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    /** @deprecated */
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    /** @deprecated */
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __spreadArray = function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__spreadArray", __spreadArray);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});


/***/ }),

/***/ 3553:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pathCase = void 0;
var tslib_1 = __nccwpck_require__(2595);
var dot_case_1 = __nccwpck_require__(2246);
function pathCase(input, options) {
    if (options === void 0) { options = {}; }
    return dot_case_1.dotCase(input, tslib_1.__assign({ delimiter: "/" }, options));
}
exports.pathCase = pathCase;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2595:
/***/ ((module) => {

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __spreadArray;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    /** @deprecated */
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    /** @deprecated */
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __spreadArray = function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__spreadArray", __spreadArray);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});


/***/ }),

/***/ 9229:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sentenceCase = exports.sentenceCaseTransform = void 0;
var tslib_1 = __nccwpck_require__(6166);
var no_case_1 = __nccwpck_require__(397);
var upper_case_first_1 = __nccwpck_require__(6256);
function sentenceCaseTransform(input, index) {
    var result = input.toLowerCase();
    if (index === 0)
        return upper_case_first_1.upperCaseFirst(result);
    return result;
}
exports.sentenceCaseTransform = sentenceCaseTransform;
function sentenceCase(input, options) {
    if (options === void 0) { options = {}; }
    return no_case_1.noCase(input, tslib_1.__assign({ delimiter: " ", transform: sentenceCaseTransform }, options));
}
exports.sentenceCase = sentenceCase;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6166:
/***/ ((module) => {

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __spreadArray;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    /** @deprecated */
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    /** @deprecated */
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __spreadArray = function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__spreadArray", __spreadArray);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});


/***/ }),

/***/ 6213:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.snakeCase = void 0;
var tslib_1 = __nccwpck_require__(2046);
var dot_case_1 = __nccwpck_require__(2246);
function snakeCase(input, options) {
    if (options === void 0) { options = {}; }
    return dot_case_1.dotCase(input, tslib_1.__assign({ delimiter: "_" }, options));
}
exports.snakeCase = snakeCase;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2046:
/***/ ((module) => {

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __spreadArray;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    /** @deprecated */
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    /** @deprecated */
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __spreadArray = function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__spreadArray", __spreadArray);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1631);
var tls = __nccwpck_require__(4016);
var http = __nccwpck_require__(8605);
var https = __nccwpck_require__(7211);
var events = __nccwpck_require__(8614);
var assert = __nccwpck_require__(2357);
var util = __nccwpck_require__(1669);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 6256:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.upperCaseFirst = void 0;
/**
 * Upper case the first character of an input string.
 */
function upperCaseFirst(input) {
    return input.charAt(0).toUpperCase() + input.substr(1);
}
exports.upperCaseFirst = upperCaseFirst;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5997:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.upperCase = exports.localeUpperCase = void 0;
/**
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 */
var SUPPORTED_LOCALE = {
    tr: {
        regexp: /[\u0069]/g,
        map: {
            i: "\u0130",
        },
    },
    az: {
        regexp: /[\u0069]/g,
        map: {
            i: "\u0130",
        },
    },
    lt: {
        regexp: /[\u0069\u006A\u012F]\u0307|\u0069\u0307[\u0300\u0301\u0303]/g,
        map: {
            i̇: "\u0049",
            j̇: "\u004A",
            į̇: "\u012E",
            i̇̀: "\u00CC",
            i̇́: "\u00CD",
            i̇̃: "\u0128",
        },
    },
};
/**
 * Localized upper case.
 */
function localeUpperCase(str, locale) {
    var lang = SUPPORTED_LOCALE[locale.toLowerCase()];
    if (lang)
        return upperCase(str.replace(lang.regexp, function (m) { return lang.map[m]; }));
    return upperCase(str);
}
exports.localeUpperCase = localeUpperCase;
/**
 * Upper case as a function.
 */
function upperCase(str) {
    return str.toUpperCase();
}
exports.upperCase = upperCase;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6417));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports.default = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports.default = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports.default = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports.default = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6417));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6417));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports.default = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports.default = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports.default = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports.default = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports.default = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports.default = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports.default = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports.default = _default;

/***/ }),

/***/ 6741:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"joi","description":"Object schema validation","version":"17.4.2","repository":"git://github.com/sideway/joi","main":"lib/index.js","types":"lib/index.d.ts","browser":"dist/joi-browser.min.js","files":["lib/**/*","dist/*"],"keywords":["schema","validation"],"dependencies":{"@hapi/hoek":"^9.0.0","@hapi/topo":"^5.0.0","@sideway/address":"^4.1.0","@sideway/formula":"^3.0.0","@sideway/pinpoint":"^2.0.0"},"devDependencies":{"@hapi/bourne":"2.x.x","@hapi/code":"8.x.x","@hapi/joi-legacy-test":"npm:@hapi/joi@15.x.x","@hapi/lab":"24.x.x","typescript":"4.3.x"},"scripts":{"prepublishOnly":"cd browser && npm install && npm run build","test":"lab -t 100 -a @hapi/code -L -Y","test-cov-html":"lab -r html -o coverage.html -a @hapi/code"},"license":"BSD-3-Clause"}');

/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 6417:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 8614:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 8605:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 7211:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1631:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 4016:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 8835:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(3109);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map