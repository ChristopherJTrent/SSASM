"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = exports.Executable = void 0;
const operation_1 = require("./operation");
class Executable extends Object {
    constructor() {
        super();
        this.procedures = new Map;
        this.labels = new Map;
        this.instructions = [];
    }
    hasProcedure(procedure) {
        return this.procedures.has(procedure);
    }
    hasLabel(label) {
        return this.labels.has(label);
    }
    toString() {
        var _a;
        let output = '';
        output += "Procedure handles: \n";
        for (const handle of this.procedures.keys()) {
            output += `${handle}: 0x${(_a = this.procedures.get(handle)) === null || _a === void 0 ? void 0 : _a.toString(16).toUpperCase()}\n`;
        }
        output += "\nLabels: \n";
        for (const label of this.labels) {
            output += `${label[0]}: 0x${label[1].toString(16).toUpperCase()}\n`;
        }
        output += "\nInstructions: \n";
        this.instructions.forEach((v, k) => {
            const temp = '0x' + k.toString(16).toUpperCase() + `: ${v.toString()}\n`;
            output += temp;
        });
        return output;
    }
}
exports.Executable = Executable;
function compile(lines) {
    let exe = new Executable();
    let instructionPointer = 0;
    const regexp = /^([A-Z]{3})\s?(R[A-HJ]X|OUT|\d+|[a-z.]+|[0-9]+)?\s?(R[A-HJ]X|OUT)?\s?(R[A-HJ]X|OUT)?/;
    for (const line of lines) {
        line.trim();
        const command = regexp.exec(line.split(';')[0].trim());
        if (command != null && command[0] != null && command[0].trim().length > 0) {
            command.shift();
            switch (command[0]) {
                case operation_1.OPCODE[operation_1.OPCODE.PRO]:
                    if (command[1] == null) {
                        throw SyntaxError("Procedure handle cannot be null");
                    }
                    else if (exe.hasProcedure(command[1])) {
                        throw SyntaxError(`procedure ${command[1]} has already been assigned.`);
                    }
                    else {
                        exe.procedures.set(command[1], instructionPointer);
                        let instruction = new operation_1.operation(operation_1.OPCODE.PRO, instructionPointer);
                        instruction.handle = command[1];
                        exe.instructions.push(instruction);
                        break;
                    }
                case operation_1.OPCODE[operation_1.OPCODE.EXE]:
                    let temp = new operation_1.operation(operation_1.OPCODE.EXE);
                    if (command[1] == null) {
                        throw SyntaxError("Call handle cannot be null.");
                    }
                    else if (!exe.hasProcedure(command[1])) {
                        throw SyntaxError(`Could not find procedure ${command[1]}`);
                    }
                    else {
                        temp.handle = command[1];
                        exe.instructions.push(temp);
                        break;
                    }
                case operation_1.OPCODE[operation_1.OPCODE.LBL]:
                    let op = new operation_1.operation(operation_1.OPCODE.LBL);
                    op.handle = command[1];
                    exe.instructions.push(op);
                    if (command[1] == null) {
                        throw SyntaxError("label cannot be null");
                    }
                    else if (exe.hasLabel(command[1])) {
                        throw SyntaxError(`cannot reassign label ${command[1]}`);
                    }
                    else {
                        exe.labels.set(command[1], instructionPointer);
                        break;
                    }
                case operation_1.OPCODE[operation_1.OPCODE.LDI]:
                    const value = Number(command[1]);
                    if (!isNaN(value)) {
                        exe.instructions.push(new operation_1.operation(operation_1.OPCODE.LDI, value, (0, operation_1.getRegister)(command[2])));
                        break;
                    }
                    else {
                        throw SyntaxError("The first argument to LDI must be a number.");
                    }
                case operation_1.OPCODE[operation_1.OPCODE.JMP]:
                case operation_1.OPCODE[operation_1.OPCODE.JEZ]:
                case operation_1.OPCODE[operation_1.OPCODE.JNZ]:
                case operation_1.OPCODE[operation_1.OPCODE.JGZ]:
                case operation_1.OPCODE[operation_1.OPCODE.JLZ]:
                    let _temp = new operation_1.operation((0, operation_1.getOpcode)(command[0]), -1);
                    _temp.handle = command[1];
                    exe.instructions.push(_temp);
                case operation_1.OPCODE[operation_1.OPCODE.INC]:
                case operation_1.OPCODE[operation_1.OPCODE.DEC]:
                    exe.instructions.push(new operation_1.operation((0, operation_1.getOpcode)(command[0]), (0, operation_1.getRegister)(command[1])));
                default:
                    let opcode = (0, operation_1.getOpcode)(command[0]);
                    opcode = opcode < 0 ? 0 : opcode;
                    const r1 = (0, operation_1.getRegister)(command[1]);
                    const r2 = (0, operation_1.getRegister)(command[2]);
                    const r3 = (0, operation_1.getRegister)(command[3]);
                    exe.instructions.push(new operation_1.operation(opcode, r1, r2, r3));
                    break;
            }
            instructionPointer++;
        }
    }
    return exe;
}
exports.compile = compile;
