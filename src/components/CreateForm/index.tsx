import { FC, useRef } from "react";
import { DrawerFormProps } from "@ant-design/pro-form/es/layouts/DrawerForm";
import { DrawerForm, ProFormInstance } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRequest } from "@@/exports";

import { Class, FieldConfig, showInCreate } from "@/utils/types";
import { defaultDisplayType, FormField } from "@/components/FormField";
import { Crud, getFieldConfigs, getTableConfig } from "@/utils/crud";

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
  // 表的元数据
  const tableConfig = getTableConfig(props.poClass);
  // 执行 api create
  const { run } = useRequest(crudApi.create, {
    manual: true,
    onSuccess: async () => {
      messageApi.success('新增' + tableConfig.description + '成功');
      formRef.current?.resetFields();
      onOk?.();
    },
    onError: async () => {
      messageApi.error('新增' + tableConfig.description + '失败，请重试');
    },
  });
  // 渲染字段的 FormField
  const renderFields = () => {
    const controls: any[] = [];
    let createFieldsConfig = new Map<string, FieldConfig>;
    getFieldConfigs(poClass).forEach((value, key) => {
      if (showInCreate(value.visibility)) {
        createFieldsConfig.set(key, value);
      }
    });
    createFieldsConfig.forEach((fieldConfig, fieldName) => {
      controls.push(
        // todo 不需要再使用 FieldInfo，用 FieldConfig 替代即可
        <FormField
          key={ fieldName }
          fieldName={ fieldName }
          protoType={ fieldConfig.columnType }
          displayType={ defaultDisplayType(fieldConfig.columnType, fieldConfig.controlTypeInCreateForm) }
          required={ fieldConfig.required }
          description={ fieldConfig.description }
          displayValueMapping={ fieldConfig.displayValueMapping }
        />);
    });
    return controls;
  };

  return (
    <>
      {contextHolder}
      <DrawerForm
        title={'新建' + tableConfig.description}
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
        {renderFields()}
      </DrawerForm>
    </>
  );
}
