import React from "react"

export default function Card(props) {
    return <div {...props} className={"card"}>{props.children}</div>
}