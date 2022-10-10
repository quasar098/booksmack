let isEditingBookmark = false;
let bookmarkBeingEdited = {title: '', link: '', tags: []};
let bookmarks = JSON.parse(localStorage.getItem("bookmarks") ?? '[]')

const bookmarksDiv = document.getElementById('bookmarks');
const searchBar = document.getElementById('search');
const mainPageDiv = document.getElementById('main-page');
const editPageDiv = document.getElementById('edit-page');
const saveButton = document.getElementById('save');
const cancelButton = document.getElementById('cancel');
const deleteButton = document.getElementById('delete');

function saveBookmarks() {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function openBookmark(bm, background=false) {
    if (bm == undefined) return;
    chrome.tabs.create({ url: bm.link, active: !background });
}

function createBookmarkDiv(bm) {
    // outer
    let bookmarkDiv = document.createElement("div");
    bookmarkDiv.classList.add("bookmark");
    // text
    let bookmarkTextDiv = document.createElement("div");
    bookmarkTextDiv.classList.add("bookmark-text");
    let bookmarkTitle = document.createElement("p");
    let bookmarkLink = document.createElement("a");
    bookmarkLink.setAttribute("target", "_blank");
    bookmarkLink.setAttribute("href", bm.link);
    bookmarkLink.innerText = bm.title;
    bookmarkTitle.appendChild(bookmarkLink);
    bookmarkTextDiv.appendChild(bookmarkTitle);
    bookmarkDiv.appendChild(bookmarkTextDiv);
    // edit button
    let editButton = document.createElement("button");
    editButton.classList.add('edit');
    editButton.innerText = "Edit";
    bookmarkDiv.appendChild(editButton);
    editButton.addEventListener("click", () => {
        startEditing(bm);
    })
    // br
    let brElm = document.createElement("br");
    bookmarkDiv.appendChild(brElm);
    return bookmarkDiv;
}

function defocusAll() {
    var tmp = document.createElement("input");
    document.body.appendChild(tmp);
    tmp.focus();
    document.body.removeChild(tmp);
}

function arrayRemove(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}


function startEditing(bm) {
    isEditingBookmark = true;
    bookmarkBeingEdited = bm;
    bookmarks = arrayRemove(bookmarks, bm);
    updateBookmarksDiv();
}

function getChosenBookmarks() {
    return bookmarks.filter(bm => {
        let filterTitle = bm.title.toLowerCase().replaceAll(" ", "").includes(searchBar.value.replaceAll(" ", "").toLowerCase())
        let filterLink = bm.link.toLowerCase().replaceAll(" ", "").includes(searchBar.value.replaceAll(" ", "").toLowerCase())
        return filterTitle || filterLink;
    });
}

function updateBookmarksDiv() {
    mainPageDiv.style.display = isEditingBookmark ? "none" : "block";
    editPageDiv.style.display = isEditingBookmark ? "block" : "none";
    bookmarksDiv.innerText = "";
    let chosen = getChosenBookmarks();
    for (let index in chosen) {
        bookmarksDiv.appendChild(createBookmarkDiv(chosen[index]));
    }
}

document.addEventListener("keydown", (e) => {
    let key = event.code.toLowerCase();
    if (key == "tab") {
        defocusAll();
        e.preventDefault();
    }
    if (document.activeElement.tagName == "INPUT") {
        setTimeout(updateBookmarksDiv, 30);
        return;
    }
    let chosen = getChosenBookmarks();
    if (key == "keyq") {
        searchBar.focus();
        setTimeout(() => {
            searchBar.value = "";
        })
    }
    if (key == "keya") {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            let { url, title } = tabs[0];
            bookmarks.push({title: title, link: url, tags: []});
            saveBookmarks();
            updateBookmarksDiv();
        });
    }
    if (key.slice(0,5) == 'digit') {
        openBookmark(chosen[key.slice(5)*1], e.shiftKey);
    }
});

deleteButton.addEventListener("click", (e) => {
    isEditingBookmark = false;
    saveBookmarks();
    updateBookmarksDiv();
})

deleteButton.addEventListener("click", (e) => {
    isEditingBookmark = false;
    saveBookmarks();
    updateBookmarksDiv();
})

updateBookmarksDiv();
