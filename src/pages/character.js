import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactList from "react-list";
import Select from 'react-select';
import "../styles.css";
import { Link, useParams } from "react-router-dom";
import { Outlet, useNavigate } from "react-router-dom";
import parse from "html-react-parser";

const loadJSON = key => key && JSON.parse(localStorage.getItem(key));
const saveJSON = (key, data) => localStorage.setItem(key, JSON.stringify(data));

function request(id) {
  const url = 'https://graphql.anilist.co';
  const query =  id => `
  {
    Media(id: ${id}){
      characters {
        nodes {
          id
          name {
            first
            last
          }
          image {
            large
          }
          gender
          age
          siteUrl
          description
        }
      }
    }
  }
  `;
  const options = {
    url: url,
    method: 'post',
    data: {
      query: query(id),
    }
  };
  return axios.request(options);
}

export default function Character() {
  let { id } = useParams();
  let index = parseInt(id);
  
  const [basicData, setBasicData] = useState(loadJSON('basic-query'));
  const [queryData, setQueryData] = useState(null);
  const [select, setSelect] = useState(0);
  
  function Title() {
    if (!basicData) return <p>no data</p>
    const find = basicData.find(x => x.id === index)
    if (!find) return <p> data not found id = {id} </p>
    const title = find.title.english ? find.title.english : find.title.native;
    return (
      <h3>{title}</h3>
    )
  }

  function renderItem(index, key) {
    if(!queryData) return;
    const data = queryData.data;
    return <div key={key} class={"listitem" + (index % 2 ? '' : ' even')} 
    onClick={() => setSelect(index)}>{data[index].name.first} {data[index].name.last}</div>;
  }

  function Description() {
    if (!queryData) return;
    if (queryData.id !== id) return(<div>loading...</div>);
    let index = select;
    let data = queryData.data;

    if (data[index].description) {
      return (
        <div>
          <p>Description:</p>
          <p>{parse(data[index].description)}</p>
        </div>
      )
    }
    return null;
  }

  function RenderDetail() {
    if (!queryData) return;
    if (queryData.id !== id) return(<div>loading...</div>);
    
    let index = select;
    let data = queryData.data;
    return (
      <>
      <div id="coverImage">
        <img src={data[index].image.large} width="230" height="360"/>
      </div>
      <div id="right"> 
        <p>ID: {data[index].id}</p>     
        <p>Name: {data[index].name.first} {data[index].name.last}</p>
        <p>Gender: {data[index].gender}</p>
        <p>Age: {data[index].age}</p>
        <p>URL: <a href={data[index].siteUrl}>{data[index].siteUrl}</a></p>
        <Description />
      </div>
      </>
    );
  }

  useEffect(() => {
    setSelect(0);
  }, [id])

  useEffect(() => {
    if (queryData && queryData.id === id) return;

    let data = loadJSON('character' + id);
    if (data) {
      setQueryData(data);
      return;
    }

    request(id)
      .then(result => {
          const content = {id: id, data: result.data.data.Media.characters.nodes};
          setQueryData(content)
          saveJSON('character' + id, content)
        })
        .catch(console.error);
  }, [id])

  if (!queryData) return <p>loading...</p>

  const data = queryData.data;

  if (!data.length) return <p>Nothing to render. </p>

  return (
    <div class='page'>
      <Title />
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
    </div>
  )
}