import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from 'firebase';

function Post({ postId, user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        }); //return snapshot of comment on that post whenever any changes occur on any postId
    }

    return () => {
      unsubscribe();
    };
  }, [postId]); //fire this if any changes occur inside postId

  const postComment = (e) => {
    e.preventDefault();

    db.collection('posts').doc(postId).collection('comments').add({
      text: comment,
      username: user.displayName, //the user who signed in and put the comment
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment('');
  };

  return (
    <div className='post'>
      {/*Header --> Avatar + username */}
      <div className='post__header'>
        <Avatar
          className='post__avatar'
          alt='AshishAman'
          src='/static/images/avatar/1.jpg'
        />
        {/* Getting avatar starting with alt name */}
        <h3>{username}</h3>
      </div>

      {/* image */}
      <img className='post__image' src={imageUrl} alt='' />
      {/* username + caption */}
      <h4 className='post__text'>
        <strong>
          {' '}
          {username}{' '}
          <span style={{ fontSize: '16px', fontWeight: 'bolder' }}>
            &#10140;{' '}
          </span>{' '}
        </strong>{' '}
        {caption}
      </h4>

      {/* comments */}
      {/* mapping through each comment and displaying */}
      <div className='post__comments'>
        {comments.map((comment) => (
          <p>
            <strong>{comment.username} : </strong>
            {comment.text}
          </p>
        ))}
      </div>

      {/* remove the comment box if logged out */}
      {user && (
        <form className='post__commentBox'>
          <input
            className='post__input'
            type='text'
            placeholder='Write a Comment...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className='post__button'
            type='submit'
            disabled={!comment}
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
