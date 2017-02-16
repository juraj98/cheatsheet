function newClassGroupsClick(_id){
	console.info("%cFunction run:\t" + "%cnewClassGroupsClick(_id)", "color: #303F9F; font-weight:700", "color: #303F9F");

	$("#cOptionsHeader").html("Groups options:");

	$("#cOptions > .leftOption").html('<i class="material-icons">group</i><div>My groups</div>');
	$("#cOptions > .rightOption").html('<i class="material-icons">group_add</i><div>Create group</div>');
	$("#cOptions").append('<div hidden id="cAddNewGroupContainer"><div id="cGroupNameInput" name="groupName" class="materialLineInput materialInput" maxlength="25" label="Group name"><input type="text"></div><div id="cGroupPrivacyDropdown" name="groupPrivacy" class="unselectable materialDropDown" placeholder="Privacy" options=\'["Public", "Closed", "Invite Only"]\'></div><div id="cGroupDescInput" name="groupDesc" class="materialLineInput materialTextarea" maxlength="500" label="Group description"><textarea rows="1"></textarea></div><div id="cGroupCreateBtn" class="unselectable card-1">Create group</div></div>');

	$("#cMainHeader").html("Groups:");

	$("#cMainHeader").after('<div id="cGroupsContainer"></div>');

	materialInputInit();
	materialTextareaInit();
	materialDropdownInit();

	newClassGroupsInit(_id);
}
