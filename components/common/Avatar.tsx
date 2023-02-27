import React  from 'react'
import Avatar, { genConfig } from 'react-nice-avatar'
type Props = {
  name: string,
  color: string,
  tw: string
}


const AvatarMe =  (props: Props) => {

  const configGenerator = (config: string) => {
    return genConfig(config)
  }
  return (
    <Avatar style={{ backgroundColor: props.color }} className={`${props.tw} rounded-lg ring-2 ring-white`} {...configGenerator(props.name)} />

  )
}


export default AvatarMe