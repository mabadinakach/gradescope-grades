
import data from './data.js'
const itemsContainer = document.getElementById('items')

window.onload = handleClientLoad()

let container = document.createElement('div')
container.className = "container"
let row = document.createElement('div')
row.className = "row"
for (let i = 0; i<data.length; i++) {
    
    // if (i%3 == 0) {
    //     let brake = document.createElement('div')
    //     brake.className = "w-100"
    //     row.appendChild(brake)
    // }
    
    let column = document.createElement('div')
    column.className = "col"
    let card = document.createElement('div')
    card.className = "card"
    let cardBody = document.createElement('div')
    cardBody.className = "card-body"
    
    let title = document.createElement('h1')
    let button = document.createElement('button')
    let grade = document.createElement('h3')
    
    let dropDown = document.createElement('p')
    
    let missingAssignments = document.createElement('a')
    missingAssignments.innerHTML = "Missing Assignments"
    missingAssignments.className = "btn btn-primary"
    missingAssignments.type = "button"
    missingAssignments.setAttribute("data-toggle", "collapse");
    missingAssignments.setAttribute("aria-controls", "missingAssignments"+i);
    missingAssignments.href = "#missingAssignments"+i
    missingAssignments.setAttribute("aria-expanded", "false");
    missingAssignments.style.margin = "10px"
    missingAssignments.style.backgroundColor = "red"
    
    let gradedAssignments = document.createElement('a')
    gradedAssignments.innerHTML = "Graded Assignments"
    gradedAssignments.className = "btn btn-primary"
    gradedAssignments.type = "button"
    gradedAssignments.setAttribute("data-toggle", "collapse");
    gradedAssignments.setAttribute("aria-controls", "gradedAssignments"+i);
    gradedAssignments.setAttribute("data-target", "#gradedAssignments"+i)
    gradedAssignments.setAttribute("aria-expanded", "false");
    gradedAssignments.style.backgroundColor = "green"
    
    
    
    dropDown.appendChild(gradedAssignments)
    
    
    let infoRow = document.createElement('div')
    infoRow.className = "row"
    let gradedCol = document.createElement('div')
    gradedCol.className = "col"
    let colapseDiv = document.createElement('div')
    colapseDiv.style.margin = "10px"
    colapseDiv.className = "collapse multi-collapse"
    colapseDiv.id = "gradedAssignments"+i
    
    for (let k = 0;k<data[i]["assignments"].length; k++) {
        let gradedDiv = document.createElement('div')
        gradedDiv.innerHTML = data[i]["assignments"][k]
        colapseDiv.appendChild(gradedDiv)
    }
    
    // gradedDiv.id = "missingAssignments"
    colapseDiv.className = "card card-body"
    gradedCol.appendChild(colapseDiv)
    infoRow.append(gradedCol)
    
    
    title.className = "card-title"
    title.innerHTML = data[i]["class"]
    
    grade.className = "card-text"
    //grade.style.color = "green"
    grade.innerHTML = `Grade: ${data[i]["grade"]}`
    
    button.className = "btn btn-primary"
    button.innerHTML = "Details"
    button.id = i
    
    
    cardBody.appendChild(title)
    cardBody.appendChild(grade)
    
    // Object.entries(data[i]["dates"]).forEach(([key, value]) => {
    //     console.log(Object.keys(data[i]["dates"][key])[0])
    //     console.log(Object.values(value)[0])
    //     console.log(Date(Object.values(value)[0]))
    // });
    
    
    if(data[i]["missing"] != null){
        
        let missingCol = document.createElement('div')
        missingCol.className = "col"
        let colapseDiv = document.createElement('div')
        colapseDiv.style.margin = "10px"
        colapseDiv.className = "collapse multi-collapse"
        colapseDiv.id = "missingAssignments"+i
        
        // gradedDiv.id = "missingAssignments"
        colapseDiv.className = "card card-body"
        cardBody.appendChild(infoRow)
        
        // let text = document.createElement('h5')
        // text.innerHTML = "Missing Assignments:"
        // cardBody.appendChild(text)
        for(let j = 0; j<data[i]["missing"].length;j++) {
            let missingDiv = document.createElement('div')
            missingDiv.innerHTML = data[i]["missing"][j]
            
            // console.log(data[i]["missing"][j])
            // let missing = document.createElement('p')
            // missing.innerHTML = data[i]["missing"][j]
            // missing.style.color = "red"
            // cardBody.append(missing)
            
            colapseDiv.appendChild(missingDiv)
        }
        
        missingCol.appendChild(colapseDiv)
        infoRow.append(missingCol)
        dropDown.appendChild(missingAssignments)
        
    }
    
    
    cardBody.appendChild(dropDown)
    cardBody.appendChild(infoRow)
    let center = document.createElement('div')
    center.className = "text-center"
    center.appendChild(button)
    cardBody.appendChild(center)
    
    card.appendChild(cardBody)
    card.style.margin = "10px"
    card.style.minHeight = "150px"
    card.style.width = "520px"
    column.appendChild(card)
    row.appendChild(column)
    container.appendChild(row)
    
    //itemsContainer.appendChild(card)
}
itemsContainer.appendChild(container)
console.log(itemsContainer)

