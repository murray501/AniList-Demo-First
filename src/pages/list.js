import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactList from "react-list";
import { Outlet, useNavigate } from "react-router-dom";
import Select from 'react-select';
import "../styles.css";

const loadJSON = key => key && JSON.parse(localStorage.getItem(key));
const saveJSON = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const query = `
{
  Page {
    media {
      id
      siteUrl
      title {
        english
        native
      }
      description
      coverImage {
        large
      }
      popularity
      trending
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
  const [data, setData] = useState(loadJSON('basic-query'));
  const [select, setSelect] = useState(0);
  const [sortOption, setSortOption] = useState(null);
  
  const navigate = useNavigate();

  const options = [
    {value: 'popularity', label: 'popularity'},
    {value: 'trending', label: 'trending'}
  ]

  function renderItem(index, key) {
    let title = data[index].title.english ? data[index].title.english : data[index].title.native;
    
    return <div key={key} class={"listitem" + (index % 2 ? '' : ' even')} 
    onClick={() => setSelect(index)}>{title} (p:{data[index].popularity},t:{data[index].trending})</div>;
  }

  function SortBox() {
    return (
      <div style={{display: "flex"}}>
        <div id="sort">
          <Select
            defaultValue={sortOption} 
            options={options} 
            onChange={setSortOption}
          />
        </div>
  
        <div id="sort-status">
          {!sortOption ? <p> List is not sorted.</p> : <p>List is sorted by {sortOption.value}.</p>}
        </div>
      </div>
    )
  }

  function RenderDetail() {
    if (!data) return;
    let index = select;
    return (
      <>
      <div id="coverImage">
        <img src={data[index].coverImage.large} width="200" height="300"/>
      </div>
      <div id="right"> 
        <p>ID: {data[index].id}</p>     
        <p>Title(English): {data[index].title.english}</p>
        <p>Title(Native): {data[index].title.native}</p>
        <p>URL: <a href={data[index].siteUrl}>{data[index].siteUrl}</a></p>
        <p>Popularity: {data[index].popularity}</p>
        <p>Trending: {data[index].trending}</p>
        <button onClick={() => navigate(`/list/description/${data[index].id}`)}>
          Description
        </button>
      </div>
      </>
    );
  }

  useEffect(() => {
    if (!sortOption) return;
    if (sortOption.value === "popularity") {
      data.sort((a, b) => (a.popularity > b.popularity ? -1 : 1));
      let newData = [...data];
      setData(newData);
    } else if (sortOption.value === "trending") {
      data.sort((a, b) => (a.trending > b.trending ? -1 : 1));
      let newData = [...data];
      setData(newData);      
    }
  }, [sortOption])

 
  useEffect(() => {
      if (data) return;
      request()
        .then(result => {
          setData(result.data.data.Page.media)
          saveJSON('basic-query', result.data.data.Page.media)
        })
        .catch(console.error);

  }, [])

  if (!data) return <p>loading...</p>
  if (!data.length) return <p>Nothing to render.</p>

  return (
    <>
    <SortBox />
    <div style={{display: "flex"}}>
      <div id="left" style={{overflow: 'auto', maxHeight: 400}}>
        <ReactList
          itemRenderer={renderItem}
          length={data.length}
          type='uniform'
        />
      </div> 
      <RenderDetail />
    </div>
    <Outlet />
    </>
  );
}


