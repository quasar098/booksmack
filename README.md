# booksmack

## better bookmark management

now you dont have to put many bookmarks in one folder, you can have two folders with both, only one, or no bookmarks!

it is like a relational database

### without extension

| Folder name | Bookmark name |
| ----------- | ------------- |
| good songs | song #1 |
| good songs | song #2 |
| happy songs | song #3 |

Song #1 could be happy, but it is also a good song<br>
it can't go in both folders with regular bookmarks though

### with extension

| Tag name | Bookmark name |
| ----------- | ------------- |
| good songs | song #1 |
| good songs | song #2 |
| happy songs | song #1 |
| happy songs | song #3 |

Song #1 can go into both happy songs category AND good songs category

## usage

this is going to be used a bit like vim, with a high learning curve but efficient usage

if you would, please go to `chrome://extensions/shortcuts` and set the keybind for the extension as `Ctrl+Shift+B`

#### shortcuts:

main shortcuts

- `TAB` enter fast mode
- `Q` enter search mode (default)
- `ENTER` open bookmark at the top of the list

fast mode shortcuts

- `A` add current page as bookmark
- `N` add custom bookmark
- `=` open all bookmarks
- `1-9` open link based on sighted bookmark index
- `Shift+Option` open but in the background
