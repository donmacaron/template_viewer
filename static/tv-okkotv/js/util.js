function leavePage(){
	blurHandler();
	if(stage.current){
		top.postMessage(['focus',stage.current.id],'*');
	}else{
		top.postMessage(['focus'],'*');
	}
}

function setFocus(){
    Platform.log('[c] setFocus');
	document.getElementById("keyhole").focus();
	focusHandler();
	top.postMessage(['blur'],'*');
}

function focusHandler(){
    Platform.log('[c] focus');
	if(stage.current){
		if(stage.current.focus){
			stage.current.focus();
		}else{
			addClass(document.getElementById(stage.current.id), 'focus');
		}
	}
}
function blurHandler(){
    Platform.log('[c] blur');
	if(stage.current){
		if(stage.current.blur){
			stage.current.blur();
		}else{
			removeClass(document.getElementById(stage.current.id), 'focus');
		}
	}
}


function addClass(el, cls) { 
	if(el && el.className){	
  		var c = el.className.split(' ');
  		for (var i=0; i<c.length; i++) {
   			if (c[i] == cls) return;
  		}
  		c.push(cls);
  		el.className = c.join(' ');
 	}
}

function removeClass(el, cls) {
	if(el && el.className){	
  		var c = el.className.split(' ');
  		for (var i=0; i<c.length; i++) {
    		if (c[i] == cls) c.splice(i--, 1);
  		}
  	el.className = c.join(' ');
 	}
}

function hasClass(el, cls) {
  for (var c = el.className.split(' '),i=c.length-1; i>=0; i--) {
    if (c[i] == cls) return true;
  }
  return false;
}

_.templateSettings = {
    interpolate: /\$\{(.+?)\}/g,
    evaluate: /\{\{(.+?)\}\}/g,
    escape: /\{\{-(.+?)\}\}/g
};

//pages
window.Pages = window.Pages || {};
Pages.StageMixin = Pages.StageMixin || {};
Pages.StageMixin.DIRECTION = Pages.StageMixin.DIRECTION || {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
};
Pages.StageMixin.EVENT = {
    FOCUS_CHANGED: 'FOCUS_CHANGED'
};

window.Strings = {
    DELETE: 'удалить',
    ERASE: 'стереть'
};
