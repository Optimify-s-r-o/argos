import React from 'react';
import {HashRouter, Route} from 'react-router-dom';
import Main from './windows/Main';
import {JobInfo} from './windows/JobInfo';
import {JobAdd} from "./windows/JobAdd";

function App() {
    return <HashRouter>
            <Route exact path="/" component={Main}/>
            <Route path="/job-info" component={JobInfo}/>
            <Route path="/job-add" component={JobAdd}/>
        </HashRouter>;
}

export default App;