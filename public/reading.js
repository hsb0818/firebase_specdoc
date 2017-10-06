$(document).ready(() => {
  const firebaseConfig = {
    apiKey: "AIzaSyCsqZVYemoQGrQlK_mm6C6Cu9CrlYfSDjM",
    authDomain: "teraphonia.firebaseapp.com",
    databaseURL: "https://teraphonia.firebaseio.com",
    storageBucket: "gs://teraphonia.appspot.com"
  };

  firebase.initializeApp(firebaseConfig);
  console.log('firebase init completed!');

  const auth = firebase.auth();
  const rootRef = firebase.database().ref();
  const pageRef = rootRef.child('docs/' + main.toString() + '/items/' + sub.toString());

  pageRef.once('value').then((snap) => {
    $('#subTitle').text(snap.val().title);
  });

  pageRef.child('items').once('value').then((snap) => {
    const subMain = $('#subMain');
    const items = snap.val();
    for (const item of items) {
      const title = $('<h2 id="subtitle"></h2>').text(item.title);
      const contents = $('<p></p>').text(item.contents);

      subMain.append(title);
      subMain.append(contents);
    }
  });
});
