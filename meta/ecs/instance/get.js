'use strict';

exports.cmdObj={
    use:'arc ecs instance get',
    long:{
        en:'get info of instanceId',
        zh:'获取实例的详细信息'
    },
    flags:{
        profile:{},
        region:{
            alias:'r'
        }
    },
    args:[
        {
            name:'instanceId',
            required:true,
            vtype:'string'
        }
    ]
};
