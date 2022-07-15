const functionFiles = Deno.readDirSync("./functions")

// TODO: Build this file from Zenith manifest/config 

const imports: Array<string> = [];
const sets: Array<string> = [];
  
for await (const dirEntry of functionFiles) {
    if (dirEntry.isDirectory) { continue; }

    const extIdx = dirEntry.name.lastIndexOf(".")
    const ext = dirEntry.name.substring(extIdx)
    const funcName = dirEntry.name.substring(0, extIdx)
  
    const isTs = ext === ".ts" 
    if (!isTs) { continue; }

    const imp = `import ${funcName} from "./functions/${dirEntry.name}"`
    const set = `functionMap.set(new URLPattern({pathname: "/api/${funcName}"}), ${funcName})`

    imports.push(imp);
    sets.push(set);
}

const importStr = imports.join("\n");
const setStr = sets.join("\n");

const fileStr = `// GENERATED BY ZENITH, DON'T EDIT
    
export type Handler = (req: Request) => Response;
export type AsyncHandler = (req: Request) => Promise<Response>;

export const functionMap = new Map<URLPattern, Handler | AsyncHandler>();

${importStr}
    
${setStr}
`
Deno.writeTextFile("./functions.ts", fileStr)