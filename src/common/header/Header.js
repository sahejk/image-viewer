import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import './Header.css';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Profile from '../../screens/profile/Profile';
import { Link } from 'react-router-dom';
import profile_picture from '../../assets/icon/profile_pic.png';


const styles = theme => ({
    appHeader: {
        backgroundColor: '#263238',
    },
    grow: {
        flexGrow: 1,
    },
    title: {
        color: 'initial',
    },
    bigAvatar: {
        margin: 10,
        width: 60,
        height: 60,
    },
    search: {
        position: 'relative',
        borderRadius: '4px',
        backgroundColor: '#c0c0c0',
        marginLeft: '70%',
        width: '300px',
        verticalAlign: 'center',
    },
    searchIcon: {
        height: '100%',
        color: 'black',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },

});

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));
const WhiteTextTypography = withStyles({
  root: {
    color: "#FFFFFF"
  }
})(Typography);

class Header extends Component {

    constructor() {
        super();
        this.state = {
            menuIsOpen: false,
            ownerInfo: [],
            anchorElement: null,
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true
        }
        this.baseUrl = "https://graph.instagram.com/me/?fields=account_type,id,media_count,username&access_token=IGQVJVRkxNdEJxZAldLYXBuRGhBQjd1Wk4wRzhwQ2hlRG1McVhUX0NWdllPY0Nrc1RNSVBjLU1nOXVkUHNuUThxanJWdFR3RnJUSFJFbkYzdFU1WUtLa2hLb0JQWlBDVzFydl83Y0l3";
    }

    profilePageLinkHandler = () => {
        ReactDOM.render(<Profile />, document.getElementById('root'));
    }

    logoutHandler = () => {
        sessionStorage.removeItem("access-token");
        this.setState({
            loggedIn: false
        });
    }

    openMenuHandler = (event) => {
        this.setState({
            anchorElement: event.currentTarget,
            menuIsOpen: true,
        });

    }

    closeMenuHandler = () => {
        this.setState({
            menuIsOpen: false
        });
    }

    //Accessing data from backend API 1
    componentWillMount() {

        // Get owner info after authenticating the  accessToken generated
        let ownerData = null;
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    ownerInfo: JSON.parse(this.responseText)

                });
            }
        })
        xhr.open("GET", this.baseUrl);
        xhr.send(ownerData);
    }

    render() {

        const { classes } = this.props;

        return (
            <div className={classes.grow} styles={{overflow:'auto',display:'flex'}}>
                <AppBar className={classes.appHeader} position="static">
                    <Toolbar>
                        <div className={classes.appHeader}>
                            <WhiteTextTypography variant="h6" noWrap>Image Viewer</WhiteTextTypography>
                        </div>
                        {this.props.showSearchBox && <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="        Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                            />
                        </div>
                        }
                        {this.state.loggedIn && <Avatar alt={"logo"}  className="avatar" src={profile_picture} onClick={this.openMenuHandler}/>}
                            <div styles={{top:'-54vh',position:'absolute'}}>
                                    <StyledMenu
                                            id="customized-menu"
                                            anchorEl={this.state.anchorElement}
                                            keepMounted
                                            open={this.state.menuIsOpen}
                                            onClose={this.closeMenuHandler}
                                        >
                                    <MenuItem ><Link to='/profile'>My Account </Link></MenuItem><hr />
                                    <MenuItem onClick={this.logoutHandler}><Link to='/'>Logout</Link></MenuItem>
                            </StyledMenu>
                            </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles)(Header);
