```

```

# Sword Sage ASM

## PLEASE DEAR GOD DON'T USE THIS IN A PUBLIC FACING PROJECT.

This repository will allow (limited) REMOTE CODE EXECUTION in whatever project you allow it in, in the event that you *ever* pass user data to it.

With that said: if you *want* to allow remote code execution in your project, for instance, allowing users to define custom behavior, then this is the project for you.
I originally wrote this interpreter for Sword Sage, my as of yet unreleased, WIP dice rolling discord bot. SSASM exists to allow my users to define (almost) turing complete macros that can be run later.

### Documentation

#### As a User

As a user, you will need to write a file ending in .ssasm containing valid Sword Sage ASM code.

##### Opcodes

Syntax is defined as follows:
OPCODE [Descriptive_Name:type...]

As a programmer you have 8 registers available to you for calculation: RAX, RBX, RCX, RDX, REX, RFX, RGX, and RHX.
There are also two additional special use registers:

* RJX, the jump register; JNZ and JEZ will look in RJX for the value that they're comparing.
* OUT, which will be printed using platform specific behavior when OUT is called.

###### NOTE

regardless of any formatting that may occur in the table below, an opcode and ALL of its arguments go on the same line.


| Opcode | Description                                                                     | Syntax                                        |
| -------- | --------------------------------------------------------------------------------- | ----------------------------------------------- |
| NOP    | Does Nothing                                                                    | NOP                                           |
| RND    | Generates a random integer                                                      | RND min:REGISTER max:REGISTER output:REGISTER |
| ADD    | a + b, result into output                                                       | ADD a:REGISTER b:REGISTER output:REGISTER     |
| SUB    | a - b, result into output                                                       | SUB a:REGISTER b:REGISTER output:REGISTER     |
| MUL    | a * b, result into output                                                       | MUL a:REGISTER b:REGISTER output:REGISTER     |
| DIV    | a / b, result into output                                                       | DIV a:REGISTER b:REGISTER output:REGISTER     |
| MOD    | a % b, result into output                                                       | MOD a:REGISTER b:REGISTER output:REGISTER     |
| MOV    | move value at a into output                                                     | MOV a:REGISTER output:REGISTER                |
| JMP    | jump unconditionally to label                                                   | JMP label:LABEL                               |
| JEZ    | jump to label if RJX == 0                                                       | JEZ label:LABEL                               |
| JNZ    | jump to label if RJX != 0                                                       | JNZ label:LABEL                               |
| PRO    | defines a procedure (compile time only)                                         | PRO label:STRING                              |
| RET    | returns from a procedure, jumping to the instruction after the last call to EXE | RET                                           |
| EXE    | calls a procedure, pushing the current instruction pointer onto the call stack. | EXE proc:PROCEDURE                            |
| END    | exits the program                                                               | END                                           |
| LBL    | defines a label                                                                 | LBL label:STRING                              |
| LDI    | loads a number into a specified register                                        | LDI i:NUMBER output:REGISTER                  |
| OUT    | outputs the OUT register in a platform specific manner.                         | OUT                                           |

##### Conventions

There are a few programming conventions you should follow in order to make your code more readable.

###### Comments

Any text after a semicolon on a line will be ignored by the compiler, allowing you to place comments at the ends of any lines of code.

###### Labels

It is convention to start process labels with a . (e.g .main) and jump labels without (e.g loop)

#### As a Library
see ./src/index.ts for a typescript example. 
we do not currently support vanilla javascript.