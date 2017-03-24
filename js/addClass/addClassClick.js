function addClassClick(){
	window.location.hash = "addclass";

	$(".content").load("/html/addClassHtml.html", null, function(){
	materialFormInit();
	addClassInit();
	});

}
