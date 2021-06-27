import React, { Component } from 'react';
import './Home.css';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Header from '../../common/header/Header';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import profile_picture from '../../assets/icon/profile_pic.png';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';

const styles = theme => ({
    icon: {
        margin: '2px',
        fontSize: 32,
     },
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    card: {
        maxWidth: '100%',
        margin: '8px',
        shadow: '20px',
    },
    bigAvatar: {
        margin: 10,
        width: 60,
        height: 60,
    },
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
    gridListMain: {
        transform: 'translateZ(0)',
        cursor: 'pointer',

    },
});

const LIKES = 10;

/*Class component Home defined with constructor & it's states */

class Home extends Component {

    constructor() {
        super();
        this.state = {
            ownerInfo: [],
            mediaInfo: [],
            anchorEl:null,
            imagecomment:"",
            addComment:"dispComment",
            likesIdMap:[],
            commentsIdMap:[],
        }
    }

    /* Event  Handler Functions Definitions */

    imageCommentOnChangeChangeHandler = (e) => {
        this.setState({imagecomment: e.target.value});
    }

    addCommentOnClickHandler = (id, value) => {
        this.setState({addedComment :value, commentsIdMap:[...this.state.commentsIdMap.filter(map => map.id !== id),{id:id,comments:[...this.state.commentsIdMap.find(map => map.id === id).comments,value]}]});
        document.getElementById(`imagecomment_${id}`).value = null
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
                console.log(this.responseText);
                that.setState({
                    mediaInfo: JSON.parse(this.responseText).data,
                    likesIdMap: JSON.parse(this.responseText).data.map(image => ({id: image.id, count: LIKES, selected: false})),
                    commentsIdMap: JSON.parse(this.responseText).data.map(image => ({id: image.id, comments: []}))
                });
            }
        })
        xhrMediaData.open("GET", this.props.baseUrl + "media?fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=IGQVJVRkxNdEJxZAldLYXBuRGhBQjd1Wk4wRzhwQ2hlRG1McVhUX0NWdllPY0Nrc1RNSVBjLU1nOXVkUHNuUThxanJWdFR3RnJUSFJFbkYzdFU1WUtLa2hLb0JQWlBDVzFydl83Y0l3");
        xhrMediaData.send(mediaData);

    }

    /* Rendering JSX elements on the Login Page as per the design requirements */

    render() {

        const {classes} = this.props;

        return (
            <div>
                <Header showSearchBox={true}/>
                <div className= "cardStyle">
                    <br />
                    <GridList cellHeight={"auto"} className={classes.gridListMain} cols={2}>
                        {this.state.mediaInfo.map(image => (

                            <GridListTile key={"image" + image.id} cols={image.cols || 1}>
                                <Grid container className={classes.root} spacing={16}>
                                    <Grid item>
                                        <Card className={classes.card}>
                                            <CardHeader
                                                avatar={
                                                    <Avatar src={profile_picture} / >
                                                }
                                                title={image.username}
                                                subheader={new Date(image.timestamp).toUTCString()} />
                                            <CardContent>
                                                <img src={image.media_url} alt={image.caption} className="image-properties" />
                                                <hr />
                                                <div style={{display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                                                <div style={{height:'80%'}}>
                                                <Typography variant="h6">{image.caption}</Typography>
                                                <Typography><div className="hash-tags">#greatpeople #upgrad</div></Typography>
                                                <div className="likesFont">
                                                <span onClick={(event)=>this.setState({likesIdMap: [...this.state.likesIdMap.filter(map => map.id!== image.id), {id:image.id,selected:!this.state.likesIdMap.find(map => map.id === image.id).selected, count:(!this.state.likesIdMap.find(map => map.id === image.id).selected) ? LIKES + 1 : LIKES}]})}>
                                                {(this.state.likesIdMap.find(map => map.id === image.id).selected) ? <FavoriteIcon className={classes.icon} color="secondary"/>: <FavoriteBorderOutlinedIcon className={classes.icon} />}
                                                </span>
                                                <Typography variant="h5" >
                                                    {this.state.likesIdMap.find(map => map.id === image.id).count} Likes
                                                </Typography>
                                                </div>
                                                {this.state.commentsIdMap.find(map => map.id === image.id).comments.map(comment => <div style={{display:'flex', flexDirection:'row',alignItems:'center'}}>
                                                <Typography variant="h6">{image.username}</Typography>
                                                <Typography variant="subtitle1" style={{fontSize:'20px'}}>{`: ${comment}`}</Typography>
                                                </div>)}
                                                </div>
                                                <div style={{flexDirection:'row',display:'flex',marginTop:'50px'}}>
                                                <FormControl style={{width:'80%'}}>
                                                    <InputLabel htmlFor="imagecomment">Add a Comment</InputLabel>
                                                    <Input id={`imagecomment_${image.id}`} type="text" onChange={this.imageCommentOnChangeChangeHandler} />
                                                </FormControl>
                                                <Button style={{width:'18%',marginLeft:'16px',marginRight:'16px'}} id="addedcomment" variant="contained" color="primary" onClick={()=> this.addCommentOnClickHandler(image.id, document.getElementById(`imagecomment_${image.id}`).value)}>ADD</Button>
                                                </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </GridListTile>
                        ))};

                    </GridList>

                </div>

            </div>

        )
    }
}

export default withStyles(styles)(Home);
