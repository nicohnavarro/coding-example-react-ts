import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

const url = "https://randomuser.me/api?results=20";

type Person = any;
type Location = any;

const fetchData = () => {
  return axios
    .get(url)
    .then((res) => {
      console.log(res.data.results);
      return res.data.results;
    })
    .catch((err) => {
      console.error(err);
    });
};

const flattenLocations = (locations: Location[]): any => {
  const location = locations[0];

  const flattenedLocationHeaders:string[] = [];
  Object.keys(location).forEach((locationKey) => {
    const value = location[locationKey];
    if (typeof value !== "object") {
      flattenedLocationHeaders.push(locationKey);
    }
  });
  console.log(flattenedLocationHeaders);
};

function App() {
  const [people, setPeople] = useState([]);
  const [flattenedLocations, setFlattenedLocations] = useState([]);
  useEffect(() => {
    fetchData().then((apiPeople) => {
      setPeople(apiPeople);
      setFlattenedLocations(
        flattenLocations(apiPeople.map(({ location }: Location) => location))
      );
    });
  }, []);

  return (
    <div className="App">
      <h2>Challenge</h2>
      {people.map((person: Person, personId: number) => (
        <div key={personId}>{person.name.first}</div>
      ))}
    </div>
  );
}

export default App;
