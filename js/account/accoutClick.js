function accountClick(){
	window.location.hash = "account";
	$(".content").load("/html/accountHtml.html", null, function(){
		accountInit();
	});

}
