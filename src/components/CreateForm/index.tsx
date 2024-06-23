import { FC, useRef } from "react";
import { DrawerFormProps } from "@ant-design/pro-form/es/layouts/DrawerForm";
import { DrawerForm, ProFormGroup, ProFormInstance, ProFormList, ProFormText } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRequest } from "@@/exports";

import { Class, ControlType } from "@/utils/types";
import { FormField } from "@/components/FormField";
import { CrudApiFactory } from "@/utils/crud";
import { MetadataFactory } from "@/utils/metadata";
import { getControlType } from "@/utils/controltype";
import { unwrapFieldsValue } from "@/utils/columns";
import { FieldConfig } from "@/utils/decorators";

interface CreateFormProps<T> {
  recordClass: Class<T>,
  onOk?: () => void;
}

export const CreateForm: FC<CreateFormProps<any> & DrawerFormProps> = (props: CreateFormProps<any> & DrawerFormProps) => {
  // 新增成功后触发的回调
  const { recordClass, onOk } = props;
  // form 的数据
  const formRef = useRef<ProFormInstance>();
  // Toast 消息显示
  const [messageApi, contextHolder] = message.useMessage();
  // 所有元数据
  const metadata = MetadataFactory.get(recordClass);
  // 数据类元数据
  const tableConfig = metadata.tableConfig();
  // 在新增表单中显示的属性元数据
  const fieldConfigs = metadata.fieldConfigsForCreate();
  // crud api 实例
  const crudApi = CrudApiFactory.get(recordClass);
  // 需要在提交前转换内容的字段列表
  const fieldsNeedUnwrapping = metadata.fieldConfigsNeedWrapping();
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
  // 渲染子类字段的 FormField，todo 目前只渲染为 FormText
  const renderSubFields = (fieldConfigs: Map<string, FieldConfig>) => {
    const controls: any[] = [];
    fieldConfigs.forEach((fieldConfig, fieldName) => {
      controls.push(
        <ProFormText name={fieldName} key={fieldName} label={fieldConfig.description} width="sm" />);
    });
    return controls;
  }
  // 渲染字段的 FormField
  const renderFields = () => {
    const controls: any[] = [];
    fieldConfigs.forEach((fieldConfig, fieldName) => {
      const controlType = getControlType(fieldConfig.columnType, fieldConfig.editControlType);
      if (controlType === ControlType.SimpleArray) {
        controls.push(
          <ProFormList
            key={ fieldName }
            name={ fieldName }
            label={ fieldConfig.description }
            creatorButtonProps={{
              position: 'bottom',
              creatorButtonText: '增加一项',
            }}
          >
            <ProFormText name="value" width="md" />
          </ProFormList>
        );
      } else if (controlType === ControlType.SimpleMap) {
        controls.push(
          <ProFormList
            key={ fieldName }
            name={ fieldName }
            label={ fieldConfig.description }
            creatorButtonProps={{
              position: 'bottom',
              creatorButtonText: '增加一项',
            }}
          >
            <ProFormGroup key="group">
              <ProFormText name="key" label="键" width="sm" />
              <ProFormText name="value" label="值" width="sm" />
            </ProFormGroup>
          </ProFormList>
        );
      } else if (controlType === ControlType.ObjectArray) {
        if (fieldConfig.subElementClass) {
          const subElementFieldConfigs = MetadataFactory.get(fieldConfig.subElementClass).fieldConfigsForUpdate();
          console.log("subElementFieldConfigs", subElementFieldConfigs);
          // console.log("fieldValue", fieldsValue[fieldName]);
          controls.push(
            <ProFormList
              key={ fieldName }
              name={ fieldName }
              label={ fieldConfig.description }
              creatorButtonProps={{
                position: 'bottom',
                creatorButtonText: '增加一项',
              }}
            >
              <ProFormGroup key="group">
                { renderSubFields(subElementFieldConfigs) }
              </ProFormGroup>
            </ProFormList>
          );
        } else {
          // console.log("controlType", controlType);
          // console.log("getValues", fieldsValue);
          // console.log("fieldValue", fieldsValue[fieldName]);
          controls.push(
            <ProFormList
              key={ fieldName }
              name={ fieldName }
              label={ fieldConfig.description }
              creatorButtonProps={{
                position: 'bottom',
                creatorButtonText: '增加一项',
              }}
            >
              <ProFormGroup key="group">
                <ProFormText name="key" width="md" />
                <ProFormText name="value" width="md" />
              </ProFormGroup>
            </ProFormList>
          );
        }
      } else {
        controls.push(
          <FormField
            key={ fieldName }
            fieldName={ fieldName }
            columnType={ fieldConfig.columnType }
            editControlType={ getControlType(fieldConfig.columnType, fieldConfig.editControlType) }
            required={ fieldConfig.required }
            description={ fieldConfig.description }
            displayValueMapping={ fieldConfig.displayValueMapping }
          />);
      }
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
        width={800}
        // modalProps={{ okButtonProps: { loading } }}
        onFinish={ async (value) => {
          await run(unwrapFieldsValue(value, fieldsNeedUnwrapping));
          return true;
        } }
      >
        {renderFields()}
      </DrawerForm>
    </>
  );
}
