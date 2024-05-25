import { View, Text, Dimensions, TouchableWithoutFeedback, Image } from 'react-native'
import React from 'react'
import Carousel from 'react-native-snap-carousel'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function CarouselCard({ data, navigation }) {
    const carouselData = [
        { id: 1, image: require('../assets/card1.jpg') },
        { id: 2, image: require('../assets/card2.jpg') },
        { id: 4, image: require('../assets/card4.jpg') },
    ];
    return (
        <View className="mt-8" style={{ height: 200 }}>
            <Carousel
                data={carouselData}
                renderItem={({ item }) => <ProductCard item={item} />}
                
                inactiveSlideOpacity={0.8}
                sliderWidth={windowWidth}
                itemWidth={windowWidth * 0.82}
                itemHeight={windowHeight * 0.3}
                slideStyle={{ display: 'flex', alignItems: 'center' }}
                //layout={'stack'} layoutCardOffset={`18`}
                autoplay={true} // Enable autoplay
                autoplayInterval={3000}
                loop={true}
            />


        </View>
    )
}


const ProductCard = ({ item }) => {
    return (
        <TouchableWithoutFeedback>
            <Image source={item.image}
                style={{
                    width: windowWidth * 0.8,
                    height: windowHeight * 0.25,
                }}
                className="rounded-3xl shadow-lg"
            />
        </TouchableWithoutFeedback>
    )
}