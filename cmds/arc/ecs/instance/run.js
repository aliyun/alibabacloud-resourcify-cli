'use strict';

exports.cmdObj={
  use:'arc ecs instane run',
  desc:{
    zh:'创建一台或多台按量付费或者包年包月ECS实例'
  },
  options:{
    region:{
      required:true,
      mapping:'regionId',
      desc:{
        zh:'实例所属的地域ID'
      }
    },
    'image-id':{
      mapping:'imageId',
      desc:{
        zh:`镜像ID，启动实例时选择的镜像资源
如果您不指定launch-template-id或launch-template-name以确定启动模板，也不通过指定image-family选用镜像族系最新可用的自定义镜像，则该选项为必选。`
      },
      sufficient:function(val){
        const optList={};
        if (!val){
          optList['ImageFamily']=false;
        }
      }
    },
    'image-family':{
      mapping:'imageFamily',
      desc:{
        zh:`镜像族系名称，通过设置该参数来获取当前镜像族系内最新可用的自定义镜像来创建实例
1. 设置了参数ImageId，则不能设置该参数。
2. 未设置参数ImageId，但指定的LaunchTemplateId或LaunchTemplateName对应的启动模板设置了ImageId，则不能设置该参数。
3. 未设置ImageId，且指定的LaunchTemplateId或LaunchTemplateName对应的启动模板未设置ImageId，则可以设置该参数。
4. 未设置ImageId，且未设置LaunchTemplateId、LaunchTemplateName参数，则可以设置该参数。`
      }
    },
    'instance-type':{
      mapping:'instanceType',
      desc:{
        zh:'实例的资源规格。如果您不指定LaunchTemplateId或LaunchTemplateName以确定启动模板，InstanceType为必选参数'
      }
    },
    'security-group-id':{
      mapping:'securityGroupId',
      desc:{
        zh:`指定新创建实例所属于的安全组ID。
1. SecurityGroupId决定了实例的网络类型，例如，如果指定安全组的网络类型为专有网络VPC，实例则为VPC类型，并同时需要指定参数VSwitchId。
2. 如果您不指定LaunchTemplateId或LaunchTemplateName以确定启动模板，SecurityGroupId为必选参数。`
      },
      conflicts:[
        'security-group-ids'
      ]
    },
    'security-group-ids':{
      mapping:'securityGroupIds',
      vtype:'array',
      subType:'string',
      desc:{
        zh: `将实例同时加入多个安全组，数量与实例能够加入安全组配额有关`
      },
      options:{
        element: {
          desc: {
            zh: '安全组ID'
          }
        }
      },
      conflicts:[
        'security-group-id',
      ]
    },
    'vswitch-id':{
      mapping:'VSwitchId',
      desc:{
        zh:'虚拟交换机ID。如果您创建的是VPC类型ECS实例，必须指定虚拟交换机ID，且安全组和虚拟交换机在同一个专有网络VPC中'
      }
    },
    'instance-name':{
      mapping:'instanceName',
      desc:{
        zh:`实例名称。
1. 长度为2~128个字符，必须以大小字母或中文开头，不能以http://和https://开头。
2. 可以包含中文、英文、数字、半角冒号（:）、下划线（_）、点号（.）或者连字符（-）。
3. 默认值为实例的InstanceId。
4. 创建多台ECS实例时，您可以使用UniqueSuffix为这些实例设置不同的实例名称。您也可以使用name_prefix[begin_number,bits]name_suffix的命名格式设置有序的实例名称，例如，设置InstanceName取值为k8s-node-[1,4]-alibabacloud，则第一台ECS实例的实例名称为k8s-node-0001-alibabacloud`
      }
    },
    'description':{
      mapping:'description',
      desc:{
        zh:'实例的描述。长度为2~256个英文或中文字符，不能以http://和https://开头'
      }
    }
  }
};