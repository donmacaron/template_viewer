/**
 * @include "index.js"
 * @include "../debug/index.js"
 */

/**
 * Создаёт объект-менеджер событий.
 * Использовать через Utils.mixin(ВашКласс.prototype, Utils.EventManagerMixin);
 * @constructor
 * @return {Utils.EventManager} объект-менеджер событий
 */

(window.Utils || (window.Utils = {}));

Utils.EventManager = function () {
	this.handlers = {};

	return this;
};

Utils.EventManager.prototype = {
	/**
	 * Вызывает обработчики события в порядке добавления
	 * Если обработчик возвращает false, то последующие обработчики не выполняются
	 * @see #addHandler
	 * @param {String} eventName событие
	 * @param {Object} params параметры, которые будут переданы каждому обработчику
	 */
	occur: function (eventName, params) {
		if ( this.handlersDefined(eventName) ) {
			var event_handlers = this.handlers[eventName];

			for(var i = 0; i < event_handlers.length; i++){
				if(typeof(event_handlers[i]) != 'function'){
					// тут нужен какой-то способ оповещения, throw не работает как ожидается
					Platform.log('Event handler for "'+eventName+'" is not function');
				}
				//DEBUG
				try{
				if ( event_handlers[i](params) === false ){
					break;
				}
				//DEBUG
				}catch(e){
//					Debug.ConsoleFrontend.enabled = true;
					Platform.logException(e);
				}
			}
		}
	},

	/**
	 * Добавляет обработчик события в конец очереди обработчиков
	 * @see #occur
	 * @param {String} eventName событие
	 * @param {Function} handler обработчик, на вход получает объект
	 */
	addHandler: function (eventName, handler) {
		if ( !this.handlersDefined(eventName) )
			this.handlers[eventName] = [];

		this.handlers[eventName].push(handler);
		return handler;
	},

	/**
	 * Удаляет обработчик события из очереди обработчиков
	 * @see #occur
	 * @param {String} eventName событие
	 * @param {Function} handler обработчик, на вход получает объект
	 */
	removeHandler: function (eventName, handler) {
		if ( !this.handlersDefined(eventName) )
			this.handlers[eventName] = [];
		for(var i = 0, length = this.handlers[eventName].length; i < length; i++){
			if(this.handlers[eventName][i] == handler){
				this.handlers[eventName].splice(i,1);
				break;
			}
		}
	},

	/**
	 * Удаляет все обработчики всех событий.
	 * @see #addHandler #handlersDefined
	 */
	clearHandlers: function () {
		this.handlers = {};
	},

	/**
	 * Существует ли хотя бы один обработчик для события
	 * @private
	 * @param {String} eventName событие
	 * @return {Boolean} true, если существует хотя бы один обработчик
	 */
	handlersDefined: function (eventName) {
		return this.handlers[eventName];
	}

};



