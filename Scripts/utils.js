export const createAutoEnum = (...keys) => new Proxy(Object.fromEntries(keys.map(key => [key, Symbol(key)])), {
    get(target, property) {
        if (!target.hasOwnProperty(property)) {
            Object.defineProperty(target, property, {
                enumerable: true,
                configurable: false,
                writable: false,
                value: Symbol(property)
            });
        }

        return target[property];
    }
});