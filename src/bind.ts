import React = require("react");
import { ReactiveStore } from "ReactiveStore";

type Pick<T, K extends keyof T> = {
    [P in K]: string;
};

/**
 * Binds the ReactiveStore to the the React Component, therefore the React Componenet will auto render when the ReactiveStore's state changes. If no map is 
 * provided, the Component will update if the ReactiveStore contains the same key. Otherwise a map can be provided to map ReactiveStore state keys onto the Component's 
 * state keys.
 * @param {TState} obj The ReactiveStore to bind to the React Component 
 * @param {Pick<TState, K>} map The optional key to key mapping from ReactiveStore state keys to the React Component state keys 
 * @returns {ClassDecorator} A class decorator
 */
export function bind<TState extends ReactiveStore<any>, K extends keyof TState>(obj: TState, map?: Pick<TState, K>): ClassDecorator {
    return function<T extends { new(...args: any[]): React.Component }>(constructor: T) {
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);

                if (obj instanceof ReactiveStore && this instanceof React.Component) {
                    obj["_resolvers"].push([ this, map ]);
                }
            }
        }
    } as ClassDecorator;
}