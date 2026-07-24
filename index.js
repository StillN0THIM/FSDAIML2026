// console.log("Hello using JS")

// var a = 6
// console.log("a="+a)

// let a = 5
// if (a<30){
//     let a = 100
//     console.log("a inside the block="+a)
// }
// console.log("a outside the block=" + a)

// const sum = function(a,b){
//     return a+b
// }
// const data = sum(20,20)
// console.log("sum="+data)

// const msg=(mymsg)=>{
//     console.log("hi"+mymsg)
// }
// msg("welcome to fsd")

// const sqrt = (n)=>Math.sqrt(n)
// console.log(sqrt(25))

// (()=>{console.log("hi")})();
// function sum(a, b) {
//     return a + b;
// }

// function sumWithMsg(clbk, msg) {
//     const result = clbk(5, 10);
//     console.log(msg + ": " + result);
// }

// sumWithMsg(sum, "The sum is");

function login(msg,error){
    if(error){
        console.log("error :"+error0)
    }
    else{
        console.log("Welcome"+msg)
    }
}

function loginVerification(username,password,clbk){
    if(username=="hi40"&& password=="12345678"){
        clbk("success",null);
    }else{
        clbk(null,"username or passward is incorrect")
    }
}