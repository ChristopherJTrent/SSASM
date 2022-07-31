import { operation } from "./operation";
export declare class Executable extends Object {
    procedures: Map<string, number>;
    labels: Map<string, number>;
    instructions: operation[];
    hasProcedure(procedure: string): boolean;
    hasLabel(label: string): boolean;
    constructor();
    toString(): string;
}
export declare function compile(lines: string[]): Executable;
