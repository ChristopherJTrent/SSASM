import { timeStamp } from "console";
import { getRandomRoll } from "../util";
import { Executable } from "./compiler"
import { OPCODE, operation, REGISTER } from "./operation";

enum FLAGS {
    inProc,
    terminate
}

export class runtime {
    registers: number[] = [
        0, //iPtr
        0, //RAX
        0, //RBX
        0, //RCX
        0, //RDX
        0, //REX
        0, //RFX
        0, //RGX
        0, //RHX
        0, //RJX
        0  //OUT
    ]
    rFlag: boolean[] = [
        false, //inProc
        false, //terminate
    ]
    callStack: number[] = []
    binary: Executable;

    bootstrap(): void {
        if (this.binary.hasProcedure('.main')) {
            this.registers[REGISTER.iPtr] = this.binary.procedures.get('.main') ?? -1
        } else {
            throw SyntaxError("All programs must have a procedure '.main'");
        }
    }

    clockCycle(): void {
        const instruction = this.binary.instructions[++this.registers[REGISTER.iPtr]];
        // if (instruction.Reg1 == -1 || instruction.Reg2 == -1 || instruction.Reg3 == -1) {
        //     throw SyntaxError("Invalid register reference found");
        // }
        switch (instruction.op) {
            case OPCODE.NOP:
                break;
            case OPCODE.RND:
                this.registers[instruction.Reg3] = getRandomRoll(this.registers[instruction.Reg1], this.registers[instruction.Reg2]);
                break;
            case OPCODE.ADD:
                this.registers[instruction.Reg3] = this.registers[instruction.Reg1] + this.registers[instruction.Reg2];
                break;
            case OPCODE.SUB:
                this.registers[instruction.Reg3] = this.registers[instruction.Reg1] - this.registers[instruction.Reg2];
                break;
            case OPCODE.MUL:
                this.registers[instruction.Reg3] = this.registers[instruction.Reg1] * this.registers[instruction.Reg2];
                break;
            case OPCODE.DIV:
                this.registers[instruction.Reg3] = this.registers[instruction.Reg1] / this.registers[instruction.Reg2];
                break;
            case OPCODE.MOD:
                this.registers[instruction.Reg3] = this.registers[instruction.Reg1] % this.registers[instruction.Reg2];
                break;
            case OPCODE.INC:
                this.registers[instruction.Reg1]++
                break;
            case OPCODE.DEC:
                this.registers[instruction.Reg1]--
                break;
            case OPCODE.MOV:
                this.registers[instruction.Reg3] = this.registers[instruction.Reg1]
                break;
            case OPCODE.JMP:
                this.jump(instruction.handle)
                break;
            case OPCODE.JEZ:
                if (this.registers[REGISTER.RJX] == 0) this.jump(instruction.handle)
                break;
            case OPCODE.JNZ:
                if (this.registers[REGISTER.RJX] != 0) this.jump(instruction.handle)
                break;
            case OPCODE.JGZ:
                if (this.registers[REGISTER.RJX] > 0) this.jump(instruction.handle)
                break;
            case OPCODE.JLZ:
                if (this.registers[REGISTER.RJX] < 0) this.jump(instruction.handle)
                break;
            case OPCODE.PRO:
                if (!this.rFlag[FLAGS.inProc]) throw SyntaxError("All procedures must include a RET opcode.")
                break;
            case OPCODE.RET:
                const returnAddress = this.callStack.pop()
                if (returnAddress == null) throw SyntaxError("RET cannot be used when the call stack is empty. did you mean JMP?");
                this.registers[REGISTER.iPtr] = returnAddress
                break;
            case OPCODE.EXE:
                this.exec(instruction.handle);
                break;
            case OPCODE.END:
                this.rFlag[FLAGS.terminate] = true
                break;
            case OPCODE.LBL:
                break;
            case OPCODE.LDI:
                this.registers[instruction.Reg3] = instruction.Reg1
                break;
            case OPCODE.OUT:
                this.OUT()
                break;
            default: break;
        }

    }

    execute() {
        this.bootstrap()
        while (!this.rFlag[FLAGS.terminate]) {
            this.clockCycle()
        }
    }

    OUT() {
        console.log(`output: ${this.registers[REGISTER.OUT]}`)
        return;
    }

    jump(label: string | undefined): void {
        if (label == null) throw SyntaxError("instruction label must be provided in order to jump.")
        const pointer = this.binary.labels.get(label ?? '')
        if (pointer == null) {
            throw SyntaxError("cannot jump to nonexistant label " + label ?? 'null')
        }
        this.registers[REGISTER.iPtr] = pointer
    }

    exec(label: string | undefined): void {
        if (label == null) throw SyntaxError("Cannot execute without a procedure handle")
        const pointer = this.binary.procedures.get(label)
        if (pointer == null) throw SyntaxError(`Cannot execute procedure ${label}: not found.`)
        this.callStack.push(this.registers[REGISTER.iPtr])
        this.registers[REGISTER.iPtr] = pointer
        this.rFlag[FLAGS.inProc] = true
    }

    constructor(binary: Executable) {
        this.binary = binary
    }
}