let isEditingBookmark = false;
let editingIndex = 0;
let editingBookmark = {title: '', link: '', tags: []};
let originalEditingBookmark = {title: '', link: '', tags: []}
let bookmarks = JSON.parse(localStorage.getItem("bookmarks") ?? '[]')

const bookmarksDiv = document.getElementById('bookmarks');
const searchBar = document.getElementById('search');
const mainPageDiv = document.getElementById('main-page');
const editPageDiv = document.getElementById('edit-page');
const saveButton = document.getElementById('save');
const cancelButton = document.getElementById('cancel');
const deleteButton = document.getElementById('delete');
const editTitle = document.getElementById('eTitle');
const editLink = document.getElementById('eLink');
const editTags = document.getElementById('eTags');

function saveBookmarks() {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function openBookmark(bm, background=false) {
    if (bm == undefined) return;
    chrome.tabs.create({ url: bm.link, active: !background });
}

function createBookmarkDiv(bm) {
    if (bm.title == undefined) return;
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
    editTitle.value = bm.title;
    editLink.value = bm.link;
    editTags.value = bm.tags.join(',');
    editingBookmark = bm;
    bookmarks.forEach((item, i) => {
        if (item.title == bm.title && item.link == bm.link) {
            editingIndex = i;
        }
    });
    originalEditingBookmark = {title: bm.title, link: bm.link, tags: [...bm.tags]}
    bookmarks = arrayRemove(bookmarks, bm);
    updateBookmarksDiv();
}

function getChosenBookmarks() {
    return bookmarks.filter(bm => {
        if (bm.title == undefined) return false;
        if (searchBar.value[0] == '!') {
            if (bm.tags.length == 0 || bm.tags[0] == '') return false;
            for (let tagIndex in bm.tags) {
                let tag = bm.tags[tagIndex];
                if (tag.toLowerCase().replaceAll(" ", '').includes(searchBar.value.slice(1).toLowerCase().replaceAll(" ", ''))) {
                    console.log(tag, bm);
                    return true;
                }
            }
            return false;
        } else {
            let filterTitle = bm.title.toLowerCase().replaceAll(" ", "").includes(searchBar.value.replaceAll(" ", "").toLowerCase())
            let filterLink = bm.link.toLowerCase().replaceAll(" ", "").includes(searchBar.value.replaceAll(" ", "").toLowerCase())
            return (filterTitle || filterLink);
        }
    });
}

function updateBookmarksDiv() {
    mainPageDiv.style.display = isEditingBookmark ? "none" : "block";
    editPageDiv.style.display = isEditingBookmark ? "block" : "none";
    bookmarksDiv.innerText = "";
    let chosen = getChosenBookmarks();
    for (let index in chosen) {
        let bmDiv = createBookmarkDiv(chosen[index]);
        if (bmDiv != undefined) {
            bookmarksDiv.appendChild(bmDiv);
        }
    }
}

document.addEventListener("keydown", (e) => {
    let key = event.code.toLowerCase();
    let chosen = getChosenBookmarks();
    if (isEditingBookmark) return;
    if (key == "tab") {
        defocusAll();
        e.preventDefault();
    }
    if (key == "enter") {
        openBookmark(chosen[0], e.shiftKey);
    }
    if (document.activeElement.tagName == "INPUT") {
        setTimeout(updateBookmarksDiv, 30);
        return;
    }
    if (key == "equal") {
        for (let index in chosen) {
            openBookmark(chosen[index], e.shiftKey);
        }
    }
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
    if (key == "keyn") {
        startEditing({title: 'New Bookmark', link: '', tags: []})
    }
    if (key.slice(0,5) == 'digit') {
        let keyDigit = key.slice(5)*1-1;
        if (keyDigit >= 0) openBookmark(chosen[keyDigit], e.shiftKey);
    }
});

deleteButton.addEventListener("click", (e) => {
    isEditingBookmark = false;
    saveBookmarks();
    updateBookmarksDiv();
})
cancelButton.addEventListener("click", (e) => {
    isEditingBookmark = false;
    bookmarks.splice(editingIndex, 0, originalEditingBookmark);
    saveBookmarks();
    updateBookmarksDiv();
})
saveButton.addEventListener("click", (e) => {
    isEditingBookmark = false;
    editingBookmark.title = editTitle.value;
    editingBookmark.link = editLink.value;
    editingBookmark.tags = editTags.value.split(',');
    bookmarks.splice(editingIndex, 0, editingBookmark)
    saveBookmarks();
    updateBookmarksDiv();
})

updateBookmarksDiv();
