import React, { Component } from 'react';
import { render } from 'react-dom';
// Import routing components
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import Main from './common/main.component.jsx'
import Home from './common/home.component.jsx'
import About from './common/about.component.jsx'
import ProcessDetails from './car/processDetail.component.jsx'

render(
    <Router history={browserHistory}>
        <Route component={Main}>
            <Route path="/" component={Home}/>
            <Route path="/cars" component={ProcessDetails}/>
            {/* Parameter route*/}
            <Route path="/about" component={About}/>
        </Route>
    </Router>,
    document.getElementById('container')
);
