import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Alert,
  RefreshControl,
  Switch,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Dimensions,
  Linking,
  TextInput,
} from "react-native";
import { Table, TableWrapper, Row, Rows } from "react-native-table-component";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from "react-native-modal";
import { Appbar } from "react-native-paper";
import Loading from "../components/Loading";
import { useCurrency } from "../components/CurrrencyProvider";

const windowHeight = Dimensions.get("window").height;

const Manufacturer = ({ route, navigation }) => {
  const [tableHead, setTableHead] = useState([
    "Name",
    "PartNo.",
    "Price",
    "Availability",
    "Action",
  ]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [selected, setSelected] = useState([]);
  const [productsNotFound, setProductsNotFound] = useState(false);
  const { isDollar, setIsDollar } = useCurrency();

  const {
    supplierId,
    supplierFirstName,
    supplierLastName,
    supplierPhone,
    supplierExRate,
    companyName,
  } = route.params;
  const supplierFullName = `${supplierFirstName} ${supplierLastName}`;

  const [searchFilter, setSearchFilter] = useState("");

  const closeModal = () => setModalVisible(false);

  const handleCall = () => {
    const phoneNumber = supplierPhone.slice(-9);
    const countryCode = "+254";
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    const phoneURL = `tel:${fullPhoneNumber}`;

    Linking.canOpenURL(phoneURL)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneURL);
        } else {
          console.error("Phone calls are not supported on this device");
        }
      })
      .catch((error) => console.error(`Error opening phone app: ${error}`));
  };

  const handleWhatsapp = () => {
    const phoneNumber = supplierPhone.slice(-9);
    const countryCode = "+254";
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    const whatsappURL = `https://wa.me/${fullPhoneNumber}`;

    Linking.canOpenURL(whatsappURL)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappURL);
        } else {
          console.error("WhatsApp is not installed on this device");
        }
      })
      .catch((error) => console.error(`Error opening WhatsApp chat: ${error}`));
  };

  useEffect(() => {
    fetchData();
  }, [supplierId]);

  const handleLinkClick = () => {
    Linking.openURL(
      `https://react-pdf-download-reseller.vercel.app/manufaclist/${supplierId}`
    );
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://res-server-sigma.vercel.app/api/product/productlist/${supplierId}`,
        { timeout: 10000 }
      );
      const apiData = response.data;
      setProducts(apiData);
      setFilteredProducts(apiData);
      setLoading(false);
      setProductsNotFound(apiData.length === 0);
    } catch (error) {
      setLoading(false);
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else if (error.code === "ECONNABORTED") {
        console.log("Request timeout:", error.message);
        setTimeModalVisible(true);
      } else {
        console.error("Error fetching data:", error.message);
      }
    }
  };

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    applyFilter();
  }, [searchFilter, isDollar]);

  const applyFilter = () => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchFilter.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchFilter.toLowerCase()) ||
        product.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (isDollar
          ? (product.price / supplierExRate).toFixed(2)
          : product.price.toFixed(2)
        ).includes(searchFilter)
    );

    setFilteredProducts(filtered);
    setProductsNotFound(filtered.length === 0);
  };

  const clearFilter = () => {
    setSearchFilter("");
    setFilteredProducts(products);
  };

  const renderProductTable = () => {
    const tableData = filteredProducts.map((item) => [
      item.name,
      item.sku,
      !isDollar
        ? `KES ${Number(
            (item.price * supplierExRate).toFixed(2)
          ).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : `$ ${Number(item.price.toFixed(2)).toLocaleString("en-US")}`,
      item.status,
      <View className="justify-center items-center">
        <TouchableOpacity
          className="bg-orange-500 w-16 rounded-2xl h-8 justify-center items-center"
          onPress={() => {
            setSelected([
              item.name,
              item.sku,
              item.price,
              item.brand,
              item.category,
              item.phoneNumber,
              item.exchangeRate,
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
        <Row
          data={tableHead}
          flexArr={[5, 4, 2, 2]}
          widthArr={[160, 180, 200, 220, 100]}
          style={styles.head}
          textStyle={styles.text}
        />
        <TableWrapper style={styles.wrapper}>
          <Rows
            data={tableData}
            flexArr={[5, 4, 2, 2]}
            widthArr={[160, 180, 200, 220, 100]}
            style={styles.row}
            textStyle={styles.text}
          />
        </TableWrapper>
      </Table>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" onPress={hideKeyboard}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Supplier Products" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>
      <View className="w-full px-5 pt-4">
        <Text className="text-slate-500 font-semibold text-xl">
          Supplier: {companyName}
        </Text>
        <Text className="text-slate-500 font-semibold text-xl">
          Contact: {supplierPhone}
        </Text>
        <Text className="text-slate-500 font-semibold text-xl">
          Exchange Rate: {supplierExRate}
        </Text>
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
        <View className="flex-row justify-between items-center space-x-5">
          <TouchableOpacity onPress={handleLinkClick}>
            <Icon name="download" color="orange" size={20} />
          </TouchableOpacity>
          
        </View>
      </View>
      <View className="px-4 pb-4 flex-row justify-between items-center">
        <TextInput
          className="bg-gray-100 rounded p-3 mb-3 w-80"
          placeholder="Search"
          value={searchFilter}
          onChangeText={setSearchFilter}
        />
        <TouchableOpacity
          className="bg-orange-500 rounded p-3 mb-3 w-10 h-10 justify-center items-center flex"
          onPress={clearFilter}
        >
          <Text className="text-white text-center">
            <Icon name="close" size={25} color="white" />
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <Loading />
        ) : productsNotFound ? (
          <View className="flex-1 justify-center items-center pt-12">
            <Icon name="database-off" color="orange" size={30} />
            <Text className="text-slate-500 font-semibold text-2xl pt-4">
              No Products Found
            </Text>
            <Text className="text-slate-500">
              Scroll down to refresh or try again later
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal={true}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          >
            {renderProductTable()}
          </ScrollView>
        )}
      </ScrollView>

      <Modal isVisible={modalVisible}>
        <View className="bg-white p-6 rounded-md">
          <Text className="text-lg font-semibold mb-4">Product Details</Text>
          <Text className="text-sm mb-1">Name: {selected[0]}</Text>
          <Text className="text-sm mb-1">Part No: {selected[1]}</Text>
          <Text className="text-sm mb-1">
            Price:{" "}
            {!isDollar
              ? `KES ${Number(
                  (selected[2] * supplierExRate).toFixed(2)
                ).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : `$ ${Number(selected[2]).toLocaleString("en-US")}`}
          </Text>
          <Text className="text-sm mb-1">Brand: {selected[3]}</Text>
          <Text className="text-sm mb-1">Category: {selected[4]}</Text>
          <Text className="text-sm mb-1">Phone: {supplierPhone}</Text>
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              className="bg-orange-500 rounded p-3 mb-3 w-1/2 mr-2"
              onPress={handleCall}
            >
              <Text className="text-white text-center">Call Supplier</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-green-500 rounded p-3 mb-3 w-1/2"
              onPress={handleWhatsapp}
            >
              <Text className="text-white text-center">WhatsApp</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="bg-gray-300 rounded p-3 mb-3 w-full"
            onPress={closeModal}
          >
            <Text className="text-center">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={timeModalVisible}>
        <View className="bg-white p-6 rounded-md">
          <Text className="text-lg font-semibold mb-4">Error</Text>
          <Text className="text-sm mb-1">
            There was an error fetching data. Please try again later.
          </Text>
          <TouchableOpacity
            className="bg-gray-300 rounded p-3 mb-3 w-full"
            onPress={() => setTimeModalVisible(false)}
          >
            <Text className="text-center">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  head: { height: 50, backgroundColor: "#f97316" },
  wrapper: { flexDirection: "row" },
  row: { height: 60, backgroundColor: "#FFF" },
  text: { textAlign: "center", color: "#000" },
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
});

export default Manufacturer;
