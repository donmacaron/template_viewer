// Developed by Robert Nyman/DOMAssistant team, code/licensing: http://domassistant.googlecode.com/, documentation: http://www.domassistant.com/documentation
/*global DOMAssistant */
DOMAssistant.Content = function () {
	var D$ = DOMAssistant.$$;
	return {
		init : function () {
			DOMAssistant.setCache(false);
		},

		create : function (name, attr, append, content) {
			var elm = D$(document.createElement(name));
			if (attr) {
				elm = elm.setAttributes(attr);
			}
			if (DOMAssistant.def(content)) {
				elm.addContent(content);
			}
			if (append) {
				this.appendChild(elm);
			}
			return elm;
		},

		//modified
		setAttributes : function (attr) {
			DOMAssistant.Content.setAttributes = function (attr) {
				for (var i in attr) {
					if (/class/i.test(i)) {
						this.className = attr[i];
					}
					else {
						this.setAttribute(i, attr[i]);
					}
				}
				return this;
			};
			return DOMAssistant.Content.setAttributes.call(this, attr);
		},

		addContent : function (content) {
			var type = typeof content;
			if (type === "string" || type === "number") {
				if (!this.firstChild) {
					this.innerHTML = content;
				}
				else {
					var tmp = document.createElement("div");
					tmp.innerHTML = content;
					for (var i=tmp.childNodes.length-1, last=null; i>=0; i--) {
						last = this.insertBefore(tmp.childNodes[i], last);
					}
				}
			}
			else if (type === "object" || (type === "function" && !!content.nodeName)) {
				this.appendChild(content);
			}
			return this;
		},

		//new
		addPrependContent : function (content) {
			var type = typeof content;
			if (type === "string" || type === "number") {
				if (!this.firstChild) {
					this.innerHTML = content;
				}
				else {
					var tmp = document.createElement("div");
					tmp.innerHTML = content;
					for (var i=tmp.childNodes.length-1; i>=0; i--){
						this.insertBefore(tmp.childNodes[i], $$(this).cssSelect('> *').first());
					}
				}
			}
			else if (type === "object" || (type === "function" && !!content.nodeName)) {
				this.insertBefore(content, $$(this).cssSelect('> *').first());
			}
			return this;
		},
		replaceContent : function (content) {
			if(!content)
				content='';
			DOMAssistant.cleanUp(this);
			return this.addContent(content);
		},

		replace : function (content, returnNew) {
			var type = typeof content;
			if (type === "string" || type === "number") {
				var parent = this.parentNode;
				var tmp = DOMAssistant.Content.create.call(parent, "div", null, false, content);
				for (var i=tmp.childNodes.length; i--;) {
					parent.insertBefore(tmp.childNodes[i], this.nextSibling);
				}
				content = this.nextSibling;
				parent.removeChild(this);
			}
			else if (type === "object" || (type === "function" && !!content.nodeName)) {
				this.parentNode.replaceChild(content, this);
			}
			return returnNew? content : this;
		},

		remove : function () {
			DOMAssistant.cleanUp(this);
			if (this.hasData()) {
				if (this.removeEvent) { this.removeEvent(); }
				this.unstore();
			}
			this.parentNode.removeChild(this);
			return null;
		},
		//new
		last : function () {
					var list = this;
					var count = list.length;
					var last_item;

					list.each( function(elm, idx, set) {
						if (idx == count-1)
						{
							last_item = elm;
							return false;
						}
					});
					return last_item;
		},
		//new
		equal : function (elm) {
			if (this == elm)
				return true;
			else
				return false;
		},
		//new
		//находим индекс элемента в массиве элементов
		//$(элемент).getIndex(массив в котором ищем элемент)
		getIndex : function (array) {
			var self = this;
			var current_item_index = -1;

			array.each(function(elm, idx, set) {
				if (self.equal(elm) === true)
				{
					current_item_index = idx;
					return false;
				}
			});
			return current_item_index;
		},
		//new
		getHtml : function () {
			return this.innerHTML;
		},
		//new
		getAttr : function (nameAttr) {
			return this.getAttribute(nameAttr);
		},
		//new
		removeAttr : function (nameAttr) {
			return this.removeAttribute(nameAttr);
		},
		//new
		parent : function () {
			return $(this.parentNode);
		},
		//new
		focusIn : function () {
			if(!Main.keyhole){
				Main.keyhole = $$('keyhole');
			}
			document.prevFocusElement = document.lastFocusElement;
			document.lastFocusElement = this;

			// alert('DOMAssistant.focusIn ' + this.id);

			if(document.activeElement != Main.keyhole){
				return Main.keyhole.focus();
			}else{
				return Main.keyhole;
			}
		},

        isFocusedIn: function(){
            return  this == document.lastFocusElement;
        },

		active : function (nameAttr) {
			document.lastActiveBlock = $('.active').first();
			$('.active').removeClass('active');
			return $(this).addClass('active');
		},
		deActive : function (nameAttr) {
			return $(this).removeClass('active');
		},
		selectIn : function (nameAttr) {
			document.prevSelectElement = document.lastSelectElement;
			document.lastSelectElement = this;

			$('.focus').removeClass('focus');
			return $(this).addClass('focus');
		},
		selectOut : function (wrap) {
			//Внимание это событие использовать только для мышы!!!
//			Menu.stageFocus();
			if(wrap)
				return $(this).elmsByClass('focus').removeClass('focus');
			else
				return $(this).removeClass('focus');
		},
		//Returns left offset from window
		offsetTop4 : function (wall_item) {
					var top = 0;
					el = this;

					while(el){
						top += el.offsetTop;
						el = el.offsetParent;
						if(wall_item && wall_item == el)
							break;
					}
			return top;
		},
		//new
		offsetLeft4 : function (wall_item) {
					var left = 0;
					el = this;

					while(el){
						left += el.offsetLeft;
						el = el.offsetParent;
						if(wall_item && wall_item == el)
							break;
					}
			return left;
		},
		is_item_bubble : function (find_item) {
					el = this;

					while(el){
						el = el.offsetParent;
						if(el && find_item == el)
							return true;
					}
			return false;
		},
		//new
		addEvent : function(callbacks){
			if(!window.keyCallbacks){
				window.keyCallbacks = {};
			}
			window.keyCallbacks[this.id] = callbacks;
		},

        //new
        clearEvent : function(){
            if(!window.keyCallbacks){
                window.keyCallbacks = {};
            }
            window.keyCallbacks[this.id] = {};
        },

		set_event_or_focus: function(key_events) {
			if(key_events)
				$(this).addEvent(key_events);
			else
				$(this).focusIn();
		},

		addMouseEvent : function(mouse_events){
			for (var i in mouse_events)
			{
				try{//DEBUG: remove for production=
					 this['on'+i] = function(event){
						 mouse_events[event.type](this, event);
					 };
				}catch(e){//DEBUG: remove for production
					Platform.logException(e);
				}
			}
		}
	};
}();
DOMAssistant.attach(DOMAssistant.Content);
