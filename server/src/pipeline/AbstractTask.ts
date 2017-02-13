import IStage from "./IStage";

abstract class AbstractTask<T> implements IStage<T>
{
    public invoke(input: T, next: (T) => Promise<T>, resolve: (output?: T | PromiseLike<T>) => void, reject: (reason: any) => void): void
    {
        let promiseIn: Promise<T> = new Promise<T>((resolveIn: (output?: T | PromiseLike<T>) => void, rejectIn: (reason: any) => void) => {
            this.in(input, resolveIn, rejectIn);
        });

        promiseIn.then((value: T) => {
            return next(value);
        }).then((value: T) => {
            return new Promise<T>((resolveOut: (output?: T | PromiseLike<T>) => void, rejectOut: (reason: any) => void) => {
                this.out(value, resolveOut, rejectOut);
            })
        }).then((value: T) => {
            resolve(value);
        }).catch((reason: any) => {
            reject(reason);
        }) ;
    }

    public abstract in(input: T, resolve: (output?: T | PromiseLike<T>) => void, reject: (reason: any) => void): void

    public abstract out(output: T, resolve: (output?: T | PromiseLike<T>) => void, reject: (reason: any) => void): void
}

export default AbstractTask;