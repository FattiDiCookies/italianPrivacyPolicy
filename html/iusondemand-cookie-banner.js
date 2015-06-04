
// Creare's 'Implied Consent' EU Cookie Law Banner v:2.4
// Conceived by Robert Kent, James Bavington & Tom Foyster
// from IusOnDemand added classes, free text easy to customize, event on body, cookie only after action,
 
var dropCookie = true;                      // false disables the Cookie, allowing you to style the banner
var cookieDuration = 365;                    // Number of days before the cookie expires, and the banner reappears
var cookieName = 'complianceCookie';        // Name of our cookie
var cookieValue = 'on';                     // Value of cookie
var cookietxt;
var scroll_is_action = false;			// a scroll is action ?
var nomatterclick_is_action = false;		// a click on body is action ?

function createDiv(cookietxt){
    var bodytag = document.getElementsByTagName('body')[0];
    var div = document.createElement('div');
    div.setAttribute('id','cookie-law');
    div.innerHTML = cookietxt+'<a class="close-cookie-banner" href="javascript:void(0);" onclick="removeMe();">chiudi o prosegui</a></p>';
 // Be advised the Close Banner 'X' link requires jQuery
     
    // bodytag.appendChild(div); // Adds the Cookie Law Banner just before the closing </body> tag
    // or
    bodytag.insertBefore(div,bodytag.firstChild); // Adds the Cookie Law Banner just after the opening <body> tag
     
    document.getElementsByTagName('body')[0].className+=' cookiebanner'; //Adds a class tothe <body> tag when the banner is visible
    if ( nomatterclick_is_action==true) {document.body.addEventListener("click", function(){removeMe()}, false);}
    if ( scroll_is_action==true) {window.addEventListener("scroll",  function(){removeMe()});}
    // an action is for sure a click on a link or on a input form
    var Anchors = document.getElementsByTagName("a");
	for (var i = 0; i < Anchors.length ; i++) {
		Anchors[i].addEventListener("click", function () {removeMe();	}, 	false);
	}
    var Anchors = document.getElementsByTagName("input");
	for (var i = 0; i < Anchors.length ; i++) {
		Anchors[i].addEventListener("click", function () {removeMe();	}, 	false);
	}

}
 
 
function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000)); 
        var expires = "; expires="+date.toGMTString(); 
    }
    else var expires = "";
    if(window.dropCookie) { 
        document.cookie = name+"="+value+expires+"; path=/"; 
    }
}
 
function checkCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
 
function eraseCookie(name) {
    createCookie(name,"",-1);
}
 
function cookieconsent(cookietxt){
    if(checkCookie(window.cookieName) != window.cookieValue){
        createDiv(cookietxt); 
    }
}
 
function removeMe(){
	createCookie(window.cookieName,window.cookieValue, window.cookieDuration); // Create the cookie
	var element = document.getElementById('cookie-law');
	element.parentNode.removeChild(element);
	document.getElementsByTagName('body')[0].className =   document.getElementsByTagName('body')[0].className.replace( /(?:^|\s)cookiebanner(?!\S)/g , '' );
}
