function classResize() {
    console.info("%cFunction run:\t" + "%cclassResize()", "color: #303F9F; font-weight:700", "color: #303F9F");

    if (timetableDisplayed) {
        setTimeout(                     //Need to set timeout, bc some browsers fire resize event before window actualy resizes
            function () {
                setupTimetable();
            }, 0);
    }

    $(".contentRowIgnoreScrollbar").width($(".content").width() - 55); // Must be set to ignore scrollbar // -20 for collapsible
    $("#classTimetable").width($(".content").width() - 45);
    $("#classGroups").width($(".content").width() - 45);

    $(".classGroupMembersPanelMember").css("margin-left", ($(".classGroupMembersPanel").width() % 55) / Math.floor($(".classGroupMembersPanel").width() / 55) / 2 + 2.5);
    $(".classGroupMembersPanelMember").css("margin-right", ($(".classGroupMembersPanel").width() % 55) / Math.floor($(".classGroupMembersPanel").width() / 55) / 2 + 2.5);

    $("#classMainUploadCollapsible").width($(".content").width() - 15);

    $("#classInfoPanel").width("auto");
    $("#classReminders").width("100%");
    $("#classReminders").css("margin-top", "0");

    if ($(".contentRow").width() < $("#classInfoPanel").width() + 510) {
        console.info("%cClass resize:\t" + "%cContentRow div width is not wide enough (<1510px) - Two rows",
            "color:#F44336; font-weight:700", "color:#F44336");

        $("#classInfoPanel").width("100%");
        $("#classReminders").css("margin-top", "10px");

        //Filter resize
        var textInputSize = ($("#classFilterPanel").width() - 58) / 2 - 16;
        var pickInputSize = ($("#classFilterPanel").width() - 58) / 3 - 16;

        $("#classFilterSearch").width(textInputSize);
        $("#classFilterTags").width(textInputSize);
        $("#classFilterSubject").width(pickInputSize);
        $("#classFilterPerson").width(pickInputSize);
        $("#classFilterDatetime").width(pickInputSize);

        $("#classFilterSubject").css("clear", "left");

        $("#classFilterSubmit").css("margin-top", "37px");

        //Upload resize
        textInputSize = ($("#classUploadPanel").width() - 58);
        pickInputSize = ($("#classUploadPanel").width() - 58) / 5 * 3 - 16;

        $("#classUploadSearch").width($("#classUploadPanel").width() - 74);
        $("#classUploadTags").width(($("#classUploadPanel").width() - 58) / 5 * 3 - 16);
        $("#classUploadSubject").width(($("#classUploadPanel").width() - 58) / 5 * 2 - 16);

        $("#classUploadTags").css("clear", "left");
        $("#classUploadSubmit").css("margin-top", "37px");

    } else {
        console.info("%cClass resize:\t" + "%cContentRow div width is wide enough(>1510px) - One row",
            "color:#4CAF50; font-weight:700", "color:#4CAF50");

        $("#classReminders").width($(".contentRow").width() - $("#classInfoPanel").width() - 10);
        //Filter resize
        var textInputSize = ($("#classFilterPanel").width() - 58) / 4 - 16;
        var pickInputSize = ($("#classFilterPanel").width() - 58) / 6 - 16;

        $("#classFilterSearch").width(textInputSize);
        $("#classFilterTags").width(textInputSize);
        $("#classFilterSubject").width(pickInputSize);
        $("#classFilterPerson").width(pickInputSize);
        $("#classFilterDatetime").width(pickInputSize);

        //Upload resize
        textInputSize = ($("#classUploadPanel").width() - 58) / 2.5 - 16;
        pickInputSize = ($("#classUploadPanel").width() - 58) / 5 - 16;

        $("#classUploadSearch").width(textInputSize);
        $("#classUploadTags").width(textInputSize);
        $("#classUploadSubject").width(pickInputSize);

    }



    //Colapsible
    $(".collapsibleComments > .comment > div").width($(".collapsibleHeader").width() - 48);
    ////Resize every content images to fit 100% of content
    $('.collapsibleBody > .collapsibleContent img').each(function () {
        var maxWidth = $(".collapsible").width() - 32;
        var ratio = 0;
        var width = $(this).width();
        var height = $(this).height();

        if (width > maxWidth) {
            ratio = maxWidth / width;
            $(this).css("width", maxWidth);
            $(this).css("height", height * ratio);
            height = height * ratio;
            width = width * ratio;
        }
    });


}