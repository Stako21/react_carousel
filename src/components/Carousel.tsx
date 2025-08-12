import React, { useState } from 'react';
import './Carousel.scss';

type Props = {
  images: string[];
  step: number;
  frameSize: number;
  itemWidth: number;
  animationDuration: number;
  infinite: boolean;
};

interface StyleDefinition {
  [key: string]: string;
}

export const Carousel: React.FC<Props> = ({
  images,
  step = 3,
  frameSize,
  itemWidth = 130,
  animationDuration,
  infinite,
}) => {
  const containerStyle: StyleDefinition = {
    width: `${frameSize * itemWidth}px`,
    overflow: 'hidden',
  };

  const newArrImages = infinite
    ? [...images.slice(-frameSize), ...images, ...images.slice(0, frameSize)]
    : images;

  const [currentIndex, setCurrentIndex] = useState(infinite ? frameSize : 0);

  const [position, setPosition] = useState<StyleDefinition>({
    transform: `translateX(${-currentIndex * itemWidth}px)`,
    transition: `transform ${animationDuration}ms ease`,
  });

  const goNext = () => {
    const tentativeIndex = currentIndex + step;

    // Если не infinite — ограничить максимальный индекс
    const maxIndex = infinite
      ? images.length + frameSize
      : images.length - frameSize;

    const newIndex = Math.min(tentativeIndex, maxIndex);

    setCurrentIndex(newIndex);
    setPosition({
      transform: `translateX(${-newIndex * itemWidth}px)`,
      transition: `transform ${animationDuration}ms ease`,
    });

    if (infinite && tentativeIndex >= images.length) {
      setTimeout(() => {
        const resetIndex = tentativeIndex - images.length;

        setCurrentIndex(resetIndex);
        setPosition({
          transform: `translateX(${-resetIndex * itemWidth}px)`,
          transition: 'none',
        });
      }, animationDuration);
    }
  };

  const goPrev = () => {
    const tentativeIndex = currentIndex - step;

    const minIndex = infinite ? 0 : 0;

    const newIndex = Math.max(tentativeIndex, minIndex);

    setCurrentIndex(newIndex);
    setPosition({
      transform: `translateX(${-newIndex * itemWidth}px)`,
      transition: `transform ${animationDuration}ms ease`,
    });

    if (infinite && tentativeIndex < frameSize) {
      setTimeout(() => {
        const resetIndex = tentativeIndex + images.length;

        setCurrentIndex(resetIndex);
        setPosition({
          transform: `translateX(${-resetIndex * itemWidth}px)`,
          transition: 'none',
        });
      }, animationDuration);
    }
  };

  return (
    <div className="Carousel">
      <button
        className="Carousel__button prev"
        onClick={goPrev}
        disabled={!infinite && currentIndex === 0}
      >
        {'<'}
      </button>
      <div className="Carousel__track" style={containerStyle}>
        <ul className="Carousel__items" style={position}>
          {newArrImages.map((img, i) => (
            <li key={i}>
              <img
                src={img}
                alt={`${i}`}
                width={itemWidth}
                style={{ width: `${itemWidth}px` }}
              />
            </li>
          ))}
        </ul>
      </div>

      <button
        data-cy="next"
        className="Carousel__button next"
        onClick={goNext}
        disabled={!infinite && currentIndex === newArrImages.length - frameSize}
      >
        {'>'}
      </button>
    </div>
  );
};

// export default Carousel;
