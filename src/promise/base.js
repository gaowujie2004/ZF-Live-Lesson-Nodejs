"use strict";
exports.__esModule = true;
exports._Promise = void 0;
var utils_1 = require("./utils");
var _Promise = /** @class */ (function () {
    function _Promise(execute) {
        var _this = this;
        this.state = "Pending" /* Pending */;
        this.result = undefined;
        this.onFulfillCallbacks = [];
        this.onRejectCallbacks = [];
        var resolve = function (value) {
            if (_this.state !== "Pending" /* Pending */) {
                return;
            }
            if (value instanceof _Promise) {
                // todo: 费脑筋
                return value.then(resolve, reject);
                // 详细版
                return value.then(function (val) {
                    resolve(val);
                }, function (reason) {
                    reject(reason);
                });
            }
            _this.state = "Fulfilled" /* Fulfilled */;
            _this.result = value;
            _this.onFulfillCallbacks.forEach(function (fn) { return fn(); });
        };
        var reject = function (reason) {
            // 调用失败，直接失败
            if (_this.state !== "Pending" /* Pending */) {
                return;
            }
            _this.state = "Rejected" /* Rejected */;
            _this.result = reason;
            _this.onRejectCallbacks.forEach(function (fn) { return fn(); });
        };
        try {
            // 同步执行
            execute(resolve, reject);
        }
        catch (err) {
            reject(err);
            console.log('--execute error', err);
        }
    }
    /**
     * then() 返回 Promise 实例，实例的状态和结果
     * let p = new Promise((resolve, reject) => {.....})
     * let p2 = p.then( val => {...} )
     *  p2 的状态由 回调函数返回值决定，回调函数返回值：
     *    1、基本类型
     *    2、promise 实例
     * @return Promise
     */
    _Promise.prototype.then = function (onFulfill, onReject) {
        var _this = this;
        // 穿透
        onFulfill = typeof onFulfill === 'function' ? onFulfill : function (v) { return v; };
        onReject =
            typeof onReject === 'function'
                ? onReject
                : function (r) {
                    throw r;
                };
        var promise2 = new _Promise(function (resolve, reject) {
            if (_this.state === "Pending" /* Pending */) {
                // todo: 这里是使用 val 还是 this.result
                // 都可以，如果使用 this.result  那就没必要写形参
                _this.onFulfillCallbacks.push(function () {
                    setTimeout(function () {
                        try {
                            var x = onFulfill(_this.result);
                            (0, utils_1.resolvePromise)(promise2, x, resolve, reject);
                        }
                        catch (err) {
                            reject(err);
                        }
                    }, 0);
                });
                _this.onRejectCallbacks.push(function () {
                    setTimeout(function () {
                        try {
                            var x = onReject(_this.result);
                            // 放入异步，因为 promise2
                            (0, utils_1.resolvePromise)(promise2, x, resolve, reject);
                        }
                        catch (err) {
                            reject(err);
                        }
                    }, 0);
                });
                // todo: 可以吗
                return;
            }
            /**
             * p.then(val => {})，val 是 p.result
             */
            if (_this.state === "Fulfilled" /* Fulfilled */) {
                setTimeout(function () {
                    try {
                        var x = onFulfill(_this.result);
                        // 放入异步，因为 promise2
                        (0, utils_1.resolvePromise)(promise2, x, resolve, reject);
                    }
                    catch (err) {
                        reject(err);
                    }
                }, 0);
                // todo: 可以吗
                return;
            }
            if (_this.state === "Rejected" /* Rejected */) {
                setTimeout(function () {
                    try {
                        var x = onReject(_this.result);
                        // 放入异步，因为 promise2
                        (0, utils_1.resolvePromise)(promise2, x, resolve, reject);
                    }
                    catch (err) {
                        reject(err);
                    }
                }, 0);
                // todo: 可以吗
                return;
            }
        });
        return promise2;
    };
    // todo: YYDS
    _Promise.resolve = function (val) {
        if (val instanceof _Promise) {
            return val;
        }
        return new _Promise(function (resolve) {
            resolve(val);
        });
    };
    _Promise.resolveSleep = function (val, duration) {
        if (duration === void 0) { duration = 1500; }
        return new _Promise(function (r) {
            setTimeout(function () {
                r(val);
            }, duration);
        });
    };
    return _Promise;
}());
exports._Promise = _Promise;
