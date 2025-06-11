import { Input, InputGroup } from "rsuite";
import React from "react";
import EyeCloseIcon from "@rsuite/icons/EyeClose";
import VisibleIcon from "@rsuite/icons/Visible";

export default function PasswordInput({
  field,
}: {
  field: {
    name: string;
    value: string;
    onChange: () => void;
    onBlur: () => void;
    placeholder?: string;
  };
}) {
  const [visible, setVisible] = React.useState(false);

  const handleChange = () => {
    setVisible(!visible);
  };
  return (
    <InputGroup inside>
      <Input
        id={field.name}
        type={visible ? "text" : "password"}
        value={field.value || ""}
        onChange={field.onChange}
        onBlur={field.onBlur}
        placeholder={field.placeholder}
        autoComplete={"one-time-code"}
      />
      <InputGroup.Button onClick={handleChange}>
        {visible ? <VisibleIcon /> : <EyeCloseIcon />}
      </InputGroup.Button>
    </InputGroup>
  );
}
