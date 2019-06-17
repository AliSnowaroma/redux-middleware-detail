const next = store.dispatch;

const dispatchImitation = function(action){
	console.log('我是中间件')
	next(action)
}

//原来的disptch(action)变为：
dispatchImitation(action)

//多个中间件串行 得出如下写法
//每个中间件返回一个接收action为参数的函数，当作下一个中间件的next方法，最初的next是store.dispatch
const dispatchImitation1 = next => action => {
	console.log('中间件1')
	return next(action)
}
const dispatchImitation2 = next => action => {
	console.log('中间件2')
	return next(action)
}

dispatchImitation = dispatchImitation1(dispatchImitation2(dispatch))

//逻辑分析
//dispatchImitation2(dispatch)  会返回：

// function(action){
// 	return dispatch(action)
// }

// dispatchImitation1(
// 	function(action){
// 		return dispatch(action)
// 	}
// )

// //执行过后为：
// action => {
// 	return  (
// 			    function(action){
// 					return dispatch(action)
// 				}
// 			)(action)
// }
