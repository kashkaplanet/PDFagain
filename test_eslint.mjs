import { ESLint } from "eslint";
import fs from "fs";

async function main() {
    try {
        const eslint = new ESLint();
        const results = await eslint.lintFiles(["."]);
        // console.log(results);
    } catch (error) {
        fs.writeFileSync("eslint_error_details.txt", error.message + '\n' + error.stack);
    }
}

main();
