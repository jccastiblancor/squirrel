tableContent = document.getElementById("toRender");
eventsTable = document.getElementById("renderEvents");

const url =
  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

mcc = ({ fp, tp }, positives, negatives) => {
  fn = positives - tp;
  tn = negatives - fp;
  console.log(fp, tp, positives, negatives);
  return (
    (tp * tn - fp * fn) /
    Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn))
  );
};

fetch(url)
  .then((resp) => resp.json())
  .then((data) => {
    var pos = 0;
    var neg = 0;
    var dict = {};

    data.map(({ events, squirrel }, index) => {
      let plus = [];
      if (squirrel) {
        plus = [0, 1];
        pos += 1;
      } else {
        plus = [1, 0];
        neg += 1;
      }

      events.map((event) => {
        let obj = {};

        if (dict[event]) {
          obj = dict[event];
          obj.fp += plus[0];
          obj.tp += plus[1];
        } else {
          obj = { fp: plus[0], tp: plus[1] };
        }

        dict[event] = obj;
      });
      tableContent.innerHTML += `<tr ${squirrel ? "class='colored'" : ""}>
          <td> ${index + 1} </td>
          <td> ${events.map((e) => e)} </td>
          <td> ${squirrel} </td>
        </tr>`;
    });

    correlation = [];
    key;

    console.log(dict);

    for (var key in dict) {
      correlation.push([mcc(dict[key], pos, neg), key]);
    }

    correlation.sort(function (a, b) {
      return b[0] - a[0];
    });

    console.log(correlation);

    correlation.map((obj, index) => {
      eventsTable.innerHTML += `<tr>
          <td> ${index + 1} </td>
          <td> ${obj[1]} </td>
          <td> ${obj[0]} </td>
        </tr>`;
    });
  });
