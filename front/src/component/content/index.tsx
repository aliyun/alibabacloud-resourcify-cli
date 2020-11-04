import { Card, Descriptions, PageHeader, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { requestFeatch } from '../../model/api';
import { ContentDataItem } from '../../model/_types';
import './index.scss';

export interface ContentProps extends RouteComponentProps {}

const Content: React.FC<ContentProps> = (props) => {
  const pathname = props.location.pathname;
  const [showData, setShowData] = useState<ContentDataItem>();

  const getUrl = () => {
    const len = (pathname || '').split('/').filter((v) => v).length;
    if (len === 1) {
      return `product${pathname}`;
    } else if (len === 2) {
      return `resource${pathname}`;
    } else {
      return `action${pathname}`;
    }
  };

  useEffect(() => {
    const getData = async () => {
      if (!pathname) return;
      const data = await requestFeatch(getUrl());
      setShowData(data);
    };
    getData();
  }, [pathname]);

  const pathNameArr = (pathname || '').split('/').filter((v) => v);
  const routes = pathNameArr.map((v) => ({ path: v, breadcrumbName: v }));

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 250,
    },
    {
      title: 'vtype',
      dataIndex: 'vtype',
    },
    {
      title: 'desc',
      dataIndex: 'desc',
    },
  ];

  const getDataSourceByOptions = () => {
    const res: { name: string; vtype: string; desc: string }[] = [];
    Object.entries(showData?.options || {}).map(([key, value]) => {
      res.push({ name: key, ...value });
    });
    return res;
  };

  return (
    <div className='pageContent'>
      <PageHeader
        title={showData?.name}
        subTitle={showData?.desc}
        ghost={false}
        breadcrumb={{ routes }}
      ></PageHeader>
      <div className='cardContent'>
        <Card title='Syntax'>
          {showData?.syntax.map((e) => {
            return (
              <div key={e} className='codeItem'>
                <Typography.Text code>{e}</Typography.Text>
              </div>
            );
          })}
        </Card>

        {showData?.actions && (
          <Card title='Actions'>
            <Descriptions bordered>
              {Object.entries(showData?.actions).map(([k, v]) => {
                return (
                  <Descriptions.Item key={k} label={k}>
                    {v as string}
                  </Descriptions.Item>
                );
              })}
            </Descriptions>
          </Card>
        )}

        {showData?.resources && (
          <Card title='Resources'>
            <Descriptions bordered>
              {Object.entries(showData?.resources).map(([k, v]) => {
                return (
                  <Descriptions.Item key={k} label={k}>
                    {v as string}
                  </Descriptions.Item>
                );
              })}
            </Descriptions>
          </Card>
        )}

        {showData?.options && (
          <Card title='Options'>
            <Table
              columns={columns}
              rowKey='name'
              dataSource={getDataSourceByOptions()}
              bordered
              pagination={false}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default withRouter(Content);
