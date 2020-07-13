'use strict';

// TODO
exports.cmdObj = {
    use: 'arc cs cluster scaleout',
    long: {
        zh: '增加集群中Worker节点的数量'
    },
    args: [
        {
            name: 'clusterId',
            required: true,
            vtype: 'string'
        },
        {
            count: 'count',
            required: true,
            vtype: 'number'
        }
    ]
};