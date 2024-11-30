import React from "react";

const Card = (props) => {
    return (
        <div className="col-lg-4 d-flex justify-content-center my-3">
            <div className="card text-center" style={{width: 24 + 'rem'}}>
                <div className="card-body">
                    <h5 className="card-title">{props.title}</h5>
                    <p className="card-text">{props.text}</p>
                    <h6>{props.authour}</h6>
                    <p className="small text-muted">{props.date}</p>
                </div>
            </div>
        </div>
    )
}

export default Card;