import React from 'react';
import styles from './Slider.module.css';
import Carousel from "./Carousel";


class Slider extends React.Component {
    constructor(props) {
        super(props);
        this.sliderRef = React.createRef();
        this.state = {
            transform: -(100 / this.props.children.length),
            transition: 'all 0.5s',
            direction: -1,
            directionWasChanged: false,
            justifyContent: 'flex-start',
            moving: false,
            transitionEndPermission: false,
            width: null,
            arrowDisabled: false,
            sliderStep: 100 / this.props.children.length
        };
    }


    widthCheck = () => {
        const screenWidth = window.outerWidth;
        if (screenWidth < 500) this.setState({width: 300});
        else this.setState({width: this.props.width});
    }

    componentDidMount() {
        this.sliderRef.current.prepend(this.sliderRef.current.lastElementChild);
        this.widthCheck();
    }


    ///BUTTON HANDLERS
    arrowHandler = (direction, transform, justifyContent) => {
        if (this.state.direction === direction) {
            this.setState({
                transform,
                direction,
                justifyContent,
                transitionEndPermission: true,
                arrowDisabled: true
            });
        } else if (this.state.direction === direction * -1) {
            this.setState({
                transform: 0,
                directionWasChanged: true,
                direction,
                transitionEndPermission: true,
                arrowDisabled: true
            });
        }
    }

    nextSlide = () => {
        !this.state.arrowDisabled
        && this.arrowHandler(-1, -this.state.sliderStep * 2, 'flex-start');

    }
    prevSlide = () => {
        !this.state.arrowDisabled
        && this.arrowHandler(1, this.state.sliderStep * 2, 'flex-end');

    }

    /////INFINITE MODE

    onSameDirection = (transform) => {
        this.setState({transition: 'none', transform});
        setTimeout(() => {
            this.setState({
                transition: 'all 0.5s',
                transitionEndPermission: false,
                arrowDisabled: false
            })
        });
    }
    onOppositeDirection = (transform, justifyContent) => {
        this.setState({transition: 'none', transform, justifyContent});
        setTimeout(() => {
            this.setState({
                transition: 'all 0.5s',
                transitionEndPermission: false,
                directionWasChanged: false,
                arrowDisabled: false
            })
        });
    }

    onTransitionEnd = () => {
        if (this.state.transitionEndPermission) {
            if (this.state.direction === -1) {
                if (this.state.directionWasChanged === false) {
                    this.sliderRef.current.appendChild(this.sliderRef.current.firstElementChild);
                    this.onSameDirection(-this.state.sliderStep);
                } else if (this.state.directionWasChanged === true) {
                    this.sliderRef.current.prepend(this.sliderRef.current.lastElementChild);
                    this.sliderRef.current.prepend(this.sliderRef.current.lastElementChild);
                    this.onOppositeDirection(-this.state.sliderStep, 'flex-start');
                }
            } else if (this.state.direction === 1) {
                if (this.state.directionWasChanged === false) {
                    this.sliderRef.current.prepend(this.sliderRef.current.lastElementChild);
                    this.onSameDirection(this.state.sliderStep);
                } else if (this.state.directionWasChanged === true) {
                    this.sliderRef.current.appendChild(this.sliderRef.current.firstElementChild);
                    this.sliderRef.current.appendChild(this.sliderRef.current.firstElementChild);
                    this.onOppositeDirection(this.state.sliderStep, 'flex-end');
                }
            }
        }

    }

    ////TOUCHES AND MOUSE HANDLERS
    startingX;
    diff;

    onPointerDown = (e) => {
        this.startingX = e.pageX;
        this.setState({moving: true, transition: 'none'});
    }

    onPointerMove = (e) => {
        this.diff = e.pageX - this.startingX;

        if (this.state.direction === -1 && this.state.moving) {
            this.sliderRef.current.style.transform = `translateX(${-this.state.width + this.diff}px)`;
        } else if (this.state.direction === 1 && this.state.moving) {
            this.sliderRef.current.style.transform = `translateX(${this.state.width + this.diff}px)`;
        }
    }

    onPointerUp = () => {
        const keyPoint = this.state.width / 5;
        this.setState({moving: false, transition: 'all 0.5s'});

        if (this.diff > keyPoint) this.prevSlide();
        else if (this.diff < -keyPoint) this.nextSlide();
        else {
            this.state.direction === -1
                ? this.sliderRef.current.style.transform = `translateX(${-this.state.width}px)`
                : this.sliderRef.current.style.transform = `translateX(${this.state.width}px)`;

        }
        this.diff = null;
    }


    render() {
        return (
            <div className={styles.container}>
                <Carousel onPointerDown={this.onPointerDown}
                          onPointerMove={this.onPointerMove}
                          onPointerUp={this.onPointerUp}
                          justifyContent={this.state.justifyContent}
                          transition={this.state.transition}
                          children={this.props.children}
                          transform={this.state.transform}
                          transitionEndHandler={this.onTransitionEnd}
                          width={this.state.width}
                          nextSlide={this.nextSlide}
                          prevSlide={this.prevSlide}
                          sliderRef={this.sliderRef}
                />
            </div>
        );
    }
}

export default Slider;