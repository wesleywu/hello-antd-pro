import { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, DatePicker, Drawer, message, Popconfirm } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { VideoCollectionItem } from "@/pages/list/video-collection/data";
import {
  listVideoCollection,
  deleteVideoCollection,
  deleteMultiVideoCollection
} from "@/pages/list/video-collection/api";
import { contentTypeMap, filterTypeMap, isOnlineMap } from "@/pages/list/video-collection/constants";
import { QuestionCircleOutlined } from "@ant-design/icons";

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<VideoCollectionItem>();
  const [selectedRowsState, setSelectedRows] = useState<VideoCollectionItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const [messageApi, contextHolder] = message.useMessage();

  const { run: delRun } = useRequest(deleteVideoCollection, {
    manual: true,
    onSuccess: async () => {
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();
      await messageApi.success('删除视频集合记录成功');
      setShowDetail(false);
    },
    onError: async() => {
      await messageApi.error('删除视频集合记录失败，请重试');
    },
  });

  const { run: delMultiRun, loading: delMultiLoading} = useRequest(deleteMultiVideoCollection, {
    manual: true,
    onSuccess: async () => {
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();
      await messageApi.success('删除视频集合记录成功');
      setShowDetail(false);
    },
    onError: async () => {
      await messageApi.error('删除视频集合记录失败，请重试');
    },
  });

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = useCallback(
    async (selectedRows: VideoCollectionItem[]) => {
      if (!selectedRows?.length) {
        messageApi.warning('请选择删除项');
        return;
      }
      const ids = selectedRows.map(item => item.id);
      await delMultiRun({
        id: ids,
      });
    },
    [delMultiRun],
  );

  const columns: ProColumns<VideoCollectionItem>[] = [
    {
      title: '集合编号',
      dataIndex: 'id',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '集合名称',
      dataIndex: 'name',
      valueType: 'textarea',
    },
    {
      title: '内容体裁',
      dataIndex: 'contentType',
      hideInForm: true,
      valueType: 'select',
      valueEnum: contentTypeMap,
      fieldProps: { mode: 'multiple', placeholder: 'Select one or more', },
      render: ( _, entity) => contentTypeMap.get(entity.contentType),
    },
    {
      title: '筛选方式',
      dataIndex: 'filterType',
      hideInForm: true,
      valueType: 'select',
      valueEnum: filterTypeMap,
      fieldProps: { mode: 'multiple', placeholder: 'Select one or more', },
    },
    {
      title: '内容量',
      dataIndex: 'count',
      sorter: true,
      hideInForm: true,
      renderText: (val: string) =>
        `${val}${intl.formatMessage({
          id: 'pages.searchTable.tenThousand',
          defaultMessage: ' 万 ',
        })}`,
      hideInSearch: true,
    },
    {
      title: '是否上线',
      dataIndex: 'isOnline',
      hideInForm: true,
      valueType: 'select',
      valueEnum: isOnlineMap,
      fieldProps: { mode: 'multiple', placeholder: 'Select one or more', },
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      renderFormItem: () => {
        return (<DatePicker.RangePicker/>);
      },
    },
    {
      title: '修改时间',
      sorter: true,
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            setShowUpdateForm(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        <Popconfirm
          key='delete-confirm'
          title="删除记录"
          description="确定要删除这条记录吗？"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => delRun({id: record.id})}
        >
          <a key='delete'> 删除 </a>
        </Popconfirm>
      ],
    },
  ];

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<VideoCollectionItem>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [<CreateForm key="create" onOk={actionRef.current?.reloadAndRest} />]}
        request={listVideoCollection}
        columns={columns}
        pagination={{
          defaultPageSize: 5,
        }}
        rowSelection={{
          onChange: (_, selectedRows) => {
            console.log(selectedRows);
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              {'已选择 '}<a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' 项'}
              &nbsp;&nbsp;
              <span>
                {'内容总量 '}
                {selectedRowsState.reduce((pre, item) => pre + item.count!, 0)}
                {' 万'}
              </span>
            </div>
          }
        >
          <Popconfirm
            title="删除记录"
            description="确定要删除选中的记录吗？"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={ async () => {
              await handleRemove(selectedRowsState);
            }}
          >
            <Button type="primary"
              loading={delMultiLoading}
            >批量删除</Button>
          </Popconfirm>
        </FooterToolbar>
      )}
      <UpdateForm
        key="修改"
        visible={showUpdateForm}
        onOk={() => {
          actionRef.current?.reload();
          setCurrentRow(undefined);
          // 如果 UpdateForm 由详情抽屉弹出，则需要在更新成功后关闭详情抽屉
          if (showDetail) {
            setShowDetail(false);
          }
        }}
        onCancel={() => {
          setShowUpdateForm(false);
          // 如果 UpdateForm 并非由详情抽屉弹出，取消后将当前选中 currentRow 信息清空
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        idValue={currentRow?.id || ''}
        values={currentRow || {}}
      />,
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={true}
      >
        {currentRow?.name && (
          <ProDescriptions<VideoCollectionItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<VideoCollectionItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
