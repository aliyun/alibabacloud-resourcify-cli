'use strict';
let { default: Client } = require('@alicloud/cs20151215');
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj={
  desc: {
    zh: '',
    en: ''
  },
  options: {
    'workflow-type':{
      mapping: 'workflowType',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'service':{
      mapping: 'service',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'mapping-oss-region':{
      mapping: 'mappingOssRegion',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'mapping-fastq-first-filename':{
      mapping: 'mappingFastqFirstFilename',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'mapping-fastq-second-filename':{
      mapping: 'mappingFastqSecondFilename',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'mapping-bucket-name':{
      mapping: 'mappingBucketName',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'mapping-fastq-path':{
      mapping: 'mappingFastqPath',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'mapping-reference-path':{
      mapping: 'mappingReferencePath',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'mapping-is-mark-dup':{
      mapping: 'mappingIsMarkDup',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'mapping-bam-out-path':{
      mapping: 'mappingBamOutPath',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'mapping-bam-out-filename':{
      mapping: 'mappingBamOutFilename',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'wgs-oss-region':{
      mapping: 'wgsOssRegion',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'wgs-fastq-first-filename':{
      mapping: 'wgsFastqFirstFilename',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'wgs-fastq-second-filename':{
      mapping: 'wgsFastqSecondFilename',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'wgs-bucket-name':{
      mapping: 'wgsBucketName',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'wgs-fastq-path':{
      mapping: 'wgsFastqPath',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'wgs-reference-path':{
      mapping: 'wgsReferencePath',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'wgs-vcf-out-path':{
      mapping: 'wgsVcfOutPath',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'wgs-vcf-out-filename':{
      mapping: 'wgsVcfOutFilename',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },},
  args: [],
};
exports.run = async function (ctx) {
  let profile = await runtime.getConfigOption(ctx.profile);
  let { Config } = require('@alicloud/openapi-client');
  let config = new Config({
    accessKeyId: profile.access_key_id,
    accessKeySecret: profile.access_key_secret,
    securityToken: profile.sts_token,
    regionId: profile.region,
    type: profile.type
  });
  let StartWorkflowRequest = require('@alicloud/cs20151215').StartWorkflowRequest;
  let request = new StartWorkflowRequest(ctx.mappingValue);  
  let client = new Client(config);
  let result;
  try {
    result = await client.startWorkflowWithOptions(request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }

  if (result) {
    result = result.body;
  }

  let data = JSON.stringify(result, null, 2);
  output.log(data);
};