import { View, TouchableOpacity, Image, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { COLORS } from "../assets/colors/colors";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import ListCard from "./ListCard";
import { ExamContext } from "../context/ExamContext";

const ExamsList = ({ setSelectedExam }) => {
  const { exams } = React.useContext(ExamContext);

  const handleExamSelect = (exam) => {
    setSelectedExam(exam);
  };

  return (
    <View className="px-2 mb-12">
      <Text className="mt-4 text-xl font-bold text-blue">Exams List</Text>
      {exams.map((exam) => (
        <ListCard
          key={exam.id}
          leftIcon={"book"}
          rightIcon={"chevron-right"}
          title={exam.title}
          subtitile={"Exam Date : " + exam.date}
          onClick={() => handleExamSelect(exam)}
        />
      ))}
    </View>
  );
};

export default ExamsList;
