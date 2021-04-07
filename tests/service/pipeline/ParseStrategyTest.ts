import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import * as sinon from "sinon";
import * as Xml2Js from "xml2js";
import PipelinePayloadModel from "../../../server/model/PipelinePayloadModel";
import ParseStrategy from "../../../server/service/pipeline/ParseStrategy";
import NullLogger from "../../../server/service/logger/NullLogger";
import { match } from "sinon";

@suite("Parse strategy")
class ParseStrategyTest {

    @test("Should resolve with a parsed XML")
    public assertResolveParse(done) {
        // Arrange
        // =======
        // Fake resolve callback
        let resolve = (output: PipelinePayloadModel | PromiseLike<PipelinePayloadModel>) => {
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
        let input = <PipelinePayloadModel> { path: "/Test.php" };
        input.raw = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
        input.raw += "<pmd version=\"@project.version@\" timestamp=\"2017-05-05T06:57:25+01:00\">";
        input.raw += "<file name=\"/Test.php\">";
        input.raw += "<violation beginline=\"1987\" endline=\"1987\" rule=\"ExitExpression\" ruleset=\"Design Rules\" externalInfoUrl=\"http://phpmd.org/rules/design.html#exitexpression\" priority=\"1\">";
        input.raw += "The method activityImageAction() contains an exit expression.";
        input.raw += "</violation>";
        input.raw += "</file>";
        input.raw += "</pmd>";

        // Create and configure strategy instance
        let strategy = new ParseStrategy(new Xml2Js.Parser(), new NullLogger());

        // Act
        strategy.execute(input, resolve, reject);
    }

    @test("Should log XML parse errors and set pmd to null")
    public assertLogError(done) {
        let resolve = (output: PipelinePayloadModel | PromiseLike<PipelinePayloadModel>) => {
            // Assert
            // ======
            expect(input.pmd).to.equal(null);
            expect(loggerSpy.calledOnce).to.be.true;
            expect(loggerSpy.calledOnceWith(match(/^Unable to parse result xml./g))).to.be.true;
            done();
        };

        // Fake reject callback
        let reject = (reason: any) => {
            // Nothing to do here, test will fail because of absence of done
        };

        // Spy logger
        const logger = new NullLogger();
        const loggerSpy = sinon.spy(logger, "log");

        // Fake input
        let input = <PipelinePayloadModel> { path: "/Test.php" };
        input.raw = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
        input.raw += "<pmd version=\"@project.version@\" timestamp=\"2017-05-05T06:57:25+01:00\">";
        input.raw += "<file name=\"/Test.php\">";
        input.raw += "<violation beginline=\"1987\" endline=\"1987\" rule=\"ExitExpression\" ruleset=\"Design Rules\" externalInfoUrl=\"http://phpmd.org/rules/design.html#exitexpression\" priority=\"1\">";
        input.raw += "The method activityImageAction() contains an exit expression.";
        input.raw += "</violation>";
        input.raw += "</file";
        input.raw += "</pmd>";

        // Create and configure strategy instance
        let strategy = new ParseStrategy(new Xml2Js.Parser(), logger);

        // Act
        strategy.execute(input, resolve, reject);
    }

    @test("Should escape XML special chars in path")
    public assertEscapePath(done) {
        // Arrange
        // =======
        // Fake resolve callback
        let resolve = (output: PipelinePayloadModel | PromiseLike<PipelinePayloadModel>) => {
            // Assert
            // ======
            expect(input.pmd.file.length).to.equal(1);
            expect(input.pmd.file[0].violation.length).to.equal(1);
            expect(input.pmd.file[0].$.name).to.equal(input.path);
            expect(loggerSpy.notCalled).to.be.true;
            done();
        };

        // Fake reject callback
        let reject = (reason: any) => {
            // Nothing to do here, test will fail because of absence of done
        };

        // Spy logger
        const logger = new NullLogger();
        const loggerSpy = sinon.spy(logger, "log");

        // Fake input
        let input = <PipelinePayloadModel> { path: "/Test&test.php" };
        input.raw = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
        input.raw += "<pmd version=\"@project.version@\" timestamp=\"2017-05-05T06:57:25+01:00\">";
        input.raw += "<file name=\"/Test&test.php\">";
        input.raw += "<violation beginline=\"1987\" endline=\"1987\" rule=\"ExitExpression\" ruleset=\"Design Rules\" externalInfoUrl=\"http://phpmd.org/rules/design.html#exitexpression\" priority=\"1\">";
        input.raw += "The method activityImageAction() contains an exit expression.";
        input.raw += "</violation>";
        input.raw += "</file>";
        input.raw += "</pmd>";

        // Create and configure strategy instance
        let strategy = new ParseStrategy(new Xml2Js.Parser(), logger);

        // Act
        strategy.execute(input, resolve, reject);
    }

    @test("Should trim windows drive when escaping XML special chars")
    public assertTrimPath(done) {
        // Arrange
        // =======
        // Fake resolve callback
        let resolve = (output: PipelinePayloadModel | PromiseLike<PipelinePayloadModel>) => {
            // Assert
            // ======
            expect(input.pmd.file.length).to.equal(1);
            expect(input.pmd.file[0].violation.length).to.equal(1);
            expect(input.pmd.file[0].$.name).to.equal(input.path);
            expect(loggerSpy.notCalled).to.be.true;
            done();
        };

        // Fake reject callback
        let reject = (reason: any) => {
            // Nothing to do here, test will fail because of absence of done
        };

        // Spy logger
        const logger = new NullLogger();
        const loggerSpy = sinon.spy(logger, "log");

        // Fake input
        let input = <PipelinePayloadModel> { path: "c:\\Test&test.php" };
        input.raw = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
        input.raw += "<pmd version=\"@project.version@\" timestamp=\"2017-05-05T06:57:25+01:00\">";
        input.raw += "<file name=\"c:\\Test&test.php\">";
        input.raw += "<violation beginline=\"1987\" endline=\"1987\" rule=\"ExitExpression\" ruleset=\"Design Rules\" externalInfoUrl=\"http://phpmd.org/rules/design.html#exitexpression\" priority=\"1\">";
        input.raw += "The method activityImageAction() contains an exit expression.";
        input.raw += "</violation>";
        input.raw += "</file>";
        input.raw += "</pmd>";

        // Create and configure strategy instance
        let strategy = new ParseStrategy(new Xml2Js.Parser(), logger);

        // Act
        strategy.execute(input, resolve, reject);
    }
}
