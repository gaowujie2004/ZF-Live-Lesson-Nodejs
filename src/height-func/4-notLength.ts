// flatFunc + valueOf(toString)
export {};

type Func = {
  (...args: any[]): Function;
  gaowujie: () => void;
};

function cacheParamsFunc<T extends Function>(userFn: T) {
  let cacheParams = [];

  const collectParamsFunc = (...params) => {
    cacheParams.push(...params);
    return collectParamsFunc;
  };
  collectParamsFunc.valueOf = () => {
    const res = userFn(...cacheParams);
    cacheParams = [];
    return res;
  };

  return collectParamsFunc;
}

function add(...params) {
  return params.reduce((v, temp) => v + temp);
}
const addCacheParamsFunc = cacheParamsFunc(add);
console.log('4-notLength', +addCacheParamsFunc(1, 2, 3, 4)(5, 6, 7, 8));
