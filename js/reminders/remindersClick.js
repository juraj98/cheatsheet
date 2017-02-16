
function remindersClick(){

$(".content").html('<div id="rReminders"><div id="rTarget"></div></div><div id="rSide"><div id="rAddReminder" class="card-1"><div id="rAddButton"><div id="rAddButtonBtn" class="unselectable" unselectable="on"><i class="material-icons">add</i> <span>Add Reminder</span></div></div><div id="rExpand"><div class="materialLineInput materialInput" id="rName" maxLegth="50" label="Reminder"><input type="text"></div><div unselectable="on" id="rCategories" class="unselectable materialDropDown" placeholder="Type" options=\'["Homework", "Project", "Oral exam", "Exam", "Test", "Lesson"]\'></div><div class="materialLineInput materialInput" id="rSubject" label="Subject"><input type="text"></div><div unselectable="on" class="unselectable materialDatePicker" result="today" id="rDate" past="false"> <i class=" material-icons ">event</i><span>Select date</span> </div></div></div><div id="rCalendar" class="card-1">Calendar</div><div id="rFilters" class="card-1"><span>Filters:</span><ul><li id="rHomeworkFilterButton" class="rfilterButton">Homework</li><li id="rProjectFilterButton" class="rfilterButton">Project</li><li id="rOralExamFilterButton" class="rfilterButton">Oral Exam</li><li id="rExamFilterButton" class="rfilterButton">Exam</li><li id="rTestFilterButton" class="rfilterButton">Text</li><li id="rLessonFilterButton" class="rfilterButton">Lesson</li></ul></div></div>');

	remindersInit();
}

