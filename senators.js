createTable();
createStatesDropdown();

// store the checked and unchecked options
var checked = [];
var unchecked = [];
// Store the selected State
var selectedState = '';

// Filter the table according to the checked boxes
$(document).ready(function() {
	
	// Filter according to the selected State
	$('select').change(function() {
		selectedState = 'state-' + $(this).find('option:selected').text();
		
		if(selectedState !== 'state-All' && $('#memberBody tr').hasClass(selectedState)) {
			checkedParties();
			for(var i = 0; i < unchecked.length; i++) {
				if($('#memberBody tr').hasClass(selectedState)) {
					$('#memberBody tr').hide();
					showAllUncheckedParties();
					filterStateAll();
				}
			}			
		} else if(checked.length > '0') {
				hideUncheckedShowChecked();
				
				// If no option is selected show all
			} else if(unchecked.length == '3' && selectedState == 'state-All') {
				$('#memberBody tr').show();
			}
		$('#checkboxes input').click(function(){
			checkedParties();
			// Check if any option is selected
			if(checked.length > '0') {
				hideUncheckedShowChecked();
				
				// If no option is selected show all
			} else {
				for(var i = 0; i < unchecked.length; i++) {
					if(selectedState == 'state-All') {
						$('.party-' + unchecked[i].value).show();
					} else {
						$('.party-' + unchecked[i].value  + '.' + selectedState).show();
					}
				}
			}
			if(unchecked.length == '3' && selectedState == 'state-All') {
				$('#memberBody tr').show();
			}
		});
	}).trigger('change');
});

// Create the table
function createTable() {
	var allMembers = data.results[0].members;
	var positionHead = document.getElementById('memberHead');
	var positionBody = document.getElementById('memberBody');
	var headers = ['Name', 'Party', 'State', 'Years in Office', '% Votes with Party'];
	var row = document.createElement('tr');
	for (i = 0; i < headers.length; i++) {
		var head = document.createTextNode(headers[i]);
		var th = document.createElement('th');
		th.appendChild(head);
		row.appendChild(th);
		positionHead.appendChild(row);
	}

	for (var i = 1; i < allMembers.length; i++) {
		var row = document.createElement('tr');
		row.className = 'party-' + allMembers[i].party + ' ' + 'state-' + allMembers[i].state;
		var td = document.createElement('td');
		var middleName = (allMembers[i].middle_name || '');
		var fullName = document.createElement('a');
		fullName.setAttribute('href', allMembers[i].url);	fullName.appendChild(document.createTextNode(allMembers[i].first_name + " " + middleName + " " + allMembers[i].last_name));
		var member = [document.createTextNode(allMembers[i].party), document.createTextNode(allMembers[i].state), document.createTextNode(allMembers[i].seniority), document.createTextNode(allMembers[i].votes_with_party_pct + '%')];
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

// Get the list of states
function createStatesDropdown() {
	var allMembers = data.results[0].members;
	var states = [];
	for(var i = 0; i < allMembers.length; i++) {
		if(states.indexOf(allMembers[i].state) == -1) {
			states.push(allMembers[i].state);
		}
	}

	states.sort();

	// Create the States dropdown
	var positionStates = document.getElementById('filterState');
	for (var i = 0; i < states.length; i++) {
		var option = document.createElement('option');
		option.value = states[i];
		var stateData = document.createTextNode(states[i]);
		option.appendChild(stateData);
		positionStates.appendChild(option);
	}
}

// Get the check and unchecked parties
function checkedParties() {
	checked = $('#checkboxes input:checked');
	unchecked = $('#checkboxes input:not(:checked)');
}

// Show when all options are unchecked
function showAllUncheckedParties() {
	if(unchecked.length == '3' && selectedState !== 'state-All') {
		for(var i = 0; i < unchecked.length; i++) {
			$('.party-' + unchecked[i].value  + '.' + selectedState).show();
		}
	}
}

// Show the checked options
function filterStateAll() {
	checkedParties();
	for(var i = 0; i < checked.length; i++) {
		if(selectedState == 'state-All') {
			$('.party-' + checked[i].value).show();
		} else {
			$('.party-' + checked[i].value + '.' + selectedState).show();
		}
	}
}

// Hide unchecked options and show checked options
function hideUncheckedShowChecked() {
	// Hide the unchecked options
	for(var i = 0; i < unchecked.length; i++) {
		if($('#memberBody tr').hasClass(selectedState) || selectedState == 'state-All') {
			$('.party-' + unchecked[i].value).hide();
		}
	}
	// Show the checked options
	filterStateAll();
}