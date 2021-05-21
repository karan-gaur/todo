import React, { Component } from 'react';
import Login from './LoginComponent';
import Task from './TaskComponent';
import { Switch, Route, Redirect } from 'react-router-dom';


class Main extends Component {

    render() {
        return (
            <div>
                <Switch>
                    <Route path="/tasks" component={Task} />
                    <Route path="/login" component={Login} />
                    <Redirect to="/login" />
                </Switch>
            </div >

        );
    }

}

export default Main;