import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver';
import * as Process from 'child_process';

class PhpmdService
{
    constructor(
        private executable: string, 
        private rules: string
    ) { }

    ExecuteProcess(path: string, ): Promise<string>
    {
        return new Promise<string>((resolve, reject) => {
            let result: string;
            let process: Process.ChildProcess = Process.exec(this.executable + " " + path + " xml " + this.rules);

            process.stdout.setEncoding('utf8');
            process.stdout.on("data", (data) => {
                if (result) {
                    data = result + data.toString();
                }

                result = data.toString();
            });
            process.stdout.on("close", (code) => {
                resolve(result);
            });
        });
    }

    getDiagnosticts(uri: string, problems: Array<any>): Array<Diagnostic> {
        let diagnostics: Diagnostic[] = [];
        
        problems.forEach((problem) => {
            let line = parseInt(problem.$.beginline, 10) - 1; // get line
            let index = 0; // get character
            let length = 10; // get length
            let message = "Mess detection: " + problem._; // get message

            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range: {
                    start: { line: line, character: index},
                    end: { line: line, character: index + length }
                },
                message: message,
                source: 'PHP Mess Detector'
            });
        });	
        
        return diagnostics;
    }
}

export default PhpmdService;