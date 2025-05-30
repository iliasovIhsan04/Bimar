import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { stylesAll } from "../../style";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "@/Redux/reducer/UserInfo";
import { AppDispatch, RootState } from "@/Redux/reducer/store";
import { url } from "@/Api";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Header from "@/components/Main/HeaderAll";
import { colors } from "@/assets/styles/components/colors";
import ButtonLayouts from "@/assets/tabs/buttonLayouts";
import { useCondition } from "@/context/FavoriteContext";

interface DropdownItem {
  label: string;
  value: string;
}

const language: DropdownItem[] = [
  { label: "Кыргызча", value: "Кыргызча" },
  { label: "Русский", value: "Русский" },
];
const cities: DropdownItem[] = [
  { label: "Бишкек", value: "Бишкек" },
  { label: "Кант", value: "Кант" },
  { label: "Токмок", value: "Токмок" },
  { label: "Чолпон-ата", value: "Чолпон-ата" },
  { label: "Кара-Балта", value: "Кара-Балта" },
  { label: "Сокулук", value: "Сокулук" },
  { label: "Бостери", value: "Бостери" },
  { label: "Балыкчы", value: "Балыкчы" },
  { label: "Белеводское", value: "Белеводское" },
  { label: "Ош", value: "Ош" },
  { label: "Каракол", value: "Каракол" },
  { label: "Базар-Коргон", value: "Базар-Коргон" },
  { label: "Другой город", value: "Другой город" },
];

const MyDetails = () => {
  const [languageValue, setLanguageValue] = useState<string | null>(null);
  const [cityValue, setCityValue] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const {setChangeFirst} = useCondition()

  const [info, setInfo] = useState({
    phone: "",
    first_name: "",
    last_name: "",
    language: "",
    city: "",
    contactName:""
  });

  const [loading, setLoading] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const [local, setLocal] = useState("");

  const getToken = async (): Promise<void> => {
    try {
      const storedToken = await AsyncStorage.getItem("tokenActivation");
      setLocal(storedToken);
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
  };
  useEffect(() => {
    const loadUserInfo = async () => {
      await getToken();
      if (local) {
        dispatch(fetchUserInfo());
      }
    };

    loadUserInfo();
  }, [dispatch, local]);

  const headers = {
    Authorization: `Bearer ${local}`,
  };
  const data = useSelector((state: RootState) => state.users);
  const user = data?.user;

  useEffect(() => {
    if (user) {
      setInfo({
        phone: user.phone,
        last_name: user.last_name,
        first_name: user.first_name,
        language: user.language || "", 
        city: user.city || "",        
        contactName: user.contactName || "" 
      });
      setLanguageValue(user.language || "");
      setCityValue(user.city || "");
    }
  }, [user]);
  const handleInputChange = (field: string, value: any) => {
    setInfo((prev) => ({ ...prev, [field]: value }));
    setIsModified(true);
    setChangeFirst(true); 
  };
  const createPerson = async () => {
    if (local) {
      setLoading(true);
      const post = {
        phone: info.phone,
        first_name: info.first_name,
        last_name: info.last_name,
        language: info.language,
        city: info.city,
        contactName:info.contactName
      };
      try {
        const response = await axios.patch(
          `${url}/user/update-user-detail/`,
          post,
          {
            headers,
          }
        );
        setLoading(false);
        if (response.data.response === true) {
          setIsModified(false);
          Alert.alert("Успешно изменён!");
        } else {
          Alert.alert("Ошибка", "Не удалось сохранить изменения.");
        }
      } catch (error) {
        console.error("Error saving user details:", error);
        Alert.alert("Ошибка", "Не удалось сохранить изменения.");
        setLoading(false);
      }
    }
  };
  const loadDateFromStorage = async () => {
    try {
      const savedDate = await AsyncStorage.getItem("selectedDate");
      if (savedDate) {
        const date = new Date(savedDate);
        setSelectedDate(date);
      }
    } catch (error) {
      console.error("Error loading date:", error);
    }
  };

  useEffect(() => {
    loadDateFromStorage();
  }, []);
  return (
    <ButtonLayouts handle={createPerson} title={'Сохранить'} color={isModified ? colors.feuillet : colors.gray} loading={loading} disabled={!isModified}>
      <ScrollView showsHorizontalScrollIndicator={true} showsVerticalScrollIndicator={true} style={stylesAll.background_block}>
      <View style={[stylesAll.background_block, stylesAll.m_bottom ]}>
      <Header container={true} back={true}>Личные данные</Header>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={stylesAll.container}>
          <View
            style={[
              stylesAll.input_block_all,
              { marginTop: 0, marginBottom: 50 },
            ]}
          >
            <View style={styles.input_block}>
              <Text style={stylesAll.label}>Имя</Text>
              <TextInput
                style={[stylesAll.input, styles.input_box]}
                placeholder="Имя"
                value={info.first_name}
                onChangeText={(text) => handleInputChange("first_name", text)}
              />
            </View>
            <View style={styles.input_block}>
              <Text style={stylesAll.label}>Фамилия</Text>
              <TextInput
                style={[stylesAll.input, styles.input_box]}
                placeholder="Фамилия"
                value={info.last_name}
                onChangeText={(text) => handleInputChange("last_name", text)}
              />
            </View>
            <View style={styles.input_block}>
              <Text style={stylesAll.label}>Названия магазина</Text>
              <TextInput
                style={[stylesAll.input, styles.input_box]}
                placeholder="Названия магазина"
                value={info.contactName}
                onChangeText={(text) => handleInputChange("contactName", text)}
              />
            </View>
            <View style={styles.input_block}>
              <Text style={stylesAll.label}>Номер телефона</Text>
              <TextInput
                style={[stylesAll.input, styles.input_box]}
                value={info.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
                placeholder="Номер телефона"
                keyboardType="numeric"
                editable={false}
              />
            </View>
            <View style={styles.input_block}>
              <Text style={stylesAll.label}>Язык</Text>
              <Dropdown
                style={[stylesAll.input, styles.input_box]}
                placeholder="Выберите язык"
                data={language}
                labelField="label"
                valueField="value"
                value={languageValue}
                onChange={(item) => {
                  setLanguageValue(item.value);
                  handleInputChange("language", item.value);
                }}
              />
            </View>
            <View style={styles.input_block}>
              <Text style={stylesAll.label}>Город</Text>
              <Dropdown
                style={[stylesAll.input, styles.input_box]}
                placeholder="Выберите город"
                data={cities}
                labelField="label"
                valueField="value"
                value={cityValue}
                onChange={(item) => {
                  setCityValue(item.value);
                  handleInputChange("city", item.value);
                  setIsModified(true);
                }}
              />
            </View>
            {isModified && (
              <Text style={styles.saveReminder}>
                Есть несохраненные изменения
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
      </View>
      </ScrollView>
    </ButtonLayouts>

  );
};
const styles = StyleSheet.create({
  input_date: {
    position: "relative",
  },
  more_date: {
    width: 18,
    height: 18,
    position: "absolute",
    right: 10,
  },
  my_btn: {
    height: 45,
    backgroundColor: "#6B6B6B",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  switch_text: {
    fontSize: 16,
    fontWeight: "700",
    color: "#191919",
  },
  saveReminder: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  input_block: {
    flexDirection: "column",
  },
  input_box: {
    backgroundColor: colors.phon,
  },
  input_box_date: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date_picker: {
    height: 45,
    marginLeft: 0,
  },
  select_box: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 10,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#AAAAAA",
  },
  icon: {
    marginRight: 5,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default MyDetails;





