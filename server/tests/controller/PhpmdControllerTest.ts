import { assert, expect } from "chai";
import { only, skip, slow, suite, test, timeout } from "mocha-typescript";
import PhpmdController from "../../src/controller/PhpmdController";

@suite("PhpMD controller")
class PhpmdControllerTest {

    @test("Should send diagnostics")
    public assertSendDiagnostics() {
        expect(true).to.be.false;
    }
};
