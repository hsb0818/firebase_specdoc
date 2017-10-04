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

  const subMain = $('#subMain');
  let idx = 0;
  $('#addItem').click(() => {
    const div = $('<div></div>');
    div.append('<input id="itemTitle' + idx.toString() + '" type="text"></input>');
    div.append('<textarea id="itemContents' + idx.toString() + '" style="resize:none;"></textarea>');
    subMain.append(div);
    idx++;
  });

  $('#btnNew').click(() => {
    console.log(pageNum);
    window.location.replace('/writing?pageNum=' + (pageNum + 1).toString());
  });

  $('#btnSave').click(() => {
    const subTitle = $('#subTitle').val();
    const items = [];
    for (let i=0; i<idx; i++) {
      const title = $('#itemTitle' + i.toString()).val();
      const contents = $('#itemContents' + i.toString()).val();

      items.push({
        title: title,
        contents: contents
      });
    }

    const rootRef = firebase.database().ref();
    if (pageNum === 0) {
      const mainTitle = $('#mainTitle').val();
      const mainContents = $('#mainContents').val();

      const rootData = {
        category: 'Tech',
        title: mainTitle,
        contents: mainContents,
        items: [{
          title: subTitle,
          items: items
        }]
      };

      rootRef.child('docs').once('value', (snap) => {
        rootRef.child('docs').child(snap.numChildren().toString()).set(rootData);
      });
    }
    else {
      const data = {
        title: subTitle,
        items: items
      };

      rootRef.child('docs').once('value', (snap) => {
        const num = snap.numChildren() - 1;
        const query = 'docs/' + num.toString() + '/items/' + pageNum.toString();
        console.log(query);
        rootRef.child(query).set(data);
      });
    }
  });
});
