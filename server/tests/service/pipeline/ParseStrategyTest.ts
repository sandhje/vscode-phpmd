import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import * as Xml2Js from "xml2js";
import PipelinePayloadModel from "../../../src/model/PipelinePayloadModel";
import ParseStrategy from "../../../src/service/pipeline/ParseStrategy";

@suite("Parse strategy")
class ParseStrategyTest {

    @test("Should resolve with a parsed XML")
    public assertResolveParse(done) {
        // Arrange
        // =======
        // Fake resolve callback
        let resolve = (output: PipelinePayloadModel) => {
            // Assert
            // ======
            expect(input.pmd.file.length).to.equal(1);
            expect(input.pmd.file[0].violation.length).to.equal(1);
            done();
        };

        // Fake reject callback
        let reject = (reason: any) => {
            // Nothing to do here, test will fail because of absence of done
        };

        // Fake input
        let input = <PipelinePayloadModel> {};
        input.raw = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
        input.raw += "<pmd version=\"@project.version@\" timestamp=\"2017-05-05T06:57:25+01:00\">";
        input.raw += "<file name=\"/Test.php\">";
        input.raw += "<violation beginline=\"1987\" endline=\"1987\" rule=\"ExitExpression\" ruleset=\"Design Rules\" externalInfoUrl=\"http://phpmd.org/rules/design.html#exitexpression\" priority=\"1\">";
        input.raw += "The method activityImageAction() contains an exit expression.";
        input.raw += "</violation>";
        input.raw += "</file>";
        input.raw += "</pmd>";

        // Create and configure strategy instance
        let strategy = new ParseStrategy(new Xml2Js.Parser());

        // Act
        strategy.execute(input, resolve, reject);
    }
}
