 var login = true;
 var roomName;
 var playerName;
 window.onload = load;
 function load(){
 	Context.game.paused = true;
 	document.getElementsByTagName('body')[0].onkeydown = function(e) { 
      var ev = e || event; 
      if(ev.keyCode == 13) {action();} 
      else if(ev.keyCode == 27) {
      	if(login == false){
      		if(Context.game.paused == true) Context.game.paused = false;
      		else if(Context.game.paused == false) Context.game.paused = true;
      	}
      }
  	} 
 	login_status(true);
 	setTimeout(function(){
 		$('input').css('opacity','1');
 		$('input').css('width','80%');
 	}, 500);
 	// login_status(false);
 } 
window.onbeforeunload = function() {
    return false;
}
 function sweet(message){
 	alert('sweet');
 	var xx;
    if (confirm(message) == true) {
        xx = true;
    } else {
        xx = false;
    } 
 }
 function action(){  
 	if(login == false) return;
 	roomName = document.getElementById('room-name').value;
 	playerName = document.getElementById('player-name').value;
 	if(roomName == '' || playerName == ''){
 		alert('room or player name cannot be empty');
 		return;
 	}else{
 		hasRoom(roomName,playerName);
 	}
 }
 function login_status(determine){
 	if(determine == true){
 		console.log('login status::::: TRUE');
 		$('#section-main').css('-webkit-filter', 'blur(5px)');
	 	$('#section-main').css('pointer-events', 'none');
	 	$('#section-login').css('visibility', 'visible');
	 	$('#section-login').css('-webkit-filter', 'blur(0px)');
	 }else{
 		console.log('login status::::: FALSE');
 		login = false;
 		Context.game.paused = false;
	 	$('#section-main').css('-webkit-filter', 'blur(0px)');
	 	$('#section-main').css('pointer-events', 'auto');
	 	$('body').css('background-color', 'teal');
	 	$('#section-login').css('height', '0px');
	 	$('#section-login').css('width', '0px');
	 	$('#section-login').css('visibility', 'hidden');
	 	$('#section-login').css('opacity', '0');
	 	$('#section-login').css('-webkit-filter', 'blur(0px)');
	 }
 }  