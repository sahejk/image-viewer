import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Controller from '../src/common/Controller';
import 'typeface-roboto';

/*Routing to all the pages in Image Viewer app is done via Controller.js file.This file is COMMON for all the pages */

ReactDOM.render(<Controller/>, document.getElementById('root'));
