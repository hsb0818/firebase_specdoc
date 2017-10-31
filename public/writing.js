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
  const categoryList = $('#categoryList');
  const imgList = {};
  const imgItemStack = [];

  rootRef.child('category').once('value').then((snap) => {
    const categories = snap.val();

    for (const category of categories) {
      const option = $('<option></option>');
      option.attr('value', category);
      option.text(category);

      categoryList.append(option);
    }
  });

  const subMain = $('#subMain');
  let idx = 0;

  // if not writing
  if (main >= 0) {
    const pageRef = rootRef.child('docs/' + main.toString());
    pageRef.once('value').then((snap) => {
      const pages = snap.val();
      if (sub === 0) {
        $('#mainTitle').val(pages.title);
        $('#mainContents').val(pages.contents);
      }

      const subTitle = pages.items[sub].title;
      $('#subTitle').val();

      const items = pages.items[sub].items;
      for (const i in items) {
        if (items[i].title.length === 0) {
          AddContents(subMain, items[i].contents);
        }
        else {
          AddItem(subMain, items[i].title, items[i].contents);
        }
      }
    });
  }

  $('#addItem').click(() => {
    AddItem(subMain);
  });

  $('#addContents').click(() => {
    AddContents(subMain);
  });

  $('#removeItem').click(() => {
    const delItem = $('#item' + (idx - 1).toString());
    delItem.remove();

    idx--;
    console.log(idx);
  });

  $('#removeImg').click(() => {
    const curIdx = (idx - 1);
    const lastFile = imgList[curIdx].pop();

    if (lastFile !== undefined) {
      const item = imgItemStack.pop();
      if (item !== undefined)
        item.remove();

      storageRef.child('temp/' + lastFile.name).delete();
    }
  });

  $('#addImg').click(() => {
    $('#uploadImg').trigger('click');
  });

  $('#uploadImg').change((e) => {
    let file = e.target.files[0];
    const strRef = firebase.storage().ref('temp/' + file.name);
    let task = strRef.put(file);

    const uploaderParent = $('#uploaderParent');
    const uploader = $('#uploader');

    uploaderParent.removeClass('hide');

    task.on('state_changed',
      function progress(snap) {
        let per = (snap.bytesTransferred / snap.totalBytes) * 100;
        uploader.attr('aria-valuenow', per.toString());
        uploader.css('width', per.toString() + '%');
        uploader.text(per.toString());
      },
      function error(err) {
        console.log(err);
      },
      function complete() {
        setTimeout(() => {
          const index = idx - 1;
          if (imgList.hasOwnProperty(index) === false) {
            imgList[index] = [];
          }
          imgList[index].push(file);

          uploaderParent.addClass('hide');
          console.log('upload complete');

          const imgItem = $('<img>');
          imgItem.addClass('img-center');

          const img = storageRef.child('temp/' + file.name);
          img.getDownloadURL().then((url) => {
            imgItem.attr('src', url);
          });

          const div = $('<div class="img-center-wraper"></div>');
          div.append(imgItem);
          subMain.append(div);
          imgItemStack.push(div);
        }, 1000);
      }
    );
  });

  $('#formdataMain').attr('value', main);
  $('#formdataSub').attr('value', sub + 1);
  $('#btnSave').click(() => {
    const subTitle = $('#subTitle').val();
    const items = [];
    for (let i=0; i<idx; i++) {
      const title = $('#itemTitle' + i.toString()).val();
      const contents = $('#itemContents' + i.toString()).val();
      const imgItems = imgList.hasOwnProperty(i) ? imgList[i] : null;
      let imgs = [];

      if (imgItems !== null) {
        for (const file of imgItems) {
          imgs.push(file.name);
        }
      }

      items.push({
        title: title,
        contents: contents,
        imgs: imgs
      });
    }

    if (sub === 0) {
      const mainTitle = $('#mainTitle').val();
      const mainContents = $('#mainContents').val();

      const rootData = {
        category: categoryList.val(),
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
        const query = 'docs/' + num.toString() + '/items/' + sub.toString();
        console.log(query);
        rootRef.child(query).set(data);
      });
    }

    let maxImgCount = 0;
    for (const key in imgList) {
      maxImgCount += imgList[key].length;
    }

    const saveParent = $('#saveParent');
    const saver = $('#saver');
    let imgCount = 0;
    const completeFunc = () => {
      imgCount++;
      if (imgCount === maxImgCount) {
        for (const key in imgList) {
          for (const file of imgList[key]) {
            storageRef.child('temp/' + file.name).delete();
          }
        }

        saveParent.addClass('hide');
      }

      const per = (imgCount / maxImgCount) * 100;
      saver.attr('aria-valuenow', per.toString());
      saver.css('width', per.toString() + '%');
      saver.text(per.toString());
    };

    saveParent.removeClass('hide');
    for (const key in imgList) {
      for (const file of imgList[key]) {
        const strRef = firebase.storage().ref(subTitle + '/' + file.name);
        const task = strRef.put(file);

        task.on('state_changed', null, null, completeFunc);
      }
    }
    console.log('save completed!!');

    setTimeout(() => {
      alert('save completed!');
    }, 1000);
  });

  function AddItem(root, title, contents) {
    const div = $('<div></div>');
    div.attr('id', 'item' + idx.toString());

    div.append('<label>Item Title</label>');
    div.append('<input id="itemTitle' + idx.toString() + '" type="text" class="form-control" value=' + title + '></input>');
    div.append('<label>Item Contents</label>');
    div.append('<textarea id="itemContents' + idx.toString() + '" style="resize:none;" class="form-control" rows="5">' + contents + '</textarea>');

    root.append(div);
    idx++;
  }

  function AddContents(root, contents) {
    const div = $('<div></div>');
    div.append('<label class="hide">Item Title</label>');
    div.append('<input id="itemTitle' + idx.toString() + '" type="text" class="hide"></input>');
    div.append('<label>Item Contents</label>');
    div.append('<textarea id="itemContents' + idx.toString() + '" style="resize:none;" class="form-control" rows="5">' + contents + '</textarea>');

    root.append(div);
    idx++;
  }

  function ImageSet(root, url) {
    const imgItem = $('<img>');
    imgItem.addClass('img-center');
    imgItem.attr('src', url);

    const div = $('<div class="img-center-wraper"></div>');
    div.append(imgItem);
    root.append(div);
  }
});
