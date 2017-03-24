function newClassUploadsClick(_id){
	console.info("%cFunction run:\t" + "%cnewClassUploadsClick(_id)", "color: #303F9F; font-weight:700", "color: #303F9F");

	//options show for messages
	$("#cOptionsHeader").show();
	$("#cOptions").show();
	$(".cUserMsg, .cOtherMsg").remove();

	//Change header
	$("#cOptionsHeader").html("Uploads options:");

	//Change options html
//	$("#cOptions > .leftOption").html('<i class="material-icons">search</i><div>Filter</div>');
	$("#cOptions > .leftOption").html('');
	$("#cOptions > .rightOption").html('<i class="material-icons">file_upload</i><div>Upload</div>');


	//Hide and show stuff
	$("#cNewUpload").hide();
	$("#cAddNewGroupContainer").hide();
	$("#cNewMessageBox").hide();


	//Handle main container
	$("#cMainHeader").html("Uploads:");
	$("#cMainHeader").after('<ul class="collapsible" id="cUploadsCollapsible"></ul>');

	//Call functions
	newClassUploadsInit(_id);
}
