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
  const storageRef = firebase.storage().ref();
  const pageRef = rootRef.child('docs/' + main.toString() + '/items/' + sub.toString());
  const subMain = $('#subMain');
  let subTitle = "";

  pageRef.once('value').then((snap) => {
    subTitle = snap.val().title;
    $('#subTitle').text(subTitle);
  })
  .then(() => {
    pageRef.child('items').once('value').then((snap) => {
      function ImageSet(url) {
        const imgItem = $('<img>');
        imgItem.addClass('img-center');
        imgItem.attr('src', url);

        const div = $('<div class="img-center-wraper"></div>');
        div.append(imgItem);
        subMain.append(div);
      }

      const items = snap.val();
      function Loader(item) {
        if (item === null)
          return;

        const title = $('<h2 class="subtitle"></h2>').text(item.title);
        const contents = $('<p></p>').text(item.contents);
        const imgs = item.hasOwnProperty('imgs') ? item.imgs : null;

        if (item.title.length > 0) {
          subMain.append(title);
        }
        subMain.append(contents);

        if (imgs !== null) {
          const promises = [];
          for (const imgTitle of imgs) {
            const img = storageRef.child(subTitle + '/' + imgTitle);
            promises.push(img.getDownloadURL());
          }

          Promise.all(promises).then((values) => {
            for (const url of values) {
              ImageSet(url);
            }

            if (items.length > 0) {
              Loader(items.shift());
            }
          });
        }
        else {
          if (items.length > 0) {
            Loader(items.shift());
          }
        }
      }

      console.log('items: ' + items.length.toString());
      Loader(items.shift());
    });
  });
});
