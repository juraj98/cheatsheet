function easterEggMusic(){
	if($("#eastereggmusic").length == 0){
	console.log("%cEaster Egg Music!", "color: #8BC34A; font-weight:700; font-size:32px");
			$("body").append('<audio loop id="eastereggmusic" hidden  src="http://www.themostamazingwebsiteontheinternet.com/justcantgetenough.mp3" autoplay="true" controls="" preload="auto" autobuffer=""></audio>');
			$("body").addClass("easterEggMusic");
		$('head').append("<style>.easterEggMusic{animation:eastereggmusic .75s infinite;animation-timing-function:linear}@keyframes eastereggmusic{0%,100%{transform:translateY(-10px) rotate(1deg)}50%{transform:translateY(10px) rotate(-1deg)}}</style>");
		}
}
