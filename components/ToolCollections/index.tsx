/* eslint-disable @next/next/no-img-element */
import React from 'react'
import SectionHeader from '../SectionHeader'
import CollectionCard from './CollectionCard'

type Props = {}

const ToolCollections = (props: Props) => {
  return (
    <div className="__container">
      <SectionHeader lineShow title='Tool Collection' description='Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven`&#39;t heard of them man bun deep jianbing selfies heirloom prism food truck ugh squid celiac humblebrag.' />
      <div className="flex flex-wrap -m-4">
        <CollectionCard title='roulette' desription='whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table.' subtitle='entertainment' imgSrc=''  />
       
      </div>
    </div>
  )
}

export default ToolCollections