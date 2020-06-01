

const Core = require('@alicloud/pop-core');

module.exports = {
    async list() {
        var client = new Core({
            accessKeyId: process.env.ACCESS_KEY_ID,
            accessKeySecret: process.env.ACCESS_KEY_SECRET,
            endpoint: 'https://ecs.aliyuncs.com',
            apiVersion: '2014-05-26'
        });

        var requestOption = {
            method: 'POST'
        };
        return await client.request('DescribeRegions', {}, requestOption);
    }
};
