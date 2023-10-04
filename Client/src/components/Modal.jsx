import React from 'react';

// static flies
import "../assets/css/modal.css";
import coins from "../assets/img/Coinsb.png";

const Modal = ({ setIsOpen, point }) => {
    const handleCloseClick = () =>
        setIsOpen(false);

    return (
        <>
            <div className={"dark-bg"} onClick={handleCloseClick} />
            <div className={"centered"}>
                <div className={"modal"}>
                    <div className={"modal-content"}>
                        You win!
                    </div>
                    <div className={"modal-point"}>
                        <h3 data-custom={point}>{point}</h3>
                        <img src={coins} alt={point} width={65} height={42}  />
                    </div>
                    <div className={"modal-actions"}>
                        <div className={"actions-container"}>
                            <button className={"close"} onClick={handleCloseClick}>GREAT</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;