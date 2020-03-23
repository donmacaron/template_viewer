/** @include "index.js" */
Utils.EventManagerMixin = {

	event_manager: null,

	getEventManager: function () {
		if ( this.event_manager === null )
			this.event_manager = new Utils.EventManager();

		return this.event_manager;
	},

	occurEvent: function (name, params) {
		this.getEventManager().occur(name, params);
	},

	addEventHandler: function (name, handler) {
		this.getEventManager().addHandler(name, handler);
	},

	removeEventHandler: function (name, handler) {
		this.getEventManager().removeHandler(name, handler);
	}

};

