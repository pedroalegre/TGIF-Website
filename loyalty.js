glanceTable();
senateLeastLoyal();
senateMostLoyal();

// Create the Glance table
function glanceTable() {
	var democratsCount = 0;
	var republicansCount = 0;
	var independentsCount = 0;
	var democratsVotesWithParty = 0;
	var republicansVotesWithParty = 0;
	var independentsVotesWithParty = 0;
	var allMembers = data.results[0].members;
	var positionHead = document.getElementById('senateGlanceHead');
	var positionBody = document.getElementById('senateGlanceBody');
	var header = ['Party', 'Number of Reps', '% Votes with Party'];
	var row = document.createElement('tr');
	
	// Create the header
	createTableHeader(header, row, positionHead);
	
	// Count the number of democrats, republicans and independents
	for (var i = 0; i < allMembers.length; i++) {
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
	}
	
	// Place the party count values in the JSON file
	senateData.glance[0].count = JSON.stringify(democratsCount);
	senateData.glance[1].count = JSON.stringify(republicansCount);
	senateData.glance[2].count = JSON.stringify(independentsCount);
	senateData.glance[3].count = JSON.stringify((democratsCount + republicansCount + independentsCount));
	
	// Get the average percentage with 2 decimal digits
	var totalAverageVotes = ((democratsVotesWithParty + republicansVotesWithParty + independentsVotesWithParty)/allMembers.length).toFixed(2);
	democratsVotesWithParty = (democratsVotesWithParty/democratsCount).toFixed(2);
	republicansVotesWithParty = (republicansVotesWithParty/republicansCount).toFixed(2);
	independentsVotesWithParty = (independentsVotesWithParty/independentsCount).toFixed(2);
	
	// Place the average % votes with party in the JSON file
	senateData.glance[0].averagePct = democratsVotesWithParty;
	senateData.glance[1].averagePct = republicansVotesWithParty;
	senateData.glance[2].averagePct = independentsVotesWithParty;
	senateData.glance[3].averagePct = totalAverageVotes;
	
	// Create the rows in the table
	for (var i = 0; i < senateData.glance.length; i++) {
		var row = document.createElement('tr');
		var member = [document.createTextNode(senateData.glance[i].party), document.createTextNode(senateData.glance[i].count), document.createTextNode(senateData.glance[i].averagePct)];
		for (var j=0; j < member.length; j++) {
			var td = document.createElement('td');
			var memberData = document.createTextNode(member[j].nodeValue);
			td.appendChild(memberData);
			row.appendChild(td);
			positionBody.appendChild(row);
		}
	}
}

// Create the Senate Least Loyal table
function senateLeastLoyal() {
	var allMembers = data.results[0].members;
	var positionHead = document.getElementById('senateLeastLoyalHead');
	var positionBody = document.getElementById('senateLeastLoyalBody');
	var header = ['Name', 'No. Party Votes', '% Party Votes'];
	var row = document.createElement('tr');
	var JSONPosition = senateData.leastLoyal;
	
	// Create the Header
	createTableHeader(header, row, positionHead);
	
	// Sort by the least loyal
	allMembers = allMembers.sort(function(a, b) {
		return a.votes_with_party_pct -b.votes_with_party_pct
	});
	
	// Put the members data in the JSON
	addObjectsJSON(allMembers, JSONPosition);
	
	// Create the Body
	createBody(allMembers, JSONPosition, positionBody);
}

// Create the Senate Most Loyal table
function senateMostLoyal() {
	var allMembers = data.results[0].members;
	var positionHead = document.getElementById('senateMostLoyalHead');
	var positionBody = document.getElementById('senateMostLoyalBody');
	var header = ['Name', 'No. Party Votes', '% Party Votes'];
	var row = document.createElement('tr');
	var JSONPosition = senateData.mostLoyal;
	
	// Create the Header
	createTableHeader(header, row, positionHead);
	
	// Sort by the least loyal
	allMembers = allMembers.sort(function(a, b) {
		return b.votes_with_party_pct -a.votes_with_party_pct
	});
	
	// Put the members data in the JSON
	addObjectsJSON(allMembers, JSONPosition);
	
	// Create the Body
	createBody(allMembers, JSONPosition, positionBody);
}

// Create the object prototype for the Engagement and Loyalty tables
function memberObject(firstName, middleName, lastName, url, partyVotes, partyVotesPct) {
	this.firstName = firstName;
	this.middleName = middleName;
	this.lastName = lastName;
	this.url = url;
	this.partyVotes = partyVotes;
	this.partyVotesPct = partyVotesPct;
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
		var mData = new memberObject(allMembers[i].first_name, allMembers[i].middle_name, allMembers[i].last_name, allMembers[i].url, (((allMembers[i].total_votes)*(allMembers[i].votes_with_party_pct))/100).toFixed(0), allMembers[i].votes_with_party_pct);
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
		var member = [document.createTextNode(JSONPosition[i].partyVotes), document.createTextNode(JSONPosition[i].partyVotesPct + '%')];
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