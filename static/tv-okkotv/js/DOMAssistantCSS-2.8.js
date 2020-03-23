// Developed by Robert Nyman/DOMAssistant team, code/licensing: http://domassistant.googlecode.com/, documentation: http://www.domassistant.com/documentation
/*global DOMAssistant */
DOMAssistant.CSS = function () {
	var def = DOMAssistant.def,
		direct = { display: true };
	def = def || def; direct = direct || direct; //WTF to fool validator
	return {
		addClass : function (className) {
			if (!this.hasClass(className)) {
				var currentClass = this.className;
				this.className = currentClass + (currentClass.length? " " : "") + className;
			}
			return this;
		},

		removeClass : function (className) {
			return this.replaceClass(className);
		},

		replaceClass : function (className, newClass) {
			var classToRemove = new RegExp(("(^|\\s)" + className + "(\\s|$)"), "i");
			this.className = this.className.replace(classToRemove, function (match, p1, p2) {
				return newClass? (p1 + newClass + p2) : " ";
			}).replace(/^\s+|\s+$/g, "");
			return this;
		},

		hasClass : function (className) {
			return (" " + this.className + " ").indexOf(" " + className + " ") > -1;
		},
		setStyle : function (property, value) {
			function replacer(str, p1, offset, s) {
			  return p1.toUpperCase();
			}
			var re = /-(\w{1})/;
			property = property.toString();
			property = property.replace(re, replacer);
			
			this.style[property] = value;
			return this;
		},
		
		setStyles: function(styles){
			for (var property in styles) this.setStyle(property, styles[property]);
			return this;
		},
		
		getStyle : function (cssRule) {
			var val = "", f;
			cssRule = cssRule.toLowerCase();
			if (document.defaultView && document.defaultView.getComputedStyle) {
				val = document.defaultView.getComputedStyle(this, "").getPropertyValue(cssRule);
			}
			else if (this.currentStyle) {
				if ("filters" in this && cssRule === "opacity") {
					val = (f = this.style.filter || this.currentStyle.filter) && f.indexOf("opacity=") >= 0? parseFloat(f.match(/opacity=([^)]*)/)[1]) / 100 : 1;
				}
				else {
					cssRule = cssRule.replace(/^float$/, "styleFloat").replace(/\-(\w)/g, function (match, p1) {
						return p1.toUpperCase();
					});
					val = this.currentStyle[cssRule];
				}
				if (val === "auto" && /^(width|height)$/.test(cssRule) && this.currentStyle.display !== "none") {
					val = this["offset" + cssRule.charAt(0).toUpperCase() + cssRule.substr(1)] + "px";
				}
			}
			return val;
		},

		show_height : function(height, time)
		{
			this.setStyles(
				{
					'height':'0',
					'display':'block'
				});
				
			jTweener.addTween(this,
				{
					'height' : height,
					'transition': 'easeInOutQuart',
					'onComplete': function(){
									if(typeof(callback) == "function") callback();
									},
					'time': time
				}
			);
		},
		
		hide_height : function(time)
		{
			var self = this;
			jTweener.addTween(this,
				{
					'height'	: '0',
					'transition': 'easeInOutQuart',
					'onComplete': function(){
									self.setStyle('display','none');
								},
					'time': time
				}
			);
		
		},
		
		show : function(){
			this.style.display = 'block';
			this.style.visibility = 'visible';
		},
		
		hide : function(){
			this.style.display = 'none';
		},

        isVisible: function(){
            return this.style.display !== "none";
        }
	};
}();
DOMAssistant.attach(DOMAssistant.CSS);
