function accountClick(){
	window.location.hash = "account";
	$(".content").html('<div id="aUserInfoPanel" class="card-1"><div id="aUserImageDiv" class="unselectable card-1"><i class="material-icons">person</i><div class="card-1" id="aUserImageUploadButton"><i class="material-icons">file_upload</i><span>Upload image</span></div></div><h1 id="aUserNameAndSurname"></h1><h2 id="aUserUsername"></h2><h2 id="aUserMail"></h2><h3 id="aUserCheatpoints"></h3><input type="text" id="aUserNameEdit"><input type="text" id="aUserSurnameEdit"><input type="text" id="aUserUsernameEdit"><input type="text" id="aUserMailEdit"><i class="material-icons unselectable" id="aUserEditInfo">mode_edit</i><i class="material-icons unselectable" id="aUserSaveInfo">save</i></div><div id="aMessagesHeader" class="aHeader">Messages:</div><div id="aUserMessages"><div id="aMessageBox"><img class="cImage card-1" src="images/placeholders/profilePicturePlaceholder.png" title="" style=""><span class="cName">New message</span><div class="cMsgConainer"><div class="cMsgBox card-1"><textarea></textarea></div><div class="cMsgBoxArrowConatiner"><div class="cMsgBoxArrow"></div></div></div></div></div><div id="aContactsHeader" class="aHeader">Messages:</div><div id="aUserContacts" class="unselectable card-1"><div id="aUserNewMessage"><i class="material-icons acceptClick">add</i><span class="acceptClick">New message</span><input type="text" id="aUserNewMessageInput"><div id="aUserNewMessageSuggestions" class="card-2"></div></div></div>');

	accountInit();
}
