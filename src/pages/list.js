import React, { useState, useEffect } from "react";
import axios from "axios";

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

  useEffect(() => {
    if (!data) return;
    saveJSON(query, data);
  }, [data]);

  useEffect(() => {
      if (data) return;

      request()
        .then(result => setData(result.data.data.Page.media))
        .catch(console.error);

  }, [])

  if (!data) return <p>loading...</p>

  return (
    <>
      <List data={data} renderItem={Details} renderEmpty={<p>Nothing to render.</p>} /> 
    </>
  );
}

function Details(data) {
  return (
    <section>
      <p>{data.siteUrl}</p>
      <p>{data.title.english}</p>
      <p>{data.title.native}</p>
      <p>{data.description}</p>  
    </section>
  );
}

function List({ data, renderItem, renderEmpty}) {
  return !data.length ? (
    renderEmpty
  ) : (
  <ul>
    {
      data.map((item, i) => (
        <li key={i}>{Details(item)}</li>
      ))
    }
  </ul>
  );
}