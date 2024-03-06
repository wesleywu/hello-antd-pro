import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  DrawerForm,
  ProFormDigit, ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { FC, useRef } from 'react';
import { addVideoCollection } from "@/pages/list/video-collection/api";
import { VideoCollectionItem } from "@/pages/list/video-collection/data";
import { contentTypeMap, filterTypeMap, isOnlineMap } from "@/pages/list/video-collection/constants";
import { useRequest } from "@umijs/max";

interface CreateFormProps {
  reload?: ActionType['reload'];
}

const CreateForm: FC<CreateFormProps> = (props) => {
  const { reload } = props;
  const formRef = useRef<ProFormInstance>();
  const [messageApi, contextHolder] = message.useMessage();
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  // const intl = useIntl();

  const { run } = useRequest(addVideoCollection, {
    manual: true,
    onSuccess: () => {
      messageApi.success('Added successfully');
      formRef.current?.resetFields();
      reload?.();
    },
    onError: () => {
      messageApi.error('Adding failed, please try again!');
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
          await run(value as VideoCollectionItem);
          return true;
        }}
      >
        <ProFormText
          label='集合编号'
          rules={[
            {
              required: true,
              message: ('集合编号必须输入'),
            },
          ]}
          width="lg"
          name="id"
        />
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
