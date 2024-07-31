import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Alert,
  Switch,
  TouchableOpacity,
  Text,
  Dimensions,
  TextInput,
  Linking,
} from "react-native";
import { Table, TableWrapper, Row, Rows } from "react-native-table-component";
import axios from "axios";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import { StatusBar } from "expo-status-bar";
import Loading from "../components/Loading";
import { useCurrency } from "../components/CurrrencyProvider";
import { Appbar } from "react-native-paper";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const CategoryViewScreen = ({ route, navigation }) => {
  const [tableHead, setTableHead] = useState([
    "",
    "Name",
    "PartNo.",
    "Price",
    "Action",
  ]);
  const [tableData, setTableData] = useState([]);
  const [productsNotFound, setProductsNotFound] = useState(false);
  const { categoryName, categoryImage } = route.params;

  const [selected, setSelected] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [found,setFound] = useState(false)

  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isDollar, setIsDollar } = useCurrency();

  const [priceFilter, setPriceFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [partNumberFilter, setPartNumberFilter] = useState("");

  const closeModal = () => {
    setModalVisible(false);
  };
  const ConnectionOut = () => {
    setTimeModalVisible(true);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchData();
    } catch (error) {
      console.log(error);
    }
    setIsRefreshing(false);
  };

  const handleLinkClick = () => {
    Linking.openURL(
      `https://react-pdf-download-reseller.vercel.app/catlist/${categoryName}`
    );
  };

  const handleCall = () => {
    const phoneNumber = selected[4].slice(-9);
    const countryCode = "+254";

    if (phoneNumber) {
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const phoneURL = `tel:${fullPhoneNumber}`;

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
  };

  const handleWhatsapp = () => {
    const phoneNumber = selected[4].slice(-9);
    const countryCode = "+254";
    if (phoneNumber) {
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const whatsappURL = `https://wa.me/${fullPhoneNumber}`;

      Linking.canOpenURL(whatsappURL)
        .then((supported) => {
          if (!supported) {
            console.error("WhatsApp is not installed on this device");
          } else {
            return Linking.openURL(whatsappURL);
          }
        })
        .catch((error) =>
          console.error(`Error opening WhatsApp chat: ${error}`)
        );
    } else {
      console.error("Phone number is not available");
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryName]);

  const getSupplierDataForEachItem = async (item) => {
    try {
      const response = await axios.get(
        `https://res-server-sigma.vercel.app/api/shop/usersdata/${item.supplier}`
      );
      const apiData = response.data;
      const exchangeRate = apiData.user.dollarExchangeRate;
      const firstName = apiData.user.firstName;
      const companyName = apiData.user.companyName;
      const lastName = apiData.user.lastName;
      const phoneNumber = apiData.user.phoneNumber;
      const categories = apiData.user.categories.join(", ");
      return {
        ...item,
        exchangeRate,
        firstName,
        phoneNumber,
        categories,
        lastName,
        companyName
      };
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      return item;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://res-server-sigma.vercel.app/api/product/productlistcategory/${categoryName}`
      );
      const apiData = response.data;
      const productsWithExchangeRates = await Promise.all(
        apiData.map(getSupplierDataForEachItem)
      );
      setProducts(productsWithExchangeRates);
      setFilteredProducts(productsWithExchangeRates);
      setLoading(false);

      if (productsWithExchangeRates.length > 0) {
        setProductsNotFound(false);
        setTableHead(["Name", "PartNo.", "Price","Availability", "Exchange Rate", "Action"]);
        const rows = productsWithExchangeRates.map((item) => [
          item.name,
          item.sku,
          isDollar
            ? `KES ${Number(item.price * item.exchangeRate).toLocaleString(
                "en-US",
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
              )}`
            : `$ ${Number(item.price).toLocaleString("en-US")}`,
            item.status,
          item.exchangeRate,
          item.available,
        ]);
        setTableData(rows);
      } else {
        setProducts([]);
        setFilteredProducts([]);
        setProductsNotFound(true);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else if (error.code === "ECONNABORTED") {
        console.log("Request timeout:", error.message);
        navigation.goBack();
      } else {
        console.error("Error fetching data:", error.message);
      }
    }
  };

  const handleActionPress = () => {
    console.log("rowData:", selected);
    Alert.alert("Selected Item", selected[1]);
  };

  useEffect(() => {
    applyFilters();
  }, [priceFilter, categoryFilter, isDollar, searchQuery]);

  const applyFilters = () => {
    let filteredProducts = products;

    if (searchQuery) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const priceFiltered = priceFilter
      ? filteredProducts.filter((product) => {
          const price = isDollar
            ? product.price / product.shop.exchangeRate
            : product.price;
          return price >= priceFilter * 0.9 && price <= priceFilter * 1.1;
        })
      : filteredProducts;

    const nameFiltered = categoryFilter
      ? priceFiltered.filter(
          (product) =>
            product.name &&
            product.name.toLowerCase().includes(categoryFilter.toLowerCase())
        )
      : priceFiltered;

    const brandFiltered = brandFilter
      ? nameFiltered.filter(
          (product) =>
            product.brand &&
            product.brand.toLowerCase().includes(brandFilter.toLowerCase())
        )
      : nameFiltered;

    const partNumberFiltered = partNumberFilter
      ? brandFiltered.filter(
          (product) =>
            product.sku &&
            product.sku.toLowerCase().includes(partNumberFilter.toLowerCase())
        )
      : brandFiltered;

    setFilteredProducts(partNumberFiltered);

    if (partNumberFiltered.length === 0) {
      setProductsNotFound(true);
    } else {
      setProductsNotFound(false);
    }
  };

  const clearFilters = () => {
    setPriceFilter("");
    setCategoryFilter("");
    setBrandFilter("");
    setPartNumberFilter("");
    setSearchQuery("");
    setFilteredProducts(products);
  };

  const renderProductTable = () => {
    const tableData = filteredProducts.map((item) => [
      item.name,
      item.sku,
      !isDollar
        ? `KES ${Number(item.price * item.exchangeRate).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : `$ ${Number(item.price).toLocaleString("en-US")}`,
        item.status,
      item.exchangeRate,

      <View className="justify-center items-center">
        <TouchableOpacity
          className="bg-orange-500 w-16 rounded-2xl h-8 justify-center items-center"
          onPress={() => {
            setSelected([
              item.companyName,
              item.lastName,
              item.brand,
              item.category,
              item.phoneNumber,
              item.exchangeRate,
              item.price,
              item.categories,
              item.name,
              item.sku,
            ]);
            setModalVisible(true);
          }}
        >
          <Text className="text-white text-sm font-semibold">View</Text>
        </TouchableOpacity>
      </View>,
    ]);
    return tableData;
  };

  const renderEmptyProductsView = () => {
    return (
      <SafeAreaView className="flex-1 justify-center items-center my-10">
        <Icon name="database-off" color="orange" size={30} />
            <Text className="text-slate-500 font-semibold text-2xl pt-4">
              No Products Found
            </Text>
            <Text className="text-slate-500">
              Scroll down to refresh or try again later
            </Text>
      </SafeAreaView>
    );
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />
        <Appbar.Header style={{ backgroundColor: "white" }}>
          <Appbar.Action
            icon="chevron-left"
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Appbar.Content
            title={categoryName}
            titleStyle={{
              fontSize: 20,
              fontWeight: "bold",
              color: "black",
            }}
          />
        </Appbar.Header>
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
                className="font-bold px-2"
              >
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
          <View className="flex-row justify-between items-center space-x-4">
            <TouchableOpacity onPress={handleLinkClick}>
              <Icon name="download" color="orange" size={30} />
            </TouchableOpacity>
            
          </View>
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <View style={{ padding: 16 }}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>

            <View>
              {loading ?<Loading/> :
              <View>
                <ScrollView className="" horizontal={true}>
              <Table
                borderStyle={{
                  borderWidth: 1,
                  borderColor: "#C8E1FF",
                }}
              >
                <Row
                  data={tableHead}
                  style={styles.head}
                  textStyle={styles.text}
                  flexArr={[5, 4, 2, 2]}
                  widthArr={[160, 180, 200, 220, 160,100]}
                />
                <TableWrapper>
                  {renderProductTable().map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      flexArr={[5, 4, 2, 2]}
                      widthArr={[160, 180, 200, 220, 160,100]}
                      style={[
                        styles.row,
                        index % 2 && {
                          backgroundColor: "#F7F6E7",
                        },
                      ]}
                      textStyle={styles.text}
                      onPress={() => setSelected(rowData)}
                    />
                  ))}
                </TableWrapper>
              </Table>
            </ScrollView>
              </View>
              
              }
            
            </View>

            {productsNotFound && renderEmptyProductsView()}
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={closeModal}
        backdropOpacity={0.5}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={500}
        animationOutTiming={500}
      >
        <View className="bg-white p-6 rounded-lg items-center justify-center">
          <Text className="text-lg font-bold mb-4">Supplier Information</Text>
          <Text>Name: {selected[0] || "N/A"}</Text>
          <Text>Phone: {selected[4] || "N/A"}</Text>
          <Text>Exchange Rate: {selected[5] || "N/A"}</Text>
          <View className="mt-4 flex-row justify-around w-full">
            <TouchableOpacity
              className="bg-green-500 px-4 py-2 rounded"
              onPress={handleWhatsapp}
            >
              <Text className="text-white">WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-blue-500 px-4 py-2 rounded"
              onPress={handleCall}
            >
              <Text className="text-white">Call</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="mt-4 bg-red-500 px-4 py-2 rounded"
            onPress={closeModal}
          >
            <Text className="text-white">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  head: { height: 50, backgroundColor: "#f97316" },
  wrapper: { flexDirection: "row" },
  row: { height: 60, backgroundColor: "#FFF" },
  text: { textAlign: "center", fontWeight: "bold", color: "#000" },
  viewDetailsButton: {
    backgroundColor: "#f97316",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  viewDetailsButtonText: {
    color: "white",
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#C8E1FF",
    padding: 8,
    borderRadius: 4,
  },
  clearButton: {
    marginLeft: 8,
    backgroundColor: "#FF6F61",
    padding: 8,
    borderRadius: 4,
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default CategoryViewScreen;
