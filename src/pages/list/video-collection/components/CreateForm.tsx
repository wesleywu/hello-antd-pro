import { FC, useRef } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DrawerForm, ProFormDigit, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { VideoCollection } from "../data";
import { contentTypeMap, filterTypeMap, isOnlineMap, videoCollectionApi } from "../constants";
import { useRequest } from "@umijs/max";

interface CreateFormProps {
  onOk?: () => void;
}

const CreateForm: FC<CreateFormProps> = (props) => {
  // 新增成功后触发的回调
  const { onOk } = props;
  // form 的数据
  const formRef = useRef<ProFormInstance>();
  // Toast 消息显示
  const [messageApi, contextHolder] = message.useMessage();
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  // const intl = useIntl();

  const { run } = useRequest(videoCollectionApi.create, {
    manual: true,
    onSuccess: async () => {
      messageApi.success('新增视频集合成功');
      formRef.current?.resetFields();
      onOk?.();
    },
    onError: async () => {
      messageApi.error('新增视频集合失败，请重试');
    },
  });

  return (
    <>
      {contextHolder}
      <DrawerForm
        title='新建视频集合'
        formRef={formRef}
        trigger={
          <Button type="primary" icon={<PlusOutlined />}>新建</Button>
        }
        width="500px"
        // modalProps={{ okButtonProps: { loading } }}
        onFinish={async (value) => {
          console.log(value);
          await run(value as VideoCollection);
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

export default CreateForm;
