$(document).ready(function() {
  const firebaseConfig = {
    apiKey: "AIzaSyCsqZVYemoQGrQlK_mm6C6Cu9CrlYfSDjM",
    authDomain: "teraphonia.firebaseapp.com",
    databaseURL: "https://teraphonia.firebaseio.com",
    storageBucket: "gs://teraphonia.appspot.com"
  };

  firebase.initializeApp(firebaseConfig);
  console.log('firebase init completed!');

  const auth = firebase.auth();

  const storageRef = firebase.storage().ref();
  const profile = storageRef.child('img/profile.jpg');

  profile.getDownloadURL().then(function(url) {
    $('.img-profile').attr('src', url);
  });

  const btnLogout = $('#btnLogout');
  btnLogout.click(() => {
    auth.signOut();
  });

  const btnWriting = $('#btnWriting');
  btnWriting.click(() => {
    window.location.replace('/writing?pageNum=0');
  });

  auth.onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
    }
    else {
      window.location.replace('/');
    }
  });
});
