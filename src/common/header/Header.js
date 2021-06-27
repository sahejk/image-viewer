import React,{Component} from 'react';
//import AppSearchBar from '../AppSearchBar';
import './Header.css'; 

/* Header component class is defined in this file.This file is COMMON for all the pages */

class Header extends Component {

    constructor() {
        super();
        this.state = {
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true
        }
    }

    render() {
        return (
            <div>
                <header className="app-header app-logo">
                  Image Viewer
                                        
                </header>
            </div>
        )
    }
}

export default Header;