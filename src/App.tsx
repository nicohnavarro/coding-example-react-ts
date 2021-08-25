import axios from 'axios';
import {useEffect} from 'react';
import './App.css';

const url = 'https://randomuser.me/api?results=20'

const fetchData = ()=>{
  return axios.get(url)
    .then((res)=>{
    console.log(res.data);
  })
  .catch((err)=>{
    console.error(err);
  })
}

function App() {

  useEffect(()=>{
    fetchData();
  },[])


  return (
    <div className="App">
    </div>
  );
}

export default App;
