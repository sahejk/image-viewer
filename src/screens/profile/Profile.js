import React, { Component } from 'react';
import './Profile.css';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import Header from '../../common/header/Header';
import { withStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import testData from '../../common/Test';
import Avatar from '@material-ui/core/Avatar';
import pencil from '../../assets/icon/pencil.png';
import profile_picture from '../../assets/icon/profile_pic.png';
import SvgIcon from '@material-ui/core/SvgIcon';

/* Defined classes styles for all relevant imported components */

const LIKES = 10;

const styles = theme => ({
     icon: {
        margin: '2px',
        fontSize: 32,
     },
    root: {
        flexGrow: 1,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper

    },
    bigAvatar: {
        marginTop: '20px',
        marginRight: '20px',
        width: '60px',
        height: '60px',
        float: 'center',
        display: 'flex'

    },
    gridList: {
        width: 'calc(100vw - 400px)',
    },

});

const customStylesImagePost = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        height: '70%',
        width: '60%',

    }
};

const customStylesEditFullName = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',

    }
};

const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
            {props.children}
        </Typography>
    )
}


function FavoriteBorderIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42
        2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22
        5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5
        5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
      </SvgIcon>
    );
  }

function FavoriteIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09
       3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </SvgIcon>
  );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

/*Class component Profile defined with constructor & it's states */

class Profile extends Component {

    constructor() {
        super();
        this.state = {
            favClick:false,
            modalIsOpen: false,
            selectedImage: null,
            fullnameRequired: "dispNone",
            fullname: "",
            ownerInfo: [],
            mediaInfo: [],
            imageDetail: {},
            UpdateFullname: "dispNone",
            ApiFullName: "dispBlock",
            full_name: ""
        }
    }

    /* Event  Handler Functions Definitions  */

    updateClickHandler = (e) => {

        this.state.fullname === "" ? this.setState({ fullnameRequired: "dispBlock" }) : this.setState({ fullnameRequired: "dispNone" });

        if (this.state.fullname !== "") {
            this.setState({
                full_name: this.state.fullname,
                UpdateFullname: "dispBlock",
                ApiFullName: "dispNone",
                modalIsOpen: false,
                favClick:false,
            });
        }
    }

    inputFullnameChangeHandler = (e) => {
        this.setState({ fullname: e.target.value });

    }

    openEditModalHandler = () => {
        this.setState({
            modalIsOpen: true,
            fullnameRequired: "dispNone",
            fullname: "",

        });
    }

    closeEditModalHandler = () => {
        this.setState({ modalIsOpen: false,favClick:false });
    }

    openImageModalHandler = (imageId) => {
        this.setState({
            imagemodalIsOpen: true,
            selectedImage: imageId,
        });
    }

    closeImageModalHandler = () => {
        this.setState({
            imagemodalIsOpen: false,
            favClick: false,
        });
    }

    /*Code written to make two API calls as per the definitions provided in problem statement */

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
        xhr.open("GET", this.props.baseUrl + "?fields=account_type,id,media_count,username&access_token=IGQVJVRkxNdEJxZAldLYXBuRGhBQjd1Wk4wRzhwQ2hlRG1McVhUX0NWdllPY0Nrc1RNSVBjLU1nOXVkUHNuUThxanJWdFR3RnJUSFJFbkYzdFU1WUtLa2hLb0JQWlBDVzFydl83Y0l3");
        xhr.send(ownerData);

        // Get media info of owner after authenticated by accessToken
        let mediaData = null;
        let xhrMediaData = new XMLHttpRequest();

