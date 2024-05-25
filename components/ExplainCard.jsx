import { View, Text, Dimensions, TouchableWithoutFeedback, Image } from 'react-native'
import React from 'react'
import Carousel from 'react-native-snap-carousel'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function ExplainCard({ data, navigation }) {
    const carouselData = [
        { id: 1, bgColor: 'black', textColor: 'orange', text: 'Connect with Manufactures', textcolor: 'white', image: require('../assets/market.png') },
        { id: 2, bgColor: 'orange', text: 'Looking for product?', textcolor: 'white', image: require('../assets/cart.png') },
        { id: 4, bgColor: 'white', text: 'The best Cloud CBD', textcolor: 'black', image: require('../assets/market.png') },
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
            <View className="h-40 w-full rounded-3xl shadow-sm" style={{ backgroundColor: item.bgColor }}>
                <View className="flex-row justify-between items-center">
                    <View className="" style={{ width:'50%' }}>
                        <Text className="text-2xl font-bold px-3 p-3" style={{ color: item.textcolor }}>{item.text}</Text>
                    </View>
                    <View className="" style={{width:'50%', zIndex:-2 }}>
                        <Image className="h-24 w-32" source={item.image}/>
                    </View>
                </View>

            </View>
        </TouchableWithoutFeedback>
    )
}