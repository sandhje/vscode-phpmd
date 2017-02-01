import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect } from "chai";

@suite("PhpmdService tests")
class PhpmdServiceSpec
{
    @test("Test test")
    assertTest() {
        expect(true).to.equal(false);
    }
}