import { useEffect, useState } from "react";
import StatCard from '@components/StatCard';
import CommentsSection from '@components/Comment';
import PassengerInfoTable from '@components/Table';
import type { Passenger, StatsModel, ChartData, CommentModel } from '@model/Passenger';
import {
    getTitanicData,
    getPassengerStats,
    getClassCount,
    getSexCountBySurvived,
    getAverageAgeByClass,
} from "../helpers/utils";
// db
import { db } from '../../firebase';
import { collection, getDocs, orderBy, query } from "firebase/firestore";


// chart
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    ArcElement,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement);

export default function Dashboard() {
    const [stats, setStats] = useState<StatsModel>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [passengers, setPassengers] = useState<Passenger[]>([]);
    const [averageAgeData, setAverageAgeData] = useState<ChartData | null>(null);
    const [comments, setComments] = useState<{
        classCount: CommentModel[];
        survived: CommentModel[];
        age: CommentModel[];
    }>({
        classCount: [],
        survived: [],
        age: [],
    });
    const addComment = (type: keyof typeof comments, newComment: CommentModel) => {
        setComments(prev => ({
            ...prev,
            [type]: [...prev[type], newComment],
        }));
    };
    const loadComments = async () => {
        const q = query(collection(db, "comments"), orderBy("createdAt", "asc"));

        const snapshot = await getDocs(q);
        const grouped = {
            classCount: [] as CommentModel[],
            survived: [] as CommentModel[],
            age: [] as CommentModel[],
        };

        snapshot.forEach((doc) => {
            const data = doc.data();
            const type = data.type as keyof typeof grouped;

            if (grouped[type]) {
                grouped[type].push({
                    id: doc.id,
                    text: data.text,
                    type: data.type,
                    createdAt: data.createdAt,
                });
            }
        });

        setComments(grouped);
    };

    useEffect(() => {
        getTitanicData() // get data from csv
            .then((data: Passenger[]) => {
                setPassengers(data);
                setStats({
                    ...getPassengerStats(data),
                    sexCount: getSexCountBySurvived(data),
                    classCount: getClassCount(data),
                });

                setAverageAgeData(getAverageAgeByClass(data));
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
        loadComments(); // load comment
    }, []);


    if (loading) return <p className="p-6">กำลังโหลดข้อมูล...</p>;
    if (error) return <p className="p-6 text-red-600">เกิดข้อผิดพลาด: {error}</p>;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="ผู้โดยสารทั้งหมด" type="number" value={stats!.total} />
                <StatCard title="ผู้รอดชีวิต" type="number" value={stats!.survivors} />
                <StatCard title="ผู้เสียชีวิต" type="number" value={stats!.deaths} />
                <StatCard title="อัตราการรอดชีวิต" type="percentage" value={stats!.survivalRate} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white rounded-lg shadow p-6 flex flex-col" >
                    <h2 className="text-xl font-semibold mb-4">จำนวนผู้โดยสารของแต่ละคลาส</h2>
                    <div className="flex-grow" style={{ height: '400px' }}>
                        <Bar
                            data={{
                                labels: ['ชั้น 1', 'ชั้น 2', 'ชั้น 3'],
                                datasets: [
                                    {
                                        label: 'จำนวนผู้โดยสาร',
                                        data: [stats?.classCount[1], stats?.classCount[2], stats?.classCount[3]],
                                        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                plugins: { legend: { display: false } },
                                maintainAspectRatio: false,
                            }}
                        />
                    </div>
                    <CommentsSection
                        comments={comments.classCount}
                        commentType="classCount"
                        onCommentAdded={(comment) => addComment("classCount", comment)}
                        onCommentDeleted={(id) =>
                            setComments((prev) => ({
                                ...prev,
                                classCount: prev.classCount.filter((c) => c.id !== id),
                            }))
                        }
                        onCommentUpdated={(updatedComment) =>
                            setComments((prev) => ({
                                ...prev,
                                classCount: prev.classCount.map((c) => c.id === updatedComment.id ? { ...c, text: updatedComment.text } : c),
                            }))
                        }
                    />


                </div>

                <div className="bg-white rounded-lg shadow p-6 flex flex-col">
                    <h2 className="text-xl font-semibold mb-4">ผู้รอดชีวิต</h2>
                    <div className="flex-grow" style={{ height: '400px' }}>
                        <Pie
                            data={{
                                labels: ['ชาย', 'หญิง'],
                                datasets: [
                                    {
                                        data: [stats?.sexCount.survived.male, stats?.sexCount.survived.female],
                                        backgroundColor: ['#60A5FA', '#F472B6'],
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                plugins: { legend: { display: true } },
                                maintainAspectRatio: false,
                            }}
                        />
                    </div>
                    <CommentsSection
                        comments={comments.survived}
                        commentType={'survived'}
                        onCommentAdded={(comment) => addComment("survived", comment)}
                        onCommentDeleted={(id) => setComments((prev) => ({
                            ...prev,
                            survived: prev.survived.filter((c) => c.id !== id),
                        }))}
                        onCommentUpdated={(updatedComment) =>
                            setComments((prev) => ({
                                ...prev,
                                survived: prev.survived.map((c) => c.id === updatedComment.id ? { ...c, text: updatedComment.text } : c),
                            }))
                        }
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6" style={{ height: '400px' }}>
                <h2 className="text-xl font-semibold mb-4">อายุเฉลี่ยของแต่ละคลาส</h2>
                {averageAgeData && (
                    <Bar
                        data={averageAgeData}
                        options={{
                            responsive: true,
                            plugins: { legend: { display: false } },
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'อายุ (ปี)',
                                    },
                                },
                            },
                        }}
                    />
                )}

            </div>
            <CommentsSection
                comments={comments.age}
                commentType={'age'}
                onCommentAdded={(comment) => addComment("age", comment)}
                onCommentDeleted={(id) => setComments((prev) => ({
                    ...prev,
                    age: prev.age.filter((c) => c.id !== id),
                }))}
                onCommentUpdated={(updatedComment) =>
                    setComments((prev) => ({
                        ...prev,
                        age: prev.age.map((c) => c.id === updatedComment.id ? { ...c, text: updatedComment.text } : c),
                    }))
                }
            />
            <PassengerInfoTable data={passengers} />


        </div>
    );
}
