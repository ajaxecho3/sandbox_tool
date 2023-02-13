import React, { ChangeEvent, FC, Fragment, InputHTMLAttributes } from 'react'

interface Props extends React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label: string;
  type?: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<Props> = ({ label, placeholder, value, onChange, type }) => {
  return (
    <Fragment>
      <label
        htmlFor="exampleFormControlInput4"
        className="form-label inline-block mb-2 text-gray-700 text-sm"
      >{label}</label
      >
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="
        form-control 
        block
          w-full
          px-2
          py-1
          text-sm
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        placeholder={placeholder}
      />
    </Fragment>
  )
}

export default Input