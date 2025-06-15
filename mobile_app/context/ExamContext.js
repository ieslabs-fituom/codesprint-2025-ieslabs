import React, { createContext, useState, useEffect } from "react";

const ExamContext = createContext();

const ExamContextProvider = ({ children }) => {
    const [exams, setExams] = useState([
        {
            id: 1,
            title: "IN24015-01",
            date: "2024-01-01",
            studentCount: 101
        },
        {
            id: 2,
            title: "IN24015-02",
            date: "2024-01-01",
            studentCount: 102
        },
        {
            id: 3,
            title: "IN24015-03",
            date: "2024-01-01",
            studentCount: 103
        },
        {
            id: 4,
            title: "IN24015-04",
            date: "2024-01-01",
            studentCount: 104
        },
        {
            id: 5,
            title: "IN24015-05",
            date: "2024-01-01",
            studentCount: 105
        },
    ]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [indexNumber, setIndexNumber] = useState('');

    const fetchExams = async () => {

    }

    return (
        <ExamContext.Provider
            value={{
                setSelectedExam,
                selectedExam,
                exams,
                indexNumber,
                setIndexNumber
            }}>
            {children}
        </ExamContext.Provider>
    )
}

export { ExamContext, ExamContextProvider }