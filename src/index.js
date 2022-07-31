"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compiler_1 = require("./adapter/compiler");
const fs_1 = require("fs");
const runtime_1 = require("./adapter/runtime");
const PROGRAM = (0, fs_1.readFileSync)(__dirname + '/takattack.ssasm', 'utf-8');
let program = (0, compiler_1.compile)(PROGRAM.split('\n'));
//program.toString()
//console.log(program.toString())
new runtime_1.runtime(program).execute();
