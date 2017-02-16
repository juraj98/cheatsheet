var groupsData;
	//

function classGroupsInit() {
    console.info("%cFunction run:\t" + "%cclassGroupsInit()", "color: #303F9F; font-weight:700", "color: #303F9F");
    $.post(
        baseDir + "/php/get/getGroups.php", {
            idToken: googleTokenId,
            classId: 1 //NOTE: Hardcoded class id
        },
        function (_ajaxData) {
            switch (_ajaxData[0]) {
            case "e":
                popout("Specific query error: " + _ajaxData);
                break;
            case "1":
                popout("User is not a member of the desired class" + _ajaxData);
                break;
            case "2":
                popout("Query for user’s classes not successful" + _ajaxData);
                break;
            case "3":
                popout("Did not received every needed variable on post" + _ajaxData);
                break;
            default:
                groupsData = JSON.parse(_ajaxData);
                setupGroups();
                break;
            }
        }
    );
}

function setupGroups() {
    var groupsColumnsCount = Math.floor($("#classGroups").innerWidth() / 450);
    var groupsColumnsWidth = ($("#classGroups").innerWidth() - groupsColumnsCount * 10) / groupsColumnsCount;

    if(groupsColumnsCount == 0){
        groupsColumnsCount = 1;
    }
    if(groupsColumnsCount > groupsData.length){
        groupsColumnsCount = groupsData.length;
    }
    
    var columnsHTML = new Array();
    for (var i = 0; i < groupsColumnsCount; i++) {
        columnsHTML[i] = '<div class="classGroupsRow" style="width: ' + groupsColumnsWidth + 'px;">';
        for (var j = i; j < groupsData.length; j += groupsColumnsCount) {
            
            if (groupsData[j]["image"] == null) {
                columnsHTML[i] += '<div groupId="' + groupsData[j]["id"] + '" class="classGroup card-1"> <div class="classGroupImage card-1"> <i class="material-icons">group</i> <div class="uploadPicture"> <p><i class="material-icons">file_upload</i>Upload picture</p> </div> </div> <div class="classGroupInfo"> <h1>' + groupsData[j]["name"] + '</h1> <h2>';
            } else {
                columnsHTML[i] += '<div groupId="' + groupsData[j]["id"] + '" class="classGroup card-1"> <img class="classGroupImage card-1" src="' + groupsData[j]["image"] + '"><div class="classGroupInfo"> <h1>' + groupsData[j]["name"] + '</h1> <h2>'; //Fix me: css for image is not setted up
            }
            switch (groupsData[j]["privacy"]) {
            case "0":
                columnsHTML[i] += 'Public';
                break;
            case "1":
                columnsHTML[i] += 'Closed';
                break;
            case "2":
                columnsHTML[i] += 'Invite Only';
                break;
            }
            
            if(groupsData[j]["privacy"] == 2){
                columnsHTML[i] += '</h2><h3>' + groupsData[j]["description"] + '</h3><i class="material-icons gropuSetting unselectable" unselectable="on">more_vert</i></div>';
            } else {
                columnsHTML[i] += '</h2><h2 class="classGroupMembers unselectable" unselectable="on">' + JSON.parse(groupsData[j]["members"]).length + ' members</h2><h3>' + groupsData[j]["description"] + '</h3><i class="material-icons gropuSetting unselectable" unselectable="on">more_vert</i></div><div class="classGroupMembersPanel" hidden>';
                for(var k = 0; k < JSON.parse(groupsData[j]["members"]).length; k++){
                    $.ajax({
                        method: "POST",
                        url: "/php/get/getUserHeadInfo.php",
                        async: false,
                        data: {
                            idToken: googleTokenId,
                            userId: JSON.parse(groupsData[j]["members"])[k]
                        }
                    }).done(function (_ajaxData) {
                        if(_ajaxData["image"] == null){
                            columnsHTML[i] += '<div usersId="'+JSON.parse(groupsData[j]["members"])[k]+'" usersName="'+_ajaxData["name"]+'" class="classGroupMembersPanelMember card-1"></div>';
                        } else {
                            columnsHTML[i] += '<img src="'+_ajaxData["image"]+'" usersId="'+JSON.parse(groupsData[j]["members"])[k]+'" usersName="'+_ajaxData["name"]+'" class="classGroupMembersPanelMember card-1">';            //FIX ME: css for image is not setted up
                        }
                    });
                }
                columnsHTML[i] += '</div>';
                
            }               
            columnsHTML[i] += '</div>';
            
        }
        columnsHTML[i] += '</div>';
    }
    var groupsHTML = "";
    
    for(var i = 0; i < columnsHTML.length; i++){
        groupsHTML += columnsHTML[i];
    }
    console.log("Add html");
    $("#classGroups").html(groupsHTML).css("margin-left", "+=10px");
	classResize();
}
