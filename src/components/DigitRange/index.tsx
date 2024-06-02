/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2023-12-13 14:34:55
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2023-12-13 18:08:35
 * @Description: 数字范围输入组件
 */
import { Col, InputNumber, Row } from 'antd'
import type { InputNumberProps } from 'antd/es/input-number'
import { toNumber } from 'lodash'
import React, { FC } from 'react'

// import type { EnumValues } from '@/utils/types'

enum INPUT_TYPE {
  MIN, // 最小值
  MAX, // 最大值
}

// type InputType = EnumValues<typeof INPUT_TYPE>

type ValuePair = (string | number | undefined)[];

type FormDigitRangeProps = {
  value?: ValuePair; // 表单控件的值
  onChange?: (value: ValuePair) => void; // 表单控件改变值的回调
  separator: string; // 分割线
  separatorGap: number; // 分割线和数据框的 gap
  placeholder: [string, string]; // 占位符
  suffix: string; // 后缀，不传则不显示
} & InputNumberProps

const FormDigitRange: FC<FormDigitRangeProps> = ({
                                                   value = [],
                                                   // onChange,
                                                   separator = '~',
                                                   separatorGap = 15,
                                                   placeholder = ['最小值', '最大值'],
                                                   precision = 2,
                                                   min = 0,
                                                   max = 99999999.99,
                                                   suffix,
                                                   ...inputNumberProps
                                                 }) => {
  // 输入值失去焦点回调
  // const handleChangeValue = (e: FocusEvent, type: INPUT_TYPE) => {
  //   // 获取输入框的值,这里转成 number 类型
  //   const result = e.target?.value !== '' ? toNumber(e.target.value) : undefined;
  //   // 解构获取最值
  //   const [min, max] = value;
  //   switch (type) {
  //     case INPUT_TYPE.MIN:
  //       // 判断最小值是否大于最大值，为真就调换位置
  //       onChange?.(gt(result, max) ? [max, result] : [result, max])
  //       break;
  //     case INPUT_TYPE.MAX:
  //       // 判断最大值是否小于最小值，为真就调换位置
  //       onChange?.(gt(min, result) ? [result, min] : [min, result])
  //       break;
  //   }
  // }
  const onChange = (value: any) => {
    console.log('changed', value);
  };
  // 渲染输入框
  const renderInputNumber = (type: INPUT_TYPE) => (
    <InputNumber
      {...inputNumberProps}
      min={min}
      max={max}
      value={toNumber(value[type])}
      precision={precision}
      placeholder={placeholder[type]}
      onChange={onChange}
      // onBlur={(e) => handleChangeValue(e, type)}
      style={{ width: '100%' }}
    />
  )

  return (
    <Row gutter={separatorGap} align='middle' wrap={false}>
      <Col flex={1}>
        {renderInputNumber(INPUT_TYPE.MIN)}
      </Col>
      <Col flex="none">
        <div>{separator}</div>
      </Col>
      <Col flex={1}>
        {renderInputNumber(INPUT_TYPE.MAX)}
      </Col>
      {
        suffix && (
          <Col flex="none">{suffix}</Col>
        )
      }
    </Row>
  )
}
export default FormDigitRange
