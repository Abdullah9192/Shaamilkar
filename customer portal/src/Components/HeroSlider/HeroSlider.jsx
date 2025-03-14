import React, { useEffect, useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import heroimage1 from "../../assets/rb_60671.png";
import heroimage2 from "../../assets/Apple Watch Series 9 Mockup (1).png";
import heroimage5 from "../../assets/file.png";
import heroimage from "../../assets/de5b3652-a667-4566-9980-2d374d60450d-removebg-preview.png";

const HeroSlider = () => {
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.params.navigation.prevEl = prevButtonRef.current;
      swiperRef.current.params.navigation.nextEl = nextButtonRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <div className="hero-slider-container position-relative py-3 px-3 px-md-0 px-lg-5 mx-md-0 mx-lg-5 mx-sm-0">
      <Swiper className="rounded-4"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={20}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        slidesPerView={1}
        loop={true}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
        }}
        modules={[Autoplay, Pagination, Navigation]}
      >
        <SwiperSlide className="text-white hero-slider3 p-4">
          <div
            className="row w-100 m-0 align-items-center "
            style={{ height: "100%" }}
          >
            <div className="col-12 col-md-6 text-center text-md-start">
              <div className="text-white mx-md-5">
                <h1 className="fw-bold">Get the Best Deals</h1>
                <br />
                <h1 className="fw-bold">Everything For Everyone</h1>
                <br />
                <span className="fw-normal fs-4">Lorem ipsum dolor sit amet</span>
              </div>
            </div>
            <div className="col-12 col-md-6 d-flex justify-content-center my-4">
              <div className="heroImg text-center w-100">
                <img src={heroimage5} alt="Hero" className="img-fluid" />
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="text-white hero-slider p-4">
          <div
            className="row w-100 m-0 align-items-center"
            style={{ height: "100%" }}
          >
            <div className="col-12 col-md-6 text-center text-md-start">
              <div className="text-white mx-md-5">
                <h1 className="fw-bold">Get the Best Deals</h1>
                <br />
                <h1 className="fw-bold">Everything For Everyone</h1>
                <br />
                <span className="fw-normal fs-4">Lorem ipsum dolor sit amet</span>
              </div>
            </div>
            <div className="col-12 col-md-6 d-flex justify-content-center my-4">
              <div className="heroImg text-center w-100">
                <img src={heroimage} alt="Hero" className="img-fluid" />
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="text-white hero-slider1 p-4">
          <div
            className="row w-100 m-0 align-items-center"
            style={{ height: "100%" }}
          >
            <div className="col-12 col-md-6 text-center text-md-start">
              <div className="text-white mx-md-5">
                <h1 className="fw-bold">Get the Best Deals</h1>
                <br />
                <h1 className="fw-bold">Everything For Everyone</h1>
                <br />
                <span className="fw-normal fs-4">Lorem ipsum dolor sit amet</span>
              </div>
            </div>
            <div className="col-12 col-md-6 d-flex justify-content-center my-4">
              <div className="heroImg text-center w-100">
                <img src={heroimage2} alt="Hero" className="img-fluid" />
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="text-white hero-slider2 p-4">
          <div
            className="row w-100 m-0 align-items-center"
            style={{ height: "100%" }}
          >
            <div className="col-12 col-md-6 text-center text-md-start">
              <div className="text-white mx-md-5">
                <h1 className="fw-bold">Get the Best Deals</h1>
                <br />
                <h1 className="fw-bold">Everything For Everyone</h1>
                <br />
                <span className="fw-normal fs-4">Lorem ipsum dolor sit amet</span>
              </div>
            </div>
            <div className="col-12 col-md-6 d-flex justify-content-center my-4">
              <div className="heroImg text-center w-100">
                <img src={heroimage1} alt="Hero" className="img-fluid" />
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <button
        ref={prevButtonRef}
        className="custom-prev-button btn btn-light rounded-circle position-absolute start-0 top-50 translate-middle-y d-none d-lg-block"
      >
        <MdOutlineArrowBackIos />
      </button>
      <button
        ref={nextButtonRef}
        className="custom-next-button btn btn-light rounded-circle position-absolute end-0 top-50 translate-middle-y d-none d-lg-block"
      >
        <MdOutlineArrowForwardIos />
      </button>

      <div className="custom-pagination text-center mt-4"></div>
    </div>
  );
};

export default HeroSlider;
