import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Product } from "src/types";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

import "./SmoothCarousel.css";

import ProductCard from "./shared/ProductCard";

// import required modules
import { EffectCards } from "swiper";

export function SmoothCarousel({ products }: { products?: Product[] }) {
  return (
    <>
      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper"
      >
        {products?.map((product) => (
          <SwiperSlide
            key={product.code}
            className="flex items-center justify-center  rounded "
          >
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}