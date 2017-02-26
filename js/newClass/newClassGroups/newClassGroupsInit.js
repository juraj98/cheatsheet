function newClassGroupsInit(_id) {
	console.info("%cFunction run:\t" + "%cnewClassGroupsInit(_id)", "color: #303F9F; font-weight:700", "color: #303F9F");

	downlodGroupsData(_id);

	$("#cOptions > .rightOption").off().click(function() {
		$("#cAddNewGroupContainer").stop().slideToggle(300);

		$(this).toggleClass("weight-700");
	});

	$("#cOptions > .leftOption").off().click(function() {
		$("#cGroupsContainer").children(".cGroup").each(function() {
			//			if($.inArray(,$(this).data("Group")["members"]) != -1){
			//
			//			}
		});
	});

	$("#cGroupCreateBtn").click(function() {
		createNewGroup($(this).parent().materialSubmit(), _id);
	});
}

function downlodGroupsData(_id) {
	$.post(
		baseDir + "/php/get/getGroups.php", {
			idToken: googleTokenId,
			classId: _id
		},
		function(_ajaxData) {

			if (_ajaxData.success) {
				createGroups(_ajaxData.data.groups);
			} else {
				popout(_ajaxData.error.message);
			}
		}
	);
}

function createGroups(_groupsArray) {
	var groupsContainer = $("#cGroupsContainer");
	$(groupsContainer).html("");
	var numberOfGroupsPerColumn = Math.floor($(groupsContainer).width() / 350);
	console.log("NumberOfGroupsPerColumn: " + numberOfGroupsPerColumn);
	var groupsElementsWidth = $(groupsContainer).width() / numberOfGroupsPerColumn - 8;
	console.log("Width: " + groupsElementsWidth + "px");


	for (var i = 0; i < _groupsArray.length; i++) {
		var newGroup = new Group(JSON.stringify(_groupsArray[i]));
		$(groupsContainer).append(newGroup.toElement().width(groupsElementsWidth));
	}
}


function createNewGroup(_data, _classId) {
	if (_data["groupName"] && _data["groupDesc"] && _data["groupPrivacy"]) {
		if (_data["groupName"].length <= 25 && _data["groupDesc"].length <= 500) {

			$.post(
				baseDir + "/php/create/createGroup.php", {
					idToken: googleTokenId,
					classId: _classId,
					groupData: JSON.stringify(_data)
				},
				function(_ajaxData) {

					if (_ajaxData.success) {
						popout("Success");
						downlodGroupsData(_classId);
					} else {
						popout(_ajaxData.error.message);
					}
				}
			);
		} else {
			popout("GroupName or GroupDesc too long");
		}
	} else {
		popout("Please enter all informations");
	}
}
