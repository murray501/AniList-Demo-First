import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactList from "react-list";
import { Outlet, useNavigate } from "react-router-dom";
import Select from 'react-select';
import "../styles.css";

const loadJSON = key => key && JSON.parse(localStorage.getItem(key));
const saveJSON = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const query = type => `
{
  Page {
    media(sort: POPULARITY_DESC, type: ${type}) {
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

function request(type) {
  const options = {
    url: url,
    method: 'post',
    data: {
      query: query(type)
    }
  };
  return axios.request(options);
}

export default function PageList() {
  const sort_options = [
    {value: 'popularity', label: 'popularity'},
    {value: 'trending', label: 'trending'}
  ]
  
  const media_options = [
    {value: 'ANIME', label: 'Anime'},
    {value: 'MANGA', label: 'Manga'}
  ]

  const [data, setData] = useState(loadJSON('basic-query-' + media_options[0].label));
  const [select, setSelect] = useState(0);
  const [sortOption, setSortOption] = useState(sort_options[0]);
  const [mediaOption, setMediaOption] = useState(media_options[0]);
  
  const navigate = useNavigate();

  function renderItem(index, key) {
    let title = data[index].title.english ? data[index].title.english : data[index].title.native;
    
    return <div key={key} class={"listitem" + (index % 2 ? '' : ' even')} 
    onClick={() => setSelect(index)}>{title}</div>;
  }

  function SortBox() {
    return (
      <div style={{display: "flex"}}>
        <div id="sort">
          <Select
            defaultValue={mediaOption} 
            options={media_options} 
            onChange={setMediaOption}
          />
        </div>

        <div id="sort">
          <Select
            defaultValue={sortOption} 
            options={sort_options} 
            onChange={setSortOption}
          />
        </div>
  
        <div id="sort-status">
          <p>{mediaOption.label}s are sorted by {sortOption.label}.</p>
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
        <div style={{display: "flex"}}>
          <button class="button" onClick={() => navigate(`/description/${data[index].id}/${mediaOption.label}`)}>
            Description
          </button>
          <button class="button" onClick={() => navigate(`/character/${data[index].id}/${mediaOption.label}`)}>
            Character
          </button>
        </div>
      </div>
      </>
    );
  }

  useEffect(() => {
    if (!data) return;
    console.log("begin to sort");
    if (sortOption.value === "popularity") {
      data.sort((a, b) => (a.popularity > b.popularity ? -1 : 1));
      let newData = [...data];
      setData(newData);
    } else if (sortOption.value === "trending") {
      data.sort((a, b) => (a.trending > b.trending ? -1 : 1));
      let newData = [...data];
      setData(newData);      
    }

    setSelect(0);
  }, [sortOption])

 
  useEffect(() => {
      const name = 'basic-query-' + mediaOption.label
      let load = loadJSON(name);
      if (load) {
        setData(load);
        return;
      }

      request(mediaOption.value)
        .then(result => {
          let content = result.data.data.Page.media
          setData(content)
          saveJSON(name, content)
        })
        .catch(console.error);

  }, [mediaOption])

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


