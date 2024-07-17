import React from 'react';

const CardItem = ( {img, name, bodyText} ) => {
    return (
        <div className="card col-12 col-sm-6 col-md-4 col-lg-3 card-custom">
            <img src={img} className="card-img-top card-img-resize" alt={name} />
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{bodyText}</p>
            </div>
        </div>
    );
};

export default CardItem;
