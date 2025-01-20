"use client"
import React from 'react'

export default function profile(props:{params:{id:string}}) {
  console.log("props",props)
  return (
    <div>
      profile {props.params.id}
    </div>
  )
}
