import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import parse from "html-react-parser";
import "./styles.css";

export function Whoops404() {
    return (
        <div>
            <h1>Resource not found</h1>
        </div>
    )
}

const loadJSON = key => key && JSON.parse(localStorage.getItem(key));

export function Description() {
    let { id, type } = useParams();
    let index = parseInt(id);
    let name = 'basic-query-' + type;
    const [data, setData] = useState(loadJSON(name));

    if (!data) return <p>no data</p>
    
    const find = data.find(x => x.id === index)

    if (!find) return <p> data not found id = {id} </p>

    const title = find.title.english ? find.title.english : find.title.native;

    return (
        <div class="page">
            <h3>{title}</h3>
            <p>{parse(find.description)}</p>
        </div>
    )
}