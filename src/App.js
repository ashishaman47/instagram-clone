import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import { auth } from './firebase';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  // state --> is basically like a short term memory store
  //posts resembles an array of posts inside our app
  //useState() is a type of a hook which is short little own piece of code
  //we have provide the initial value to state
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // this is gonna listen for any single time any authentication happen --> it gives authUser
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user get logged in --> this code get fired
        console.log(authUser);
        setUser(authUser); //capture the logged in user
        // this is amazing as it survives refresh --> if after loggin u refersh it will go and check if he's still login because it usses cookie tracking and set the piece of state --> state by default is not persistent but this things keeps you logged in
      } else {
        //user gets logged out --> this code gets fired
        setUser(null);
      }
    });

    return () => {
      //perform some cleanup actions
      unsubscribe();
      //Imagine what happens --> say we logged in --> we update the username --> it's gonna refire the frontend code (useEffect) but before it does we are saying to detach the listner that you setup so that we don't have duplicates --> and then it will refire it
    };
  }, [user, username]); //so here 2 things (user, username) so anytime they change we need to fire this up

  //useEffect runs a piece of code based on specific condition
  useEffect(() => {
    //onSnapshot --> is very powerful lister what it does is every time when DB changes in the collection, it takes snapshot of updated document/new doc and this code fires off
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        //everytime a new post is added, this code fires
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
        //doc.data() will give back all the property inside document -->caption,username,imageUrl
      });
  }, []); //it will run every single time when post changes

  // const handleClose = () => {
  //   setOpen(false);
  // };

  const signUp = (e) => {
    e.preventDefault();

    //user signup in database with firebase --> cath and display error if occurs
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((err) => alert(err.message)); //firebase also provide backend validation

    setOpen(false);
  };

  const signIn = (e) => {
    e.preventDefault();

    //signin using authentication api of firebase
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));

    setOpenSignIn(false);
  };

  return (
    <div className='app'>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
            <center>
              <img
                className='app__headerImage'
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png'
                alt=''
              />
            </center>
            <Input
              placeholder='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
            <center>
              <img
                className='app__headerImage'
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png'
                alt=''
              />
            </center>

            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      {/* Header */}
      <div className='app__header'>
        <img
          className='app__headerImage'
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png'
          alt=''
        />
        {user ? (
          <div className='app__loginContainer1'>
            <Button onClick={() => auth.signOut()}>Logout</Button>
          </div>
        ) : (
          <div className='app__loginContainer'>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      {/* Ctrl+Space for auto import */}

      {/* Posts */}
      {/* passing username,caption,imageUrl as props */}
      {/* <center> */}
      <div className='app__posts'>
        <div className='app__postsLeft'>
          {/* looping through posts */}
          {posts.map(({ id, post }) => (
            <Post
              key={id} //now it will rerender just the post that is newly added not the entire list of page
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
          <center>
            <InstagramEmbed
              url='https://www.instagram.com/p/CD6ZQn1lGBi/'
              maxWidth={320}
              hideCaption={false}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />
          </center>
        </div>
      </div>
      {/* </center> */}

      {/* image upload */}
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <div className='msg'>
          <center>
            <h3>Sorry You Need To Login To Upload...</h3>
          </center>
        </div>
      )}

      {/* <Post
        username='ashishaman'
        caption='MSD'
        imageUrl='https://img.etimg.com/thumb/width-640,height-480,imgsize-147726,resizemode-1,msid-71004375/markets/stocks/news/this-much-awaited-ipo-is-at-the-mercy-of-dhoni-and-an-ed-probe.jpg'
      />
      <Post
        username='ashish'
        caption='LEGEND'
        imageUrl='https://c.ndtvimg.com/2020-05/s2ejdvf8_ms-dhoni-afp_625x300_11_May_20.jpg'
      />
      <Post
        username='aman'
        caption='Captain Cool'
        imageUrl='https://ss.thgim.com/cricket/article26701199.ece/alternates/FREE_380/MSDjpg'
      /> */}
    </div>
  );
}

export default App;
