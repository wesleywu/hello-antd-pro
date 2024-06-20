import { FC, useRef } from "react";
import { DrawerFormProps } from "@ant-design/pro-form/es/layouts/DrawerForm";
import { DrawerForm, ProFormInstance } from "@ant-design/pro-components";
import { message } from "antd";
import { useRequest } from "@@/exports";

import { Class, getControlType } from "@/utils/types";
import { FormField } from "@/components/FormField";
import { CrudApiFactory } from "@/utils/crud";
import { MetadataFactory } from "@/utils/metadata";

interface UpdateFormProps<T> {
  recordClass: Class<T>,
  onOk?: () => void;
  onCancel?: () => void;
  getValues?: () => Partial<T>;
  visible: boolean;
  idValue: string;
}

export const UpdateForm: FC<UpdateFormProps<any> & DrawerFormProps> = (props: UpdateFormProps<any> & DrawerFormProps) => {
  // 修改成功、取消后触发的回调
  const { recordClass, onOk, onCancel, getValues, visible, idValue } = props;
  // form 的数据
  const formRef = useRef<ProFormInstance>();
  // Toast 消息显示
  const [messageApi, contextHolder] = message.useMessage();
  // 所有元数据
  const metadata = MetadataFactory.get(recordClass);
  // 数据类元数据
  const tableConfig = metadata.tableConfig();
  // 在新增表单中显示的属性元数据
  const fieldConfigs = metadata.fieldConfigsForUpdate();
  // crud api 实例
  const crudApi = CrudApiFactory.get(recordClass);
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
    fieldConfigs.forEach((fieldConfig, fieldName) => {
      controls.push(
        <FormField
          key={ fieldName }
          fieldName={ fieldName }
          columnType={ fieldConfig.columnType }
          controlTypeInCreateForm={ getControlType(fieldConfig.columnType, fieldConfig.controlTypeInUpdateForm) }
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
