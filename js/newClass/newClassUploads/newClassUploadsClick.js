function newClassUploadsClick(_id){
	console.info("%cFunction run:\t" + "%cnewClassUploadsClick(_id)", "color: #303F9F; font-weight:700", "color: #303F9F");

	$("#cOptionsHeader").show();
	$("#cOptions").show();

	$("#cOptionsHeader").html("Uploads options:");

	$("#cOptions > .leftOption").html('<i class="material-icons">search</i><div>Filter</div>');
	$("#cOptions > .rightOption").html('<i class="material-icons">file_upload</i><div>Upload</div>');
	$("#cOptions").append('<div id="cNewUpload"><div class="materialLineInput materialInput" id="cNewUploadHeader" maxLength="50" label="Header"><input type="text"></div><div class="materialLineInput materialInput" id="cNewUploadSubject" maxLength="50" label="Subject"><input type="text"></div><div class="materialTagInput" id="cNewUploadTags" label="Tags"><input type="text" maxLength="25"></div><textarea id="cNewUploadContent"></textarea><div id="cNewUploadButton" class="card-1">Upload</div></div>');

	$("#cMainHeader").html("Uploads:");

	$("#cMainHeader").after('<ul class="collapsible" id="cUploadsCollapsible"></ul>');

	newClassUploadsInit(_id);
}


//<div id="cNewUpload">
//	<div class="materialLineInput materialInput" id="cNewUploadHeader" maxLength="50" label="Header">
//		<input type="text">
//	</div>
//	<div class="materialLineInput materialInput" id="cNewUploadSubject" maxLength="50" label="Subject">
//		<input type="text">
//	</div>
//	<div class="tagInput" id="cNewUploadTags" label="Tags">
//		<input type="text" maxLength="25">
//	</div>
//  <textarea id="cNewUploadContent" style="visibility: hidden;"></textarea>
//  <textarea id="cNewUploadContent"></textarea>
//</div>
