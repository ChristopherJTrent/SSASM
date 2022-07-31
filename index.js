"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.compile = exports.Executable = void 0;
var compiler_1 = require("./src/adapter/compiler");
Object.defineProperty(exports, "Executable", { enumerable: true, get: function () { return compiler_1.Executable; } });
Object.defineProperty(exports, "compile", { enumerable: true, get: function () { return compiler_1.compile; } });
var runtime_1 = require("./src/adapter/runtime");
Object.defineProperty(exports, "runtime", { enumerable: true, get: function () { return runtime_1.runtime; } });
