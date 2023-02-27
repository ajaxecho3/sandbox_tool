import { Popover, Transition } from '@headlessui/react'
import React, { ChangeEventHandler, Fragment, useEffect, useState } from 'react'
import { ChromePicker, ColorResult } from 'react-color'

type Props = {
  selectedColor: string;
  onChange: (color: ColorResult) => void
}

const ColorPicker = ({onChange, selectedColor}: Props) => {
  const [color, setColor] = useState('')

  useEffect(() => {
    setColor(selectedColor)
  }, [selectedColor])
 
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            style={{backgroundColor: color}}
            className={`
                ${open ? '' : 'text-opacity-90'}
                group 
                inline-flex 
                items-center  
                h-10
                w-10
                rounded-full
                text-base 
                font-medium 
                text-white 
                hover:text-opacity-100 
                focus:outline-none 
                focus-visible:ring-2 
                focus-visible:ring-white 
                focus-visible:ring-opacity-75`}
          >
            
            
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-1/2 z-50 mt-3 w-full max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
              <ChromePicker color={color} onChange={onChange} />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

export default ColorPicker