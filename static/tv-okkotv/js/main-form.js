
function InputInit(id, valueHolderId, length, callbackFnc, emptySymbol, checkValFunc){
    return {
        id: id,
        valueHolderElm: $$(valueHolderId),
        count: length,
        value: '',
        elm: $$(id),
        emptySymbol: emptySymbol,
        spaceTemplate: _.template(
            "<div class='input'> </div>"
        ),
        fillTemplate: _.template(
            "<div id='${elmId}' class='input_place empty'>${val}</div>"
        ),
        callbackFnc: callbackFnc,
        checkValFnc: checkValFunc,
        curPos: 0,
        prefixId:id + '_',

        init: function() {
            var text = '';

            for (var i = 0; i < this.count; i++) {
                if (i % 4 == 0) {
                    text += this.spaceTemplate();
                }

                text += this.fillTemplate({elmId: this.prefixId + i, val:this.emptySymbol});
            }

            this.elm.replaceContent(text);

            this.setCursor(0);
        },

        setActive: function(active) {
            if (active) {
                this.elm.addClass('active');

                this.setCursor(this.isFilled() ? 0 : this.value.length);
            } else {
                this.elm.removeClass('active');
            }
        },

        setCursor: function(pos) {
            if (pos >= 0 && pos < this.count) {
                var elm = this.elmAtPos(this.curPos);
                if (elm) {
                    elm.removeClass('cursor');
                }

                this.curPos = pos;

                elm = this.elmAtPos(this.curPos);
                if (elm) {
                    elm.addClass('cursor');
                }
            }
        },

        elmAtPos: function(pos){
            return $$(this.prefixId + pos);
        },

        spliceString: function (str, i, char) {
            return str.substr(0, i) + char + str.substr(i + 1, this.length);
        },


        addVal: function(val) {
            var res = false;

            if (this.curPos < this.count) {
                var newVal;
                if (this.value[this.curPos]) {
                    newVal = this.spliceString(this.value, this.curPos, val);
                } else {
                    newVal = this.value + val;
                }

                if (!this.checkValFnc || this.checkValFnc(newVal)) {
                    res = true;

                    this.value = newVal;

                    this.setCursor(Math.min(this.curPos + 1, this.count));
                    this.updateText();
                }
            }

            return res;
        },
        backspace: function() {
            if (this.value.length > 0) {
                this.value = this.value.substring(0, this.value.length - 1);
                this.setCursor(this.curPos - 1);
                this.updateText();
            }
        },
        isFilled: function() {
            return this.value.length == this.count;
        },
        clear: function() {
            this.value = '';
            this.setCursor(0);
            this.updateText();
        },
        updateText: function() {
            for (var i = 0; i < this.count; i++) {
                var char = this.value[i];
                var elm = this.elmAtPos(i);

                elm.replaceContent(char ? char : this.emptySymbol);

                if (char) {
                    elm.removeClass('empty')
                } else {
                    elm.addClass('empty');
                }
            }

            if (this.valueHolderElm) {
                this.valueHolderElm.value = this.value;
            }
        },
        callback: function() {
            this.callbackFnc && this.callbackFnc(this);
        }
    };
};

