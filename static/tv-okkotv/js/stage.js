var stage = {
	stage: {},
	current: null,
	last_current: null,
    key_events: {},

    DIRECTION: {
        UP: 0,
        RIGHT: 1,
        DOWN: 2,
        LEFT: 3
    },

    CALLBACK: {
        UP: 4,
        RIGHT: 5,
        DOWN: 6,
        LEFT: 7
    },


    ORIENTATION: {
        VERTICAL: 0,
        HORIZONTAL: 1
    },

    EVENT: {
        FOCUS_CHANGED: 'FOCUS_CHANGED'
    },

	link: function(dir, first, second, back){
		if(second){
			this.stage[first][dir] = this.stage[second];
		}else{
			this.stage[first][dir] = null;
		}
		if(back){
			this.stage[second][(dir + 2) % 4] = this.stage[first];
		}
	},

    addAndLinkList: function (stages, orientation) {
        this.linkList(stages, orientation, true);
    },

    linkList: function (stages, orientation, add) {
        if (stages) {
            for (var i = 0; i < stages.length; i++) {
                var stage = stages[i];
                if (i + 1 < stages.length) {
                    stage[orientation == this.ORIENTATION.VERTICAL ? this.DIRECTION.DOWN : this.DIRECTION.RIGHT] = stages[i + 1];
                }

                if (i > 0) {
                    stage[orientation == this.ORIENTATION.VERTICAL ? this.DIRECTION.UP : this.DIRECTION.LEFT] = stages[i - 1];
                }

                if (add) {
                    this.stageAdd(stage);
                }
            }
        }
    },

    getFocusedId: function () {
        return this.current ? this.current.id : null;
    },

	/**
	 * Add object to stage, accept any number of arguments
	 */
	stageAdd: function(obj, obj2){
		if(obj2){
			for(var i = 0; i < arguments.length; i++){
				this.stage[arguments[i].id] = arguments[i];
			}
		}else{
			this.stage[obj.id] = obj;
		}
	},

	setFocus: function(id, focus){
		this.prev = this.current;
		
		if(focus && this.stageFocus){
			this.stageFocus();
		}
		if(this.current){
			if(this.current.id == id && !focus){
				return;
			}
			var el = document.getElementById(this.current.id);
			if(this.current.blur){
				if(this.current.blur(id) && el){
					removeClass(el, 'focus');
				}
			}else{
				if(el){
					removeClass(el, 'focus');
				}
			}
		}
		this.current = this.stage[id];
		if(this.current && !this.current.disabled){
			if(this.current.focus){
				if(this.current.focus()){
					addClass(document.getElementById(this.current.id), 'focus');
				}
			}else{
				addClass(document.getElementById(this.current.id), 'focus');
			}
            if (!this.prev || this.prev.id != this.current.id) {

                this.occurEvent(stage.EVENT.FOCUS_CHANGED,
                    {
                        fromId: (this.prev ? this.prev.id : null),
                        toId: this.current.id
                    }
                );
            }
		}
	},

	moveFocus: function(dir, from){
		if(from){
			this.stageFocus();
			this.current = this.stage[from];
		}
		if(this.current){
			if(this.current[dir + 4]){
				if(this.current[dir + 4]() && this.current[dir]){
					this.setFocus(this.current[dir].id);
				}
			}else{
				var next = this.current[dir];
				if(next && next.disabled){ // перепрыгивать через выключенные кнопки
					if(next[dir]){
						next = next[dir];
					}else{
						next = null;
					}
				}
				if(next){
					this.setFocus(next.id);
				}
			}
		}
		if(!this.current && this.last_current){
			this.setFocus(this.last_current.id);
		}
	},

    getFocusedId: function () {
        return this.current ? this.current.id : null;
    },

    isFocused: function(element){
        return element && element.id == this.getFocusedId();
    },
	
	initStageEvents: function(parent, element, control){
		element.onmouseover = function(event){
			var target = event.target;
			while(!parent.stage[target.id]){
				if(target.parentNode){
					target = target.parentNode;
				}else{
					target = null;
					break;
				}
			}
			if(target){
				target = parent.stage[target.id];
				if(parent.current != target && !target.skipmouse){
					parent.setFocus(target.id);
				}
			}
		};

		element.onmouseout = function(event){
			if(event.relatedTarget && parent.current){
				var target = event.relatedTarget;
				while(target.parentNode){
					if(target.id == parent.current.id){
						return;
					}
					target = target.parentNode;
				}
				parent.last_current = parent.current;
				parent.setFocus(null);
			}
		};

		element.onclick = function(event){
			var target = event.target;
			while(!parent.stage[target.id]){
				if(target.parentNode){
					target = target.parentNode;
				}else{
					target = null;
					break;
				}
			}
			if(target){
				if(parent.current != target && !target.skipmouse){
					parent.setFocus(target.id);
				}
				if(!parent.current.cancelMouse){
					parent.key_events.key_enter();	
				}
			}
		};

		if(!parent.key_events.key_enter){
			parent.key_events.key_enter = function(){
				if(parent.current && !parent.current.disabled && parent.current.callback){
					parent.current.callback();
				}
			};
		}
	}
};

_.extend(stage, Utils.EventManagerMixin);
