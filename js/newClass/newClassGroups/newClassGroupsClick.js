function newClassGroupsClick(_id) {
	console.info("%cFunction run:\t" + "%cnewClassGroupsClick(_id)", "color: #303F9F; font-weight:700", "color: #303F9F");

	$(".noItemMessageClass").remove();

	//options show for messages
	$("#cOptionsHeader").show();
	$("#cOptions").show();
	$(".cUserMsg, .cOtherMsg").remove();

	//Change header
	$("#cOptionsHeader").html("Groups options:");

	//Change options html
	$("#cOptions > .leftOption").html('<i class="material-icons">group</i><div>My groups</div>');
	$("#cOptions > .rightOption").html('<i class="material-icons">group_add</i><div>Create group</div>');


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
