import React, {Component} from 'react';
//import {Component} from 'react';把React省略的写法是错误的
import './Header.less'
export default class Header extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="header_box">
			    我是顶部导航11222
			</div>
		);
	}
}
