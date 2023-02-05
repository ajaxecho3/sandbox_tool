import React from 'react'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const Layout = (props: Props) => {
  return (
    <div>
      {props.children}
    </div>
  )
}

export default Layout