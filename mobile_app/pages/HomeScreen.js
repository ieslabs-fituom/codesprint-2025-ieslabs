import { View, ScrollView, Image, Text } from "react-native";
import React, { useState, useEffect } from "react";
import HomeHeader from "../components/HomeHeader";
import NormalHeader from "../components/NormalHeader";
import BottomNavigation from "../components/BottomNavigation";
import InsightCard from "../components/InsightCard";
import ExamsList from "../components/ExamsList";
import { ExamContext } from '../context/ExamContext';
import { Alert } from "react-native";

const HomeScreen = () => {
  const { selectedExam, setSelectedExam, setIndexNumber } = React.useContext(ExamContext);

  useEffect(() => {
    setIndexNumber('');
  }, [])

  useEffect(() => {
    if (selectedExam != null) {
      Alert.alert(
        "Exam Selected",
        selectedExam.title +
        " is selected and the attendance of students will be counted for that examination"
      );
    }
  }, [selectedExam]);

  return (
    <View className="flex-1">
      <HomeHeader />
      <ScrollView
        className="flex-1 bg-white py-4 mb-1 px-3"
        contentContainerClassName="justify-center items-center"
      >
        {selectedExam != null && (
          <InsightCard
            studentCount={selectedExam == null ? "-" : selectedExam.studentCount}
            selectedExam={selectedExam == null ? "-" : selectedExam.title}
          />
        )}
        <ExamsList setSelectedExam={(exam) => setSelectedExam(exam)} />
      </ScrollView>
      <BottomNavigation />
    </View>
  );
};

export default HomeScreen;
