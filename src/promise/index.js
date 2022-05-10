"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
            if (value instanceof _Promise) {
                // todo: 费脑筋
                return value.then(resolve, reject);
                value.then(function (val) {
                    resolve(val);
                }, function (reason) {
                    reject(reason);
                });
            }
            if (_this.state === "Pending" /* Pending */) {
                _this.state = "Fulfilled" /* Fulfilled */;
                _this.result = value;
                _this.onFulfillCallbacks.forEach(function (fn) { return fn(_this.result); });
            }
        };
        var reject = function (reason) {
            // 调用失败，直接失败
            if (_this.state === "Pending" /* Pending */) {
                _this.state = "Rejected" /* Rejected */;
                _this.result = reason;
                _this.onRejectCallbacks.forEach(function (fn) { return fn(_this.result); });
            }
        };
        try {
            execute(resolve, reject);
        }
        catch (err) {
            reject(err);
            console.log('--execute error', err);
        }
    }
    // todo: YYDS
    _Promise.resolve = function (val) {
        if (val instanceof _Promise) {
            return val;
        }
        return new _Promise(function (resolve) {
            resolve(val);
        });
    };
    _Promise.reject = function (reason) {
        return new _Promise(function (_, reject) {
            reject(reason);
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
    _Promise.rejectSleep = function (val, duration) {
        if (duration === void 0) { duration = 1500; }
        return new _Promise(function (_, reject) {
            setTimeout(function () {
                reject(val);
            }, duration);
        });
    };
    // 只要有一个 reject，则 all() 返回 这个失败的promise
    // 都为成功，all() 返回成功的，val 是数组按照顺序的 val
    _Promise.all = function (promiseList) {
        return new _Promise(function (resolve, reject) {
            var resList = [];
            var count = 0;
            promiseList.forEach(function (p, pIndex) {
                // then callback 是异步的
                _Promise.resolve(p).then(function (val) {
                    resList[pIndex] = val;
                    if (++count >= promiseList.length) {
                        // todo: 不能使用 resList.length
                        // 所以 let count 一个计数器
                        resolve(resList);
                    }
                }, reject
                // (reason) => {
                //   reject(reason);
                // }
                );
            });
        });
    };
    _Promise.allSettled = function (promiseList) {
        return new _Promise(function (resolve) {
            var resList = [];
            var count = 0;
            function processMap(key, val) {
                resList[key] = val;
                if (++count >= promiseList.length) {
                    resolve(resList);
                }
            }
            promiseList.forEach(function (p, pIndex) {
                _Promise.resolve(p).then(function (value) {
                    processMap(pIndex, {
                        value: value,
                        status: "Fulfilled" /* Fulfilled */
                    });
                }, function (reason) {
                    processMap(pIndex, {
                        reason: reason,
                        status: "Rejected" /* Rejected */
                    });
                });
            });
        });
    };
    // race() 的返回值是 promiseLIst 中第一个改变状态的那个 promise 副本
    _Promise.race = function (promiseList) {
        return new _Promise(function (resolve, reject) {
            promiseList.forEach(function (p) {
                _Promise.resolve(p).then(resolve, reject);
            });
        });
    };
    _Promise.retry = function (fn, options, retryAction) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, count, _b, interval, i, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = options || {}, count = _a.count, _b = _a.interval, interval = _b === void 0 ? 0 : _b;
                        i = 1;
                        _c.label = 1;
                    case 1:
                        if (!(i <= count)) return [3 /*break*/, 6];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fn()];
                    case 3:
                        _c.sent();
                        return [2 /*return*/, true];
                    case 4:
                        err_1 = _c.sent();
                        retryAction();
                        if (i === count) {
                            return [2 /*return*/, _Promise.reject(err_1)];
                        }
                        return [3 /*break*/, 5];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * then() 返回 Promise 实例，实例的状态和结果，
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
                _this.onFulfillCallbacks.push(function (val) {
                    setTimeout(function () {
                        try {
                            var x = onFulfill(val);
                            (0, utils_1.resolvePromise)(promise2, x, resolve, reject);
                        }
                        catch (err) {
                            reject(err);
                        }
                    }, 0);
                });
                _this.onRejectCallbacks.push(function (reason) {
                    setTimeout(function () {
                        try {
                            var x = onReject(reason);
                            (0, utils_1.resolvePromise)(promise2, x, resolve, reject);
                        }
                        catch (err) {
                            reject(err);
                        }
                    }, 0);
                });
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
            }
            if (_this.state === "Rejected" /* Rejected */) {
                setTimeout(function () {
                    try {
                        var x = onReject(_this.result);
                        (0, utils_1.resolvePromise)(promise2, x, resolve, reject);
                    }
                    catch (err) {
                        reject(err);
                    }
                }, 0);
            }
        });
        return promise2;
    };
    /**
     * @return Promise 实例
     * return Promise 状态由 onReject 决定，和 then 一样
     */
    _Promise.prototype["catch"] = function (onReject) {
        // 不用再判断非法值，因为 then 内部会做处理
        return this.then(undefined, onReject);
    };
    /**
     * todo: 坑
     * p.finally(......) 返回的是 p
     * 如果这样那就有问题了，正确的 Promise，是会等待 finally callback 的promise
     * 只不过不使用 finally callback return 的值
     *
     * Promise
     *  .reject(55555)
     *  .finally(() => {
     *     return new Promise(r => {
     *        setTimeout(r, 4000)
     *     })
     *   })
     *  .catch(reason => console.log('catch --', reason))  // 输出 5555
     */
    _Promise.prototype.finallyError = function (callback) {
        this.then(function () {
            callback();
        }, function () {
            callback();
        });
        return this;
    };
    // p.finally(......) 返回的是 p
    // this -> p
    _Promise.prototype["finally"] = function (callback) {
        return this.then(function (val) {
            return _Promise.resolve(callback()).then(function () { return val; });
        }, function (reason) {
            return _Promise.resolve(callback()).then(function () {
                throw reason;
            });
        });
    };
    return _Promise;
}());
exports._Promise = _Promise;
/**================================== race 超时应用 **/
function withAbort(userPromise) {
    var abort;
    var innerPromise = new Promise(function (resolve, reject) {
        abort = reject;
    });
    var res = Promise.race([innerPromise, userPromise]);
    res.abort = abort;
    return res;
}
