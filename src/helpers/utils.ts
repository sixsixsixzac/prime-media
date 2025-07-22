import Papa from "papaparse";
import type { Passenger } from '@model/Passenger';

export const parseCSV = (csvText: any) => {
    const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
    });

    return parsed.data;
};


export const getTitanicData = async () => {
    try {
        const response = await fetch("/data/TitanicDataset.csv");
        if (!response.ok) {
            throw new Error("Failed to get CSV file");
        }

        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error("Error loading Titanic data:", error);
        throw error;
    }
};

export const getPassengerStats = (data: Passenger[]) => {
    const totalPassengers = data.length;
    const survivors = data.filter((p) => {

        return p.survived == 1;
    }).length;
    const survivalRate = (survivors / totalPassengers);

    return {
        total: totalPassengers,
        survivors,
        deaths: totalPassengers - survivors,
        survivalRate: survivalRate,
    };
};

export const getClassCount = (data: Passenger[]) => {
    const classCounts = {
        1: data.filter(p => p.pclass === 1).length,
        2: data.filter(p => p.pclass === 2).length,
        3: data.filter(p => p.pclass === 3).length,
    };
    return classCounts
}

export const getSexCountBySurvived = (data: Passenger[]) => {
    const survivedMale = data.filter(p => p.sex === 'male' && p.survived === 1).length;
    const survivedFemale = data.filter(p => p.sex === 'female' && p.survived === 1).length;
    const notSurvivedMale = data.filter(p => p.sex === 'male' && p.survived === 0).length;
    const notSurvivedFemale = data.filter(p => p.sex === 'female' && p.survived === 0).length;

    return {
        survived: { male: survivedMale, female: survivedFemale },
        notSurvived: { male: notSurvivedMale, female: notSurvivedFemale },
    };
};

export const getAverageAgeByClass = (data: Passenger[]) => {


    const validData = data.filter(p => typeof p.age === 'number' && !isNaN(p.age));

    const classAges = [1, 2, 3].map(cls => {
        const ages: number[] = validData.filter(p => p.pclass === cls && p.age !== null).map(p => p.age as number);
        if (ages.length === 0) return 0;
        return ages.reduce((sum, age) => sum + age, 0) / ages.length;
    });

    return {
        labels: ['ชั้น 1', 'ชั้น 2', 'ชั้น 3'],
        datasets: [
            {
                label: 'อายุเฉลี่ย',
                data: classAges,
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
            },
        ],
    };
};
