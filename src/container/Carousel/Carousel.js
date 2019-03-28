import React, { Component } from 'react';
import Slider from "react-slick";

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {value: '鸣人'};
  }
  render() {
    let banners = new Array(3)
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    return (
        <div>
            <Slider {...settings}>
                <div style={{
                    width: '500px',
                    height: '100px',
                    backgroundColor: 'blue'
                }} >
                </div>
                <div style={{
                    height: '100px',
                    width: '500px',
                    backgroundColor: 'red'
                }} >
                </div>
                <div style={{
                    height: '100px',
                    width: '500px',
                    backgroundColor: 'yellow'
                }} >
                </div>
            </Slider>
        </div>
        
    );
  }
}

export default Carousel;
