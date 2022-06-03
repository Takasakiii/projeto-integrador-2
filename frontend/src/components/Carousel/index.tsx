import "bulma-carousel/dist/css/bulma-carousel.min.css";
import Image from "next/image";
import { HTMLProps, useEffect, useRef } from "react";
import doacaoApi from "../../api";

export interface CarouselProps extends HTMLProps<HTMLDivElement> {
  images: string[];
  itemId: string;
}

const Carousel: React.FC<CarouselProps> = ({ images, itemId, ...props }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (images.length > 0) {
      import("./CarouselWrapper").then(({ default: initBulmaCarousel }) => {
        initBulmaCarousel(carouselRef);
        console.log("grande dia");
      });
    }
  }, [images]);

  return (
    <div ref={carouselRef} className="carousel">
      {images.map((image, index) => (
        <div className={`item-${index + 1}`} key={image}>
          <Image
            src={doacaoApi.getImageUrl(image, itemId)}
            alt={`Imagem ${index}`}
            objectFit="cover"
            width={800}
            height={400}
          />
        </div>
      ))}
    </div>
  );
};

export default Carousel;
