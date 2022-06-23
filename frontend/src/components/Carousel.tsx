import { css } from "@emotion/react";
import Image from "next/image";
import { HTMLProps } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

export interface CarouselProps extends HTMLProps<HTMLDivElement> {
  images: string[];
}

const imageCSS = css`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
`;

const Carousel: React.FC<CarouselProps> = ({ images, ...props }) => {
  const imagesElements = images.map((image) => (
    <div key={image} css={imageCSS}>
      <Image
        src={image}
        alt="Imagem representando o item"
        layout="fill"
        objectFit="cover"
      />
    </div>
  ));

  return (
    <div {...props}>
      <AliceCarousel items={imagesElements} disableButtonsControls />
    </div>
  );
};

export default Carousel;
