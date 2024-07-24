// Data Structure
/*
    "players": 
        [{
            "name": "Player Name",
            "scores": [{
                "key": date-index,
                "value": score
            },
            {
                ...
            }]
        }, 
        {
            ...
        }]
    }
    
    "dates": [
        "mm/dd",
        "mm/dd",
        ...
    ] 
*/

// Break Data into Meaningful Pieces
// players[index].name : Player Name
// players[i].scores[j].key : Date Index
// players[i].scores[j].value : Score (default = -99)

const dateRegExp = /^[0-9]{2}\/[0-9]{2}$/g;

const datesData = localStorage.getItem("dates");
const playersData = localStorage.getItem("players");

let dates = [];
if (datesData != null) {
    dates = JSON.parse(datesData);
}

let players = [];
if (playersData != null) {
    players = JSON.parse(playersData);
}

let setup = false;

//localStorage.clear();

//const abortController = new AbortController();

//console.log(players);

function LoadTable() {
    
    if (!setup) {
        // Add Rows per Player
        for (let i = 0; i < players.length; i++) {
            document.getElementById("new-player-input").insertAdjacentHTML("beforebegin", `<tr>
                <td class="player-name">${players[i].name}</td>
                <td class="average-score" player=${i}></td>
                <td></td>
                <td type="score" key="0" player=${i} class="changeable">-</td>
                <td type="score" key="1" player=${i} class="changeable">-</td>
                <td type="score" key="2" player=${i} class="changeable">-</td>
                <td type="score" key="3" player=${i} class="changeable">-</td>
                <td type="score" key="4" player=${i} class="changeable">-</td>
                <td type="score" key="5" player=${i} class="changeable">-</td>
                <td type="score" key="6" player=${i} class="changeable">-</td>
                <td type="score" key="7" player=${i} class="changeable">-</td>
                <td type="score" key="8" player=${i} class="changeable">-</td>
                <td type="score" key="9" player=${i} class="changeable">-</td>           
            </tr>`);
        }

        // Add EventListeners to Changeable Elements
        let changeableElements = document.getElementsByClassName("changeable");
        Array.from(changeableElements).forEach((element) => {
            element.addEventListener("click", EnableInput);
        })

        setup = true;
    }

    // Set Values
    let scoreElements = document.getElementsByClassName("changeable");
    let dateCounter = 0;
    Array.from(scoreElements).forEach((element) => {
        if (element.getAttribute("type") == "score") {
            if (players[element.getAttribute("player")].scores[element.getAttribute("key")].value != -99) {
                element.innerHTML = players[element.getAttribute("player")].scores[element.getAttribute("key")].value;
            } else {
                element.innerHTML = "-";
            }
        } else if (element.getAttribute("type") == "date") {
            if (dateCounter < dates.length) {
                element.innerHTML = dates[dateCounter];
                dateCounter++;
            }
        }
    });

    UpdateAverages();
}

function UpdateAverages() {
    let averages = document.getElementsByClassName("average-score");

    Array.from(averages).forEach((element) => {
        let playerId = element.getAttribute("player");
        //console.log(playerId);
        if (playerId != -1 && playerId != null) {
            let scores = []
            for (let i = 0; i < players[playerId].scores.length; i++) {
                scores.push(players[playerId].scores[i].value);
            }
            scores.sort((a,b) => b - a);

            let sum = 0;
            let numPlayed = 0;
            for (let i = 0; i < 5; i++) {
                if (scores[i] != -99) {
                    sum += parseInt(scores[i]);
                    numPlayed++
                }
            }
            let average = sum / numPlayed;
            element.innerHTML = average;
        }
    })

}

function EnableInput(e) {
    //console.log(this);
    //console.log(e.target);
    if (e.target.getAttribute("class") == "changeable") {
        let currentValue = "";
        if (e.target.getAttribute("type") == "date" && e.target.innerHTML == "-") {
            currentValue = `mm/dd`;
        } else {
            currentValue = e.target.innerHTML;
        }
        let playerIndex = e.target.getAttribute("player");
        let dateIndex = e.target.getAttribute("key");

        let newId = `cell_${playerIndex}_${dateIndex}`;
        //console.log(newId);

        this.innerHTML = `
                <input id=${newId} type="text" player=${playerIndex} key=${dateIndex} placeholder=${currentValue}>
                <button input-id=${newId} onclick="UpdateCell(${newId})">&check;</button>
        `;
    }    
}


