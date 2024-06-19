import { FC, useRef } from "react";
import { DrawerFormProps } from "@ant-design/pro-form/es/layouts/DrawerForm";
import { DrawerForm, ProFormInstance } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRequest } from "@@/exports";

import { Class, FieldConfig, showInCreate } from "@/utils/types";
import { defaultDisplayType, FormField } from "@/components/FormField";
import { Crud, getFieldConfigs } from "@/utils/crud";

interface CreateFormProps<T> {
  poClass: Class<T>,
  crudApi: Crud,
  onOk?: () => void;
}

export const CreateForm: FC<CreateFormProps<any> & DrawerFormProps> = (props: CreateFormProps<any> & DrawerFormProps) => {
  // 新增成功后触发的回调
  const { poClass, crudApi, onOk } = props;
  // form 的数据
  const formRef = useRef<ProFormInstance>();
  // Toast 消息显示
  const [messageApi, contextHolder] = message.useMessage();
  // 字段配置
  let fieldConfigs: FieldConfig[] = [];
  getFieldConfigs(poClass).forEach(value => {
    if (showInCreate(value.visibility)) {
      fieldConfigs.push(value);
    }
  });
  const { run } = useRequest(crudApi.create, {
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
        formRef={ formRef }
        trigger={
          <Button type="primary" icon={ <PlusOutlined/> }>新建</Button>
        }
        width="500px"
        // modalProps={{ okButtonProps: { loading } }}
        onFinish={ async (value) => {
          console.log(value);
          await run(value);
          return true;
        } }
      >
        {fieldConfigs.map((fieldConfig) => (
          <FormField
            key={fieldConfig.fieldName}
            fieldName={fieldConfig.fieldName}
            protoType={fieldConfig.columnType}
            displayType={defaultDisplayType(fieldConfig.columnType, fieldConfig.controlTypeInCreateForm)}
            required={fieldConfig.required}
            description={fieldConfig.description}
            displayValueMapping={fieldConfig.displayValueMapping}
          />
        ))}
      </DrawerForm>
    </>
  );
}
