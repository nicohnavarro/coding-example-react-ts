import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

const url = "https://randomuser.me/api?results=20";

type Person = any;
type Location = any;

enum SortingDirections {
  ASCENCING = "ASCENDING",
  DESCENDING = "DESCENDING",
  UNSORTED = "UNSORTED",
}

const fetchData = () => {
  return axios
    .get(url)
    .then((res) => {
      return res.data.results;
    })
    .catch((err) => {});
};

const flattenLocations = (locations: Location[]): any => {
  const data: any[] = [];

  for (const { street, coordinates, timezone, ...rest } of locations) {
    data.push({
      ...rest,
      number: street.number,
      name: street.name,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    });
  }
  const flattenedLocationHeaders: string[] = extractObjectKeys(data[0]);
  return { headers: flattenedLocationHeaders, data };
};

const extractObjectKeys = (object: any) => {
  let objectKeys: string[] = [];
  Object.keys(object).forEach((objectKey) => {
    const value = object[objectKey];
    if (typeof value !== "object") {
      objectKeys.push(objectKey);
    } else {
      objectKeys = [...objectKeys, ...extractObjectKeys(value)];
    }
  });
  return objectKeys;
};

const sortData = (
  data: any,
  sortKey: string,
  sortingDirection: SortingDirections
) => {
  data.sort((a: any, b: any) => {
    const relevantValueA = a[sortKey];
    const relevantValueB = b[sortKey];
    if (
      sortingDirection === SortingDirections.UNSORTED ||
      sortingDirection === SortingDirections.ASCENCING
    ) {
      if (relevantValueA < relevantValueB) return -1;
      if (relevantValueA > relevantValueB) return 1;
      return 0;
    } else {
      if (relevantValueA > relevantValueB) return -1;
      if (relevantValueA < relevantValueB) return 1;
      return 0;
    }
  });
};

const getNextSortingDirection =(current:SortingDirections)=>{
  if (
    current === SortingDirections.UNSORTED ||
    current === SortingDirections.ASCENCING
  ) return SortingDirections.DESCENDING;
   else return SortingDirections.ASCENCING;
}

function App() {
  const [people, setPeople] = useState([]);
  const [flattenedLocations, setFlattenedLocations] = useState({
    headers: [],
    data: [],
  });
  const [sortingDirections, setSortingDirections] = useState<any>({});

  useEffect(() => {
    fetchData().then((apiPeople) => {
      setPeople(apiPeople);
      //console.log(extractObjectKeys(apiPeople[0]));
      const ourFlattenedLocations = flattenLocations(
        apiPeople.map(({ location }: Location) => location)
      );
      setFlattenedLocations(ourFlattenedLocations);
      const { headers } = ourFlattenedLocations;
      const ourSortingDirections: any = {};
      for (const header of headers) {
        ourSortingDirections[header] = SortingDirections.UNSORTED;
      }
      setSortingDirections(ourSortingDirections);
    });
  }, []);

  const sortColumn = (sortKey: string) => {
    const newFlattenedLocations = {
      ...flattenedLocations,
      data: [...flattenedLocations.data],
    };

    const currentSortingDirection = sortingDirections[sortKey];
    sortData(newFlattenedLocations.data,sortKey,currentSortingDirection);
    const nextSortingDirection = getNextSortingDirection(currentSortingDirection);
    const newSortingDirections:any = {...sortingDirections};
    newSortingDirections[sortKey] = nextSortingDirection;
    setSortingDirections(newSortingDirections);
    setFlattenedLocations(newFlattenedLocations);
  };

  return (
    <div className="App">
      <h2>Challenge</h2>
      {people.map((person: Person, personId: number) => (
        <div key={personId}>{person.name.first}</div>
      ))}
      <table>
        <thead>
          <tr>
            {flattenedLocations.headers.map(
              (locationString: string, locationIdx: number) => (
                <th
                  onClick={() => {
                    sortColumn(locationString);
                  }}
                  key={locationIdx}
                >
                  {locationString}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {flattenedLocations.data.map(
            (location: any, locationsIdx: number) => (
              <tr key={locationsIdx}>
                {/*                 {Object.values(location).map(
                  (locationValue: any, valueIdx: number) => (
                    <td key={valueIdx}>{locationValue}</td>
                  )
                )} */}
                {flattenedLocations.headers.map((header, headerIdx) => (
                  <td key={headerIdx}>{location[header]}</td>
                ))}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
