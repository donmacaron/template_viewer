
Platform.Input = {
    KEY: {
        MENU:       'key_menu',
        ENTER:      'key_enter',
        INFO:       'key_info',
        BACK:       'key_back',

        CH_UP:      'key_channel_up',
        CH_DOWN:    'key_channel_down',

        CH_LIST:    'key_channel_list',

        LEFT:       'key_left',
        UP:         'key_up',
        RIGHT:      'key_right',
        DOWN:       'key_down',

        YELLOW:     'key_yellow',
        RED:        'key_red',
        GREEN:      'key_green',
        BLUE:       'key_blue',

        PLAY:       'key_play',
        PAUSE:      'key_pause',
        STOP:       'key_stop',
        RW:         'key_rw',
        FF:         'key_ff',

        0:          'key_0',
        1:          'key_1',
        2:          'key_2',
        3:          'key_3',
        4:          'key_4',
        5:          'key_5',
        6:          'key_6',
        7:          'key_7',
        8:          'key_8',
        9:          'key_9',

        REPEAT_E:   'key_repeat_e',

        VOL_UP:     'key_volume_up',
        VOL_DOWN:   'key_volume_down',
        MUTE:       'key_mute',
        SOURCE:     'key_source',

        EXIT:       'key_exit'
    },

    keyMap: {},
    inited: false,

    init: function(config) {
        if (!this.inited) {
            var platformMap = null;

            if (config) {
                platformMap = config.getPlatfromKeyMap();
            }

            platformMap = platformMap || {};

            var map = {};
            Platform.log('[PLATFORM KEY MAP]');
            for (var key in Platform.Input.KEY) {
                if (platformMap.hasOwnProperty(key)) {
                    var platformCode = platformMap[key];

                    if (platformCode != undefined) {
                        var internalCode = Platform.Input.KEY[key];
                        map[platformCode] = internalCode;

                        Platform.log(internalCode + ' : ' + platformCode);
                    }
                }
            }
            Platform.log('[PLATFORM KEY MAP]');

            Platform.Input.keyMap = map;
            this.inited = true;
        }
    }
};

