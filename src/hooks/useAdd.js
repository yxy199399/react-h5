import useAccmul from './useAccmul';


// 加法进度处理
const useAdd = (arg1,arg2) => {
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    // console.log(m);
    // console.log((useAccmul(arg1, m) + useAccmul(arg2, m)) / m);
    return (useAccmul(arg1, m) + useAccmul(arg2, m)) / m
};

export default useAdd