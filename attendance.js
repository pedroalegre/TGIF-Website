var url = "https://nytimes-ubiqum.herokuapp.com/congress/113/senate";
var allMembers = data.results[0].members;
var senateGlanceTable = '';

$(function () {
	
	console.log("Getting the JSON");
  
  $.getJSON(url, doTheWork);
  
  console.log("JSON is coming...");
});

function doTheWork(data) {
  console.log(senateGlanceTable);
  console.log("Received JSON with " + allMembers.length + " members");
  
  console.log("Table should appear below:");
  
	var headerHTML = createHeader();
	
	$('#senateGlanceHead').html(headerHTML);
	
	// $('#senateLeastEngagedHead').html(headerHTML);
	
  var tableHtml = buildTableHtmlWithPlainJs(senateGlanceTable);
  
  $('#senateGlanceBody').html(tableHtml);
	
}

// Headers for the all the tables
function createHeader() {
	var headerGlance = { 'senateGlance': [{
		'party': 'Party',
		'numReps': 'Number of Reps',
		'votesWithPartyPct': '% Votes with Party'
	}], 'headerAttendance': [{
		'name': 'Name',
		'missedVotes': 'No. Missed Votes',
		'votesPct': '% Missed'
	}], 'headerLoyalty': [{
		'name': 'Name',
		'partyVotes': 'No. Party Votes',
		'votesPct': '% Party Votes'
	}]
	};
	
	var html = "";
	
	headerGlance.senateGlance.forEach(function(headerGlance) {
		var row =
				'<tr>' +
					'<th>' + headerGlance.party + '</th>' +
					'<th>' + headerGlance.numReps + '</th>' +
					'<th>' + headerGlance.votesWithPartyPct + '</th>' +
				'</tr>';
		html += row;
	});
	
	return html;
}
	
function buildTableHtmlWithPlainJs(result) { // people is a parameter
	
	var html = "";
	var template = $('#senateGlanceBody').html();
 	return Mustache.render(template, { members: result });
	
	// result.forEach(function(person) {
	//	html += Mustache.render(template, person);
	// });
  
  /*
	result.forEach(function(row) { // people is a parameter
		var row =
				'<tr>' +
					'<td>' + row.party + '</td>' +
					'<td>' + row.count + '</td>' +
					'<td>' + row.averagePct + '</td>' +
				'</tr>';
  */  
		
  
  return html;
}

glanceTable(allMembers);

//glanceTable();
//senateLeastEngaged();
//senateMostEngaged();


// Create the Glance table
function glanceTable(allMembers) {
	var democratsCount = 0;
	var republicansCount = 0;
	var independentsCount = 0;
	var democratsVotesWithParty = 0;
	var republicansVotesWithParty = 0;
	var independentsVotesWithParty = 0;

	// Count the number of democrats, republicans and independents
	$.each(allMembers, function(i) {
		if (allMembers[i].party === 'D') {
			democratsCount ++;
			var convertPctNumber = parseFloat(allMembers[i].votes_with_party_pct);
			democratsVotesWithParty += convertPctNumber;
		} else if (allMembers[i].party === 'R') {
			var convertPctNumber = parseFloat(allMembers[i].votes_with_party_pct);
			republicansCount ++;
			republicansVotesWithParty += convertPctNumber;
		} else {
			var convertPctNumber = parseFloat(allMembers[i].votes_with_party_pct);
			independentsCount ++;
			independentsVotesWithParty += convertPctNumber;
		}		
	});	

	// Get the average percentage with 2 decimal digits
	var totalAverageVotes = ((democratsVotesWithParty + republicansVotesWithParty + independentsVotesWithParty)/allMembers.length).toFixed(2);
	democratsVotesWithParty = (democratsVotesWithParty/democratsCount).toFixed(2);
	republicansVotesWithParty = (republicansVotesWithParty/republicansCount).toFixed(2);
	independentsVotesWithParty = (independentsVotesWithParty/independentsCount).toFixed(2);
	
	// Create
	senateGlanceTable = [{
			'party': 'Democrats',
			'count': JSON.stringify(democratsCount),
			'averagePct': democratsVotesWithParty
		}, {
			'party': 'Republicans',
			'count': JSON.stringify(republicansCount),
			'averagePct': republicansVotesWithParty
		}, {
			'party': 'Independents',
			'count': JSON.stringify(independentsCount),
			'averagePct': independentsVotesWithParty
		}, {
			'party': 'Total',
			'count': JSON.stringify(democratsCount + republicansCount + independentsCount),
			'averagePct': totalAverageVotes,
		}];

	// Create the rows in the table
	/* for (var i = 0; i < senateData.glance.length; i++) {
		var row = document.createElement('tr');
		var member = [document.createTextNode(senateData.glance[i].party), document.createTextNode(senateData.glance[i].count), document.createTextNode(senateData.glance[i].averagePct)];
		for (var j=0; j < member.length; j++) {
			var td = document.createElement('td');
			var memberData = document.createTextNode(member[j].nodeValue);
			td.appendChild(memberData);
			row.appendChild(td);
			positionBody.appendChild(row);
		}
	} */
}

