import IPipeline from "./IPipeline";
import IStage from "./IStage";

class Pipeline<T> implements IPipeline<T>
{
    protected current: number = -1;

    protected stages: Array<IStage<T>> = [];

    public pipe(stage: IStage<T>): IPipeline<T>
    {
        this.stages.push(stage);

        return this;
    }

    public run(input: T): Promise<T>
    {
        this.reset();

        return this.next(input);
    }

    protected reset(): void
    {
        this.current = -1;
    }

    protected next = (input: T): Promise<T> => {
        let promiseCallback = (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason: any) => void) => {
            this.current++;

            if (this.current in this.stages) {
                // Go to next in filter chain
                // TODO: Try Wrapping this.invoke or next in an arrow function, see: http://stackoverflow.com/questions/36627845/es6-promises-how-to-chain-functions-with-delays
                this.stages[this.current].invoke(input, this.next.bind(this), resolve, reject);
                return; // Do not continue to default resolve if a filter was invoked
            }

            // End of Pipeline
            this.end(input, resolve, reject);
        };

        return new Promise<T>(promiseCallback.bind(this));
    }

    protected end(input: T, resolve: (value?: T | PromiseLike<T>) => void, reject: (reason: any) => void): void
    {
        resolve(input);
    }
}

export default Pipeline;