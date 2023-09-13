(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeCardNotes = exports.ChangeCardLabels = exports.RenameList = exports.RenameCard = exports.DeleteList = exports.DeleteCard = exports.AddList = exports.AddCard = exports.MoveList = exports.MoveCard = exports.fillerStr = void 0;
// Can use require() despite targeting browser,
// only since Browserify is used to build.
var cloneDeep = require('lodash.clonedeep');
/*
* Used by regular code and test code.
*/
exports.fillerStr = "...";
/*
* Pure function.
* Returns a new board, with card moved one unit in direction dir.
* Return input board if dir is not possible direction movement,
* given card's current position.
* dir can be "up", "down", "left", or "right".
*/
function MoveCard(board, cardId, dir) {
    var boardCopy = cloneDeep(board);
    // Need some details about the list that the card comes from.
    var parentListsCards = boardCopy.listsCards.filter(function (listCards, i) { return listCards.includes(cardId); })[0];
    var sourceListId = boardCopy.listsCards.indexOf(parentListsCards);
    var sourceListCards = boardCopy.listsCards[sourceListId];
    var sourceListPosOnBoard = boardCopy.listsPositions[sourceListId];
    // Need to know where the card is in its original list.
    var cardPosInSourceList = boardCopy.listsCards[sourceListId].indexOf(cardId);
    // First check move is possible.
    // If not, just return the supplied board.
    var isPoss = true;
    switch (dir) {
        case "up":
            if (cardPosInSourceList === 0) {
                // Then card is already at top of its list.
                isPoss = false;
            }
            break;
        case "down":
            var bottom = boardCopy.listsCards[sourceListId].length - 1;
            if (cardPosInSourceList === bottom) {
                // Then card is already at bottom of its list.
                isPoss = false;
            }
            break;
        case "left":
            var leftmostListPosition = Math.min.apply(Math, boardCopy.listsPositions);
            if (sourceListPosOnBoard === leftmostListPosition) {
                // Then card is already in leftmost list.
                isPoss = false;
            }
            break;
        case "right":
            var rightmostListPosition = Math.max.apply(Math, boardCopy.listsPositions);
            if (sourceListPosOnBoard === rightmostListPosition) {
                // Then card is already in rightmost list.
                isPoss = false;
            }
            break;
    }
    if (!isPoss) {
        return board;
    }
    // Assume now that move is indeed possible.
    var resultBoard = cloneDeep(boardCopy);
    switch (dir) {
        // Source list === destination list when moving vertically.
        case "up":
            { // Scopes used so sourcePos, destPos can be redefined.
                var sourcePos = cardPosInSourceList;
                var destPos = cardPosInSourceList - 1;
                // Swap card with supplied id with the card above it.
                var tempCardId = resultBoard.listsCards[sourceListId][destPos];
                resultBoard.listsCards[sourceListId][destPos] = cardId;
                resultBoard.listsCards[sourceListId][sourcePos] = tempCardId;
            }
            break;
        case "down":
            {
                var sourcePos = cardPosInSourceList;
                var destPos = cardPosInSourceList + 1;
                // Swap card with supplied id with the card above it.
                var tempCardId = resultBoard.listsCards[sourceListId][destPos];
                resultBoard.listsCards[sourceListId][destPos] = cardId;
                resultBoard.listsCards[sourceListId][sourcePos] = tempCardId;
            }
            break;
        // Source list !== destination list when moving horizontally.
        case "left":
            {
                // Need to determine id of destination list.
                var destListPos = sourceListPosOnBoard - 1;
                var destListId = boardCopy.listsPositions.indexOf(destListPos);
                // Remove supplied card id from source list.
                resultBoard.listsCards[sourceListId].splice(cardPosInSourceList, 1);
                // Insert supplied card id into destination list.
                var destPos = Math.min(boardCopy.listsCards[destListId].length, cardPosInSourceList);
                resultBoard.listsCards[destListId].splice(destPos, 0, cardId);
            }
            break;
        case "right":
            {
                // Need to determine id of destination list.
                var destListPos = sourceListPosOnBoard + 1;
                var destListId = boardCopy.listsPositions.indexOf(destListPos);
                // Remove supplied card id from source list.
                resultBoard.listsCards[sourceListId].splice(cardPosInSourceList, 1);
                // Insert supplied card id into destination list.
                var destPos = Math.min(boardCopy.listsCards[destListId].length, cardPosInSourceList);
                resultBoard.listsCards[destListId].splice(destPos, 0, cardId);
            }
            break;
    }
    return resultBoard;
}
exports.MoveCard = MoveCard;
/*
* Pure function.
* Returns a new board, with list moved one unit in direction dir.
* Return input board if dir is not possible direction movement,
* given list's current position.
* dir can be "left" or "right".
*/
function MoveList(board, listId, dir) {
    var resultBoard = cloneDeep(board);
    var origPos = board.listsPositions[listId];
    // Don't modify board state if rightmost list is being moved right.
    if (dir === "right" && origPos === board.listsTitles.length - 1) {
        return resultBoard;
    }
    // Don't modify board state if leftmost list is being moved left.
    if (dir === "left" && origPos === 0) {
        return resultBoard;
    }
    // Can assume now that a valid movement has been specified.
    switch (dir) {
        case "left":
            {
                // Prepare for swap.
                var otherSwappeePosition_1 = origPos - 1;
                var otherSwappeeListId = board.listsPositions
                    .filter(function (listId) {
                    return board.listsPositions[listId] === otherSwappeePosition_1;
                })[0];
                // Execute swap.
                resultBoard.listsPositions[listId] = otherSwappeePosition_1;
                resultBoard.listsPositions[otherSwappeeListId] = origPos;
            }
            break;
        case "right":
            {
                // Prepare for swap.
                var otherSwappeePosition_2 = origPos + 1;
                var otherSwappeeListId = board.listsPositions
                    .filter(function (listId) {
                    return board.listsPositions[listId] === otherSwappeePosition_2;
                })[0];
                // Execute swap.
                resultBoard.listsPositions[listId] = otherSwappeePosition_2;
                resultBoard.listsPositions[otherSwappeeListId] = origPos;
            }
            break;
    }
    return resultBoard;
}
exports.MoveList = MoveList;
/*
* Pure function.
* Returns a new board, with one new card at the end of the list with given listId.
* Sets filler values for the card's properties.
* Expects no gaps in card ids in input board.
*/
function AddCard(board, listId) {
    var resultBoard = cloneDeep(board);
    var indexForNewCard = resultBoard.cardsTitles.length;
    resultBoard.cardsTitles.push(exports.fillerStr);
    resultBoard.cardsNotes.push(exports.fillerStr);
    resultBoard.cardsLabels.push([exports.fillerStr]);
    resultBoard.listsCards[listId].push(indexForNewCard);
    return resultBoard;
}
exports.AddCard = AddCard;
/*
* Pure function.
* Returns a new board, with one new list in rightmost position.
* New board contains one filler card, with filler values for its properties.
* Expects no gaps in list ids in input board.
*/
function AddList(board) {
    var resultBoard = cloneDeep(board);
    var newCardId = resultBoard.cardsTitles.length;
    var newListId = resultBoard.listsTitles.length;
    var newListPos = resultBoard.listsPositions.length;
    // New list should come with a filler card.
    resultBoard.cardsTitles.push(exports.fillerStr);
    resultBoard.cardsNotes.push(exports.fillerStr);
    resultBoard.cardsLabels.push([exports.fillerStr]);
    resultBoard.listsTitles.push(exports.fillerStr);
    resultBoard.listsCards.push([newCardId]);
    resultBoard.listsPositions.push(newListPos);
    return resultBoard;
}
exports.AddList = AddList;
/*
* Pure function.
* Returns a new board, with the card with given cardId removed.
* Expects no gaps in card ids in input board.
* Leaves no gaps in card ids in output board.
*/
function DeleteCard(board, cardId) {
    var resultBoard = cloneDeep(board);
    var cardFound = IsBetween(cardId, 0, resultBoard.cardsTitles.length - 1);
    if (!cardFound) { // Then no card with supplied id exists.
        return resultBoard;
    }
    // Use index of deletee to clean up parallel card data arrays.
    resultBoard.cardsTitles.splice(cardId, 1);
    resultBoard.cardsNotes.splice(cardId, 1);
    resultBoard.cardsLabels.splice(cardId, 1);
    // Remove card from its list.  Brute force to find it...
    resultBoard.listsCards.forEach(function (elt, i) {
        resultBoard.listsCards[i] = elt.filter(function (id) { return id !== cardId; });
    });
    // Decrement required lists' pointers to some cards, as required.
    resultBoard.listsCards.forEach(function (elt, i) {
        resultBoard.listsCards[i] = elt.map(function (id) { return id < cardId ? id : id - 1; });
    });
    return resultBoard;
}
exports.DeleteCard = DeleteCard;
/*
* Pure function.
* Returns a new board, with the list with given listId removed.
* Cards belonging to that list also get removed from board.
* Responsible for leaving no gaps in list ids.
*/
function DeleteList(board, listId) {
    var resultBoard = cloneDeep(board);
    var listFound = IsBetween(listId, 0, resultBoard.listsTitles.length - 1);
    if (!listFound) { // Then no list with supplied id exists.
        return resultBoard;
    }
    // Find all cards belonging to the list.  Delete each.
    // We iterate backwards to avoid a card deletion
    // interfering with subsequent card deletions.
    var idsOfCardsToDelete = __spreadArray([], resultBoard.listsCards[listId], true);
    idsOfCardsToDelete.sort();
    var i = idsOfCardsToDelete.length - 1;
    for (; i > -1; i--) {
        var deleteeCardId = idsOfCardsToDelete[i];
        resultBoard = DeleteCard(resultBoard, deleteeCardId);
    }
    // Now we're ready to get rid of the list itself.
    resultBoard.listsTitles.splice(listId, 1);
    resultBoard.listsCards.splice(listId, 1);
    // Shuffle list positions down too.
    var removedPos = resultBoard.listsPositions[listId];
    resultBoard.listsPositions.splice(listId, 1);
    resultBoard.listsPositions = resultBoard.listsPositions.map(function (pos) { return pos < removedPos ? pos : pos - 1; });
    return resultBoard;
}
exports.DeleteList = DeleteList;
/*
* Pure function.
* Returns a new board, where the card with supplied cardId is assigned
* the new title newTitle.
*/
function RenameCard(board, cardId, newTitle) {
    var boardCopy = cloneDeep(board);
    var cardFound = IsBetween(cardId, 0, boardCopy.cardsTitles.length - 1);
    if (!cardFound) {
        return boardCopy;
    }
    boardCopy.cardsTitles[cardId] = newTitle;
    return boardCopy;
}
exports.RenameCard = RenameCard;
/*
* Pure function.
* Returns a new board, where the list with supplied listId is assigned
* the new title newTitle.
*/
function RenameList(board, listId, newTitle) {
    var boardCopy = cloneDeep(board);
    var listFound = IsBetween(listId, 0, boardCopy.listsTitles.length - 1);
    if (!listFound) {
        return boardCopy;
    }
    boardCopy.listsTitles[listId] = newTitle;
    return boardCopy;
}
exports.RenameList = RenameList;
/*
* Pure function.
* Returns a new board, where the card with supplied cardId is assigned
* the new string array of labels newLabels.
* Can be used for (manually) adding/deleting/renaming a label.
*/
function ChangeCardLabels(board, cardId, newLabels) {
    var boardCopy = cloneDeep(board);
    var cardFound = IsBetween(cardId, 0, boardCopy.cardsTitles.length - 1);
    if (!cardFound) {
        return boardCopy;
    }
    boardCopy.cardsLabels[cardId] = newLabels;
    return boardCopy;
}
exports.ChangeCardLabels = ChangeCardLabels;
/*
* Pure function.
* Returns a new board, where the card with supplied cardId is assigned
* the new notes string newNote.
*/
function ChangeCardNotes(board, cardId, newNotes) {
    var boardCopy = cloneDeep(board);
    var cardFound = IsBetween(cardId, 0, boardCopy.cardsTitles.length - 1);
    if (!cardFound) {
        return boardCopy;
    }
    boardCopy.cardsNotes[cardId] = newNotes;
    return boardCopy;
}
exports.ChangeCardNotes = ChangeCardNotes;
/*
* Helper function to check whether a given number reprensents an integer
* in a given closed interval.
*/
function IsBetween(numToCheck, lowerBound, upperBound) {
    if (!Number.isInteger(numToCheck)) {
        return false;
    }
    return (numToCheck >= lowerBound) && (numToCheck <= upperBound);
}

},{"lodash.clonedeep":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var controller_1 = require("./controller");
/*
* The non-empty template board that will be used when user
* creates a new board.
* The object is wrapped in a function as a simple
* way of preventing mutation.
*/
function FillerBoardState() {
    var state = {
        cardsTitles: [controller_1.fillerStr],
        cardsNotes: [controller_1.fillerStr],
        cardsLabels: [[controller_1.fillerStr]],
        listsTitles: [controller_1.fillerStr, controller_1.fillerStr],
        listsCards: [[0], []],
        listsPositions: [0, 1]
    };
    return state;
}
;
/*
* Holds state of the user's board.
* Can be imported and exported as file.
*/
var boardState = FillerBoardState();
/*
* Will not be imported or exported.
* Intended guiViewMode space is "welcome", "aggregate", "focused".
*/
var appState = { guiViewMode: "", focusedCardId: 0 };
/*
* The only custom event.
* Raisers of this event should make any necessary changes to:
*   - board state
*   - app sate
* then return.  I.e. no code needing to be executed appear
* in any block where this is called, following the event raise.
*/
var OutdatedGUI = new Event("OutdatedGUI");
/*
* Call once to start the application.
*/
function InitializeApp() {
    // Set app state.
    // Raise outdated GUI event.
    // Then render function will take over.
    // No need to set board state here.
    appState.guiViewMode = "welcome";
    document.dispatchEvent(OutdatedGUI);
}
/*
* Handles the OutdatedGUI event.
* Responds by cleaning part of the DOM then calling the appropriate
* rendering function(s), in the appropriate order based on app state.
* Caller should set guiViewMode beforehand.
*/
function Render() {
    // Ensure that we're rendering on a blank slate.
    // (Except for <script>.)
    StripBody();
    var mode = appState.guiViewMode;
    switch (mode) {
        case "welcome":
            RenderWelcome();
            break;
        case "aggregate":
            RenderAggregate();
            break;
        case "focused":
            RenderFocus();
            break;
        default:
            throw "Invalid view mode in app state.";
    }
}
/*
* Renders the welcome screen, where user can create new board or load file.
* Assumes it has not been called since the browser was last refreshed.
*/
function RenderWelcome() {
    // Button for creating new board.
    var newBtn = document.createElement("div");
    newBtn.classList.add("welcomeButton", "clickable");
    newBtn.append("New board");
    newBtn.addEventListener("click", function (e) {
        appState.guiViewMode = "aggregate";
        document.dispatchEvent(OutdatedGUI);
    });
    // Button for opening existing board, and an
    // invisble file input control.  These work together.
    var loadBtn = document.createElement("div");
    loadBtn.classList.add("welcomeButton", "clickable");
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    // By default, clickable area is the size of the 
    // small input element.  Instead we want the clickable 
    // area to correspond to the large div.
    fileInput.style.display = "none";
    loadBtn.addEventListener("click", function () {
        fileInput.click();
    });
    loadBtn.append(document.createTextNode("Load board"), fileInput);
    fileInput.addEventListener("change", function (e) {
        if (!(fileInput.files)) {
            return;
        }
        var file = fileInput.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onloadend = function (e) {
            // e.target points to the reader
            if (e.target) {
                var fileContents = e.target.result;
                boardState = JSON.parse(fileContents);
                appState.guiViewMode = "aggregate";
                document.dispatchEvent(OutdatedGUI);
            }
        };
        reader.onerror = function (e) {
            if (e.target) {
                var error = e.target.error;
                console.error("Error occured while reading ".concat(file.name), error);
            }
        };
        reader.readAsText(file);
    });
    // Will be a grid container for the buttons.
    var buttonsContainer = document.createElement("div");
    buttonsContainer.id = "buttonsContainer";
    buttonsContainer.append(newBtn, loadBtn);
    document.body.append(buttonsContainer);
}
/*
* Renders the aggregate view.
* Shows lists, cards
* Provides controls for saving boardData to file,
* adding/deleting/repositioning cards/lists,
* renaming lists,
* bringing one card into focus,
* preparing board state for download.
* Does not assume list/card ids and positions
* are gapless sequences.
*/
function RenderAggregate() {
    /*
    * Helper function.
    * Returns a button which, when clicked, automatically intiates a
    * download to the user's file system, of the user's current board
    * data, serialized as a JSON text file.
    */
    function MakeDownloadBtn() {
        // Set up to make data downloadable.
        var exportData = new Blob([JSON.stringify(boardState)], { type: 'application/json' });
        var downloadURL = window.URL.createObjectURL(exportData);
        var outputFileName = "myBoardData.json";
        // Create a hidden <a> element, which links to
        // the downloadable data.
        var dlAnchor = document.createElement("a");
        dlAnchor.download = outputFileName;
        dlAnchor.href = downloadURL;
        dlAnchor.style.display = "none";
        // Create a visible div which the user clicks
        // to initiate a download, instead of having
        // them click the <a> element itself.
        var dlBtn = document.createElement("div");
        dlBtn.classList.add("downloadButton", "clickable");
        dlBtn.append("Save (download board)");
        dlBtn.appendChild(dlAnchor);
        dlBtn.addEventListener("click", function () { dlAnchor.click(); });
        return dlBtn;
    }
    // Construct bottom bar, which contains app title and
    // a download button, for the user's data.
    var bottomBar = document.createElement("div");
    bottomBar.classList.add("aggregateBottomBar");
    var lhsDiv = document.createElement("div");
    var title = document.createElement("h3");
    title.append("B . O . A . R . D");
    lhsDiv.append(title);
    lhsDiv.classList.add("appTitleDiv");
    bottomBar.append(lhsDiv, MakeDownloadBtn());
    // Now ready to actually render stuff.
    document.body.appendChild(MakeListsContainer());
    document.body.appendChild(bottomBar);
}
/*
* Returns all lists, and thus all cards.
*/
function MakeListsContainer() {
    var listsContainer = document.createElement("div");
    var numLists = boardState.listsTitles.length;
    // Need an additional column for list-adding button.
    var numColumns = numLists + 1;
    listsContainer.classList.add("listsContainer");
    listsContainer.style.gridTemplateColumns = "auto ".repeat(numColumns);
    // Will sort list ids by their intended GUI position,
    // left to right.
    var listIds = boardState.listsTitles.map(function (elt, i) { return i; });
    listIds.sort(function (a, b) {
        return boardState.listsPositions[a] - boardState.listsPositions[b];
    });
    for (var i = 0; i < numColumns; i++) {
        if (i == numLists) {
            // The last item to display in the list container
            // is not a list itself, but a button for adding
            // a new list to the board.
            listsContainer.append(MakeAddListBtn());
            continue;
        }
        var listDiv = MakeListDiv(listIds[i]);
        listsContainer.appendChild(listDiv);
    }
    return listsContainer;
}
/*
* Renders a view of one focused card.
* Shows title, labels, notes.
* Provides controls for renaming card,
* changing notes, adding/deleting labels,
* deleting the card.
*/
function RenderFocus() {
    var id = appState.focusedCardId;
    /*
    * Basic structure of a card's representation
    * in focused view:
    *
    *  |----------------|--------------|
    *  |  title         |  delete btn  |  } top row container
    *  |----------------|--------------|
    *  |                               |
    *  |  notes                        |
    *  |                               |
    *  |-------------------------------|
    *  |  labels                       |
    *  |-------------------------------|
    *  |  back btn                     |
    *  |-------------------------------|
    *
    *   \__________  _________________/
    *              \/
    *            container
    */
    var container = document.createElement("div");
    var topRow = document.createElement("div");
    container.classList.add("cardContainerFocused");
    topRow.classList.add("cardTopRowFocused");
    // Construct top row.
    var titleDiv = MakeCardTitleDiv(id);
    var deleteBtn = MakeCardDeleteButton(id);
    [titleDiv, deleteBtn].forEach(function (elt) { return topRow.appendChild(elt); });
    var parts = [
        topRow,
        MakeNoteDiv(id),
        MakeLabelsDiv(id),
        MakeCardBackButton()
    ];
    parts.forEach(function (cardPart) {
        container.appendChild(cardPart);
    });
    document.body.appendChild(container);
}
/*
* Takes id of a card.  Returns a div to add to the
* aggregate view, displaying card's title and
* providing user controls for moving card.
*/
function MakeCardDiv(id) {
    var container = document.createElement("div");
    container.classList.add("cardContainerAggregate");
    /*
    * Basic structure of a card's representation
    * in aggregate view is a 3x3 matrix:
    *
    *  |-----------------|-----------------|------------------|
    *  |                 |                 |                  |
    *  |                 |  move up btn    |                  |
    *  |                 |                 |                  |
    *  |-----------------|-----------------|------------------|
    *  |                 |                 |                  |
    *  |  move left btn  |  card title     |  move right btn  |
    *  |                 |                 |                  |
    *  |-----------------|-----------------|------------------|
    *  |                 |                 |                  |
    *  |                 |  move down btn  |                  |
    *  |                 |                 |                  |
    *  |-----------------|-----------------|------------------|
    */
    var cells = [
        0, 1, 2,
        3, 4, 5,
        6, 7, 8
    ];
    /*
    * Defines each cell for the 3x3.
    */
    function MakeCell(cardId, indexInto3x3) {
        var cell = document.createElement("div");
        switch (indexInto3x3) {
            // Center cell represents the card itself.
            case 4:
                cell.style.textAlign = "left";
                cell.classList.add("cardCell", "clickable");
                cell.append(boardState.cardsTitles[id]);
                cell.addEventListener("click", function () {
                    appState.focusedCardId = cardId;
                    appState.guiViewMode = "focused";
                    document.dispatchEvent(OutdatedGUI);
                });
                break;
            // Cells with buttons for moving card.
            case 1:
            case 3:
            case 5:
            case 7:
                // Parallel arrays.
                var arrowCellIds_1 = [1, 3, 5, 7];
                var arrows = ['🢁', '🢀', '🢂', '🢃'];
                var directions_1 = ["up", "left", "right", "down"];
                // Construct cell from data in parallel arrays.
                cell.classList.add("arrow", "clickable");
                cell.append(arrows[arrowCellIds_1.indexOf(indexInto3x3)]);
                cell.addEventListener("click", function () {
                    boardState = (0, controller_1.MoveCard)(boardState, id, directions_1[arrowCellIds_1.indexOf(indexInto3x3)]);
                    document.dispatchEvent(OutdatedGUI);
                });
                break;
            // Cells with buttons for moving card.
            default:
                break;
        }
        return cell;
    }
    // Have already defined what each cell will be,
    // Can insert cells into container, now that 
    // they've all been defined.
    cells.forEach(function (i) {
        container.appendChild(MakeCell(id, i));
    });
    return container;
}
/*
* Takes id of a list.  Returns a div to add to the
* aggregate view, displaying all child cards and
* providing user controls for moving, renaming list.
*/
function MakeListDiv(listId) {
    /*
    * Basic structure of a list's representation
    * in aggregate view:
    *
    *   |--------|--------------------------|--------|
    *   |        |  title | delete list btn |        |
    *   |        |--------------------------|        |
    *   |  move  |       card               |  move  |
    *   |  left  |--------------------------|  right |
    *   |  btn   |       card               |  btn   |
    *   |        |--------------------------|        |
    *   |        |       card               |        |
    *   |        |--------------------------|        |
    *   |        |      add card btn        |        |
    *   |--------|--------------------------|--------|
    */
    // Construct metacontainer.
    var topLevelContainer = document.createElement("div");
    topLevelContainer.classList.add("listTopLevelContainer");
    // Construct left and right columns, including interactivity.
    var leftColumn = document.createElement("div");
    var rightColumn = document.createElement("div");
    leftColumn.append("🢀");
    rightColumn.append("🢂");
    leftColumn.classList.add("arrow", "clickable");
    rightColumn.classList.add("arrow", "clickable");
    leftColumn.addEventListener("click", function () {
        boardState = (0, controller_1.MoveList)(boardState, listId, "left");
        document.dispatchEvent(OutdatedGUI);
    });
    rightColumn.addEventListener("click", function () {
        boardState = (0, controller_1.MoveList)(boardState, listId, "right");
        document.dispatchEvent(OutdatedGUI);
    });
    var middleColumnContainer = document.createElement("div");
    middleColumnContainer.classList.add("listMiddleColumnContainer");
    // Construct middle column, top row.
    var topRow = document.createElement("div");
    topRow.classList.add("listTopRow");
    var titleDiv = MakeListTitleDiv(listId);
    topRow.appendChild(titleDiv);
    var deleteBtn = MakeListDeleteButton(listId);
    topRow.appendChild(deleteBtn);
    middleColumnContainer.appendChild(topRow);
    // Construct middle column, middle rows.
    var listCardIds = boardState.listsCards[listId];
    listCardIds.forEach(function (cardId) {
        middleColumnContainer.appendChild(MakeCardDiv(cardId));
    });
    // Construct middle column, bottom rows.
    middleColumnContainer.appendChild(MakeAddCardToListBtn(listId));
    // Put it all together.
    topLevelContainer.appendChild(leftColumn);
    topLevelContainer.appendChild(middleColumnContainer);
    topLevelContainer.appendChild(rightColumn);
    return topLevelContainer;
}
/*
* Takes id of a card.  Returns a div which
* displays a card's title and provides user
* controls for changing title.
*/
function MakeCardTitleDiv(id) {
    // Populate card title from current board state.
    var title = boardState.cardsTitles[id];
    var result = document.createElement("h3");
    result.append(title);
    // Used to make title writable by the user.
    result.id = "card_title_div";
    // Add interactivity to title.
    result.addEventListener("click", function () {
        // Make input area for user to set new title.
        var toReplace = document.getElementById("card_title_div");
        var editableArea = document.createElement("input");
        editableArea.value = title;
        editableArea.addEventListener("keypress", function (event) {
            if (event.getModifierState("Control") && event.key === "Enter") {
                boardState = (0, controller_1.RenameCard)(boardState, id, editableArea.value);
                document.dispatchEvent(OutdatedGUI);
            }
        });
        // Swap title div for input control.
        toReplace === null || toReplace === void 0 ? void 0 : toReplace.replaceWith(editableArea);
    });
    return result;
}
/*
* Takes id of a list.  Returns a div which
* displays the list's title and provides user
* controls for changing title.
*/
function MakeListTitleDiv(id) {
    // Populate list title from current board state.
    var title = boardState.listsTitles[id];
    var result = document.createElement("h3");
    result.append(title);
    // Used to make title writable by the user.
    // There will usually be more than one list title div
    // displayed to the user at a time.
    var htmlEltId = "list_title_div_" + id.toString();
    result.id = htmlEltId;
    // Add interactivity to title.
    result.addEventListener("click", function () {
        // Make input area for user to set new title.
        var toReplace = document.getElementById(htmlEltId);
        var editableArea = document.createElement("input");
        editableArea.value = title;
        editableArea.addEventListener("keypress", function (event) {
            if (event.getModifierState("Control") && event.key === "Enter") {
                boardState = (0, controller_1.RenameList)(boardState, id, editableArea.value);
                document.dispatchEvent(OutdatedGUI);
            }
        });
        // Swap title div for input control.
        toReplace === null || toReplace === void 0 ? void 0 : toReplace.replaceWith(editableArea);
    });
    return result;
}
/*
* Takes id of a card.  Returns a div which
* displays a card's note and provides user
* controls for changing note contents.
*/
function MakeNoteDiv(id) {
    // Populate card note from current board state.
    var note = boardState.cardsNotes[id];
    var textArea = document.createElement("textarea");
    textArea.append(note);
    textArea.classList.add("note");
    // Add interactivity to note.
    textArea.addEventListener("keypress", function (event) {
        if (event.getModifierState("Control") && event.key === "Enter") {
            boardState = (0, controller_1.ChangeCardNotes)(boardState, id, textArea.value);
            document.dispatchEvent(OutdatedGUI);
        }
    });
    return textArea;
}
/*
* Takes id of a card.  Returns a div which
* displays a card's labels in a row and provides
* user controls for changing labels.
*/
function MakeLabelsDiv(id) {
    var labels = boardState.cardsLabels[id];
    var result = document.createElement("div");
    result.classList.add("labelContainer");
    // Not sure this logic can be farmed out to the stylesheet...
    result.style.gridTemplateColumns = "auto ".repeat(labels.length);
    // Used to make labels writable by the user.
    result.id = "card_labels_div";
    labels.forEach(function (label) {
        var labelDiv = document.createElement("div");
        labelDiv.classList.add("labelDiv", "clickable");
        labelDiv.append(label);
        result.appendChild(labelDiv);
    });
    // Add interactivity to label list.
    result.addEventListener("click", function () {
        // Make input area for user to modify labels.
        var toReplace = document.getElementById("card_labels_div");
        var editableArea = document.createElement("input");
        editableArea.value = labels.join(", ");
        editableArea.addEventListener("keypress", function (event) {
            if (event.getModifierState("Control") && event.key === "Enter") {
                var newLabels = editableArea.value
                    .split(",")
                    .map(function (s) { return s.trimStart(); });
                boardState = (0, controller_1.ChangeCardLabels)(boardState, id, newLabels);
                document.dispatchEvent(OutdatedGUI);
            }
        });
        toReplace === null || toReplace === void 0 ? void 0 : toReplace.replaceWith(editableArea);
    });
    return result;
}
/*
* Returns a button which adds a new default card to given list.
* Doesn't change GUI view mode.
*/
function MakeAddCardToListBtn(listId) {
    var btn = document.createElement("div");
    btn.append("✚");
    btn.classList.add("addCardButton", "clickable");
    btn.addEventListener("click", function () {
        boardState = (0, controller_1.AddCard)(boardState, listId);
        document.dispatchEvent(OutdatedGUI);
    });
    return btn;
}
/*
* Returns a button which, when clicked, creates a new
* default list, adding it to the board.
* Doesn't change GUI view mode.
*/
function MakeAddListBtn() {
    var btn = document.createElement("div");
    btn.append("✚");
    btn.classList.add("addListButton", "clickable");
    btn.addEventListener("click", function () {
        boardState = (0, controller_1.AddList)(boardState);
        document.dispatchEvent(OutdatedGUI);
    });
    return btn;
}
/*
* Returns a button which deletes the given list.
* Doesn't change GUI view mode.
*/
function MakeListDeleteButton(id) {
    var btn = document.createElement("div");
    btn.append("⨯");
    btn.classList.add("deleteButton", "clickable");
    btn.addEventListener("click", function () {
        boardState = (0, controller_1.DeleteList)(boardState, id);
        document.dispatchEvent(OutdatedGUI);
    });
    return btn;
}
/*
* Returns a button which returns user to aggregate view.
*/
function MakeCardBackButton() {
    var btn = document.createElement("div");
    btn.classList.add("cardBackButton", "clickable");
    var btnLabel = document.createElement("h3");
    btnLabel.append("↵");
    btn.appendChild(btnLabel);
    btn.addEventListener("click", function () {
        appState.guiViewMode = "aggregate";
        document.dispatchEvent(OutdatedGUI);
    });
    return btn;
}
/*
* Returns a button which deletes the focused card theen
* returns user to aggregate view.
*/
function MakeCardDeleteButton(id) {
    var btn = document.createElement("div");
    btn.append("⨯");
    btn.classList.add("deleteButton", "clickable");
    btn.addEventListener("click", function () {
        boardState = (0, controller_1.DeleteCard)(boardState, id);
        appState.focusedCardId = 0;
        appState.guiViewMode = "aggregate";
        document.dispatchEvent(OutdatedGUI);
    });
    return btn;
}
/*
* Removes all child elements of the <body> element, except for <script>.
* Implementation relies on <script>s preceding all other children of <body>.
*/
function StripBody() {
    // Count up scripts in the DOM so they don't get removed.
    // Better than maintaining a magic number in code each time the
    // number of <script> tags in the HTML changes.
    var numScripts = document.getElementsByTagName("script").length;
    while (document.body.children.length > numScripts) {
        document.body.children[numScripts].remove();
    }
}
// Render needs to be prepared to respond to this event before
// InitializeApp raises it.
document.addEventListener("OutdatedGUI", Render);
InitializeApp();

},{"./controller":1}],3:[function(require,module,exports){
(function (global){(function (){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, true, true);
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = cloneDeep;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[2]);
