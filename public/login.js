$(document).ready(function() {
  const firebaseConfig = {
    apiKey: "AIzaSyCsqZVYemoQGrQlK_mm6C6Cu9CrlYfSDjM",
    authDomain: "teraphonia.firebaseapp.com",
    databaseURL: "https://teraphonia.firebaseio.com",
    storageBucket: "gs://teraphonia.appspot.com"
  };

  firebase.initializeApp(firebaseConfig);
  console.log(firebase);

  const txtEmail = $('#txtEmail');
  const txtPassword = $('#txtPassword');
  const btnLogin = $('#btnLogin');
  const btnLogout = $('#btnLogout');

  const auth = firebase.auth();

  btnLogin.click(() => {
    const email = txtEmail.val();
    const pass = txtPassword.val();
    let promise = auth.signInWithEmailAndPassword(email, pass);

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
/*
  // https://stackoverflow.com/questions/10230341/http-cookies-and-ajax-requests-over-https
   xhrFields: {
     withCredentials: true
   }
*/
      $.ajaxSetup({
          crossDomain: true,
          xhrFields: {
              withCredentials: true
          },
      });

      auth.currentUser.getIdToken(true).then((idToken) => {
        $.ajax({
          url: 'login',
          data: {
            idToken: idToken
          },
          type: 'POST',
          success: (data, status) => {
            if (data !== null) {
              if (window.confirm('login successed : ' + data)) {
                window.location.replace('/');
              }
            }
            else {
              alert('failed to login...');
            }
          }
        });
      });
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
