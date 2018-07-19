'use strict'
var logic = {
    token: 'BQCKg_Hi118mJxq6npg6pXmUopImIx0ECW0BDyCNWS4wcT4nHuXKcr4sB2RUVFxke8',
    _callApi: function (path) {
        /*
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();

            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        var res = JSON.parse(request.responseText);

                        resolve(res);
                    } else reject(Error('request error, status ' + request.status));
                }
            };

            var url = 'https://api.spotify.com/v1' + path;

            request.open('get', url);

            request.setRequestHeader('Authorization', 'Bearer ' + this.token);


            request.send();
        }.bind(this));
*/


var url = 'https://api.spotify.com/v1' + path;



    },
    searchArtists: function (query) {
        return this._callApi('/search?type=artist&query=' + query)
        .then(function(res) {
            return res.artists.items;
        });
    },
    
    retrieveAlbumsByArtistId(id) {
        return this._callApi('/artists/' + id + '/albums')
        .then(function(res) {
            return res.items;
        });
    },
    
    // 	https://api.spotify.com/v1/albums/{id}/tracks
    
    retrieveTracksByAlbumId(id) {
        return this._callApi('/albums/' + id + '/tracks')
            .then(function(res) {
                return res.items;
                
            });
    },
//https://api.spotify.com/v1/audio-features/{id}
    retrieveTrackById(id) {
        return this._callApi('/audio-features/' + id)
        .then(function(res) {
            return res.items;
            
        });
    },
};