ChronopayForm = {
    NUM_ROW_LENGTH: 3,

    KEY_ERASE: 10,
    KEY_LEFT: 11,
    KEY_RIGHT: 12,

    START_KEY: 5,

    keyPositionMap: [
        [1,2,3],
        [4,5,6],
        [7,8,9],
        [11,12,0]
    ],

    cardNumberInput: null,
    cardExpirationYearInput: null,
    cardExpirationMonthInput: null,
    cardCvvInput: null,

    currentField:null,
    fillOrder: [],

    lastFocusedElement:null,
    hasFocus: false,

    enter: function() {
    	if (this._loaded) {
    		return;
    	}
    	
        Platform.Input.init({
            getPlatfromKeyMap: function() {
                return Platform.keyMap;
            }
        });

        //set focus to iframe
        setFocus();
        this.hasFocus = true;

        var self = this;
        this.cardNumberInput = InputInit(
            'card_number',
            'PAN',
            16,
            function(field) {self.onFieldSelect(field)},
            "•");
        this.cardNumberInput.init();

        this.cardExpirationYearInput = InputInit(
            'card_year',
            'year',
            2,
            function(field) {self.onFieldSelect(field)},
            "Г");
        this.cardExpirationYearInput.init();

        this.cardExpirationMonthInput = InputInit(
            'card_month',
            'month',
            2,
            function(field) {self.onFieldSelect(field)},
            "М",
            function(val) {
                var first = val[0];

                if (first != undefined) {
                    if (first > 1) {
                        return false;
                    }

                    var sec = val[1];

                    if (sec != undefined) {
                        if ((first == 1 && sec > 2) || (first == 0 && sec == 0)) {
                            return false;
                        }
                    }
                }

                return true;
            });
        this.cardExpirationMonthInput.init();

        this.cardCvvInput = InputInit(
            'card_cvv',
            'CVV',
            3,
            function(field) {self.onFieldSelect(field)},
            "•");
        this.cardCvvInput.init();

        this.fillOrder.push(this.cardNumberInput);
        this.fillOrder.push(this.cardExpirationMonthInput);
        this.fillOrder.push(this.cardExpirationYearInput);
        this.fillOrder.push(this.cardCvvInput);

        this.initForm();
        this.checkForm();
        this.setActiveField(this.cardNumberInput);

        stage.initStageEvents(stage, $$('cardForm'));

        top.postMessage(['loaded'],'*');
        
        this._loaded = true;
    },

    getNotFilledField: function() {
        var fill = null;

        for(var i = 0; i < this.fillOrder.length; i ++) {
            var field = this.fillOrder[i];
            if (!field.isFilled()) {
                fill = field;
                break;
            }
        }

        return fill;
    },

    setActiveField: function(field) {
        if (this.currentField != field) {
            if (this.currentField) {
                this.currentField.setActive(false);
            }

            this.currentField = field;

            if (this.currentField) {
                this.currentField.setActive(true);
            }
        }
    },

    onFieldSelect: function(field) {
        this.setActiveField(field);
        stage.setFocus(this.getNumId(this.START_KEY), true);
    },

    initForm: function() {
        this.containerEl = $$('chronopay_frame');

        this.cancelBtn = {
            id: 'cancel_btn',
            callback: function() {
                self.cancelBtnAction();
            }
        };

        this.okBtn = {
            id: 'ok_btn',
            callback: function() {
                self.okBtnAction();
            }
        };

        var self = this;
        var btns = [
            this.cancelBtn,
            this.okBtn
        ];

        var numpad = this.containerEl.cssSelect('.numpad').first();

        var numStages = [];
        var rows = [];
        var cols = [];

        function addOrCreate(target, container, val) {
            if (!target) {
                container.push([val]);
            } else {
                target.push(val);
            }
        }

        for(var row = 0; row < this.keyPositionMap.length; row++) {
            var rowLine = this.keyPositionMap[row];
            for(var col = 0; col < rowLine.length; col++) {
                var val = rowLine[col];
                var elm = $$(this.getNumElement(val));

                var stageobj = {
                    id: elm.id,
                    val: val,
                    callback: function() {
                        self.inputKey(this.val);
                    }
                };

                addOrCreate(rows[row], rows, stageobj);
                addOrCreate(cols[col], cols, stageobj);

                numStages.push(stageobj);
            }
        }

        var lastRightElm = null;
        for(var i = 0; i < rows.length; i++) {
            var rowStages = rows[i];
            lastRightElm = rowStages[rowStages.length - 1];
            lastRightElm[stage.DIRECTION.RIGHT] = this.cardNumberInput;
            stage.linkList(rowStages, stage.ORIENTATION.HORIZONTAL);
        }

        stage.addAndLinkList(btns, stage.ORIENTATION.HORIZONTAL);
        this.cancelBtn[stage.DIRECTION.LEFT] = lastRightElm;

        for(var i = 0; i < cols.length; i++) {
            var colStages = cols[i];
            stage.linkList(colStages, stage.ORIENTATION.VERTICAL);
        }

        for(var i = 0; i < numStages.length; i++) {
            var stageobj = numStages[i];
            stage.stageAdd(stageobj);
        }
        stage.addAndLinkList(btns);

        this.cardExpirationMonthInput[stage.DIRECTION.UP] = this.cardNumberInput;
        this.cardExpirationMonthInput[stage.DIRECTION.LEFT] = lastRightElm;
        this.cardExpirationMonthInput[stage.DIRECTION.RIGHT] = this.cardExpirationYearInput;
        this.cardExpirationMonthInput[stage.DIRECTION.DOWN] = this.cancelBtn;

        this.cardNumberInput[stage.DIRECTION.DOWN] = this.cardExpirationMonthInput;
        this.cardNumberInput[stage.DIRECTION.LEFT] = lastRightElm;

        this.cardExpirationYearInput[stage.DIRECTION.UP] = this.cardNumberInput;
        this.cardExpirationYearInput[stage.DIRECTION.LEFT] = this.cardExpirationMonthInput;
        this.cardExpirationYearInput[stage.DIRECTION.RIGHT] = this.cardCvvInput;
        this.cardExpirationYearInput[stage.DIRECTION.DOWN] = this.cancelBtn;

        this.cardCvvInput[stage.DIRECTION.UP] = this.cardNumberInput;
        this.cardCvvInput[stage.DIRECTION.LEFT] = this.cardExpirationYearInput;
        this.cardCvvInput[stage.DIRECTION.DOWN] = this.cancelBtn;

        this.okBtn[stage.DIRECTION.UP] = this.cardExpirationMonthInput;
        this.cancelBtn[stage.DIRECTION.UP] = this.cardExpirationMonthInput;

        stage.stageAdd(this.cardExpirationMonthInput);
        stage.stageAdd(this.cardNumberInput);
        stage.stageAdd(this.cardExpirationYearInput);
        stage.stageAdd(this.cardCvvInput);

        stage.setFocus(this.getNumId(this.START_KEY), true);
    },

    okBtnAction:function() {
        top.postMessage(['submitted'], '*');
        $$('paymentFormSubmit').click();
    },

    cancelBtnAction:function() {
        top.postMessage(['return'], '*');
    },

    getNumId: function(number) {
        return 'num' + number;
    },

    getNumElement:function(number) {
        return $$(this.getNumId(number));
    },

    getNumElementCode:function(numElm) {
        return numElm.id.replace('num', '');
    },

    setNumpadFocus:function(numpadButton){
        if (numpadButton != null) {
            var elm = this.getNumElement(numpadButton);

            if (!stage.isFocused(elm)) {
                stage.setFocus(elm.id);
            }
        }
    },

    inputKey:function(key) {
        Platform.log('inputKey: ' + key) ;

        this.setNumpadFocus(key);

        var field = this.currentField;

        if (field) {
            switch (key) {
                case this.KEY_ERASE: {

                    break;
                }
                case this.KEY_LEFT: {
                    if (field.curPos > 0) {
                        field.setCursor(field.curPos - 1);
                    } else {
                        var index = _.indexOf(this.fillOrder, field);
                        if (index >= 0) {
                            var prevField = this.fillOrder[index - 1];
                            if (prevField) {
                                this.setActiveField(prevField);
                            }
                        }
                    }

                    break;
                }
                case this.KEY_RIGHT: {
                    if (field.curPos < field.value.length - 1) {
                        field.setCursor(field.curPos + 1);
                    } else {
                        var index = _.indexOf(this.fillOrder, field);
                        if (index >= 0) {
                            var nextField = this.fillOrder[index + 1];
                            if (nextField) {
                                this.setActiveField(nextField);
                            }
                        }
                    }
                    break;
                }
                default : {
                    var pos = field.curPos;

                    if (field.addVal(key)) {
                        this.checkForm();

                        if (field.isFilled() && pos == (field.count - 1)) {
                            var index = _.indexOf(this.fillOrder, field);
                            var nextField = this.fillOrder[index + 1];

                            if (nextField) {
                                this.setActiveField(nextField);
                            } else if (field == this.fillOrder[this.fillOrder.length - 1]){
                                stage.setFocus(this.okBtn.id);
                            }
                        }
                    }

                    break;
                }
            }
        }
    },

    checkForm: function() {
        var field = this.getNotFilledField();
        var btnOkElm = $$(this.okBtn.id);

        this.okBtn.disabled = !!field;

        if (field) {
            btnOkElm.addClass('disabled');
        } else {
            btnOkElm.removeClass('disabled');
        }
    }
};

