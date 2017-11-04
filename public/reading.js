$(document).ready(() => {
  const firebaseConfig = {
    apiKey: "AIzaSyCsqZVYemoQGrQlK_mm6C6Cu9CrlYfSDjM",
    authDomain: "teraphonia.firebaseapp.com",
    databaseURL: "https://teraphonia.firebaseio.com",
    storageBucket: "gs://teraphonia.appspot.com"
  };

  firebase.initializeApp(firebaseConfig);
//  console.log('firebase init completed!');

  const auth = firebase.auth();
  const rootRef = firebase.database().ref();
  const storageRef = firebase.storage().ref();
  const pageRef = rootRef.child('docs/' + main.toString() + '/items/');
  const subMain = $('#subMain');
  let pages = null;
  let subTitle = "";
  pageRef.once('value').then((snap) => {
    pages = snap.val();
    subTitle = pages[sub].title;
    $('#subTitle').text(subTitle);
  })
  .then(() => {
    const items = pages[sub].items;
    let nextUrl = '/document?main=' + main.toString() + '&sub=';

    $('div.nav').append('<a href=' + nextUrl + '0><< Series Start</a>');

    const pageList = $('#pageList');
    for (const i in pages) {
      const pageItem = $('<a></a>');
      pageItem.attr('href', nextUrl + i.toString());
      pageItem.append(pages[i].title);

      pageList.append(pageItem);
      if (i < pages.length -1)
        pageList.append(' · ');
    }

    let prevSub = -1;
    let nextSub = -1;
    if (sub > 0)
      prevSub = sub - 1;
    if (sub < pages.length -1)
      nextSub = sub + 1;

    const navPageDiv = $('.centered');
    function SetPageNav(subPage, isLeft) {
      if (subPage < 0 || subPage > pages.length -1)
        return false;

      const url = nextUrl + subPage.toString();

      let title = null;
      if (isLeft)
        title = '<strong><< ' + pages[subPage].title + '</strong>';
      else
        title = '<strong>' + pages[subPage].title + ' >></strong>';

      const navPage = $('<a></a>');
      navPage.attr('href', url);
      navPage.append(title);
      navPageDiv.append(navPage);

      return true;
    }

    if (SetPageNav(prevSub, true))
      navPageDiv.append(' · ');
    if (SetPageNav(nextSub, false) === false)
      navPageDiv.append('<a href=' + nextUrl + '0>Series Start</a>');

    function ImageSet(url) {
      function PopUpImage(url, ext) {
        const img = new Image();
        img.src = url;
        const winW = img.width * ext + 20;
        const winH = img.height * ext + 30;

        const newWin = $('<div></div>');
        newWin.append('<title>Original Image</title>');

        const imgItem = $('<img></img>');
        imgItem.attr('src', url);
        imgItem.attr('width', img.width * ext);
        imgItem.attr('height', img.height * ext);
        imgItem.attr('onclick', 'self.close();');

        newWin.append(imgItem);

        const OpenWindow = window.open('', '_blank', 'width=' + winW + ', height=' +
          winH + ', menubars=no, scrollbars=auto');
        OpenWindow.document.write($('<div>').append(newWin.clone()).html());
      }

      const imgItem = $('<img>');
      imgItem.addClass('img-center');
      imgItem.attr('src', url);
      imgItem.click((e) => {
        PopUpImage(url, 1.5);
      });

      const div = $('<div class="img-center-wraper"></div>');
      div.append(imgItem);
      subMain.append(div);
    }

    function Loader(item) {
      if (item === null)
        return;

      const title = $('<h2 class="subtitle"></h2>').text(item.title);
      const contents = $('<p>' + item.contents.replace(/\n/gi, "<br>") +'</p>');
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

    Loader(items.shift());
  });
});
