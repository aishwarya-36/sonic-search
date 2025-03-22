const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

import "./App.css";
import { useState, useEffect } from "react";
import { Button } from "/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  }
  console.log(albums);
  return (
    <div>
      <div className="flex items-center justify-center w-full">
        <input
          className="w-[300px] bg-gray-400 h-[35px] border-0 border-solid rounded-md m-5 pl-1.5"
          type="text"
          placeholder="Search For Artist"
          aria-label="Search for an Artist"
          onKeyDown={handleKeyDown}
          onChange={(event) => setSearchInput(event.target.value)} // setSearch
        />
        <Button onClick={search}> Search</Button>
      </div>
      <div className="m-5 flex flex-wrap justify-around content-center">
        {albums.map((album) => {
          return (
            <Card key={album.id} className="m-1.5 border w-[300px] rounded-md">
              <CardHeader className="flex-grow">
                <CardTitle>{album.name}</CardTitle>
                <CardDescription>
                  Release Date: {album.release_date}
                  <br />
                  Total Tracks: {album.total_tracks}
                </CardDescription>
              </CardHeader>
              <CardContent className="items-center flex flex-col">
                <img
                  alt={album.name}
                  src={album.images[0].url}
                  className="border rounded-sm w-[200px]"
                />
                <a href={album.external_urls.spotify}> View in spotify</a>
              </CardContent>
              <CardFooter className="bg-gray-200 rounded-md mx-3 h-[50px]">
                <p className="text-sm">
                  {album.artists.length > 3
                    ? album.artists
                        .map((item) => item["name"])
                        .slice(0, 3)
                        .join(", ") + " . . ."
                    : album.artists
                        .map((item) => item["name"])
                        .slice(0, 3)
                        .join(", ")}
                </p>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default App;
