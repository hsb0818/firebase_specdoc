$(document).ready(function() {
  const firebaseConfig = {
    apiKey: "AIzaSyCsqZVYemoQGrQlK_mm6C6Cu9CrlYfSDjM",
    authDomain: "teraphonia.firebaseapp.com",
    databaseURL: "https://teraphonia.firebaseio.com",
    storageBucket: "gs://teraphonia.appspot.com"
  };

  firebase.initializeApp(firebaseConfig);
  console.log('firebase init completed!');

  auth = firebase.auth();
  const storageRef = firebase.storage().ref();
  const profile = storageRef.child('img/profile.jpg');

  profile.getDownloadURL().then(function(url) {
    $('.img-profile').attr('src', url);
  });

  const rootRef = firebase.database().ref();
  const subMain = $('#subMain');
  const categoryItems = {};

  rootRef.child('category').once('value').then((snap) => {
    const categories = snap.val();

    for (const category of categories) {
      const item = $('<div></div>');
      const title = $('<h2></h2>');
      title.text(category.charAt(0).toUpperCase() + category.slice(1));
      title.addClass('subtitle');

      item.append(title);

      const ul = $('<ul></ul>');
      ul.attr('id', category);

      categoryItems[category] = ul;

      item.append(ul);
      subMain.append(item);
    }

    rootRef.child('docs').once('value').then((snapDoc) => {
      const docs = snapDoc.val();
      for (const i in docs) {
        const root = $('<li></li>');
        const doc = $('<p></p>');
        const href = $('<a></a>');

        href.attr('href', '/document?' +
          'main=' + i.toString() + '&sub=0');
        href.append('<strong>' + docs[i].title + '</strong>');

        doc.append(href);
        doc.append(': ' + docs[i].contents);

        const ul = $('<ul></ul>');
        const items = docs[i].items;
        for (const j in items) {
          const item = $('<li></li>');
          const href = $('<a></a>');
          href.attr('href', '/document?' +
            'main=' + i.toString() + '&sub=' + j.toString());
          href.text(items[j].title);

          item.append(href);
          ul.append(item);
        }

        root.append(doc);
        root.append(ul);
        categoryItems[docs[i].category].append(root);
      }
    });
  });
});
