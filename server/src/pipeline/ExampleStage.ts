import IStage from "./IStage";

class ExampleStage<T> implements IStage<T>
{
    constructor(private logIn, private logOut)
    {

    }

    public invoke(input: T, next: (T) => Promise<T>, resolve: (output?: T | PromiseLike<T>) => void, reject: (reason: any) => void): void
    {
        // Do something (async) with input
        let doSomethingAsync = () => {
            input = input + this.logIn;

            // Invoke next
            let outputNext = next(input);

            // Do something with output and resolve or reject
            outputNext.then((value: T) => {
                // Do something (async) with output
                let output = value + this.logOut

                resolve(output);
            });
        };

        setTimeout(doSomethingAsync.bind(this), 0);
    }
}

export default ExampleStage;