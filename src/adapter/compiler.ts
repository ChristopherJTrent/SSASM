import { getOpcode, getRegister, OPCODE, operation, REGISTER } from "./operation";

export class Executable extends Object {
    procedures: Map<string, number>
    labels: Map<string, number>
    instructions: operation[]

    hasProcedure(procedure: string): boolean {
        return this.procedures.has(procedure);
    }

    hasLabel(label: string): boolean {
        return this.labels.has(label)
    }

    constructor() {
        super();
        this.procedures = new Map;
        this.labels = new Map;
        this.instructions = [];
    }
    override toString(): string {
        let output = '';
        output += "Procedure handles: \n"
        for (const handle of this.procedures.keys()) {
            output += `${handle}: 0x${this.procedures.get(handle)?.toString(16).toUpperCase()}\n`
        }
        output += "\nLabels: \n"
        for (const label of this.labels) {
            output += `${label[0]}: 0x${label[1].toString(16).toUpperCase()}\n`
        }
        output += "\nInstructions: \n"
        this.instructions.forEach((v, k) => {
            const temp = '0x' + k.toString(16).toUpperCase() + `: ${v.toString()}\n`
            output += temp
        })
        return output;
    }
}

export function compile(lines: string[]): Executable {
    let exe = new Executable();
    let instructionPointer = 0
    const regexp = /^([A-Z]{3})\s?(R[A-HJ]X|OUT|\d+|[a-z.]+|[0-9]+)?\s?(R[A-HJ]X|OUT)?\s?(R[A-HJ]X|OUT)?/
    for (const line of lines) {
        line.trim();
        const command = regexp.exec(line.split(';')[0].trim())
        if (command != null && command[0] != null) {
            command.shift()
            switch (command[0]) {
                case OPCODE[OPCODE.PRO]:
                    if (command[1] == null) {
                        throw SyntaxError("Procedure handle cannot be null")
                    } else if (exe.hasProcedure(command[1])) {
                        throw SyntaxError(`procedure ${command[1]} has already been assigned.`)
                    } else {
                        exe.procedures.set(command[1], instructionPointer)
                        let instruction = new operation(OPCODE.PRO, instructionPointer)
                        instruction.handle = command[1]
                        exe.instructions.push(instruction)
                        break;
                    }
                case OPCODE[OPCODE.EXE]:
                    let temp = new operation(OPCODE.EXE)
                    if (command[1] == null) {
                        throw SyntaxError("Call handle cannot be null.")
                    } else if (!exe.hasProcedure(command[1])) {
                        throw SyntaxError(`Could not find procedure ${command[1]}`)
                    } else {
                        temp.handle = command[1]
                        exe.instructions.push(temp)
                        break;
                    }
                case OPCODE[OPCODE.LBL]:
                    exe.instructions.push(new operation(OPCODE.NOP))
                    if (command[1] == null) {
                        throw SyntaxError("label cannot be null");
                    } else if (exe.hasLabel(command[1])) {
                        throw SyntaxError(`cannot reassign label ${command[1]}`);
                    } else {
                        exe.labels.set(command[1], instructionPointer)
                        break;
                    }
                case OPCODE[OPCODE.LDI]:
                    const value = Number(command[1])
                    if (!isNaN(value)) {
                        exe.instructions.push(new operation(OPCODE.LDI, value, getRegister(command[2])))
                        break;
                    } else {
                        throw SyntaxError("The first argument to LDI must be a number.")
                    }
                case OPCODE[OPCODE.JEZ]:
                case OPCODE[OPCODE.JNZ]:
                    let _temp = new operation(getOpcode(command[0]), REGISTER.iPtr, getRegister(command[2]))
                    _temp.handle = command[1]
                    exe.instructions.push(_temp)
                default:
                    let opcode = getOpcode(command[0])
                    opcode = opcode < 0 ? 0 : opcode;
                    const r1 = getRegister(command[1])
                    const r2 = getRegister(command[2])
                    const r3 = getRegister(command[3])
                    exe.instructions.push(new operation(opcode, r1, r2, r3))
                    break;
            }

        }
        instructionPointer++
    }
    return exe;
} 