/*
function senateLeastEngaged(allMembers) {
	var header = ['Name', 'No. Missed Votes', '% Missed'];
	
}
*/

/*
// Create the Senate Least Engaged table
function senateLeastEngaged() {
	//var allMembers = data.results[0].members;
	var positionHead = document.getElementById('senateLeastEngagedHead');
	var positionBody = document.getElementById('senateLeastEngagedBody');
	var header = ['Name', 'No. Missed Votes', '% Missed'];
	var row = document.createElement('tr');
	var JSONPosition = senateData.leastEngaged;

	// Create the Header
	createTableHeader(header, row, positionHead);

	// Sort by the least engaged
	allMembers = allMembers.sort(function(a, b) {
		return b.missed_votes_pct - a.missed_votes_pct
	});

	// Put the members data in the JSON
	addObjectsJSON(allMembers, JSONPosition);

	// Create the Body
	createBody(allMembers, JSONPosition, positionBody);
}

// Create the Senate Most Engaged table
function senateMostEngaged() {
	//var allMembers = data.results[0].members;
	var positionHead = document.getElementById('senateMostEngagedHead');
	var positionBody = document.getElementById('senateMostEngagedBody');
	var header = ['Name', 'No. Missed Votes', '% Missed'];
	var row = document.createElement('tr');
	var JSONPosition = senateData.mostEngaged;

	// Create the Header
	createTableHeader(header, row, positionHead);

	// Sort by the most engaged
	allMembers = allMembers.sort(function(a, b) {
		return a.missed_votes_pct -b.missed_votes_pct
	});

	// Put the members data in the JSON
	addObjectsJSON(allMembers, JSONPosition);

	// Create the Body
	createBody(allMembers, JSONPosition, positionBody);
}

// Create the object prototype for the Engagement and Loyalty tables
function memberObject(firstName, middleName, lastName, url, missedVotes, missedPct) {
	this.firstName = firstName;
	this.middleName = middleName;
	this.lastName = lastName;
	this.url = url;
	this.missedVoted = missedVotes;
	this.missedPct = missedPct;
}

// Create the table header
function createTableHeader(headers, row, positionHead) {
	for (var i = 0; i < headers.length; i++) {
		var head = document.createTextNode(headers[i]);
		var th = document.createElement('th');
		th.appendChild(head);
		row.appendChild(th);
		positionHead.appendChild(row);
	}
}

// Put the members data in the JSON
function addObjectsJSON(allMembers, JSONPosition) {
	$.each(allMembers, function(i) {
		var mData = new memberObject(allMembers[i].first_name, allMembers[i].middle_name, allMembers[i].last_name, allMembers[i].url, allMembers[i].missed_votes, allMembers[i].missed_votes_pct);
		JSONPosition.push(mData);
	});
}

// Create the Body
function createBody(allMembers, JSONPosition, positionBody) {
	for (var i = 1; i <= allMembers.length*0.1; i++) {
		var row = document.createElement('tr');
		var td = document.createElement('td');
		var middleName = (JSONPosition[i].middleName || '');
		var fullName = document.createElement('a');
		fullName.setAttribute('href', JSONPosition[i].url);	fullName.appendChild(document.createTextNode(JSONPosition[i].firstName + " " + middleName + " " + JSONPosition[i].lastName));
		var member = [document.createTextNode(JSONPosition[i].missedVoted), document.createTextNode(JSONPosition[i].missedPct + '%')];
		td.appendChild(fullName);
		row.appendChild(td);
		positionBody.appendChild(row);
		for (var j = 0; j < member.length; j++) {
			var td = document.createElement('td');
			var memberData = document.createTextNode(member[j].nodeValue);
			td.appendChild(memberData);
			row.appendChild(td);
			positionBody.appendChild(row);
		}
	}
}
*/