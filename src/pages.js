import React from "react";
import {
    Link,
} from "react-router-dom";

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