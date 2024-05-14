import React from 'react';
import TextType from '../FormFields/TextType';
import SelectType from '../FormFields/SelectType';
import PhoneField from '../FormFields/PhoneField';
import CodeField from '../FormFields/CodeField';
import TextArea from '../FormFields/TextArea';
import DateTimePicker from '../FormFields/DateTimePicker';
import Places from '../FormFields/Places';
import CheckboxField from "../FormFields/CheckboxField";
import VideoField from "../FormFields/VideoField";

const FormConstructor = ({inputField, field, fieldState}) => {
  switch (inputField.type) {
    case 'text':
      return (
        <TextType
          inputField={inputField}
          field={field}
          fieldState={fieldState}
        />
      );
    case 'password':
      return (
        <TextType
          inputField={inputField}
          field={field}
          fieldState={fieldState}
        />
      );
    case 'tel':
      return (
        <PhoneField
          inputField={inputField}
          field={field}
          fieldState={fieldState}
        />
      );
    case 'textarea':
      return (
        <TextArea
          inputField={inputField}
          field={field}
          fieldState={fieldState}
        />
      );
    case 'select':
      return (
        <SelectType
          inputField={inputField}
          field={field}
          fieldState={fieldState}
        />
      );
    case 'code':
      return (
        <CodeField
          inputField={inputField}
          field={field}
          fieldState={fieldState}
        />
      );
    case 'datetime':
      return (
        <DateTimePicker
          inputField={inputField}
          field={field}
          fieldState={fieldState}
        />
      );
    case 'places':
      return (
        <Places inputField={inputField} field={field} fieldState={fieldState} />
      );
    case 'checkbox':
      return (
          <CheckboxField
              inputField={inputField}
              field={field}
              fieldState={fieldState}
          />
      );
      case 'video':
      return (
          <VideoField
              inputField={inputField}
              field={field}
              fieldState={fieldState}
          />
      );
    default:
      return;
  }
};

export default FormConstructor;