(function(){
    window.onmessage = messageHandler;
    window.onkeydown = keyDown;

    function messageHandler(event) {
        Platform.log('[c] messageHandler ' + event.data);

        switch(event.data) {
            case 'focus':
                setFocus();
                focusHandler();
                top.postMessage(['blur'],'*');
                break;
            case 'blur':
                blurHandler();
                break;
            case 'submit':
                //no submit() method on samsung 2011
                document.getElementById('paymentFormSubmit').click();
                break;
            default:
                Platform.log('[c] messageHandlerAction ' + event.data.action);
                switch (event.data.action) {
                    case "tvPlatform": {
                        Platform.init(event.data.value);
                        break;
                    }
                }
                break;
        }
    };

    function keyDown(event) {
        var keyCode = event.keyCode;
        var valueToAppend = undefined;

        var key = Platform.Input.keyMap[keyCode];
        Platform.log('[c] keydown ' + keyCode + ' key: ' + key);

        switch(key) {
            case Platform.Input.KEY.BACK:
                event.preventDefault();
                //widgetAPI.blockNavigation(event);
                top.postMessage(['return'],'*');
                return false;
                break;
            case Platform.Input.KEY.RED:
                var err = $$('error_line');
                if (err.isVisible()) {
                    err.hide();
                } else {
                    err.show();
                }

                break;
            case Platform.Input.KEY.DOWN:
                stage.moveFocus(2);
                break;
            case Platform.Input.KEY.UP:
                stage.moveFocus(0);
                break;
            case Platform.Input.KEY.RIGHT:
                stage.moveFocus(1);
                break;
            case Platform.Input.KEY.LEFT:
                stage.moveFocus(3);
                break;
            case Platform.Input.KEY.ENTER:
                if (stage.current && !stage.current.disabled && stage.current.callback) {
                    stage.current.callback();
                }
                break;
            case Platform.Input.KEY[0]:
                valueToAppend = 0;
                break;
            case Platform.Input.KEY[1]:
                valueToAppend = 1;
                break;
            case Platform.Input.KEY[2]:
                valueToAppend = 2;
                break;
            case Platform.Input.KEY[3]:
                valueToAppend = 3;
                break;
            case Platform.Input.KEY[4]:
                valueToAppend = 4;
                break;
            case Platform.Input.KEY[5]:
                valueToAppend = 5;
                break;
            case Platform.Input.KEY[6]:
                valueToAppend = 6;
                break;
            case Platform.Input.KEY[7]:
                valueToAppend = 7;
                break;
            case Platform.Input.KEY[8]:
                valueToAppend = 8;
                break;
            case Platform.Input.KEY[9]:
                valueToAppend = 9;
                break;
            default:
                return true;
        }

        if (valueToAppend != undefined && ChronopayForm != null) {
            ChronopayForm.inputKey && ChronopayForm.inputKey(valueToAppend);
        }

        return false;
    }

    DOMAssistant.DOMReady(function(){
        Platform.log('******************************************');
        Platform.log('*	          Chronopay                 *');
        Platform.log('******************************************');

        ChronopayForm.enter();
    });
})();
