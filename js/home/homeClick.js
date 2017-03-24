function homeClick() {
			window.location.hash = "";
	$(".content").load('/html/homeHtml.html', null, function(){
		homeInit();
	});
}
