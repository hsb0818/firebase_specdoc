$(document).ready(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyCsqZVYemoQGrQlK_mm6C6Cu9CrlYfSDjM",
    authDomain: "teraphonia.firebaseapp.com",
    databaseURL: "https://teraphonia.firebaseio.com",
    storageBucket: "gs://teraphonia.appspot.com"
  };

  firebase.initializeApp(firebaseConfig);
  console.log('firebase init completed!');

  auth = firebase.auth();
  const rootRef = firebase.database().ref();
  const storageRef = firebase.storage().ref();
  const profile = storageRef.child('img/profile.jpg');

  profile.getDownloadURL().then(function (url) {
    $('.img-profile').attr('src', url);
  });

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
        const url = '/document?' + 'main=' + i.toString() + '&sub=0';

        href.attr('href', url);
        href.append('<strong>' + docs[i].title + '</strong>');

        doc.append(href);
        doc.append(': ' + docs[i].contents);

        const ul = $('<ul></ul>');
        const items = docs[i].items;
        for (const j in items) {
          const item = $('<li></li>');
          const itemsHref = $('<a></a>');

          itemsHref.attr('href', '/document?main=' + i.toString() + '&sub=' + j.toString());
          itemsHref.text(items[j].title);

          item.append(itemsHref);
          ul.append(item);
        }

        if (isAdmin) {
          const form = $('<form></form>');
          form.attr('action', '/document');
          form.attr('method', 'post');
          form.append('<input type="hidden" name="main" value="' + i.toString() + '">');
          form.append('<input type="hidden" name="sub" value="' + items.length.toString() + '">');
          form.append('<button>+</button>');
          form.insertBefore(href);

          const btnDel = $('<button>-</button>');
          btnDel.insertBefore(href);
          AddDeleteEvent(btnDel, i);
        }

        root.append(doc);
        root.append(ul);
        categoryItems[docs[i].category].append(root);
      }
    });
  });

  function AddDeleteEvent(jObj, delIdx) {
    jObj.click((e) => {
      if (confirm("you want deleting it?")) {
        const delRef = rootRef.child('docs/' + delIdx.toString());
        delRef.remove().then(() => {
          window.location.reload();
        });
      }
    });
  }
});
