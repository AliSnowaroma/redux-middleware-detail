const middleWares = [
    function(next) {
        return function (action) {
                console.log('中间件1'); //这里是异步中间件
                return setTimeout(function () {
                next(action);
            }, 10000);
        }
    },
    function(next) {
        return function (action) {
            console.log('中间件2'); //这里是异步中间件
      
            return next(action);
        }
    },
    function(next) {
        return function (action) {
            console.log('中间件3'); //这里是异步中间件
      
            return next(action);
        }
    },
    function(next) {
        return function (action) {
            console.log('中间件4'); //这里是异步中间件
      
            return next(action);
        }
    }
]

middleWares.reduce(function(a,b){
    return b(a())
})

// function compose(...funcs) {
// 	if (funcs.length === 0) {
// 		return arg => arg
// 	}

// 	if (funcs.length === 1) {
// 		return funcs[0]
// 	}

// 	return funcs.reduce((a, b) => (...args) => a(b(...args)))
// 	// return funcs.reduce(function(a,b,currentIndex){
// 	// 	console.log(a.toString(),currentIndex)
// 	// 	return function(){
// 	// 		return a(b())
// 	// 	}
// 	// })
// }
