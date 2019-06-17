import React from 'react'
import ReactDOM from 'react-dom'
import { Header } from './components'
import Home from './pages/Home'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import reducer from './reducer'
const app_container = document.getElementById('app');


//中间件1
const middleWare1 = function(){
    return (dispatch, getState) => next => action => {
		console.log('中间件1')
		//这里是异步中间件
		return setTimeout(() => {
			next(action)
		},1000)
        //return next(action)
    }
}

const middleWare2 = function(){
    return (dispatch, getState) => next => action => {
        console.log('中间件2')
        return next(action)
    }
}

const middleWare3 = function(){
    return (dispatch, getState) => next => action => {
        console.log('中间件3')
        return next(action)
    }
}


function compose(...funcs) {
	if (funcs.length === 0) {
		return arg => arg
	}

	if (funcs.length === 1) {
		return funcs[0]
	}

	//return funcs.reduce((a, b) => (...args) => a(b(...args)))
	return funcs.reduce(function(a,b,currentIndex){
		//console.log(a.toString(),currentIndex)
		return function(...args){
			//console.log('这里传入了参数',args.toString())
			return a(b(...args))
		}
	})

	/**
	 * 解析该函数 假设执行三次 ，参见middleware-analysis.js文件
	 */
}



function myApplyMiddleware(...middlewares){
	return (createStore) => (reducer, preloadedState, enhancer) => {
		var store = createStore(reducer, preloadedState, enhancer);
		var dispatch = store.dispatch;
		var chain = [];
	 
		var middlewareAPI = {
		  getState: store.getState,
		  dispatch: (action) => dispatch(action)
		};
		chain = middlewares.map(middleware => middleware(middlewareAPI));
		/**中间件数组  接收next 返回接收action为参数的函数
		 *  [
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
		 */
		//console.log(...chain)
		//console.log('合并之后的函数:',compose(...chain).toString())
		dispatch = compose(...chain)(store.dispatch);
	    //console.log(dispatch,'改造后的dispatch')
		return {...store, dispatch}
	  }
}

let store = createStore(
	reducer,
	myApplyMiddleware(
	   middleWare1(),middleWare2(),middleWare3()
	)
)

@connect(
	state => ({name:state.name})
)
class App extends React.Component{
  componentDidMount() {
	  // console.log(this.props)
  }
  test = () => {
	  //测试中间件运行顺序
	  this.props.dispatch({
		  type:'TEST',
		  data:'测试'
	  })
  }
  render(){
  	return (
  		<div>
  		   <Home></Home>
			 <button onClick = {this.test}>点击测试中间件运行顺序</button>
			 <div>{this.props.name}</div>
  		</div>
  	)
  }
}

class main extends React.Component {
	render() {
		return (
			ReactDOM.render(
				<Provider store = {store}>
					<App></App>
				</Provider>,
				app_container
			)
		);
	}
}

new main().render();
