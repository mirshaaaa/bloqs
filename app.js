let itemContainers = [].slice.call(
  document.querySelectorAll(".board-column-content")
);
let columnGrids = [];
let boardGrid;
const help = document.getElementById("help");
let items = document.querySelectorAll(".board-item");

itemContainers.forEach(function(container) {
  var grid = new Muuri(container, {
    items: ".board-item",
    layoutDuration: 300,
    dragEnabled: true,
    dragSort: function() {
      return columnGrids;
    },
    dragSortInterval: 0,
    dragContainer: document.body,
    dragReleaseDuration: 400,
    dragReleaseEasing: "ease"
  })
    .on("dragStart", function(item) {
      item.getElement().style.width = item.getWidth() + "px";
      item.getElement().style.height = item.getHeight() + "px";
    })
    .on("dragReleaseEnd", function(item) {
      item.getElement().style.width = "";
      item.getElement().style.height = "";
      console.log("Dragend");
      columnGrids.forEach(function(grid) {
        grid.refreshItems();
      });
    })
    .on("layoutStart", function() {
      boardGrid.refreshItems().layout();
    });

  columnGrids.push(grid);
});

boardGrid = new Muuri(".board", {
  dragEnabled: false,
  layout: {
    rounding: false
  }
});

function runSubmit(e) {
  let newtask;
  if (e.keyCode == 13 || event.which == 13) {
    const tb = document.getElementById("newtask");
    newtask = tb.value;
    console.log(newtask);
    addItem(newtask);
    tb.value = "";
    return false;
  }
}

function addItem(task) {
  let divi = document.createElement("div");
  divi.classList.add("board-item-content");
  divi.innerHTML = `` + task;
  let div = document.createElement("div");
  div.classList.add("board-item");
  div.appendChild(divi);
  columnGrids[0].add(div);
}

//console.log(columnGrids[0].getItems())

function clearDone() {
  let items = document.querySelectorAll(".board-item");
  columnGrids[3].remove(items);
  let doneContent = document.getElementById("done-content");
  doneContent.innerHTML = "";
}

function showHelp() {
  const helpBox = document.getElementById("helpBox");
  help.style.visibility = "hidden";
  helpBox.style.opacity = 1;
}

function minimizeHelp() {
  const helpBox = document.getElementById("helpBox");

  help.style.visibility = "visible";
  helpBox.style.opacity = 0;
}

myStorage = window.localStorage;
getData();

function saveData() {
  let elements = [];

  elements.push(...columnGrids[0].getItems());
  elements.push(...columnGrids[1].getItems());
  elements.push(...columnGrids[2].getItems());
  elements.push(...columnGrids[3].getItems());

  console.log(elements);
  let data = [];
  elements.forEach(element => {
    let task = {
      text: element._child.innerText,
      position: element._element.parentNode.parentNode.id
    };
    data.push(task);
  });
  myStorage.setItem("data", JSON.stringify(data));
}

function getData() {
  let data = JSON.parse(myStorage.getItem("data"));
  data.forEach(element => {
    let divi = document.createElement("div");
    divi.classList.add("board-item-content");
    divi.innerHTML = element.text;
    let div = document.createElement("div");
    div.classList.add("board-item");
    div.appendChild(divi);
    let task = div;
    switch (element.position) {
      case "backlog":
        columnGrids[0].add(task);
        break;
      case "buffer":
        columnGrids[1].add(task);
        break;
      case "progress":
        columnGrids[2].add(task);
        break;
      case "done":
        columnGrids[3].add(task);
        break;
    }
  });
}

window.onload = function() {
  if (localStorage.getItem("visited") === null) {
    firstVisit();
    localStorage.setItem("visited", true);
  }
};

function firstVisit() {
  createTask("Create a new task above!", 0);
  createTask("You can drag and drop!", 0);
  createTask("This is a task", 0);
  createTask("Nothing here", 1);
  createTask("Delete tasks using the arrow!", 3);
}

function createTask(text, pos) {
  let divi = document.createElement("div");
  divi.classList.add("board-item-content");
  divi.innerHTML = text;
  let div = document.createElement("div");
  div.classList.add("board-item");
  div.appendChild(divi);
  let task = div;
  columnGrids[pos].add(task);
}

function clearAll() {
  let items = document.querySelectorAll(".board-item");
  columnGrids[0].remove(items, { removeElements: true });
  columnGrids[1].remove(items, { removeElements: true });
  columnGrids[2].remove(items, { removeElements: true });
  columnGrids[3].remove(items, { removeElements: true });
  columnGrids[0].refreshItems().layout();
  columnGrids[1].refreshItems().layout();
  columnGrids[2].refreshItems().layout();
  columnGrids[3].refreshItems().layout();
}

function backUp() {
  saveData();
  clearAll();
}
