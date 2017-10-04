$(document).ready(function() {
  const firebaseConfig = {
    apiKey: "AIzaSyCsqZVYemoQGrQlK_mm6C6Cu9CrlYfSDjM",
    authDomain: "teraphonia.firebaseapp.com",
    databaseURL: "https://teraphonia.firebaseio.com",
    storageBucket: "gs://teraphonia.appspot.com"
  };

  firebase.initializeApp(firebaseConfig);

  const txtEmail = $('#txtEmail');
  const txtPassword = $('#txtPassword');
  const btnLogin = $('#btnLogin');
  const btnLogout = $('#btnLogout');

  const auth = firebase.auth();

  btnLogin.click(() => {
    const email = txtEmail.val();
    const pass = txtPassword.val();
    const promise = auth.signInWithEmailAndPassword(email, pass);

    promise.catch((e) => {
      console.log(e.message);
     });
  });

  btnLogout.click(() => {
    auth.signOut();
  });

  auth.onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      txtEmail.addClass('hide');
      txtPassword.addClass('hide');
      btnLogin.addClass('hide');
      btnLogout.removeClass('hide');

      $('#txtLogin').text('welcome ' + firebaseUser.email);
      console.log('logged in');
      console.log(firebaseUser);

      window.location.replace('/home');
    }
    else {
      txtEmail.removeClass('hide');
      txtPassword.removeClass('hide');
      btnLogin.removeClass('hide');
      btnLogout.addClass('hide');
      $('#txtLogin').text('need to login...');

      console.log('not logged in');
    }
  });
});
