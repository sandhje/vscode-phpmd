import AbstractParallel from "./AbstractParallel";

class ExampleParallel extends AbstractParallel<String>
{
    protected mergeUp(input: String, results: Array<String>) 
    {
        let output = input.toString();
        
        results.every((result: String) => {
            output = output + result.substr(-3);

            return true;
        });

        return output;
    }

    protected mergeDown(input: String, results: Array<String>) 
    {
        let output = input.toString();
        
        results.every((result: String) => {
            output = output + result.substr(-3);

            return true;
        });

        return output;
    }
}

export default ExampleParallel;