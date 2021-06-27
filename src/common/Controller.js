import React, { Component } from 'react';
import Profile from '../screens/profile/Profile';
import Home from '../screens/home/Home';
import Login from '../screens/login/Login';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

class Controller extends Component {

    constructor() {
        super();
        this.baseUrl = "https://graph.instagram.com/me/";
    }

    render() {
        return (
            <div>
                <Router>
                    <Route exact path='/' render={(props) => <Login {...props}  baseUrl={this.baseUrl} />} />
                    <Route path='/home/' render={(props) => sessionStorage.getItem("access-token") != null ? (<Home {...props} baseUrl={this.baseUrl} />) : (<Redirect to='/' />)} />
                    <Route path='/profile/' render={(props) => sessionStorage.getItem("access-token") != null ? (<Profile {...props} baseUrl={this.baseUrl} />) : (<Redirect to='/' />)} />
                </Router>
            </div>
        );
    }
}

export default Controller;
