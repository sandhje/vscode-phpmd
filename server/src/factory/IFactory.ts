interface IFactory<T>
{
    create: () => T
}

export default IFactory;