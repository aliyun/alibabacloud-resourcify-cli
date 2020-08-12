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
            vtype: 'number',
            desc: {
                zh: '第二个flag'
            }
        },
        tflag3: {
            vtype: 'boolean',
            desc: {
                zh: '第三个flag'
            }
        },
        tflag4: {
            vtype: 'array',
            mapping:'workerDataDisks',
            mappingType: require('@alicloud/cs20151215').CreateClusterBodyWorkerDataDisks,
            sub:{
                category:{
                    choices:[
                        'cloud',
                        'cloud_efficiency',
                        'cloud_ssd'
                    ],
                },
                size:{},
                encrypted:{
                    choices:[
                        'true',
                        'false'
                    ]
                }
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