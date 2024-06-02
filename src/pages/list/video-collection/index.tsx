import { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, DatePicker, Drawer, message, Popconfirm } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { VideoCollectionItem } from "@/pages/list/video-collection/data";
import { listVideoCollection, removeVideoCollection } from "@/pages/list/video-collection/api";
import { contentTypeMap, filterTypeMap, isOnlineMap } from "@/pages/list/video-collection/constants";
import { QuestionCircleOutlined } from "@ant-design/icons";
import FormDigitRange from "@/components/DigitRange";

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<VideoCollectionItem>();
  const [selectedRowsState, setSelectedRows] = useState<VideoCollectionItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const [messageApi, contextHolder] = message.useMessage();

  const { run: delRun, loading } = useRequest(removeVideoCollection, {
    manual: true,
    onSuccess: () => {
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();

      messageApi.success('Deleted successfully and will refresh soon');
    },
    onError: () => {
      messageApi.error('Delete failed, please try again');
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
      if (selectedRows?.length > 1) {
        messageApi.warning('目前只支持删除单条记录');
        return;
      }
      await delRun({
        id: selectedRows[0].id,
      });
    },
    [delRun],
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
      render: (dom, entity) => contentTypeMap.get(entity.contentType),
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
      // renderFormItem: () => {
      //   return <FormDigitRange suffix="万" placeholder={['内容量最小值', '内容量最大值']} min={0} max={999999}></FormDigitRange>;
      // },
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
        <UpdateForm
          trigger={
            <a>修改</a>
          }
          key="config"
          onOk={ actionRef.current?.reload }
          values={ record }
        />,
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
        toolBarRender={() => [<CreateForm key="create" reload={actionRef.current?.reload} />]}
        request={listVideoCollection}
        columns={columns}
        pagination={{
          defaultPageSize: 2,
        }}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.count!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Popconfirm
            title="删除记录"
            description="确定要删除选中的记录吗？"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => {
              handleRemove(selectedRowsState);
            }}
          >
            <Button
              loading={loading}
            >
              <FormattedMessage
                id="pages.searchTable.batchDeletion"
                defaultMessage="Batch deletion"
              />
            </Button>
          </Popconfirm>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<VideoCollectionItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<VideoCollectionItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
