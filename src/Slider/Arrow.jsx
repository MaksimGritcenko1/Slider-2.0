import React from 'react';


const Arrow = ({arrowHandler, arrowImg, arrowStyle}) => {
    return (
        <span onClick={arrowHandler} className={arrowStyle}>
                        <img src={arrowImg}
                             alt=""
                        />
        </span>
    );
}

export default Arrow;