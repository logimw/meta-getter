const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const getMetaTags = ($, tag) =>
  $(`meta[property='og:${tag}']`).attr("content") ||
  $(`meta[property='twitter:${tag}']`).attr("content") ||
  $(`meta[name='${tag}']`).attr("content") ||
  $(`${tag}`).text();

const options = page => {
  return {
    uri: `http://${page}`,
    headers: {
      "User-Agent": "Request-Promise"
    },
    json: true,
    resolveWithFullResponse: true,
    transform: function(body) {
      return cheerio.load(body);
    }
  };
};

const appendToCSV = websiteData => {
  fs.appendFileSync(
    "files/wynik.csv",
    `'${websiteData.www}';'${websiteData.metaTitle}';'${websiteData.metaDescrtiption}';'${websiteData.info}'\n`,
    err => {
      if (err) {
        console.log(
          `Nie udało się dodać treści do pliku. Powód: ${err.message}`
        );
        throw err;
      }
      console.log("Dodano treść.");
    }
  );
};

// const appendToCSV = websiteData => {
//   fs.appendFileSync("files/wynik.csv", websiteData => {
//     const header = ["WWW, Title, Description"];
//     const rows = websiteData.map(
//       data => `'${data.www}';'${data.metaTitle}';'${data.metaDescrtiption}'`
//     );
//     return header.concat(rows).join("\n");
//   });
// };

const createFile = () => {
  const writeStream = fs.createWriteStream("files/wynik.csv");
  writeStream.write(`WWW;title;description;info\n`);
};

const getFile = () => {
  fs.readdir(path.join(__dirname, "..", "files"), (err, files) => {
    if (err) {
      console.log(`Wystąpił błąd: ${err.message}.`);
      throw err;
    }
    files.forEach(file => {
      if (file == "wynik.csv") {
        return file;
      }
    });
  });
};

const timing = start => {
  let end = new Date().getTime();
  let time = end - start;
  console.log(`Czas pobierania: ${time / 1000} sekund`);
  return Math.round(time / 1000);
};

module.exports = {
  getMetaTags: getMetaTags,
  options: options,
  appendToCSV: appendToCSV,
  createFile: createFile,
  getFile: getFile,
  timing: timing
};
