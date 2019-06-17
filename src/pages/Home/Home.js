import React, { Component, PropTypes } from 'react';
import  { Header }  from '@components'
import './Home.less'
class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="test">

        <div className="pic_box">
          <img src={require('./images/middleware.png')} alt=""/>
        </div>
      </div>
    );
  }
}

export default Home;

