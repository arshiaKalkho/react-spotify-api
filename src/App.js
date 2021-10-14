import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import Listbox from './Listbox';
import Detail from './Detail';
//import { Credentials } from './Credentials';
import axios from 'axios';
import Logo from './logo.svg';



const App = () => {
  //accessing environment variables on server instead of a static file
  //const spotify = Credentials();  
  let spotify={ClientId:"",ClientSecret:""} 
  spotify.ClientId= process.env.REACT_APP_SPOTIFY_CLIENT;
  spotify.ClientSecret= process.env.REACT_APP_SPOTIFY_SECRET;


  const [token, setToken] = useState('');  
  const [genres, setGenres] = useState({selectedGenre: '', listOfGenresFromAPI: []});
  const [playlist, setPlaylist] = useState({selectedPlaylist: '', listOfPlaylistFromAPI: []});
  const [tracks, setTracks] = useState({selectedTrack: '', listOfTracksFromAPI: []});
  const [trackDetail, setTrackDetail] = useState(null);

  useEffect(() => {

    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)      
      },
      data: 'grant_type=client_credentials',
      method: 'POST'
    })
    .then(tokenResponse => {      
      setToken(tokenResponse.data.access_token);

      axios('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
      })
      .then (genreResponse => {        
        setGenres({
          selectedGenre: genres.selectedGenre,
          listOfGenresFromAPI: genreResponse.data.categories.items
        })
      });
      
    });

  }, [genres.selectedGenre, spotify.ClientId, spotify.ClientSecret]); 

  
  
  
  
  
  const genreChanged = val => {
    setGenres({
      selectedGenre: val, 
      listOfGenresFromAPI: genres.listOfGenresFromAPI
    });

    axios(`https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`, {
      method: 'GET',
      headers: { 'Authorization' : 'Bearer ' + token}
    })
    .then(playlistResponse => {
      setPlaylist({
        selectedPlaylist: playlist.selectedPlaylist,
        listOfPlaylistFromAPI: playlistResponse.data.playlists.items
      })
    });

    console.log(val);
  }
  
  const playlistChanged = val => {
    console.log(val);
    setPlaylist({
      selectedPlaylist: val,
      listOfPlaylistFromAPI: playlist.listOfPlaylistFromAPI
    });
  }


  const buttonClicked = e => {
    e.preventDefault();
    
    if(playlist.selectedPlaylist !== ""){//must choose a value
    
    axios(`https://api.spotify.com/v1/playlists/${playlist.selectedPlaylist}/tracks?limit=20`, {
      method: 'GET',
      headers: {
        'Authorization' : 'Bearer ' + token
      }
    })
    .then(tracksResponse => {
      setTracks({
        selectedTrack: tracks.selectedTrack,
        listOfTracksFromAPI: tracksResponse.data.items
      })
    });
  }
  
}
  
  
  const listboxClicked = val => {

    const currentTracks = [...tracks.listOfTracksFromAPI];

    const trackInfo = currentTracks.filter(t => t.track.id === val);

    setTrackDetail(trackInfo[0].track);



  }

  
  

  
  
  
  
  
  
  
  return (
    
    
    <>
    <div className="App-header">
      <h3>Arshia Kalkhorani</h3>
    <img className="App-logo" src={Logo} alt="logo"/> 
      <h3><a href="https://github.com/arshiaKalkho/react-spotify-api">GitHub</a></h3>
  </div>
    <p className="summery">this react app will send a get request to spotify api, then it displays the response as a list of songs that you can select to see their detail</p>
    <div className="container">
      
      <form onSubmit={buttonClicked}>        
          <Dropdown label="Genre:" options={genres.listOfGenresFromAPI} selectedValue={genres.selectedGenre} changed={genreChanged} />
          <Dropdown label="Playlist:" options={playlist.listOfPlaylistFromAPI} selectedValue={playlist.selectedPlaylist} changed={playlistChanged} />
          <div className=" form-group px-0">
            <button type='submit' className="btn btn-success col-12">
              Search
            </button>
          </div>
          
            <Listbox className="songs-list" items={tracks.listOfTracksFromAPI} clicked={listboxClicked} />
            {trackDetail && <Detail {...trackDetail} /> }
                
      </form>
    </div>
    </>
    
  );
}





export default App;