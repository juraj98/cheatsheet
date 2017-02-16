function classGroupsClick() {
	console.info("%cFunction run:\t" + "%cclassGroupsClick()", "color: #303F9F; font-weight:700", "color: #303F9F");

    $("#classOptionsPanel").html('<div id="group" class="leftOption"><i class="material-icons">group</i>My groups</div> <div id="create" class="rightOption"><i class="material-icons">group_add</i>Create group</div> <div id="classMyGroups" hidden></div> <div id="classCreateGroup" hidden> <div id="classGroupName" name="groupName" class="materialLineInput materialInput" maxLength="25" label="Group Name"><input type="text"></div> <div id="classGroupPrivacy" name="groupPrivacy" unselectable="on" class="unselectable materialDropDown" placeholder="Privacy" options=\'["Public", "Closed", "Invite Only"]\'></div> <div id="classGroupDesc" name="groupDesc" class="materialLineInput materialTextarea" maxLength="300" label="Group Description"><textarea rows="1"></textarea></div> <div id="classCreateGroupSubmit" class="card-1"><i class="material-icons">group_add</i></div> </div>');
	
    $("#classOptionsPanel").after('<div id="classGroups" class="contentRowIgnoreScrollbar"></div>');
    
	classGroupsInit();
	classResize();
}