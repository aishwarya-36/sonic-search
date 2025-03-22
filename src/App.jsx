const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

import "./App.css";
import { useState, useEffect } from "react";
import { Button } from "/src/components/ui/button";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      search();
    } // search function
  };

  useEffect(() => {
    let authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret,
    };

    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json())
      .then((data) => {
        setAccessToken(data.access_token);
      });
  }, []);

  async function search() {
    let artistParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    // Get Artist
    const artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

    // Get Artist Albums
    await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/albums?include_groups=album&market=US&limit=50",
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        setAlbums(data.items);
      });

    console.log("Search Input: " + searchInput);
    console.log("Artist ID: " + artistID);
  }
  return (
    <div className="bg-gray-600 rounded-md">
      <input
        className="w-[300px] h-[35px] border-0 border-solid rounded-md mr-1.5 pl-1.5"
        type="text"
        placeholder="Search For Artist"
        aria-label="Search for an Artist"
        onKeyDown={handleKeyDown}
        onChange={(event) => setSearchInput(event.target.value)} // setSearch
      />
      <Button onClick={search}> Search</Button>
    </div>
  );
}

export default App;
