"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveState = exports.bind = void 0;
const React = require("react");
function bind(obj, map) {
    return function (constructor) {
        return class extends constructor {
            constructor(...args) {
                super(...args);
                if (obj instanceof ReactiveState && this instanceof React.Component) {
                    obj["_resolvers"].push([this, map]);
                }
            }
        };
    };
}
exports.bind = bind;
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
            if (resolver[1] == null) {
                if (typeof (resolver[0].state[key] !== typeof (value)))
                    return;
                resolver[0].state[key] = value;
                resolver[0].setState({
                    key: value
                });
            }
            else if (resolver[1].hasOwnProperty(key)) {
                let mappedKey = resolver[1][key];
                if (typeof (resolver[0].state[mappedKey] !== typeof (value)))
                    return;
                resolver[0].state[mappedKey] = value;
                resolver[0].setState({
                    mappedKey, value
                });
            }
        });
    };
    Object.defineProperty(obj.state, key, {
        get: getter,
        set: setter
    });
}
class ReactiveState {
    constructor(state) {
        this._state = null;
        this._resolvers = [];
        this._state = state;
        for (let key in this.state) {
            define(this, key);
        }
    }
    get state() {
        return this._state;
    }
    setState(state) {
        for (let key in state) {
            this._state[key] = state[key];
        }
    }
}
exports.ReactiveState = ReactiveState;
