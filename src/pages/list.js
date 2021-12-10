import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactList from "react-list";

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
    return <div key={key} onClick={() => onClick(index)}>{index + 1} {data[index].title.english} - {data[index].title.native}</div>;
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
    <>
    <div style={{overflow: 'auto', maxHeight: 400}}>
      <ReactList
        itemRenderer={renderItem}
        length={data.length}
        type='uniform'
      />
    </div> 
    <h1>Detail</h1>
    <RenderDetail index={select} data={data}/>
    </>
  );
}

function RenderDetail({index, data}) {
  if (index === -1) return <p>Nothing is selected.</p> 
  return (
    <div>
      <p>URL: {data[index].siteUrl}</p>
      <p>Title(English): {data[index].title.english}</p>
      <p>TitleNative): {data[index].title.native}</p>
      <p>Description: {data[index].description}</p>  
    </div>
  );
}

