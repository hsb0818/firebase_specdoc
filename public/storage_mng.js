$(document).ready(() => {
  const firebaseConfig = {
    apiKey: "AIzaSyCsqZVYemoQGrQlK_mm6C6Cu9CrlYfSDjM",
    authDomain: "teraphonia.firebaseapp.com",
    databaseURL: "https://teraphonia.firebaseio.com",
    storageBucket: "gs://teraphonia.appspot.com"
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const rootRef = firebase.database().ref();
  const storageRef = firebase.storage().ref();
  const pageRef = rootRef.child('docs/');
  let docs = null;

  pageRef.once('value').then((snap) => {
    docs = snap.val();
  })
  .then(() => {
    let mainTitle = null;
    let subTitle = null;

    const promises = [];
    const subTitles = {};
    const doc = docs[main];
    mainTitle = doc.title;

    for (const j in doc.items) {
      const page = doc.items[j];
      for (const k in page.items) {
        const item = page.items[k];
        for (const idx in item.imgs) {
          console.log(page.title + '/' + item.imgs[idx]);
          const img = storageRef.child(page.title + '/' + item.imgs[idx]);
          subTitles[item.imgs[idx]] = page.title;
          promises.push(img.getMetadata());
        }
      }
    }

    Promise.all(promises).then((values) => {
      for (const metaData of values) {
        ReqBlob(metaData, mainTitle, subTitles[metaData.name]);
      }
    });
  });
});

function ReqBlob(metaData, mainTitle, subTitle) {
  // `url` is the download URL for 'images/stars.jpg'
  // This can be downloaded directly:
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function(event) {
    const blob = xhr.response;
    console.log(mainTitle + '/' + subTitle + '/' + metaData.name);

    firebase.storage().ref(mainTitle + '/' + subTitle + '/' + metaData.name).put(blob);
  };

  xhr.open('GET', metaData.downloadURLs);
  xhr.send();
}

function blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

function SaveToDisk(fileURL, fileName) {
  if (!(window.ActiveXObject || "ActiveXObject" in window)) {
      var save = document.createElement('a');
      save.href = fileURL;
      save.target = '_blank';
      save.download = fileName || fileURL;
      var evt = document.createEvent('MouseEvents');
      evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0,
          false, false, false, false, 0, null);
      save.dispatchEvent(evt);
      (window.URL || window.webkitURL).revokeObjectURL(save.href);
  }
}
