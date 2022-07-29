export enum OPCODE {
    NOP, //does nothing
    RND, //Random Number [Reg1, Reg2] -> Reg3
    ADD, //Reg1 + Reg2 -> Reg3
    SUB, //Reg1 - Reg2 -> Reg3
    MUL, //Reg1 * Reg2 -> Reg3
    DIV, //Reg1 / Reg2 -> Reg3
    MOD, //Reg1 % Reg2 -> Reg3
    INC,
    DEC,
    MOV, //Reg1 -> Reg3 (omit reg2)
    JMP, //label instruction number -> iPtr
    JEZ, //RJX == 0 ? label instruction -> iPtr : NOP
    JNZ, //RJX != 0 ? label instruction -> iPtr : NOP
    JGZ, //RJX > 0 ? label instruction -> iPtr : NOP
    JLZ, //RJX < 0 ? label instruction -> iPtr : NOP
    PRO, //Defines a procedure, <Reg1:string, iPtr> -> procedure map. EVERY PROGRAM MUST HAVE A PROCEDURE .main
    RET, //rPtr -> iPtr 
    EXE, //iPtr -> rPtr, lookup Reg1 in procedure map -> iPtr
    END, //exits the program.
    LBL, //places a label at the current instruction pointer (Compilation step only)
    LDI, //"Reg1" -> Reg3
    OUT, //outputs the OUT register based on platform specific behavior.
}

export enum REGISTER {
    INVALID = -1,
    iPtr = 0, //not user addressable
    RAX,
    RBX,
    RCX,
    RDX,
    REX,
    RFX,
    RGX,
    RHX,
    RJX,
    OUT,
}

export function getRegister(reg: string): REGISTER | undefined {
    switch (reg) {
        case 'RAX': return REGISTER.RAX;
        case 'RBX': return REGISTER.RBX;
        case 'RCX': return REGISTER.RCX;
        case 'RDX': return REGISTER.RDX;
        case 'REX': return REGISTER.REX;
        case 'RFX': return REGISTER.RFX;
        case 'RGX': return REGISTER.RGX;
        case 'RHX': return REGISTER.RHX;
        case 'RJX': return REGISTER.RJX;
        case 'OUT': return REGISTER.OUT;
        default: return undefined;
    }
}
export function getOpcode(input: string): number {
    return Object.keys(OPCODE).filter((v) => isNaN(Number(v))).indexOf(input);
}

export class operation extends Object {
    op: OPCODE;
    Reg1: REGISTER;
    Reg2: REGISTER;
    Reg3: REGISTER;
    handle?: string;

    constructor(opcode: OPCODE | number, Reg1?: number | REGISTER, Reg2?: number | REGISTER, Reg3?: number | REGISTER) {
        super()
        this.op = opcode;
        if (Reg1 == null && Reg2 == null && Reg3 == null) { // if no registers are provided, Reg1 needs to be iPtr
            this.Reg1 = REGISTER.iPtr;
            this.Reg2 = -1;
            this.Reg3 = -1;
        } else if (Reg1 != null) { //If Reg1 is provided, place it here
            this.Reg1 = Reg1;
        } else { // This shouldn't be possible, but it will be caught in the runtime step and throw an error.
            this.Reg1 = -1;
        }
        if (Reg2 != null) {
            if (Reg3 != null) { //if all 3 registers are provided, pass them through
                this.Reg2 = Reg2;
                this.Reg3 = Reg3;
            } else { // if only 2 registers are provided, Reg1 is input, Reg2 is output
                this.Reg2 = -1
                this.Reg3 = Reg2;
            }
        } else {
            this.Reg2 = -1
            this.Reg3 = -1
        }
    }
    override toString(): string {
        let output = ''
        switch (this.op) {
            case OPCODE.JMP:
            case OPCODE.JNZ:
            case OPCODE.JEZ:
            case OPCODE.JGZ:
            case OPCODE.JLZ:
                output = `${OPCODE[this.op]} ${this.handle ?? ''}`
                break;
            case OPCODE.RND:
            case OPCODE.ADD:
            case OPCODE.SUB:
            case OPCODE.MUL:
            case OPCODE.DIV:
                output = `${OPCODE[this.op]} ${REGISTER[this.Reg1]} ${REGISTER[this.Reg2]} ${REGISTER[this.Reg3]}`
                break;
            case OPCODE.LDI:
                output = `${OPCODE[this.op]} ${this.Reg1} ${REGISTER[this.Reg3]}`
                break;
            case OPCODE.MOV:
                output = `${OPCODE[this.op]} ${REGISTER[this.Reg1]} ${REGISTER[this.Reg3]}`
                break;
            case OPCODE.END:
                output = "END"
                break;
            case OPCODE.EXE:
            case OPCODE.PRO:
                output = `${OPCODE[this.op]} ${this.handle}`
                break;
            case OPCODE.RET:
                output = `${OPCODE[this.op]}`
                break;
            case OPCODE.OUT:
                output = `${OPCODE[this.op]}`
                break;
            case OPCODE.LBL:
                output = `${OPCODE[this.op]} -> ${this.handle}`
                break;
            case OPCODE.NOP:
                output = "NOP"
                break;
            default: break;
        }
        return output
    }
}
