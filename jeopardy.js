/*// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]
*/
let NUM_CATEGORIES = 6;
let NUM_QUESTIONS = 5;
let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

const getCategoryIds = async () => {
  const res = await axios.get("https://jservice.io/api/categories?count=100");
  const { title, id } = res.data;
  let catIds = _.sampleSize(res.data, 6).map((val) => {
    return { title: val.title, id: val.id };
  });

  return catIds;
};

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

const getCategory = async (_catIds) => {
  const cluesArray = await _catIds.map((val) => {
    const clues = axios.get(`https://jservice.io/api/clues?category=${val.id}`);
    return clues;
  });

  const promisedClues = await Promise.all(cluesArray);
  let processedClues = await promisedClues.map((val) => {
    return {
      title: val.data[0].category.title,
      clues: _.sampleSize(val.data, 5).map((val) => {
        return { question: val.question, answer: val.answer, showing: null };
      }),
    };
  });
  processedClues = await Promise.all(processedClues);
  categories = processedClues;
  return processedClues;
};

function fillTable() {
  
  const $jeopardyTable = $('<table id = "jeopardy"></table>');
  $("body").append($jeopardyTable);

  const $jeopardyThead = $("<thead><tr></tr></thead>").attr("id", "thead");
  const $jeopardyBody = $("<tbody></tbody>").attr("class", "table-body");
  $jeopardyTable.prepend($jeopardyThead, $jeopardyBody);

  for (let i = 0; i < NUM_CATEGORIES; i++) {
    const $th = $(`<th id="${i}"></th>`).html(`${categories[i].title}`);
    $("tr").append($th);
  }
  for (let y = 0; y < NUM_QUESTIONS; y++) {
    const $row = $("<tr></tr>");
    for (let x = 0; x < NUM_CATEGORIES; x++) {
      const $cell = $("<td>?</td>");
      $cell.attr("id", `${y}-${x}`);

      $cell.on("click", handleClick);
      $row.prepend($cell);
    }
    $jeopardyTable.append($row);
  }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick() {
  const $id = $(this).attr("id");
  const y = $id[0];
  const x = $id[2];
  let clue = categories[x].clues[y];
  if (clue.showing === null) {
    $(this).html(`${clue.question}`);
    clue.showing = "question";
  } else if (clue.showing === "question") {
    $(this).html(`${clue.answer}`);
    clue.showing = "answer";
  }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

async function showLoadingView() {
  $("table").empty();
  // disable button
  $("#restart").prop("disabled", true);
  const $spinner = $(
    '<div id ="spin" class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>'
  );
  //$spinner.css('top', '20vh', 'left', '40vw');
  $spinner.css("left", "40vw");
  $("body").append($spinner);
  
  // add spinner to button
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
  $("#spin").remove();
  $("#restart").prop("disabled", false);
}
/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

 


async function setupAndStart() {
  await showLoadingView();
  $('#jeopardy').remove();
  categories = [];
  const catIds = await getCategoryIds();
  const clues = await getCategory(catIds);
  hideLoadingView();
  fillTable();
}
$("#restart").on("click", setupAndStart);
setupAndStart();