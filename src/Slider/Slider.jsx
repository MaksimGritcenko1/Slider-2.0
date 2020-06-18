import React from 'react';
import styles from './Slider.module.css';
import Carousel from "./Carousel";


class Slider extends React.Component {
    constructor(props) {
        super(props);
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
            onPointerDownPermission: true,
            sliderStep: 100 / this.props.children.length
        };
    }

    slider;


    widthCheck = () => {
        const screenWidth = window.outerWidth;
        if (screenWidth < 500) this.setState({width: 300});
        else this.setState({width: this.props.width});
    }

    componentDidMount() {
        this.slider = document.getElementById('slider');
        this.slider.prepend(this.slider.lastElementChild);
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
        if (!this.state.arrowDisabled) {
            this.arrowHandler(-1, -this.state.sliderStep * 2, 'flex-start');
        }
    };
    prevSlide = () => {
        if (!this.state.arrowDisabled) {
            this.arrowHandler(1, this.state.sliderStep * 2, 'flex-end');
        }
    }

    /////INFINITE MODE

    onSameDirection = (transform) => {
        this.setState({transition: 'none', transform});
        setTimeout(() => {
            this.setState({
                transition: 'all 0.5s',
                transitionEndPermission: false,
                arrowDisabled: false,
                onPointerDownPermission: true
            })
        });
    }
    onChangeDirection = (transform, justifyContent) => {
        this.setState({transition: 'none', transform, justifyContent});
        setTimeout(() => {
            this.setState({
                transition: 'all 0.5s',
                transitionEndPermission: false,
                directionWasChanged: false,
                arrowDisabled: false,
                onPointerDownPermission: true
            })
        });
    }

    onTransitionEnd = () => {
        if (this.state.transitionEndPermission) {
            if (this.state.direction === -1) {
                if (this.state.directionWasChanged === false) {
                    this.slider.appendChild(this.slider.firstElementChild);
                    this.onSameDirection(-this.state.sliderStep);
                } else if (this.state.directionWasChanged === true) {
                    this.slider.prepend(this.slider.lastElementChild);
                    this.slider.prepend(this.slider.lastElementChild);
                    this.onChangeDirection(-this.state.sliderStep, 'flex-start');
                }
            } else if (this.state.direction === 1) {
                if (this.state.directionWasChanged === false) {
                    this.slider.prepend(this.slider.lastElementChild);
                    this.onSameDirection(this.state.sliderStep);
                } else if (this.state.directionWasChanged === true) {
                    this.slider.appendChild(this.slider.firstElementChild);
                    this.slider.appendChild(this.slider.firstElementChild);
                    this.onChangeDirection(this.state.sliderStep, 'flex-end');
                }
            }
        }

    }

    ////TOUCHES AND MOUSE HANDLERS
    startingX
    diff

    onPointerDown = (e) => {
        if (this.state.onPointerDownPermission) {
            this.startingX = e.pageX;
            this.setState({moving: true, transition: 'none'});
        }
    }
    onPointerMove = (e) => {
        this.diff = e.pageX - this.startingX;

        if (this.state.direction === -1 && this.state.moving) {
            this.slider.style.transform = `translateX(${-this.state.width + this.diff}px)`;
        } else if (this.state.direction === 1 && this.state.moving) {
            this.slider.style.transform = `translateX(${this.state.width + this.diff}px)`;
        }
    }

    onPointerUp = () => {
        const keyPoint = this.state.width / 5;
        this.setState({
            moving: false,
            transition: 'all 0.5s',
            onPointerDownPermission: false
        });

        if (this.diff > keyPoint) this.prevSlide();
        else if (this.diff < -keyPoint) this.nextSlide();
        else {
            this.state.direction === -1
                ? this.slider.style.transform = `translateX(${-this.state.width}px)`
                : this.slider.style.transform = `translateX(${this.state.width}px)`;

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
                />
            </div>
        );
    }
}

export default Slider;