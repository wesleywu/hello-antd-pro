import { FC, useRef } from 'react';
import { useRequest } from '@umijs/max';
import { message } from 'antd';
import { DrawerForm, ProFormDigit, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { VideoCollection } from "../constants";
import { contentTypeMap, filterTypeMap, isOnlineMap, videoCollectionApi } from "../constants";

export type UpdateFormProps = {
  onOk?: () => void;
  onCancel?: () => void;
  getValues?: () => Partial<VideoCollection>;
  visible: boolean;
  idValue: string;
};

const UpdateForm: FC<UpdateFormProps> = (props) => {
  // 修改成功、取消后触发的回调
  const { onOk, onCancel, getValues, visible, idValue } = props;
  // form 的数据
  const formRef = useRef<ProFormInstance>();
  // Toast 消息显示
  const [messageApi, contextHolder] = message.useMessage();

  const { run } = useRequest(videoCollectionApi.update, {
    manual: true,
    onSuccess: async () => {
      messageApi.success('修改视频集合成功');
      onOk?.();
    },
    onError: async () => {
      messageApi.error('修改视频集合失败，请重试');
    },
  });

  return (
    <>
      {contextHolder}
      <DrawerForm
        title='修改视频集合'
        formRef={formRef}
        open={visible}
        width="500px"
        onOpenChange={(visible) => {
          if (!visible) {
            onCancel?.();
          } else {
            formRef?.current?.setFieldsValue(getValues?.());
          }
        }}
        onFinish={async (value) => {
          await run(idValue, value as VideoCollection);
          return true;
        }}
      >
        <ProFormText
          label='集合名称'
          rules={[
            {
              required: true,
              message: ('集合名称必须输入'),
            },
          ]}
          width="lg"
          name="name"
        />
        <ProFormSelect
          label='内容体裁'
          rules={[
            {
              required: true,
              message: ('内容体裁必须输入'),
            },
          ]}
          width="lg"
          name="contentType"
          valueEnum={contentTypeMap}
        />
        <ProFormSelect
          label='筛选方式'
          rules={[
            {
              required: true,
              message: ('筛选方式必须输入'),
            },
          ]}
          width="lg"
          name="filterType"
          valueEnum={filterTypeMap}
        />
        <ProFormDigit
          label='内容量'
          rules={[
            {
              required: true,
              message: ('内容量必须输入'),
            },
          ]}
          width="lg"
          name="count"
        />
        <ProFormSelect
          label='是否上线'
          rules={[
            {
              required: true,
              message: ('是否上线必须输入'),
            },
          ]}
          width="lg"
          name="isOnline"
          valueEnum={isOnlineMap}
        />
      </DrawerForm>
    </>
  );
};

export default UpdateForm;
