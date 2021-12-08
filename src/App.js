import React, { useState, useEffect } from "react";
import { GraphQLClient } from "graphql-request";

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

const client = new GraphQLClient(
  "https://graphql.anilist.co"
);

function App() {
  const [Data, setData] = useState();

  useEffect(() => {
    client
      .request(query)
      .then(setData)
      .catch(console.error);

  }, [client, query])

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
