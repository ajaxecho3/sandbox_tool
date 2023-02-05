import React from 'react'
import { ReactNode } from 'react';

type Props = {
  title: string;
  description: string | ReactNode;
  lineShow: boolean;
}


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const SectionHeader = (props: Props) => {

  
  return (
    <div className="flex flex-wrap w-full mb-5">
      <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">{props.title}</h1>
        {
          props.lineShow && (
            <div className="h-1 w-20 bg-indigo-500 rounded"></div>

          )
        }
      </div>
      <p className="lg:w-1/2 w-full leading-relaxed text-gray-500">{props.description}</p>
    </div>
  )
}

export default SectionHeader