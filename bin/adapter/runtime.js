"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = void 0;
const util_1 = require("../util");
const operation_1 = require("./operation");
var FLAGS;
(function (FLAGS) {
    FLAGS[FLAGS["inProc"] = 0] = "inProc";
    FLAGS[FLAGS["terminate"] = 1] = "terminate";
})(FLAGS || (FLAGS = {}));
class runtime {
    constructor(binary) {
        this.registers = [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0 //OUT
        ];
        this.rFlag = [
            false,
            false, //terminate
        ];
        this.callStack = [];
        this.binary = binary;
    }
    bootstrap() {
        var _a;
        if (this.binary.hasProcedure('.main')) {
            this.registers[operation_1.REGISTER.iPtr] = (_a = this.binary.procedures.get('.main')) !== null && _a !== void 0 ? _a : -1;
        }
        else {
            throw SyntaxError("All programs must have a procedure '.main'");
        }
    }
    clockCycle() {
        const instruction = this.binary.instructions[++this.registers[operation_1.REGISTER.iPtr]];
        // if (instruction.Reg1 == -1 || instruction.Reg2 == -1 || instruction.Reg3 == -1) {
        //     throw SyntaxError("Invalid register reference found");
        // }
        switch (instruction.op) {
            case operation_1.OPCODE.NOP:
                break;
            case operation_1.OPCODE.RND:
                this.registers[instruction.Reg3] = (0, util_1.getRandomRoll)(this.registers[instruction.Reg1], this.registers[instruction.Reg2]);
                break;
            case operation_1.OPCODE.ADD:
                this.registers[instruction.Reg3] = this.registers[instruction.Reg1] + this.registers[instruction.Reg2];
                break;
            case operation_1.OPCODE.SUB:
                this.registers[instruction.Reg3] = this.registers[instruction.Reg1] - this.registers[instruction.Reg2];
                break;
            case operation_1.OPCODE.MUL:
                this.registers[instruction.Reg3] = this.registers[instruction.Reg1] * this.registers[instruction.Reg2];
                break;
            case operation_1.OPCODE.DIV:
                this.registers[instruction.Reg3] = this.registers[instruction.Reg1] / this.registers[instruction.Reg2];
                break;
            case operation_1.OPCODE.MOD:
                this.registers[instruction.Reg3] = this.registers[instruction.Reg1] % this.registers[instruction.Reg2];
                break;
            case operation_1.OPCODE.INC:
                this.registers[instruction.Reg1]++;
                break;
            case operation_1.OPCODE.DEC:
                this.registers[instruction.Reg1]--;
                break;
            case operation_1.OPCODE.MOV:
                this.registers[instruction.Reg3] = this.registers[instruction.Reg1];
                break;
            case operation_1.OPCODE.JMP:
                this.jump(instruction.handle);
                break;
            case operation_1.OPCODE.JEZ:
                if (this.registers[operation_1.REGISTER.RJX] == 0)
                    this.jump(instruction.handle);
                break;
            case operation_1.OPCODE.JNZ:
                if (this.registers[operation_1.REGISTER.RJX] != 0)
                    this.jump(instruction.handle);
                break;
            case operation_1.OPCODE.JGZ:
                if (this.registers[operation_1.REGISTER.RJX] > 0)
                    this.jump(instruction.handle);
                break;
            case operation_1.OPCODE.JLZ:
                if (this.registers[operation_1.REGISTER.RJX] < 0)
                    this.jump(instruction.handle);
                break;
            case operation_1.OPCODE.PRO:
                if (!this.rFlag[FLAGS.inProc])
                    throw SyntaxError("All procedures must include a RET opcode.");
                break;
            case operation_1.OPCODE.RET:
                const returnAddress = this.callStack.pop();
                if (returnAddress == null)
                    throw SyntaxError("RET cannot be used when the call stack is empty. did you mean JMP?");
                this.registers[operation_1.REGISTER.iPtr] = returnAddress;
                break;
            case operation_1.OPCODE.EXE:
                this.exec(instruction.handle);
                break;
            case operation_1.OPCODE.END:
                this.rFlag[FLAGS.terminate] = true;
                break;
            case operation_1.OPCODE.LBL:
                break;
            case operation_1.OPCODE.LDI:
                this.registers[instruction.Reg3] = instruction.Reg1;
                break;
            case operation_1.OPCODE.OUT:
                this.OUT();
                break;
            default: break;
        }
    }
    execute() {
        this.bootstrap();
        while (!this.rFlag[FLAGS.terminate]) {
            this.clockCycle();
        }
    }
    OUT() {
        console.log(`output: ${this.registers[operation_1.REGISTER.OUT]}`);
        return;
    }
    jump(label) {
        var _a;
        if (label == null)
            throw SyntaxError("instruction label must be provided in order to jump.");
        const pointer = this.binary.labels.get(label !== null && label !== void 0 ? label : '');
        if (pointer == null) {
            throw SyntaxError((_a = "cannot jump to nonexistant label " + label) !== null && _a !== void 0 ? _a : 'null');
        }
        this.registers[operation_1.REGISTER.iPtr] = pointer;
    }
    exec(label) {
        if (label == null)
            throw SyntaxError("Cannot execute without a procedure handle");
        const pointer = this.binary.procedures.get(label);
        if (pointer == null)
            throw SyntaxError(`Cannot execute procedure ${label}: not found.`);
        this.callStack.push(this.registers[operation_1.REGISTER.iPtr]);
        this.registers[operation_1.REGISTER.iPtr] = pointer;
        this.rFlag[FLAGS.inProc] = true;
    }
}
exports.runtime = runtime;
