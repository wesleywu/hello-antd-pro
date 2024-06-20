import { FC, useRef } from "react";
import { DrawerFormProps } from "@ant-design/pro-form/es/layouts/DrawerForm";
import { DrawerForm, ProFormInstance } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRequest } from "@@/exports";

import { Class, FieldConfig, getControlType, showInUpdate } from "@/utils/types";
import { FormField } from "@/components/FormField";
import { CrudApiFactory, getFieldConfigs, getTableConfig } from "@/utils/crud";
import { VideoCollection } from "@/pages/list/video-collection/constants";

interface UpdateFormProps<T> {
  poClass: Class<T>,
  onOk?: () => void;
  onCancel?: () => void;
  getValues?: () => Partial<T>;
  visible: boolean;
  idValue: string;
}

export const UpdateForm: FC<UpdateFormProps<any> & DrawerFormProps> = (props: UpdateFormProps<any> & DrawerFormProps) => {
  // 修改成功、取消后触发的回调
  const { poClass, onOk, onCancel, getValues, visible, idValue } = props;
  // form 的数据
  const formRef = useRef<ProFormInstance>();
  // Toast 消息显示
  const [messageApi, contextHolder] = message.useMessage();
  // 表的元数据
  const tableConfig = getTableConfig(props.poClass);
  // crud api 实例
  const crudApi = CrudApiFactory.get(poClass);
  // 执行 api update
  const { run } = useRequest(crudApi.update, {
    manual: true,
    onSuccess: async () => {
      messageApi.success('修改' + tableConfig.description + '成功');
      onOk?.();
    },
    onError: async () => {
      messageApi.error('修改' + tableConfig.description + '失败，请重试');
    },
  });
  // 渲染字段的 FormField
  const renderFields = () => {
    const controls: any[] = [];
    let createFieldsConfig = new Map<string, FieldConfig>;
    getFieldConfigs(poClass).forEach((value, key) => {
      if (showInUpdate(value.visibility)) {
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
          displayType={ getControlType(fieldConfig.columnType, fieldConfig.controlTypeInUpdateForm) }
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
        title={'修改' + tableConfig.description}
        formRef={ formRef }
        trigger={
          <Button type="primary" icon={ <PlusOutlined/> }>新建</Button>
        }
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
          await run(idValue, value);
          return true;
        }}
      >
        {renderFields()}
      </DrawerForm>
    </>
  );
}
