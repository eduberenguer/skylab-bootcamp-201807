import React, {Component} from 'react'
import logic from '../logic'
import SearchPanel from './SearchPanel'
import ResultList from './ResultList'
import TrackPlayer from './TrackPlayer'
import styled, {css} from 'styled-components'

/*
import SpotifyPlayer from './SpotifyPlayer'
*/

const ERROR_HOUSTON = 'We have a problem, Houston! Sorry, try again later.'

class Main extends Component {
  state = {
    artists: [],
    albums: [],
    tracks: [],
    track: undefined, // { title, image, file, url }
    searchError: null,
    artistError: null,
    albumError: null,
    trackError: null,
    favoriteError: null,
    mountError: null
  }

  onSearch = query =>
    logic.searchArtists(query)
      .then(artists =>
        this.setState({
          artists: artists.map(({id, name: text}) => ({id, text})),
          albums: [],
          tracks: [],
          track: undefined,
          searchError: null,
          artistError: null,
          albumError: null,
          trackError: null,
          favoriteError: null,
          mountError: null
        })
      )
      .catch(() => this.setState({searchError: ERROR_HOUSTON}))

  onArtistClick = id =>
    logic.retrieveAlbumsByArtistId(id)
      .then(albums =>
        this.setState({
          albums: albums.map(({id, name: text}) => ({id, text})),
          tracks: [],
          track: undefined,
          searchError: null,
          artistError: null,
          albumError: null,
          trackError: null,
          favoriteError: null,
          mountError: null
        })
      )
      .catch(() => this.setState({artistError: ERROR_HOUSTON}))

  onAlbumClick = id =>
    logic.retrieveTracksByAlbumId(id)
      .then(tracks =>
        this.setState({
          tracks: tracks.map(({id, name: text}) => ({id, text})),
          track: undefined,
          searchError: null,
          artistError: null,
          albumError: null,
          trackError: null,
          favoriteError: null,
          mountError: null
        })
      )
      .catch(() => this.setState({albumError: ERROR_HOUSTON}))

  onTrackClick = id =>
    logic.retrieveTrackById(id)
      .then(track =>
        this.setState({
          track: {
            id: track.id,
            title: track.name,
            image: track.album.images[0].url,
            file: track.preview_url,
            url: track.external_urls.spotify,
            isFavorite: this._favoritesSet.has(track.id)
          },
          searchError: null,
          artistError: null,
          albumError: null,
          trackError: null,
          favoriteError: null,
          mountError: null
        })
      )
      .catch(() => this.setState({trackError: ERROR_HOUSTON}))


  _favoritesSet = null;


  componentDidMount() {
    debugger
    logic.retrieveUserData('favorites')
      .then(res => {
        if (res && res.length) {
          console.log("in componentDidMount received favorites = ",res)
          this._favoritesSet = new Set(res);
          console.log("transofmred into  set",this._favoritesSet)
        } else {
          console.log("in componentDidMount DID NOT RECEIVE favorites = ",res)
          console.log("created new set set",this._favoritesSet)

          this._favoritesSet = new Set();

        }
      })
      .catch((err) => this.setState({mountError: ERROR_HOUSTON}))
  }


  Section = styled.section` 
    background:lightgrey;
    `


  onFavorite = id => {
    let arr;
    if (this._favoritesSet){
      this._favoritesSet.add(id);
       arr = Array.from(this._favoritesSet);
    }
    logic.storeUserData('favorites', arr)
      .then(res => {
        if (res) console.log("added successfully")
        let track = this.state.track;
        track.isFavorite = true;
        this.setState({track:track})
      })
      .catch(() => this.setState({favoriteError: ERROR_HOUSTON}))

  }
  onUnFavorite = id => {
    let arr;
    if (this._favoritesSet && this._favoritesSet.has(id)){
      this._favoritesSet.delete(id);
       arr = Array.from(this._favoritesSet);
    }
    logic.storeUserData('favorites', arr)
      .then(res => {
        if (res) console.log("removed successfully")
        let track = this.state.track;
        track.isFavorite = false;
        this.setState({track:track})
      })
      .catch(() => this.setState({favoriteError: ERROR_HOUSTON}))

  }

  /*
       favoriteTracks() {
        logic.retrieveUserData('favorites')
          .then(res => {
            if (res && res.length) {
              _favoritesSet = new Set(res);
            }
          })
      }*/


  render() {
    const {state: {favoriteError, artists, albums, tracks, track, searchError, artistError, albumError, trackError}, onUnFavorite,onFavorite,onSearch, onArtistClick, onAlbumClick, onTrackClick} = this

    return <section>
      <h2>Search</h2>

      <SearchPanel onSearch={onSearch} error={searchError}/>

      {artists.length > 0 &&
      <section><h2>Artists</h2><ResultList results={artists} onItemClick={onArtistClick} error={artistError}/>
      </section>}

      {albums.length > 0 &&
      <section><h2>Albums</h2><ResultList results={albums} onItemClick={onAlbumClick} error={albumError}/></section>}

      {tracks.length > 0 &&
      <section><h2>Tracks</h2><ResultList results={tracks} onItemClick={onTrackClick} error={trackError}/></section>}

      {/*
      {track && <section><h2>Track</h2><SpotifyPlayer track={track} /></section>}
*/}
      {track &&
      <section><h2>Track</h2><TrackPlayer error={favoriteError} onFavorite={onFavorite} onUnFavorite={onUnFavorite } track={track}/></section>}
    </section>
  }
}

export default Main