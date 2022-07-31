import { Executable } from "./compiler";
export declare class runtime {
    registers: number[];
    rFlag: boolean[];
    callStack: number[];
    binary: Executable;
    bootstrap(): void;
    clockCycle(): void;
    execute(): void;
    OUT(): void;
    jump(label: string | undefined): void;
    exec(label: string | undefined): void;
    constructor(binary: Executable);
}
