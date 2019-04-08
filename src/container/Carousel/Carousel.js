import React, { Component } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {value: '鸣人'};
  }
  render() {
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
                <div>
                    <div style={{
                        width: '100%',
                        height: '500px',
                        backgroundColor: 'blue'
                    }} >
                    </div>
                </div>
                <div>
                    <div style={{
                        width: '100%',
                        height: '500px',
                        backgroundColor: 'red'
                    }} >
                    </div>
                </div>
                <div>
                    <div style={{
                        width: '100%',
                        height: '500px',
                        backgroundColor: 'green'
                    }} >
                    </div>
                </div>
            </Slider>
        </div>
        
    );
  }
}

export default Carousel;
