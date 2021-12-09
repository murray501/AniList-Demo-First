import React, { useState, useEffect } from "react";

const axios = require('axios');

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
  return axios({
    url: url,
    method: 'post',
    data: {
      query: query
    }
  });
}

function App() {
  const [Data, setData] = useState();

  useEffect(() => {
      request()
      .then(result => setData(result.data.data))
      .catch(console.error);

  }, [])

  if (!Data) return <p>loading...</p>

  return (
    <>
      <List data={Data.Page.media} renderItem={Details} renderEmpty={<p>Nothing to render.</p>} /> 
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

export default App;
