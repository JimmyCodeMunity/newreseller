import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, Alert, RefreshControl, Switch, ActivityIndicator, TouchableOpacity, Text, Dimensions, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';
import axios from 'axios';
import * as Icon from 'react-native-feather';
import Modal from "react-native-modal";
import { StatusBar } from 'expo-status-bar';
import Loading from '../components/Loading';
import { useCurrency } from '../components/CurrrencyProvider';


const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const Manufacturer = ({ route, navigation }) => {
  const [tableHead, setTableHead] = useState(['', 'Name', 'PartNo.', 'Price', 'Action']);
  const [tableData, setTableData] = useState([]);
  const [productsNotFound, setProductsNotFound] = useState(false);
  const { supplierId } = route.params;

  const [selected, setSelected] = useState([]);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProductDescription, setSelectedProductDescription] = useState([]);
  const [filterModal, setFilterModal] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isDollar, setIsDollar } = useCurrency();


  const [priceFilter, setPriceFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');

  const [value, setValue] = useState(null);
  const [isFocusCat, setIsFocusCat] = useState(false);
  const [isFocusPrice, setIsFocusPrice] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  // Inside your component...
  const [partNumberFilter, setPartNumberFilter] = useState(''); // Add this state variable

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleCall = () => {
    const phoneNumber = manPhone;
    const countryCode = "+254";


    // Check if the phone number is valid
    if (manPhone) {

      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      // Construct the phone call URL
      const phoneURL = `tel:${fullPhoneNumber}`;

      // Open the phone app with the specified phone number
      Linking.canOpenURL(phoneURL)
        .then((supported) => {
          if (!supported) {
            console.error("Phone calls are not supported on this device");
          } else {
            return Linking.openURL(phoneURL);
          }
        })
        .catch((error) => console.error(`Error opening phone app: ${error}`));
    } else {
      console.error("Phone number is not available");
    }
  }



  //handle whatsapp
  const handleWhatsapp = () => {
    const phoneNumber = manPhone;
    const countryCode = "+254";
    if (phoneNumber) {
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const phoneURL = `tel:${fullPhoneNumber}`;
      // Construct the WhatsApp chat URL
      const whatsappURL = `https://wa.me/${fullPhoneNumber}`;

      // Open the WhatsApp chat with the specified phone number
      Linking.canOpenURL(whatsappURL)
        .then((supported) => {
          if (!supported) {
            console.error("WhatsApp is not installed on this device");
          } else {
            return Linking.openURL(whatsappURL);
          }
        })
        .catch((error) => console.error(`Error opening WhatsApp chat: ${error}`));
    } else {
      console.error("Phone number is not available");
    }
  }




  useEffect(() => {
    fetchData();
  }, [supplierId]);




  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://res-server-sigma.vercel.app/api/product/productlist/${supplierId}`, {
        timeout: 10000,
      });
      const apiData = response.data;
      setFilteredProducts(apiData);
      setProducts(apiData); // Update the products state
      setLoading(false);

      if (apiData.length > 0) {
        setTableHead(['Name', 'PartNo.', 'Price', 'Action']);

        const rows = apiData.map((item, index) => [
          item.name,
          item.partNumber,
          item.discountPrice,
          item.available,
        ]);
      } else {
        setProducts([]);
        setFilteredProducts([]); // Initialize filteredProducts with an empty array
        setProductsNotFound(true);
      }
    } catch (error) {
      // Handle errors
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message); // Handle canceled request
      } else if (error.code === 'ECONNABORTED') {
        console.log('Request timeout:', error.message); // Handle timeout
        setLoading(false);
        //navigation.goBack();
        setTimeModalVisible(true)
      } else {
        console.error('Error fetching data:', error.message);
      }
    }
  };



  // ... existing code ...

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchData(); // Fetch the updated data

    } catch (error) {
      console.log(error);
    }
    setIsRefreshing(false);
  };


  const handleActionPress = ({ tableData }) => {
    console.log('rowData:', selected); // Log the entire rowData to inspect its structure

    Alert.alert('Selected Item', selected[1]);
  };



  //Apply filters when any filter criteria change
  useEffect(() => {
    applyFilters();
  }, [priceFilter, categoryFilter, isDollar]);

  // Apply filters function
  const applyFilters = () => {
    // Filter by price
    const priceFiltered = priceFilter
      ? products.filter((product) => {
        const price = isDollar
          ? product.discountPrice / product.shop.exchangeRate
          : product.discountPrice;
        return price >= priceFilter * 0.9 && price <= priceFilter * 1.1;
      })
      : products;

    // Filter by name
    const nameFiltered = categoryFilter
      ? priceFiltered.filter((product) =>
        product.name && product.name.toLowerCase().includes(categoryFilter.toLowerCase())
      )
      : priceFiltered;

    // Filter by brand
    const brandFiltered = brandFilter
      ? nameFiltered.filter((product) =>
        product.brand && product.brand.toLowerCase().includes(brandFilter.toLowerCase())
      )
      : nameFiltered;

    // Filter by part number
    const partNumberFiltered = partNumberFilter
      ? brandFiltered.filter((product) =>
        product.partNumber && product.partNumber.toLowerCase().includes(partNumberFilter.toLowerCase())
      )
      : brandFiltered;

    setFilteredProducts(partNumberFiltered);

    if (partNumberFiltered.length === 0) {
      // Handle the case when no products match the filters
      setProductsNotFound(true);
    } else {
      setProductsNotFound(false);
    }
  };




  // Function to clear filters
  const clearFilters = () => {
    setPriceFilter(''); // Clear price filter
    setNameFilter('');  // Clear name filter
    setBrandFilter('');
    setPartNumberFilter('');
    setCategoryFilter('');
    setFilteredProducts(products); // Reset filteredProducts to all products
  };








  const renderProductTable = () => {
    const tableData = products.map((item) => [
      item.name,
      item.partNumber,
      isDollar
        ? `$ ${Number((item.discountPrice / item.shop.exchangeRate).toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : `KES ${Number(item.discountPrice.toFixed(2)).toLocaleString('en-US')}`,
      <View className="justify-center items-center">
        <TouchableOpacity
          className="bg-orange-500 w-16 rounded-2xl h-8 justify-center items-center"
          onPress={() => {
            setSelected([
              item.shop.name,
              item.name,
              item.brand,
              item.category,
              item.shop.phoneNumber,
              item.shop.exchangeRate,
              item.discountPrice,
            ]);
            setModalVisible(true);
          }}
          style={styles.viewDetailsButton}
        >
          <Text style={styles.viewDetailsButtonText}>View</Text>
        </TouchableOpacity>
      </View>,
    ]);

    return (
      <Table borderStyle={{ borderWidth: 1 }}>
        <Row data={tableHead} flexArr={[5, 4, 2, 2]} widthArr={[160, 180, 200, 220]} style={styles.head} textStyle={styles.text} />
        <TableWrapper style={styles.wrapper}>
          <Rows
            data={tableData}
            flexArr={[5, 4, 2, 2]}
            widthArr={[160, 180, 200, 220]}
            style={styles.row}
            textStyle={styles.text}
          />
        </TableWrapper>
      </Table>
    );
  };


  return (
    <SafeAreaView className="flex-1" style={styles.container}>
      <View className="flex-row justify-between items-center px-5 py-5">
        <View>
          <Text className="text-xl text-slate-500 font-semibold flex-row justify-between item-center">Currency:
            <Text className="font-bold px-2" style={{ textDecorationLine: isDollar ? 'none' : 'line-through', color: isDollar ? 'black' : 'gray' }}>USD</Text> ||
            <Text style={{ textDecorationLine: isDollar ? 'line-through' : 'none', color: isDollar ? 'gray' : 'black' }}> KES</Text>
          </Text>

        </View>

        <View>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDollar ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setIsDollar((prevState) => !prevState)}
            value={isDollar}
          />
        </View>
      </View>

      <ScrollView horizontal={true} contentContainerStyle={{ paddingHorizontal:15 }}>
        <ScrollView vertical={true}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          {loading ? (
            <Loading />

          ) : (
            <View>
              {renderProductTable()}
            </View>

          )}

        </ScrollView>
      </ScrollView>

      {/* <Modal animationType="slide" transparent={true} visible={modalVisible} className="justify-center items-center mt-12">

      </Modal> */}


      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modalContainer}
      >
        <View
          className=""
          style={[
            styles.bottomSheetContainer1,
            { height: windowHeight * 0.8 },
          ]}
        >
          <View>
            <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-slate-400 justify-center items-center rounded-2xl h-12 w-12">
              <Icon.XCircle size={30} color={"orange"} />
            </TouchableOpacity>
          </View>
          <View className="justify-center items-center">
            <Text className="text-slate-800 text-2xl font-semibold">Product Details</Text>
          </View>
          <ScrollView vertical={true}>
            <View className="justify-center">
              <Text className="text-3xl font-bold text-slate-500 space-x-4 py-3">{selected[1]}</Text>

              <Text style={{ fontSize: 24, fontWeight: 'bold' }} className="text-xl text-bold">
                {isDollar ? '$ ' + Number(selected[6] / selected[5]).toFixed(2) : 'KES ' + selected[6]}
              </Text>
              <Text className="text-xl text-slate-600 font-semibold">Manufacturer:{selected[0]}</Text>
              <Text className="text-xl text-slate-600 font-semibold">Brand:{selected[2]}</Text>
              <Text className="text-xl text-slate-600 font-semibold">SubCategory:{selected[3]}</Text>
              <Text className="text-xl text-slate-600 font-semibold">ExchangeRate:{selected[5]}</Text>
            </View>
            <View className="py-2">
              <TouchableOpacity onPress={handleWhatsapp} className="rounded-2xl flex-row bg-green-500 p-2 w-90 h-12 justify-center items-center">
                <Icon.MessageCircle size={23} color={"white"} />
                <Text className="text-2xl font-semibold text-slate-700">Chat</Text>

              </TouchableOpacity>
            </View>
            <View className="py-2">
              <TouchableOpacity onPress={handleCall} className="rounded-2xl flex-row p-2 bg-black w-90 h-12 justify-center items-center">
                <Icon.Phone size={23} color={"white"} />
                <Text className="text-2xl font-semibold text-slate-200">Call</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

        </View>
      </Modal>




      {/* display modal when data is not fetched on time */}
      <Modal
        isVisible={timeModalVisible}
        onBackdropPress={() => setTimeModalVisible(false)}
        style={styles.modalContainer}
      >
        <View
          className=""
          style={[
            styles.bottomSheetContainer1,
            { height: windowHeight * 0.5 },
          ]}
        >
          <View className="justify-center items-center flex-1">
            <ActivityIndicator size="large" color="red" />
            <Text className="text-slate-500 py-4">Connection Timeout!!</Text>
          </View>


        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 20, backgroundColor: '#f1f8ff', minWidth: 300 },
  wrapper: { flexDirection: 'row' },
  row: { height: 70 },
  text: { textAlign: 'center' },
  bottomSheetContainer1: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 5,
    elevation: 5,
  },
  modalContainer: {
    justifyContent: "flex-end",
    margin: 0,
    height: "50%",
  },
});

export default Manufacturer;