import React from 'react';
import {HashRouter, Route} from 'react-router-dom';
import Main from './windows/Main';
import {JobInfo} from './windows/JobInfo';
import {JobAdd} from "./windows/JobAdd";
import {CapacityChange, CapacityChangePath} from './windows/CapacityChange';
import {DayCapacityEdit, DayCapacityEditPath} from './windows/DayCapacityEdit';
import {CreatePhase, CreatePhasePath} from './windows/CreatePhase';
import {GenerateDocument, GenerateDocumentPath} from "./windows/GenerateDocument";
import {MessageBox, MessageBoxPath} from './windows/MessageBox';

function App() {
    return <HashRouter>
            <Route exact path="/" component={Main}/>
            <Route path="/job-info" component={JobInfo}/>
            <Route path="/job-add" component={JobAdd}/>
            <Route path={CapacityChangePath} component={CapacityChange}/>
            <Route path={DayCapacityEditPath} component={DayCapacityEdit}/>
            <Route path={CreatePhasePath} component={CreatePhase}/>
            <Route path={GenerateDocumentPath} component={GenerateDocument}/>
            <Route path={MessageBoxPath} component={MessageBox}/>
        </HashRouter>;
}

export default App;