        xhrMediaData.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    mediaInfo: JSON.parse(this.responseText).data
                });
            }
        })
        xhrMediaData.open("GET", this.props.baseUrl + "media?fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=IGQVJVRkxNdEJxZAldLYXBuRGhBQjd1Wk4wRzhwQ2hlRG1McVhUX0NWdllPY0Nrc1RNSVBjLU1nOXVkUHNuUThxanJWdFR3RnJUSFJFbkYzdFU1WUtLa2hLb0JQWlBDVzFydl83Y0l3");
        xhrMediaData.send(mediaData);

        let currentState = this.state;
        currentState.imageDetail = this.state.mediaInfo.filter((img) => {
            return img.id === this.props.imageId
        });
        this.setState({ currentState });
    }

    render() {

        const { classes } = this.props;

        return (
            <div>
                <div>
                    <Header />
                </div>

                <div className="infoSection">
                    <div className="row">
                        <div className="column-left">
                        </div>

                        <div className="column-center">
                            <div className="row1">
                                <div className="col-left">
                                    {<Avatar src={profile_picture} className={classes.bigAvatar}/>}
                                </div>

                                <div className="col-center">
                                    <span><div className="row-one">{this.state.ownerInfo.username}</div></span>
                                    <span><div className="row-two">
                                        <div className="col-l">Posts : {testData[0].posts}</div>
                                        <div className="col-c">Follows : {testData[0].follows}</div>
                                        <div className="col-r">Followed By : {testData[0].followed_by}</div>
                                    </div></span>
                                    <div className="row-three">
                                        <span style={{marginRight:'12px'}}><div className={this.state.ApiFullName}>{this.state.ownerInfo.username}</div><div className={this.state.UpdateFullname}>{this.state.full_name}</div></span>
                                        <Button variant="fab" color="secondary" className="edit-icon-button"><img src={pencil} alt={"pencil-logo"} onClick={this.openEditModalHandler} /></Button>
                                    </div>
                                </div>

                                <div>
                                    <Modal
                                        ariaHideApp={false}
                                        isOpen={this.state.modalIsOpen}
                                        onRequestClose={this.closeEditModalHandler}
                                        style={customStylesEditFullName}
                                    >
                                        <Tabs className="tabs" value={this.state.value} >
                                            <Tab label="Edit" />

                                        </Tabs>
                                        <TabContainer>
                                            <FormControl required>
                                                <InputLabel htmlFor="fullname">Full Name</InputLabel>
                                                <Input id="fullname" type="text" fullname={this.state.fullname} onChange={this.inputFullnameChangeHandler} />
                                                <FormHelperText className={this.state.fullnameRequired}>
                                                    <span className="red">required</span>
                                                </FormHelperText>
                                            </FormControl>
                                            <br /><br />

                                            <Button variant="contained" color="primary" onClick={this.updateClickHandler}>UPDATE</Button>
                                        </TabContainer>
                                    </Modal>
                                </div>

                                <div className="col-right">
                                </div>
                            </div>
                        </div>
                        <div className="column-right">
                        </div>

                    </div>

                </div>
                <br />
                <div className={classes.root}>
                    <GridList cellHeight={300} className={classes.gridList} cols={3}>
                        {this.state.mediaInfo.map(image => (
                            <GridListTile key={image.id} cols={image.cols || 1}>
                                <img src={image.media_url} alt={image.caption} onClick={() => this.openImageModalHandler(image.id)} />
                            </GridListTile>
                        ))}
                    </GridList>
                </div>
                <div>
                    <Modal
                        ariaHideApp={false}
                        isOpen={this.state.imagemodalIsOpen}
                        onRequestClose={this.closeImageModalHandler}
                        style={customStylesImagePost}
                    >

                        <div className="row-card">

                            <div className="column-card-left" >
                                <img src={this.state.selectedImage !=null ? this.state.mediaInfo.find(img => img.id === this.state.selectedImage).media_url : '' } style={{width: '96%'}} alt={"uploadedpic1"} />

                            </div>

                            <div className="column-card-right" >
                                <div className="row-card-up">
                                    <div style={{display:'flex', flexDirection:'row',alignItems:'center'}}>
                                    {
                                        <Avatar className={classes.bigAvatar} src={profile_picture}/>
                                    }
                                    {this.state.selectedImage !=null ? this.state.mediaInfo.find(img => img.id === this.state.selectedImage).username : '' }
                                    </div>
                                    <hr />

                                    <Typography variant="h6">{this.state.selectedImage !=null ? this.state.mediaInfo.find(img => img.id === this.state.selectedImage).caption : '' }</Typography>
                                    <Typography variant="caption"><div className="hash-tags">#images #description</div></Typography>
                                </div>
                                <div className="row-card-down">
                                    <div style={{display: 'flex',flexDirection:'row',alignItems:'cemter',textAlign:'center'}}>
                                    <span onClick={(event)=>this.setState({favClick: !this.state.favClick})}>
                                    {this.state.favClick === true?<FavoriteIcon className={classes.icon}/>: <FavoriteBorderIcon className={classes.icon}/>}
                                    </span>
                                    <span style={{marginLeft:'8px',marginTop:'12px'}}>{this.state.favClick === true ? (LIKES+ 1): LIKES} likes</span>
                                    </div>
                                    <div>
                                    <FormControl >
                                        <InputLabel htmlFor="imagecomment">Add a Comment</InputLabel>
                                        <Input id="imagecomment" type="text" onChange={this.imageCommentChangeHandler} />
                                    </FormControl>
                                    <Button variant="contained" color="primary" onClick={this.addCommentOnClickHandler}>ADD</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>

                </div>


            </div>

        )
    }
}


export default withStyles(styles)(Profile);