const all_items_button = Array.from(document.querySelectorAll("button"))
console.log(all_items_button)

all_items_button.forEach(elt => elt.addEventListener('click', (index) => {
    console.log(elt.getAttribute('id'))
    console.log(data[elt.getAttribute('id')])
    window.open(data[elt.getAttribute('id')]["link"])
}))


var CLIENT_ID = '486906308520-7gapsff55hia8hj8kvgk3mdctjojtilo.apps.googleusercontent.com';
var API_KEY = 'AIzaSyChNbkCvbk2KBayw2nzgaz-bW5BveZOsO4';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
*  On load, called to load the auth2 library and API client library.
*/
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
*  Initializes the API client library and sets up sign-in state
*  listeners.
*/
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        
        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
*  Called when the signed in status changes, to update the UI
*  appropriately. After a sign-in, the API is called.
*/
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listUpcomingEvents();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
*  Sign in the user upon button click.
*/
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
*  Sign out the user upon button click.
*/
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
* Append a pre element to the body containing the given message
* as its text node. Used to display the results of the API call.
*
* @param {string} message Text to be placed in pre element.
*/
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/**
* Print the summary and start datetime/date of the next ten events in
* the authorized user's calendar. If no events are found an
* appropriate message is printed.
*/
function listUpcomingEvents() {
    
    for (let i = 0; i<data.length; i++) {
        Object.entries(data[i]["dates"]).forEach(([key, value]) => {
            console.log(Object.keys(data[i]["dates"][key])[0])
            console.log(Object.values(value)[0])
            var date = Date.parse(Object.values(value)[0])
            var dateEpoch = new Date(date)
            var year = dateEpoch.getFullYear();
            var month = dateEpoch.getMonth() + 1;
            var day = dateEpoch.getDate();
            var dateTime = year + "-" + month + "-" + day
            console.log(dateTime)
            var event = {
                'summary': `${data[i]["class"]} - ${Object.keys(data[i]["dates"][key])[0]}`,
                'location': '',
                'description': `${Object.keys(data[i]["dates"][key])[0]} due today`,
                'start': {
                    'dateTime': dateTime+'T22:00:00-07:00',
                    'timeZone': 'America/Los_Angeles'
                },
                'end': {
                    'dateTime': dateTime+'T22:59:00-07:00',
                    'timeZone': 'America/Los_Angeles'
                },
                'recurrence': [
                    // 'RRULE:FREQ=DAILY;COUNT=2'
                ],
                'attendees': [
                    
                ],
                'reminders': {
                    'useDefault': false,
                    'overrides': [
                        {'method': 'popup', 'minutes': 1440},
                        {'method': 'popup', 'minutes': 10},
                    ]
                }
            };

            var request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event
            });
            
            gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'timeMin': (new Date()).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 30,
                'orderBy': 'startTime'
            }).then(function(response) {
                var events = response.result.items;
            
                if (events.length > 0) {
                    for (let j = 0; j < events.length; j++) {
                        var event = events[j];
                        var when = event.start.dateTime;
                        if (!when) {
                            when = event.start.date;
                        }
                        if (event.summary == `${data[i]["class"]} - ${Object.keys(data[i]["dates"][key])[0]}`) {
                            console.log("existe")
                            return
                        } 
                        //appendPre(event.summary + ' (' + when + ')')
                    }
                    request.execute(function(event) {
                        appendPre('Event added to calendar: ' + `${data[i]["class"]} - ${Object.keys(data[i]["dates"][key])[0]}`);
                    });
                } else {
                    //appendPre('No upcoming events found.');
                }
            });
                
        });
    }   
}