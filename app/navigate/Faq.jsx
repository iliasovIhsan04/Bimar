import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Loading from "@/assets/ui/Loading";
import { url } from "@/Api";
import Header from "../../components/Main/HeaderAll";
import { stylesAll } from "../../style";
import Wave from "../../assets/styles/components/Wave";
import TextContent from "@/assets/styles/components/TextContent";
import Flex from "../../assets/styles/components/Flex";
import { colors } from "../../assets/styles/components/colors";

const Faq = () => {
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const fetchFaq = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${url}/category/FAQ/`, {
          timeout: 10000,
        });
        setFaqData(response.data);
      } catch (error) {
        setError("Failed to load FAQ data");
      } finally {
        setLoading(false);
      }
    };
    fetchFaq();
  }, []);

  const toggleItem = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <Header back={true} container={true}>
        Часто задаваемые вопросы
      </Header>
      <ScrollView style={[stylesAll.container, stylesAll.background_block]}>
        <TextContent top={20} fontSize={20} color={colors.black} fontWeight={700}>
          Возникли вопросы?
        </TextContent>
        <TextContent top={10} fontSize={16} color={colors.faq_gray}>
          Мы ввсегда рады вашим вопросам и открыты проконсультировать Вас в
          любое время либо ниже найдете ответы на Ваши часто задаваемые вопросы:
        </TextContent>
        {faqData.length > 0 ? (
          faqData.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <Wave
                style={styles.questionContainer}
                handle={() => toggleItem(index)}
              >
                <Flex>
                  <Text style={styles.faqText}>{item.question}</Text>
                  <Text style={styles.toggleIcon}>
                    {expandedItems[index] ? "−" : "+"}
                  </Text>
                </Flex>
              </Wave>
              {expandedItems[index] && (
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No FAQ</Text>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 20,
  },
  faqText: {
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  toggleIcon: {
    fontSize: 24,
    fontWeight: "700",
    width: 30,
    textAlign: "right",
  },
  faqAnswer: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: colors.feuillet,
    fontSize: 16,
  },
  noData: {
    fontSize: 16,
    textAlign: "center",
    padding: 16,
  },
});

export default Faq;
