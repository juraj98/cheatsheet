function timetableInit() {
        $(".ttTimetableRow").each(function () {
            var that = $(this);
            $(this).find(".ttSubjectBody").each(function () {
                if($(that).hasClass("timetableEditor")) {
                    var height = ($(this).height() - 50) / 2;
                    $(this).children(".ttSubjectIcon").css("top", height);
                    $(this).children(".ttSubjectNotifications").css("top", height-8);
                } else {
                    var height = ($(this).height() - 66) / 2;
                    $(this).children(".ttSubjectIcon").css("top", height);
                    $(this).children(".ttSubjectNotifications").css("top", height);
                }
            });
    });
}
