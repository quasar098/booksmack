let isEditingBookmark = false;
let bookmarkBeingEdited = {title: '', link: '', tags: []};
let bookmarks = JSON.parse(localStorage.getItem("bookmarks") ?? '[]')

const bookmarksDiv = document.getElementById('bookmarks');
const searchBar = document.getElementById('search');

const devMode = true;

function saveBookmarks() {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function openBookmark(bm) {
    chrome.tabs.create({ url: bm.link, active: false});
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

function getChosenBookmarks() {
    return bookmarks.filter(bm => bm.title.toLowerCase().replaceAll(" ", "").includes(searchBar.value.replaceAll(" ", "").toLowerCase()))
}

function updateBookmarksDiv() {
    bookmarksDiv.innerText = "";
    let chosen = getChosenBookmarks();
    for (let index in chosen) {
        bookmarksDiv.appendChild(createBookmarkDiv(chosen[index]));
    }
}

document.addEventListener("keydown", (e) => {
    let key = event.key.toLowerCase();
    if (key == "tab") {
        defocusAll();
        e.preventDefault();
    }
    if (document.activeElement.tagName == "INPUT") {
        setTimeout(updateBookmarksDiv, 30);
        return;
    }
    if (key == "a") {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            let { url, title } = tabs[0];
            bookmarks.push({title: title, link: url, tags: []});
            saveBookmarks();
            updateBookmarksDiv();
        });
    }
    if (key == "c" && devMode) {
        bookmarks = [];
        saveBookmarks();
        updateBookmarksDiv();
    }
});

updateBookmarksDiv();
