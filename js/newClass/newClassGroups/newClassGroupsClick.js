function newClassGroupsClick(_id){
	console.info("%cFunction run:\t" + "%cnewClassGroupsClick(_id)", "color: #303F9F; font-weight:700", "color: #303F9F");

	//options show for messages
	$("#cOptionsHeader").show();
	$("#cOptions").show();

	//Change header
	$("#cOptionsHeader").html("Groups options:");

	//Change options html
	$("#cOptions > .leftOption").html('<i class="material-icons">group</i><div>My groups</div>');
	$("#cOptions > .rightOption").html('<i class="material-icons">group_add</i><div>Create group</div>');

	//Add #cAddNewGroupContainer if don't exists
	if($("#cAddNewGroupContainer").length == 0)
		$("#cOptions").append('<div hidden id="cAddNewGroupContainer"><div id="cGroupNameInput" name="groupName" class="materialLineInput materialInput" maxlength="25" label="Group name"><input type="text"></div><div id="cGroupPrivacyDropdown" name="groupPrivacy" class="unselectable materialDropDown" placeholder="Privacy" options=\'["Public", "Closed", "Invite Only"]\'></div><div id="cGroupDescInput" name="groupDesc" class="materialLineInput materialTextarea" maxlength="500" label="Group description"><textarea rows="1"></textarea></div><div id="cGroupCreateBtn" class="unselectable card-1">Create group</div></div>');

	//Hide and show stuff
	$("#cAddNewGroupContainer").hide();
	$("#cNewUpload").hide()
	$("#cNewMessageBox").hide();

	//Handle main container
	$("#cMainHeader").html("Groups:");
	$("#cMainHeader").after('<div id="cGroupsContainer"></div>');


	//Call functions
	materialInputInit();
	materialTextareaInit();
	materialDropdownInit();

	newClassGroupsInit(_id);
}
