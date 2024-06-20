import React, { useCallback, useRef, useState } from 'react';
import { useRequest } from '@umijs/max';
import { Button, DatePicker, Drawer, message, Popconfirm } from 'antd';
import { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { FooterToolbar, PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { QuestionCircleOutlined } from "@ant-design/icons";
import { VideoCollection, contentTypeMap, filterTypeMap, isOnlineMap } from "./constants";
import { UpdateForm } from '@/components/UpdateForm';
import { CreateForm } from "@/components/CreateForm";
import { CrudApiFactory, MetadataFactory } from "@/utils/crud";

const VideoCollectionListPage: React.FC = () => {
  // 刷新表格的actionRef
  const actionRef = useRef<ActionType>();
  // 显示更新表单抽屉的开关
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  // 显示详情抽屉的开关
  const [showDetail, setShowDetail] = useState<boolean>(false);
  // 当前行
  const [currentRow, setCurrentRow] = useState<VideoCollection>();
  // 选中行
  const [selectedRows, setSelectedRows] = useState<VideoCollection[]>([]);
  // Toast 消息显示
  const [messageApi, contextHolder] = message.useMessage();
  // crud api
  const videoCollectionApi = CrudApiFactory.get(VideoCollection);

  const { run: deleteSingleRow } = useRequest(videoCollectionApi.delete, {
    manual: true,
    onSuccess: async () => {
      messageApi.success('删除视频集合记录成功');
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();
      setShowDetail(false);
    },
    onError: async() => {
      messageApi.error('删除视频集合记录失败，请重试');
    },
  });

  const { run: deleteMultiRows, loading: deleteMultiRowsLoading} = useRequest(videoCollectionApi.deleteMulti, {
    manual: true,
    onSuccess: async () => {
      messageApi.success('删除视频集合记录成功');
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();
      setShowDetail(false);
    },
    onError: async () => {
      messageApi.error('删除视频集合记录失败，请重试');
    },
  });

  /**
   * 处理删除多条记录的逻辑
   * @param selectedRows
   */
  const handleRemove = useCallback(
    async (selectedRows: VideoCollection[]) => {
      if (!selectedRows?.length) {
        messageApi.warning('请选择删除项');
        return;
      }
      const ids = selectedRows.map(item => item.id);
      await deleteMultiRows({
        id: ids,
      });
    },
    [deleteMultiRows],
  );
  const columns1 = MetadataFactory.get(VideoCollection).columns();
  /**
   * 定义表格显示的列
   */
  const columns: ProColumns<VideoCollection>[] = [
    // {
    //   title: '集合编号',
    //   dataIndex: 'id',
    //   render: (dom, entity) => {
    //     return (
    //       <a
    //         onClick={() => {
    //           setCurrentRow(entity);
    //           setShowDetail(true);
    //         }}
    //       >
    //         {dom}
    //       </a>
    //     );
    //   },
    // },
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
        `${val} 万`,
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
            setCurrentRow(record);
            // 如果 UpdateForm 由详情抽屉弹出，则需要先关闭详情抽屉
            if (showDetail) {
              setShowDetail(false);
            }
            setShowUpdateForm(true);
          }}
        >
          修改
        </a>,
        <Popconfirm
          key='delete-confirm'
          title="删除记录"
          description="确定要删除这条记录吗？"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => deleteSingleRow({id: record.id})}
        >
          <a key='delete'> 删除 </a>
        </Popconfirm>
      ],
    },
  ];

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<VideoCollection, VideoCollection>
        headerTitle='视频集合列表'
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [<CreateForm key="create" poClass={VideoCollection} onOk={() => {
          actionRef.current?.reload();
        }} />]}
        request={videoCollectionApi.list}
        columns={columns1}
        pagination={{
          defaultPageSize: 5,
        }}
        onRow={record => {
          return { onClick: () => {
            setCurrentRow(record);
            setShowDetail(true);
          }};
        }}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRows?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              {'已选择 '}<a style={{ fontWeight: 600 }}>{selectedRows.length}</a>{' 项'}
              &nbsp;&nbsp;
              <span>
                {'内容总量 '}
                {selectedRows.reduce((pre, item) => pre + item.count!, 0)}
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
              await handleRemove(selectedRows);
            }}
          >
            <Button type="primary"
              loading={deleteMultiRowsLoading}
            >批量删除</Button>
          </Popconfirm>
        </FooterToolbar>
      )}
      <UpdateForm
        key="修改"
        poClass={VideoCollection}
        visible={showUpdateForm}
        onOk={() => {
          actionRef.current?.reload();
          setCurrentRow(undefined);
        }}
        onCancel={() => {
          setShowUpdateForm(false);
        }}
        idValue={currentRow?.id || ''}
        getValues={() => currentRow || {} }
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
          <ProDescriptions<VideoCollection>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<VideoCollection>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default VideoCollectionListPage;
