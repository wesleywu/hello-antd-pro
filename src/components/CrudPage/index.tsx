import { FC, useCallback, useRef, useState } from "react";
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable
} from "@ant-design/pro-components";
import { Button, Drawer, message, Popconfirm } from "antd";
import { CrudApiFactory, MetadataFactory } from "@/utils/crud";
import { useRequest } from "@@/exports";
import { getColumns } from "@/utils/columns";
import { CreateForm } from "@/components/CreateForm";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { UpdateForm } from "@/components/UpdateForm";
import { Class } from "@/utils/types";

interface CrudPageProps<T extends Record<string, any>> {
  // 表格记录对应的数据类
  recordClass: Class<T>,
  // 每页显示的记录数
  pageSize: number,
}

export const CrudPage : FC<CrudPageProps<any>> = <T extends Record<string, any>,>(props: CrudPageProps<T>) => {
  const { recordClass, pageSize } = props;
  // 刷新表格的actionRef
  const actionRef = useRef<ActionType>();
  // 显示更新表单抽屉的开关
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  // 显示详情抽屉的开关
  const [showDetail, setShowDetail] = useState<boolean>(false);
  // 当前行
  const [currentRow, setCurrentRow] = useState<T>();
  // 选中行
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  // Toast 消息显示
  const [messageApi, contextHolder] = message.useMessage();
  // crud api
  const api = CrudApiFactory.get(recordClass);
  // 数据类元数据
  const tableConfig = MetadataFactory.get(recordClass).tableConfig();
  // 删除单一记录的请求
  const { run: deleteSingleRow } = useRequest(api.delete, {
    manual: true,
    onSuccess: async () => {
      messageApi.success('删除' + tableConfig.description + '记录成功');
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();
      setShowDetail(false);
    },
    onError: async() => {
      messageApi.error('删除' + tableConfig.description + '记录失败，请重试');
    },
  });
  // 删除多条记录的请求
  const { run: deleteMultiRows, loading: deleteMultiRowsLoading} = useRequest(api.deleteMulti, {
    manual: true,
    onSuccess: async () => {
      messageApi.success('删除' + tableConfig.description + '记录成功');
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();
      setShowDetail(false);
    },
    onError: async () => {
      messageApi.error('删除' + tableConfig.description + '记录失败，请重试');
    },
  });
  // 处理删除多条记录的逻辑
  const handleRemove = useCallback(
    async (selectedRows: T[]) => {
      if (!selectedRows?.length) {
        messageApi.warning('请选择删除项');
        return;
      }
      const ids = selectedRows.map(item => item.id);
      await deleteMultiRows({
        id: ids,
      });
    },
    [selectedRows, deleteMultiRows],
  );
  // 处理点击修改按钮的逻辑
  const onUpdateClick = useCallback((record: any) => {
    setCurrentRow(record);
    // 如果 UpdateForm 由详情抽屉弹出，则需要先关闭详情抽屉
    if (showDetail) {
      setShowDetail(false);
    }
    setShowUpdateForm(true);
  }, [showDetail]);
  // 处理点击删除按钮的逻辑
  const onDeleteClick = useCallback((record: T) => deleteSingleRow({id: record.id}), [deleteSingleRow])
  // 定义表格、详情显示的列
  const columns = getColumns(recordClass, onUpdateClick, onDeleteClick);

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<T, T>
        headerTitle={tableConfig.description + '列表'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [<CreateForm key="create" recordClass={recordClass} onOk={() => {
          actionRef.current?.reload();
        }} />]}
        request={api.list}
        columns={columns}
        pagination={{
          defaultPageSize: pageSize,
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
        recordClass={recordClass}
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
          <ProDescriptions<T>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<T>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};
