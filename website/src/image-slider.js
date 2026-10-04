import React from 'react';

const ImageSlider = () => {
    const [index, setIndex] = React.useState(0);

    const images = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmeAZhMKbRuR_R0TvL_jrU-9CBJzp8WbjhTGGIcVm7lw&s=10',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGSY9R0Mm7f7Hq4NsNC421Dg7MqOxI9Z7W0pJCMAL_kA&s=10',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMIAsHTCSA_ekZ09Pa2AcaBZMFx-ltwg4kYA4d-CjcEg&s=10'
    ];

    const previous = () => {
        setIndex((index - 1 + images.length) % images.length);
    };

    const next = () => {
        setIndex((index + 1) % images.length);
    };

    return (
        <div>
            <h1>Image Slider</h1>

            <img
                src={images[index]}
                alt="Image"
                style={{ height: '300px', width: '300px' }}
            />

            <br />

            <button onClick={previous}>Previous</button>
            <button onClick={next}>Next</button>
        </div>
    );
};

export default ImageSlider;