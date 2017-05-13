import { IExecuteStrategy } from "@open-sourcerers/j-stillery";
import { Diagnostic, DiagnosticSeverity } from "vscode-languageserver";
import PipelinePayloadModel from "../../model/PipelinePayloadModel";
import { IPmd, IPmdViolation } from "../../model/pmd";

class BuildDiagnosticsStrategy implements IExecuteStrategy<PipelinePayloadModel> {
    protected reported: string[] = [];

    // TODO: construct form options
    protected severityMap: DiagnosticSeverity[] = [
        DiagnosticSeverity.Error,
        DiagnosticSeverity.Warning,
        DiagnosticSeverity.Information,
        DiagnosticSeverity.Hint,
        DiagnosticSeverity.Hint
    ];

    public execute(
        input: PipelinePayloadModel,
        resolve: (output?: PipelinePayloadModel | PromiseLike<PipelinePayloadModel>) => void,
        reject: (reason: any) => void
    ) {
        let pmd = <IPmd> input.pmd;

        if (pmd === null || typeof pmd.file === "undefined") {
            // If no pmd results found, resolve without diagnostics
            resolve(input);
            return;
        }

        // For all files in Pmd result
        // Get diagnostics and append to payload
        pmd.file.every((file) => {
            input.diagnostics = input.diagnostics.concat(this.getDiagnosticts(file.$.name, this.getProblems(pmd)));

            return true;
        });

        resolve(input);
    };

    protected getProblems(pmd: IPmd): IPmdViolation[] {
        return pmd.file[0].violation || [];
    }

    protected getDiagnosticts(filename: string, problems: IPmdViolation[]): Diagnostic[] {
        let diagnostics: Diagnostic[] = [];

        problems.forEach((problem) => {
            try {
                let diagnostic = this.getDiagnostic(problem);

                if (diagnostic !== null) {
                    diagnostics.push(diagnostic);
                }
            } catch (e) {
                // TODO: Log get diagnostic error
            }
        });

        return diagnostics;
    }

    protected getDiagnostic(problem: any): Diagnostic {
        try {
            let line = this.getLine(problem);
            let index = this.getIndex(problem);
            let length = this.getLength(problem);

            let hash = this.createProblemHash(problem);
            if (hash !== null && this.alreadyReported(hash)) {
                return null;
            }

            this.report(hash);
            return {
                message: this.getMessage(problem),
                range: {
                    end: {
                        character: index + length,
                        line
                    },
                    start: {
                        character: index,
                        line
                    },
                },
                severity: this.getSeverity(problem),
                source: this.getSource(problem)
            };
        } catch (e) {
            throw new Error("Unable to create diagnostic (" + e.message + ")");
        }
    }

    protected report(hash: string): void {
        this.reported.push(hash);
    }

    protected alreadyReported(hash: string): boolean {
        return this.reported.indexOf(hash) >= 0;
    }

    protected createProblemHash(problem: any): string {
        let ruleset = problem.$.ruleset || null;
        let rule = problem.$.rule || null;
        let line = problem.$.beginline || null;

        let str = ruleset + "-" + rule + "-" + line;

        let hash = 0;
        if (str.length === 0) {
            return null;
        }

        for (let i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }

        return hash.toString();
    }

    protected getLine(problem: any): number {
        let beginline = problem.$.beginline || null;

        if (beginline === null) {
            throw new Error("Unable to find problem begin line");
        }

        return parseInt(beginline, 10) - 1;
    }

    protected getIndex(problem: any): number {
        return 0;
    }

    protected getLength(problem: any): number {
        return Number.MAX_VALUE;
    }

    protected getMessage(problem: any): string {
        let message = problem._ || null;

        if (message === null) {
            throw new Error("Unable to find problem message");
        }

        return message;
    }

    protected getSource(problem: any): string {
        return "PHP Mess Detector";
    }

    protected getSeverity(problem: any): DiagnosticSeverity {
        let priority: number = parseInt(problem.$.priority, 10) || 100;

        let severity = this.severityMap[priority - 1] || DiagnosticSeverity.Hint;

        return severity;
    }
}

export default BuildDiagnosticsStrategy;
