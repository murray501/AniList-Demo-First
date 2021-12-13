import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import parse from "html-react-parser";

export function Home() {
    return (
        <div>
            <h1>[Home]</h1>
            <nav>
                <Link to="list">List</Link>
                <Link to="other">Other</Link>
            </nav>
        </div>
    );
}

export function Other() {
    return (
        <div>
            <h1>[Other]</h1>
        </div>
    );
}

export function Whoops404() {
    return (
        <div>
            <h1>Resource not found</h1>
        </div>
    )
}

const loadJSON = key => key && JSON.parse(localStorage.getItem(key));

export function Description() {
    let { id } = useParams();
    let index = parseInt(id);
    const [data, setData] = useState(loadJSON('basic-query'));

    if (!data) return <p>no data</p>
    
    const find = data.find(x => x.id === index)

    if (!find) return <p> data not found id = {id} </p>

    const title = find.title.english ? find.title.english : find.title.native;

    return (
        <div style={{margin: 20}}>
            <h3>{title}</h3>
            <p>{parse(find.description)}</p>
        </div>
    )
}