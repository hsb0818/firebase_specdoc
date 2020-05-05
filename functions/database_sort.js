function createSuitableArrayWithFillZero(arr, size) {
  if (!arr || !arr instanceof Array) {
    return new Array(size).fill(0);
  } else if (arr.length < size) {
    return arr.concat(new Array(size - arr.length).fill(0));
  }

  return arr.slice(0, size);
}

function dateArrayToInteger(dates) {
  return dates.reduce((acc, date, i) => {
    date = parseInt(date);
    factor = Math.pow(100, dates.length - 1 - i);

    return acc + date * factor;
  }, 0);
}

const regex = /(\d{4})|(\d{2})/g;

(async () => {
  const fs = require('fs').promises;
  const root = JSON.parse(await fs.readFile('./functions/src/teraphonia-export.json', 'utf8'));
  console.log(root);
  root.docs.sort((a, b) => {
    a = dateArrayToInteger(createSuitableArrayWithFillZero(a.title.match(regex), 2));
    b = dateArrayToInteger(createSuitableArrayWithFillZero(b.title.match(regex), 2));

    return b - a;
  });

  await fs.writeFile('./functions/out/sorted-teraphonia-export.json', JSON.stringify(root));
})();
