import {
  DrawerForm,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { message } from 'antd';
import { FC, useRef } from 'react';
import { VideoCollectionItem } from "@/pages/list/video-collection/data";
import { updateVideoCollection } from "@/pages/list/video-collection/api";
import { contentTypeMap, filterTypeMap, isOnlineMap } from "@/pages/list/video-collection/constants";

export type UpdateFormProps = {
  onOk: () => void;
  onCancel: () => void;
  visible: boolean;
  idValue: string;
  values: Partial<VideoCollectionItem>;
};

const UpdateForm: FC<UpdateFormProps> = (props) => {
  const { onOk, onCancel, visible, idValue, values } = props;
  const formRef = useRef<ProFormInstance>();
  const [messageApi, contextHolder] = message.useMessage();

  const { run } = useRequest(updateVideoCollection, {
    manual: true,
    onSuccess: () => {
      messageApi.success('修改视频集合成功');
      onOk?.();
    },
    onError: () => {
      messageApi.error('修改视频集合失败，请重试');
    },
  });

  return (
    <>
      {contextHolder}
      <DrawerForm
        title='修改视频集合'
        formRef={formRef}
        initialValues={values}
        open={visible}
        width="500px"
        // modalProps={{ okButtonProps: { loading } }}
        onOpenChange={(visible) => {
          if (!visible) {
            onCancel();
          } else {
            formRef.current?.resetFields();
          }
        }}
        onFinish={async (value) => {
          await run(idValue, value as VideoCollectionItem);
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
