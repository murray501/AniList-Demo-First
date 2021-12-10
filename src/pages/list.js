import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactList from "react-list";
import "../styles.css";

const loadJSON = key => key && JSON.parse(localStorage.getItem(key));
const saveJSON = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const query = `
{
  Page {
    media {
      siteUrl
      title {
        english
        native
      }
      description
    }
  }
}
`;

const url = 'https://graphql.anilist.co';

function request() {
  const options = {
    url: url,
    method: 'post',
    data: {
      query: query
    }
  };
  return axios.request(options);
}

export default function PageList() {
  const [data, setData] = useState(loadJSON(query));
  const [select, setSelect] = useState(-1);

  function renderItem(index, key) {
    let title = data[index].title.english ? data[index].title.english : data[index].title.native;
    return <div key={key} class="listitem" onClick={() => onClick(index)}>{index + 1} {title}</div>;
  }

  const onClick = (index) => {
    setSelect(index);
  }

  useEffect(() => {
    if (!data) return;
    saveJSON(query, data);
    console.log('data length=' + data.length);
  }, [data]);

  useEffect(() => {
      if (data) return;

      request()
        .then(result => setData(result.data.data.Page.media))
        .catch(console.error);

  }, [])

  if (!data) return <p>loading...</p>
  if (!data.length) return <p>Nothing to render.</p>

  return (
    <div style={{display: "flex"}}>
    <div class="left" style={{overflow: 'auto', maxHeight: 400}}>
      <ReactList
        itemRenderer={renderItem}
        length={data.length}
        type='uniform'
      />
    </div> 
    <RenderDetail index={select} data={data}/>
    </div>
  );
}

function RenderDetail({index, data}) {
  if (index === -1) return <p>Nothing is selected.</p>   
  return (
    <div class="right">
      <h1>Detail</h1>
      <p>URL: <a href={data[index].siteUrl}>{data[index].siteUrl}</a></p>
      <p>Title(English): {data[index].title.english}</p>
      <p>Title(Native): {data[index].title.native}</p>
      <h>Description:</h>
      <p>
      </p>  
    </div>
  );
}

