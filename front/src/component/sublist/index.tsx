import { CodeOutlined } from '@ant-design/icons';
import { message, Tree } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { getSublist } from '../../model/api';
import { ProductItem, TreeItem } from '../../model/_types';
import './index.scss';

export interface SubListProps extends RouteComponentProps {}

const SubList: React.FC<SubListProps> = (props) => {
  const [treeData, setTreeData] = useState<TreeItem[]>([]);
  const pathname = props.location.pathname;

  const dataToTreeData = (data: ProductItem, parentKey = '') => {
    const res: TreeItem[] = [];
    Object.entries(data).forEach(([key, value]) => {
      const curentKey = `${parentKey}/${key}`;
      const item: TreeItem = {
        title: key,
        key: curentKey,
        icon: <CodeOutlined />,
        children: [],
      };
      if (typeof value === 'object') {
        item.children = dataToTreeData(value, curentKey);
      }
      res.push(item);
    });

    return res;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSublist();
        setTreeData(dataToTreeData(data));
        if (!pathname || pathname === '/') {
          props.history.push(Object.keys(data)?.[0] || '');
        }
      } catch (e) {
        message.error('获取列表出错');
      }
    };

    fetchData();
  }, []);

  const onSelect = (selectedKeys: React.Key[]) => {
    props.history.push(selectedKeys[0] as string);
  };

  return (
    <div className='tree'>
      {treeData.length && (
        <Tree
          defaultExpandAll
          blockNode
          showLine={{ showLeafIcon: false }}
          selectedKeys={[pathname]}
          onSelect={onSelect}
          treeData={treeData}
        />
      )}
    </div>
  );
};

export default withRouter(SubList);
