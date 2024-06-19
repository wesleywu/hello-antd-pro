import { FC, useRef } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DrawerForm, ProFormDigit, ProFormInstance, ProFormSelect } from '@ant-design/pro-components';
import { contentTypeMap, filterTypeMap, isOnlineMap, VideoCollection, videoCollectionApi } from "../constants";
import { useRequest } from "@umijs/max";
import { ControlType, FormField } from "@/components/FormField";
import { ProtoType } from "@/utils/types";

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
        <FormField
          fieldName={'name'}
          protoType={ProtoType.StringValue}
          required={true}
          description={'集合名称'}
        />
        <FormField
          fieldName={'contentType'}
          protoType={ProtoType.StringValue}
          displayType={ControlType.Select}
          required={true}
          description={'内容体裁'}
          displayValueMapping={contentTypeMap}
        />
        <FormField
          fieldName={'filterType'}
          protoType={ProtoType.StringValue}
          displayType={ControlType.Select}
          required={true}
          description={'筛选方式'}
          displayValueMapping={filterTypeMap}
        />
        <FormField
          fieldName={'count'}
          protoType={ProtoType.Int32Value}
          required={true}
          description={'内容量'}
        />
        <FormField
          fieldName={'isOnline'}
          protoType={ProtoType.BoolValue}
          required={true}
          description={'是否上线'}
          displayValueMapping={isOnlineMap}
        />
      </DrawerForm>
    </>
  );
};

export default CreateForm;
