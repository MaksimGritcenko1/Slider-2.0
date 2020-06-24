import React from 'react';
import styles from "./Slider.module.css";
import Arrow from "./Arrow";
import arrowLeft from "../images/arrow_left.png";
import arrowRight from "../images/arrow_right.png";


const Carousel = ({
                      width, justifyContent,
                      transitionEndHandler, onPointerDown,
                      onPointerMove, onPointerUp,
                      children, transition,
                      transform, prevSlide, nextSlide, sliderRef,
                  }) => {
    return (
        <div className={styles.carousel}
             style={{
                 width: `${width}px`,
                 justifyContent: `${justifyContent}`,
             }}>
            <div className={styles.slider}
                 onTransitionEnd={transitionEndHandler}
                 onPointerDown={onPointerDown}
                 onPointerMove={onPointerMove}
                 onPointerUp={onPointerUp}
                 style={{
                     width: `${children.length * 100}%`,
                     transition: `${transition}`,
                     transform: `translateX(${transform}%)`
                 }}
                 ref={sliderRef}
            >

                {children}

            </div>

            <Arrow arrowStyle={styles.arrow + " " + styles.prev}
                   arrowImg={arrowLeft}
                   arrowHandler={prevSlide}
            />
            <Arrow arrowStyle={styles.arrow + " " + styles.next}
                   arrowImg={arrowRight}
                   arrowHandler={nextSlide}
            />

        </div>
    );
}

export default Carousel;