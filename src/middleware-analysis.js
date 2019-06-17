

//这里是三个中间件为例子
composeReturn = 
function(...args){
	return  (function(...args){
						return  (function(next){
											return /* function(action){
												      *   console.log('中间件1')
															* 	return setTimeout(function(){
															* 		next(action)
															* 	},2000)
											        * }
											        */
											        function(action){
																console.log('中间件1')
																return setTimeout(function(){
																	(function(action){
																		console.log('中间件2')
																		return  (
																				      function (action) {
																							  console.log('中间件3'); 
																							  return dispatch(action);
																						  }
																					  )(action)
																	})(action)
																},2000)
											        }
						        })(
						            /**(function(next) {
													*	  return function (action) {
													*		  console.log('中间件2'); //这里是异步中间件
													*		  return next(action);
													*	  }
													*  })(...args)
												*/
												function(action){
													console.log('中间件2')
													return  (
															      function (action) {
																		  console.log('中间件3'); 
																		  return dispatch(action);
																	  }
																  )(action)
												}
						          )
					})(
					    /**
					     * (function(next) {
							 * 	return function (action) {
							 * 		console.log('中间件3'); 
							 * 		return next(action);
							 * 	}
							 * })(...args)//最外层args是dispatch
							*/
							function (action) {
								console.log('中间件3'); 
								return dispatch(action);
							}
						)
}
composeReturn(store.dispatch)