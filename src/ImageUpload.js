import React, { useState } from 'react';
import './ImageUpload.css';
import { Button } from '@material-ui/core';
import { storage, db } from './firebase';
import firebase from 'firebase';

function Imageupload({ username }) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    // this func says get the 1st file u actually selected --> sometime u might select multile files
    if (e.target.files[0]) {
      setImage(e.target.files[0]); //set your image and state to that 1st file
    }
  };

  const handleUpload = (e) => {
    //   access the storgae in firebase --> get ref to images folder --> we are storing everything inside it --> image.name is basically the file name that we selected --> then put the image that u grabbed into that point
    //1---> this is uploading to firebase storage
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    // 2---> progress bar
    //uploadTask and listen to  --> state_changed -> on change give me a snapshot --> it might take time
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        //this is where we write progress function... --> as it changes as it get updated keep giving me snapshot of the progress
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        ); //this equation is gonna workout no. b/w 0 & 100 and gonna give you exact progress indicator --> based on how much info send across and how much is left
        setProgress(progress); //then we set the progress
      },
      (error) => {
        //Error function...
        console.log(error);
        alert(error.message);
      },
      () => {
        //complete function...
        // storage then goto images --> goto image name child -->and get me downloadURL
        // 3---> getting the downloadURL of the image from storage --> in that way we can use in the form of post submission
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // then get the url now we'll do stuff with the imageURl
            // --> here is we post image inside DB
            db.collection('posts').add({
              // storing timestamp --> as we want to sort the post on basis of time --> recent one on the top
              // so basically it go and get the exact server timestamp --> time of firebase server --> regardless of where u are in world this will give u one unified time
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });

            // once upload is done set it back
            setProgress(0);
            setCaption('');
            setImage(null);
          });
      }
    );
  };

  return (
    <div className='imageupload'>
      {/* i want to have */}

      {/* Caption input */}
      <input
        type='text'
        placeholder='Enter a caption...'
        onChange={(e) => setCaption(e.target.value)}
        value={caption}
      />

      {/* File Upload --> type is file --> this give all the stuff we need --> select file from the browser and all --> function that handle what happens whenu click a file */}
      <input type='file' onChange={handleChange} />

      {/* progress bar */}
      {/* progress --> html element --> max value is 100 */}
      <progress className='imageupload__progress' value={progress} max='100' />

      {/* Post button */}
      <Button className='imageupload__button' onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}

export default Imageupload;
