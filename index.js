"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bind = void 0;
const React = require("react");
const ReactiveStore_1 = require("ReactiveStore");
/**
 * Binds the ReactiveStore to the the React Component, therefore the React Componenet will auto render when the ReactiveStore's state changes. If no map is
 * provided, the Component will update if the ReactiveStore contains the same key. Otherwise a map can be provided to map ReactiveStore state keys onto the Component's
 * state keys.
 * @param {TState} obj The ReactiveStore to bind to the React Component
 * @param {Pick<TState, K>} map The optional key to key mapping from ReactiveStore state keys to the React Component state keys
 * @returns {ClassDecorator} A class decorator
 */
function bind(obj, map) {
    return function (constructor) {
        return class extends constructor {
            constructor(...args) {
                super(...args);
                if (obj instanceof ReactiveStore_1.ReactiveStore && this instanceof React.Component) {
                    obj["_resolvers"].push([this, map]);
                }
            }
        };
    };
}
exports.bind = bind;

Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveStore = void 0;
function define(obj, key) {
    let value;
    const getter = function () {
        return value;
    };
    const setter = function (newVal) {
        var _a;
        value = newVal;
        (_a = obj["_resolvers"]) === null || _a === void 0 ? void 0 : _a.forEach(resolver => {
            if (resolver[0] == null)
                return;
            // If the caller hasn't overridden the state keys to map to, then the algorithm will use the same key from the 
            // reactive state as the component's state key if there is a match
            if (resolver[1] == null) {
                // Ensure the types match before setting state
                if (typeof (resolver[0].state[key]) !== typeof (value))
                    return;
                resolver[0].state[key] = value;
                resolver[0].setState({
                    key: value
                });
            }
            // Otherwise check if the caller has provided a map from reactive state to the component's state 
            else if (resolver[1].hasOwnProperty(key)) {
                let mappedKey = resolver[1][key];
                // Ensure the types match before setting state
                if (typeof (resolver[0].state[mappedKey]) !== typeof (value))
                    return;
                resolver[0].state[mappedKey] = value;
                resolver[0].setState({
                    mappedKey: value
                });
            }
        });
    };
    Object.defineProperty(obj.state, key, {
        get: getter,
        set: setter
    });
}
/**
 * ReactiveStore class provides the functionality to override the get and set methods on the provided objects properties and listen for state changes.
 * If the state changes, all applicable (from key map) and listening components will be notified.
 */
class ReactiveStore {
    constructor(state) {
        this._state = null;
        this._resolvers = [];
        this._state = state;
        for (let key in this.state) {
            define(this, key);
        }
    }
    /**
     * Gets the state of the ReactiveStore
     */
    get state() {
        return this._state;
    }
    /**
     * Sets the state of the ReactiveStore
     * @param {Pick<S, K>} state the optional key values to set in the ReactiveStore's state
     */
    setState(state) {
        for (let key in state) {
            this._state[key] = state[key];
        }
    }
}
exports.ReactiveStore = ReactiveStore;
//# sourceMappingURL=ReactiveStore.js.map