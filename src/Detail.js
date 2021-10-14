import React from 'react';

const Detail = ({album, artists, name}) => {

    return (
        <div className="image-div" >
            <div className="image ">
                <img 
                    src={album.images[0].url}
                    alt={name}>                    
                </img>
            </div>
            <div className="img-info">
                <div className="song-name">
                    <label htmlFor={name} className="form-label">
                        {name}
                    </label>
                </div>
                <div className="artist-name">
                    <label htmlFor={artists[0].name} className="form-label">
                        {artists[0].name}
                    </label>
                </div>
            </div>
        </div>
    );
}

export default Detail;