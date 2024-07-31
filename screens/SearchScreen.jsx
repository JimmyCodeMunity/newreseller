import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Alert,
  Switch,
  TouchableOpacity,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Linking,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Table, TableWrapper, Row, Rows } from "react-native-table-component";
import axios from "axios";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import Loading from "../components/Loading";
import { RefreshControl } from "react-native";
import { useCurrency } from "../components/CurrrencyProvider";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const SearchScreen = ({ navigation }) => {
  const [tableHead, setTableHead] = useState([
    "Name",
    "SKU.",
    "Price",
    "Action",
  ]);
  const [tableData, setTableData] = useState([]);

  const [selected, setSelected] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isDollar, setIsDollar } = useCurrency();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const [usdPrice, setUsdPrice] = useState("");

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleLinkClick = () => {
    Linking.openURL(
      "https://react-pdf-download-reseller.vercel.app/productlist"
    );
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  //handle refresh
  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchData(); // Fetch the updated data
    } catch (error) {
      console.log(error);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       "https://res-server-sigma.vercel.app/api/product/productlist"
  //     );
  //     const apiData = response.data;
  //     setFilteredProducts(apiData);
  //     setProducts(apiData);
  //     setLoading(false);

  //     if (apiData.length > 0) {
  //       setTableHead(["Name", "supplier.", "Price", "Availability", "Action"]);

  //       const rows = apiData.map((item, index) => [
  //         item.name,
  //         item.supplier,
  //         item.price,
  //         item.isAvailable,
  //       ]);

  //       //setTableData(rows);
  //       //console.log("data",tableData)
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error.message);
  //   }
  // };

  const [newdollar, setNewDollar] = useState();
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://res-server-sigma.vercel.app/api/product/productlist"
      );
      const apiData = response.data;
      setFilteredProducts(apiData);
      setProducts(apiData);
      setLoading(false);

      if (apiData.length > 0) {
        setTableHead(["Name", "sku.", "Price", "Availability", "Action"]);

        const rows = await Promise.all(
          apiData.map(async (item, index) => {
            try {
              // Fetch supplier details for each product
              const supplierResponse = await axios.get(
                `https://res-server-sigma.vercel.app/api/shop/usersdata/${item.supplier}`
              );
              const supplierData = supplierResponse.data.user;
              const { firstName, lastName, dollarExchangeRate } = supplierData;
              setNewDollar(dollarExchangeRate);
              // console.log(`Supplier for ${item.name}: ${firstName} ${lastName}, Exchange: ${dollarExchangeRate} Price:${item.price}`);

              // Calculate price in USD

              return [
                item.name,
                `${firstName} ${lastName}`,
                isDollar
                  ? `$ ${Number(priceInUSD).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : `KES ${Number(item.price).toLocaleString("en-US")}`,
                item.status,
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("viewproduct", {
                      name: item.name,
                      brand: item.brand,
                      category: item.category,
                      price: isDollar ? usdPrice : item.price,
                      supplier: `${firstName} ${lastName}`,
                      desc: item.description,
                      categ: item.category,
                      status: item.status,
                    })
                  }
                  style={styles.viewDetailsButton}
                >
                  <Text style={styles.viewDetailsButtonText}>View</Text>
                </TouchableOpacity>,
              ];
            } catch (error) {
              console.error("Error fetching supplier details:", error.message);
              return [];
            }
          })
        );

        setTableData(rows.filter((row) => row.length > 0));
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleActionPress = ({ tableData }) => {
    console.log("rowData:", selected); // Log the entire rowData to inspect its structure

    Alert.alert("Selected Item", selected[1]);
  };

  // Apply filters function
  const applyFilter = () => {
    setSearchQuery(filterName || filterPrice || filterBrand);
  };

  const initialPrice = 2000;

  //filter
  const searchedProducts = products.filter(
    (products) =>
      products.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      products.price.toString().includes(searchQuery.toLowerCase()) ||
      products.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to clear filters
  const clearFilters = () => {
    setFilterBrand("");
    setFilterPrice("");
    setFilterName("");
    setSearchQuery("");

    setFilteredProducts(products); // Reset filteredProducts to all products
  };

  const renderProductTable = () => {
    const tableData = searchedProducts.map((item) => {
      // Calculate price in USD
      const priceInUSD = item.price * newdollar;
      // Calculate price in KES
      const priceInKES = item.price;

      // console.log("dollars",newdollar)

      return [
        item.name,
        item.sku,
        !isDollar
          ? `KES ${Number(priceInUSD.toFixed(2)).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : `$ ${Number(priceInKES.toFixed(2)).toLocaleString("en-US")}`,
        item.status,

        <View className="justify-center items-center">
          <TouchableOpacity
            className="bg-orange-500 w-16 rounded-2xl h-8 justify-center items-center"
            onPress={() => {
              navigation.navigate("viewproduct", {
                name: item.name,
                companyname: item.companyName,
                brand: item.brand,
                category: item.category,
                price: item.price,
                supplier: item.supplier,
                desc: item.description,
                categ: item.category,
                status: item.status,
                dollarstate: isDollar,
              });
            }}
            style={styles.viewDetailsButton}
          >
            <Text style={styles.viewDetailsButtonText}>View</Text>
          </TouchableOpacity>
        </View>,
      ];
    });

    return (
      <Table borderStyle={{ borderWidth: 1 }}>
        <Row
          data={tableHead}
          flexArr={[5, 4, 2, 2]}
          widthArr={[160, 180, 200, 220, 180]}
          style={styles.head}
          textStyle={styles.text}
        />
        <TableWrapper style={styles.wrapper}>
          <Rows
            // Access the name at index 0
            data={tableData}
            flexArr={[5, 4, 2, 2]}
            widthArr={[160, 180, 200, 220, 180]}
            style={styles.row}
            textStyle={styles.text}
          />
        </TableWrapper>
      </Table>
    );
  };

  return (
    <SafeAreaView className="flex-1" style={styles.container}>
      <View className="mt-8 py-3 px-4 flex-row justify-between items-center">
        <View>
          <Text className="text-orange-500 text-2xl font-bold">Search</Text>
        </View>
      </View>
      <View className="py-4 justify-between items-center w-full px-5 flex-row">
        <TextInput
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          className="border border-slate-300 rounded-xl w-80 h-10 px-4"
          placeholder="search products,resellers,brands...."
        />
        <TouchableOpacity className="h-10 w-10 bg-black rounded-xl justify-center items-center ">
          <Icon name="search-web" color="white" size={30} />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center px-5 py-5">
        
        <View className="flex-row space-x-3">
        <View>
          <Text className="text-xl text-slate-500 font-semibold flex-row justify-between item-center">
            Currency:
            <Text
              className="font-bold px-2"
              style={{
                textDecorationLine: isDollar ? "none" : "line-through",
                color: isDollar ? "black" : "gray",
              }}
            >
              USD
            </Text>{" "}
            ||
            <Text
              style={{
                textDecorationLine: isDollar ? "line-through" : "none",
                color: isDollar ? "gray" : "black",
              }}
            >
              {" "}
              KES
            </Text>
          </Text>
        </View>
        <Switch
              trackColor={{ false: "#767577", true: "lightgrey" }}
              thumbColor={isDollar ? "orange" : "white"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() =>
                setIsDollar((previousState) => !previousState)
              }
              value={isDollar}
            />
            </View>

        <View className="flex-row justify-between items-center space-x-3">
          <View>
            <TouchableOpacity
              //   onPress={() =>
              //     navigation.navigate("pdfdownloadall")
              //   }
              onPress={handleLinkClick}
            >
              <Icon name="download" size={30} color="black" />
            </TouchableOpacity>
          </View>

          <View>
            
          </View>
        </View>
      </View>

      <ScrollView
        horizontal={true}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        <ScrollView
          vertical={true}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          {loading ? (
            <Loading />
          ) : (
            <Animated.View entering={FadeInDown.delay(400).springify()}>
              {renderProductTable()}
            </Animated.View>
          )}
        </ScrollView>
      </ScrollView>

      {/* <Modal animationType="slide" transparent={true} visible={modalVisible} className="justify-center items-center mt-12">

      </Modal> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  head: { height: 20, backgroundColor: "#f1f8ff", minWidth: 300 },
  wrapper: { flexDirection: "row" },
  row: { height: 70 },
  text: { textAlign: "center" },
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

export default SearchScreen;
