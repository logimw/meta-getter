const rp = require("request-promise");
const functions = require("./functions/modules");
const mail = require("./functions/mail");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

function file(filename) {
  return path.join(__dirname, "files", filename);
}

let data = fs
  .readFileSync(file("data.txt"))
  .toString()
  .split("\r\n");

// const urls = ["mateusz-wojcik.pl", "prawos.pl"];
// const urls = ["mateusz-wojcik.pl"];

const app = async () => {
  // Write headers
  functions.createFile();

  let start = new Date().getTime();

  for (let page of data) {
    let webpage = await rp(functions.options(page))
      .then($ => {
        return (websiteData = {
          www: functions.options(page).uri,
          metaTitle: functions.getMetaTags($, "title"),
          metaDescrtiption: functions.getMetaTags($, "description"),
          info: "OK"
        });
      })
      .catch(err => {
        let term = err.statusCode;
        const re = new RegExp("^[4-5]");
        if (re.test(term)) {
          return (websiteData = {
            www: functions.options(page).uri,
            metaTitle: `${err.name}`,
            metaDescrtiption: `${err.name}`,
            info: err.statusCode
          });
        } else {
          if (err.cause.code) {
            return (websiteData = {
              www: functions.options(page).uri,
              metaTitle: "Strona nie istnieje.",
              metaDescrtiption: "Strona nie istnieje.",
              info: err.cause.code
            });
          } else {
            return (websiteData = {
              www: functions.options(page).uri,
              metaTitle:
                "Nie znany błąd. Możliwa przyczyna: strona nie istnieje",
              metaDescrtiption: "Error",
              info: "Check"
            });
          }
        }
      });
    functions.appendToCSV(webpage);
    console.log(webpage);
  }
  // Send CSV with data on email

  //   let file = functions.getFile();
  functions.getFile();

  let time = functions.timing(start);
  //   await mail("Wynik sprawdzacza stron 15", time);
};

app();