function UpdateCell(inputElement) {
    //console.log(inputElement);
    //let inputId = this.getAttribute("input-id");
    //let inputElement = document.getElementById(inputId);

    let playerIndex = inputElement.getAttribute("player");
    let dateIndex = inputElement.getAttribute("key");
    let parentElement = inputElement.parentElement;
    let inputValue = inputElement.value;
    let validDate = dateRegExp.test(inputValue)

    //console.log(parentElement);
    //console.log(playerIndex);
    //console.log(dateIndex);
    //console.log(inputValue);
    //console.log(inputElement.value);
    //console.log(validDate);

    if (playerIndex != "null") {
        //console.log("Update Player");
        players[playerIndex].scores[dateIndex].value = inputValue;
        parentElement.innerHTML = inputValue;
    } else if (validDate == true) {
        //console.log("Update Date");
        dates[dateIndex] = inputValue;
        parentElement.innerHTML = inputValue;
    } else {
        //console.log("Replace with Placeholder");
        parentElement.innerHTML = inputElement.getAttribute("placeholder");
    }

    SaveData();
    UpdateAverages();
    //ResetListener(parentElement);
}

function AddWeek() {
    dates.unshift("-");

    if (dates.length > 10) {
        dates.pop();
    }


    // Adjust Player Scores
    //console.log(players);
    for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < players[i].scores.length; j++) {
            players[i].scores[j].key += 1;
            if (players[i].scores[j].key == 10) {
                players[i].scores[j].key = 0;
                players[i].scores[j].value = -99;
            }
        }

        players[i].scores.sort((a, b) => a.key - b.key);
    }
    //console.log(players);

    // Update Table - May need to Reset Table
    SaveData();
    LoadTable();
}

function AddPlayer() {
    let newPlayer = document.getElementById("name").value;
    document.getElementById("name").innerHTML = document.getElementById("name").getAttribute("placeholder");
    
    players.push({
        name: "",
        scores: [
            {
                key: 0,
                value: -99
            },
            {
                key: 1,
                value: -99
            },
            {
                key: 2,
                value: -99
            },
            {
                key: 3,
                value: -99
            },
            {
                key: 4,
                value: -99
            },
            {
                key: 5,
                value: -99
            },
            {
                key: 6,
                value: -99
            },
            {
                key: 7,
                value: -99
            },
            {
                key: 8,
                value: -99
            },
            {
                key: 9,
                value: -99
            }
        ]
    });

    players[players.length - 1].name = newPlayer;

    // Update Table

    document.getElementById("new-player-input").insertAdjacentHTML("beforebegin", `<tr>
            <td class="player-name">${newPlayer}</td>
            <td class="average-score" player=${players.length-1}></td>
            <td></td>
            <td type="score" key="0" player=${players.length-1} class="changeable">-</td>
            <td type="score" key="1" player=${players.length-1} class="changeable">-</td>
            <td type="score" key="2" player=${players.length-1} class="changeable">-</td>
            <td type="score" key="3" player=${players.length-1} class="changeable">-</td>
            <td type="score" key="4" player=${players.length-1} class="changeable">-</td>
            <td type="score" key="5" player=${players.length-1} class="changeable">-</td>
            <td type="score" key="6" player=${players.length-1} class="changeable">-</td>
            <td type="score" key="7" player=${players.length-1} class="changeable">-</td>
            <td type="score" key="8" player=${players.length-1} class="changeable">-</td>
            <td type="score" key="9" player=${players.length-1} class="changeable">-</td>           
        </tr>`);

    
    //abortController.abort();

    let changeableElements = document.getElementsByClassName("changeable");
    Array.from(changeableElements).forEach((element) => {
        element.removeEventListener("click", EnableInput);

        element.addEventListener("click", EnableInput);
    });

    SaveData();
}

function SaveData() {
    let dateJSON = JSON.stringify(dates);
    let playerJSON = JSON.stringify(players);

    localStorage.setItem("dates", dateJSON);
    localStorage.setItem("players", playerJSON);
}


LoadTable();