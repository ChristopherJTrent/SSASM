"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operation = exports.getOpcode = exports.getRegister = exports.REGISTER = exports.OPCODE = void 0;
var OPCODE;
(function (OPCODE) {
    OPCODE[OPCODE["NOP"] = 0] = "NOP";
    OPCODE[OPCODE["RND"] = 1] = "RND";
    OPCODE[OPCODE["ADD"] = 2] = "ADD";
    OPCODE[OPCODE["SUB"] = 3] = "SUB";
    OPCODE[OPCODE["MUL"] = 4] = "MUL";
    OPCODE[OPCODE["DIV"] = 5] = "DIV";
    OPCODE[OPCODE["MOD"] = 6] = "MOD";
    OPCODE[OPCODE["INC"] = 7] = "INC";
    OPCODE[OPCODE["DEC"] = 8] = "DEC";
    OPCODE[OPCODE["MOV"] = 9] = "MOV";
    OPCODE[OPCODE["JMP"] = 10] = "JMP";
    OPCODE[OPCODE["JEZ"] = 11] = "JEZ";
    OPCODE[OPCODE["JNZ"] = 12] = "JNZ";
    OPCODE[OPCODE["JGZ"] = 13] = "JGZ";
    OPCODE[OPCODE["JLZ"] = 14] = "JLZ";
    OPCODE[OPCODE["PRO"] = 15] = "PRO";
    OPCODE[OPCODE["RET"] = 16] = "RET";
    OPCODE[OPCODE["EXE"] = 17] = "EXE";
    OPCODE[OPCODE["END"] = 18] = "END";
    OPCODE[OPCODE["LBL"] = 19] = "LBL";
    OPCODE[OPCODE["LDI"] = 20] = "LDI";
    OPCODE[OPCODE["OUT"] = 21] = "OUT";
})(OPCODE = exports.OPCODE || (exports.OPCODE = {}));
var REGISTER;
(function (REGISTER) {
    REGISTER[REGISTER["INVALID"] = -1] = "INVALID";
    REGISTER[REGISTER["iPtr"] = 0] = "iPtr";
    REGISTER[REGISTER["RAX"] = 1] = "RAX";
    REGISTER[REGISTER["RBX"] = 2] = "RBX";
    REGISTER[REGISTER["RCX"] = 3] = "RCX";
    REGISTER[REGISTER["RDX"] = 4] = "RDX";
    REGISTER[REGISTER["REX"] = 5] = "REX";
    REGISTER[REGISTER["RFX"] = 6] = "RFX";
    REGISTER[REGISTER["RGX"] = 7] = "RGX";
    REGISTER[REGISTER["RHX"] = 8] = "RHX";
    REGISTER[REGISTER["RJX"] = 9] = "RJX";
    REGISTER[REGISTER["OUT"] = 10] = "OUT";
})(REGISTER = exports.REGISTER || (exports.REGISTER = {}));
function getRegister(reg) {
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
exports.getRegister = getRegister;
function getOpcode(input) {
    return Object.keys(OPCODE).filter((v) => isNaN(Number(v))).indexOf(input);
}
exports.getOpcode = getOpcode;
class operation extends Object {
    constructor(opcode, Reg1, Reg2, Reg3) {
        super();
        this.op = opcode;
        if (Reg1 == null && Reg2 == null && Reg3 == null) { // if no registers are provided, Reg1 needs to be iPtr
            this.Reg1 = REGISTER.iPtr;
            this.Reg2 = -1;
            this.Reg3 = -1;
        }
        else if (Reg1 != null) { //If Reg1 is provided, place it here
            this.Reg1 = Reg1;
        }
        else { // This shouldn't be possible, but it will be caught in the runtime step and throw an error.
            this.Reg1 = -1;
        }
        if (Reg2 != null) {
            if (Reg3 != null) { //if all 3 registers are provided, pass them through
                this.Reg2 = Reg2;
                this.Reg3 = Reg3;
            }
            else { // if only 2 registers are provided, Reg1 is input, Reg2 is output
                this.Reg2 = -1;
                this.Reg3 = Reg2;
            }
        }
        else {
            this.Reg2 = -1;
            this.Reg3 = -1;
        }
    }
    toString() {
        var _a;
        let output = '';
        switch (this.op) {
            case OPCODE.JMP:
            case OPCODE.JNZ:
            case OPCODE.JEZ:
            case OPCODE.JGZ:
            case OPCODE.JLZ:
                output = `${OPCODE[this.op]} ${(_a = this.handle) !== null && _a !== void 0 ? _a : ''}`;
                break;
            case OPCODE.RND:
            case OPCODE.ADD:
            case OPCODE.SUB:
            case OPCODE.MUL:
            case OPCODE.DIV:
                output = `${OPCODE[this.op]} ${REGISTER[this.Reg1]} ${REGISTER[this.Reg2]} ${REGISTER[this.Reg3]}`;
                break;
            case OPCODE.LDI:
                output = `${OPCODE[this.op]} ${this.Reg1} ${REGISTER[this.Reg3]}`;
                break;
            case OPCODE.MOV:
                output = `${OPCODE[this.op]} ${REGISTER[this.Reg1]} ${REGISTER[this.Reg3]}`;
                break;
            case OPCODE.END:
                output = "END";
                break;
            case OPCODE.EXE:
            case OPCODE.PRO:
                output = `${OPCODE[this.op]} ${this.handle}`;
                break;
            case OPCODE.RET:
                output = `${OPCODE[this.op]}`;
                break;
            case OPCODE.OUT:
                output = `${OPCODE[this.op]}`;
                break;
            case OPCODE.LBL:
                output = `${OPCODE[this.op]} -> ${this.handle}`;
                break;
            case OPCODE.NOP:
                output = "NOP";
                break;
            default: break;
        }
        return output;
    }
}
exports.operation = operation;
