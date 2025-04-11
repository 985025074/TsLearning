function changeNum(num) {
    num++;
}
let arr1 = [0];
changeNum(...arr1);
console.log(arr1[0]);
