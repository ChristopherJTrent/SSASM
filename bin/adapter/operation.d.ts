export declare enum OPCODE {
    NOP = 0,
    RND = 1,
    ADD = 2,
    SUB = 3,
    MUL = 4,
    DIV = 5,
    MOD = 6,
    INC = 7,
    DEC = 8,
    MOV = 9,
    JMP = 10,
    JEZ = 11,
    JNZ = 12,
    JGZ = 13,
    JLZ = 14,
    PRO = 15,
    RET = 16,
    EXE = 17,
    END = 18,
    LBL = 19,
    LDI = 20,
    OUT = 21
}
export declare enum REGISTER {
    INVALID = -1,
    iPtr = 0,
    RAX = 1,
    RBX = 2,
    RCX = 3,
    RDX = 4,
    REX = 5,
    RFX = 6,
    RGX = 7,
    RHX = 8,
    RJX = 9,
    OUT = 10
}
export declare function getRegister(reg: string): REGISTER | undefined;
export declare function getOpcode(input: string): number;
export declare class operation extends Object {
    op: OPCODE;
    Reg1: REGISTER;
    Reg2: REGISTER;
    Reg3: REGISTER;
    handle?: string;
    constructor(opcode: OPCODE | number, Reg1?: number | REGISTER, Reg2?: number | REGISTER, Reg3?: number | REGISTER);
    toString(): string;
}
