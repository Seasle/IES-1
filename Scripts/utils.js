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

export const render = (tag, properties = null, children = null, callback = null) => {
    const element = document.createElement(tag);

    if (properties !== null) {
        for (let [key, value] of Object.entries(properties)) {
            if (key in element) {
                element[key] = value;
            } else {
                element.setAttribute(key, value);
            }
        }
    }

    if (children !== null) {
        if (children instanceof Array) {
            element.append(...children);
        } else {
            element.append(children);
        }
    }

    if (callback !== null && typeof callback === 'function') {
        callback(element);
    }

    return element;
};

export const round = (number, precision = 0) => {
    const multiplier = Math.pow(10, precision);

    return Math.round(number * multiplier) / multiplier;
};

export const load = path => fetch(path).then(response => {
    return response.json();
});