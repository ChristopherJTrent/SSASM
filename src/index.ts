import { compile } from "./adapter/compiler"
import { readFileSync } from 'fs'
import { runtime } from "./adapter/runtime"

const PROGRAM = readFileSync(__dirname + '/takattack.ssasm', 'utf-8')
let program = compile(PROGRAM.split('\n'))
//program.toString()
//console.log(program.toString())
new runtime(program).execute()