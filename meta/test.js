'use strict';

exports.cmdObj = {
    use: 'arc test',
    desc: {
        zh: '逻辑测试'
    },
    flags: {
        tflag: {
            vtype: 'boolean',
            desc: {
                zh: '第一个flag'
            }
        },
        tflag2: {
            desc: {
                zh: '第二个flag'
            }
        },
        tflag3: {
            desc: {
                zh: '第三个flag'
            }
        }
    },
    relationship: {
        'tflag': [
            {
                symbol: 'equal',
                value: 'true',
                sufficient: [
                    'tflag2'
                ]
            }
        ],
        'tflag2': [
            {
                symbol: 'equal',
                value: 'true',
                sufficient: [
                    'tflag3'
                ]
            }
        ]

    }
};