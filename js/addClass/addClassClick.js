function addClassClick(){
	$(".content").html('<div id="ccContainer" class="card-1"><div class="materialLineInput materialInput" maxLength="10" id="ccName" label="Name"><input type="text"></div><div class="materialLineInput materialInput" maxLength="50" id="ccLongName" label="Long name"><input type="text"></div><div class="materialLineInput materialInput" maxLength="100" id="ccSchool" label="School"><input type="text"></div><div class="card-1 ccButton" id="ccCreateClassButton">Create class</div><div id="ccDivider"></div><div class="materialLineInput materialInput" id="ccInviteToken" label="Invite token"><input type="text"></div><div class="card-1 ccButton" id="ccJoinClassButton">Join class</div></div>');

	materialFormInit();
	addClassInit();

}
