import { useState, useMemo } from "react";
import type { Passenger } from '@model/Passenger';

export default function PassengerTable({ data }: { data: Passenger[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const [filterSex, setFilterSex] = useState<string>("");
  const [filterSurvived, setFilterSurvived] = useState<string>("");
  const [filterPclass, setFilterPclass] = useState<string>("");
  const [searchText, setSearchText] = useState("");


  const filteredData = useMemo(() => {
    return data.filter((p) => {
      if (filterSex && p.sex !== filterSex) return false;
      if (filterSurvived) {
        const survivedBool = filterSurvived === "yes" ? 1 : 0;
        if (p.survived !== survivedBool) return false;
      }
      if (filterPclass && p.pclass.toString() !== filterPclass) return false;
      if (searchText && !p.name.toLowerCase().includes(searchText.toLowerCase())) return false;
      return true;
    });
  }, [data, filterSex, filterSurvived, filterPclass, searchText]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const onFilterChange = () => setCurrentPage(1);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">รายชื่อผู้โดยสาร</h2>

      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input type="text" placeholder="ค้นหาชื่อ..." className="border rounded p-2 flex-grow min-w-[180px]" value={searchText}
          onChange={(e) => { setSearchText(e.target.value); onFilterChange(); }}
        />
        <select className="border rounded p-2" value={filterSex} onChange={(e) => { setFilterSex(e.target.value); onFilterChange(); }}>
          <option value="">เพศทั้งหมด</option>
          <option value="male">ชาย</option>
          <option value="female">หญิง</option>
        </select>
        <select
          className="border rounded p-2"
          value={filterSurvived}
          onChange={(e) => { setFilterSurvived(e.target.value); onFilterChange(); }}>
          <option value="">ทั้งหมด (รอด/ไม่รอด)</option>
          <option value="yes">รอด</option>
          <option value="no">ไม่รอด</option>
        </select>
        <select
          className="border rounded p-2"
          value={filterPclass}
          onChange={(e) => { setFilterPclass(e.target.value); onFilterChange(); }}>
          <option value="">ชั้นทั้งหมด</option>
          <option value="1">ชั้น 1</option>
          <option value="2">ชั้น 2</option>
          <option value="3">ชั้น 3</option>
        </select>
      </div>

      <table className="min-w-full text-sm text-left border border-gray-200">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-3 py-2">ชื่อ</th>
            <th className="px-3 py-2">ชั้นโดยสาร</th>
            <th className="px-3 py-2">รอดชีวิต</th>
            <th className="px-3 py-2">เพศ</th>
            <th className="px-3 py-2">อายุ</th>
            <th className="px-3 py-2">ค่าโดยสาร</th>
            <th className="px-3 py-2">ท่าเรือ</th>
            <th className="px-3 py-2">ห้องพัก</th>
            <th className="px-3 py-2">จุดหมาย</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {currentData.map((passenger, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-3 py-2">{passenger.name}</td>
              <td className="px-3 py-2">{passenger.pclass}</td>
              <td className="px-3 py-2">
                {passenger.survived === 1 ? (
                  <span className="text-green-600 font-medium">รอด</span>
                ) : (
                  <span className="text-red-600 font-medium">ไม่รอด</span>
                )}
              </td>
              <td className="px-3 py-2 capitalize">
                {passenger.sex === "male" ? (
                  <span className="text-blue-600">ชาย</span>
                ) : (
                  <span className="text-pink-600">หญิง</span>
                )}
              </td>
              <td className="px-3 py-2">{passenger.age ?? '-'}</td>
              <td className="px-3 py-2">{passenger.fare != null ? passenger.fare.toFixed(2) : '-'}</td>
              <td className="px-3 py-2">{passenger.embarked}</td>
              <td className="px-3 py-2">{passenger.cabin || "-"}</td>
              <td className="px-3 py-2">{passenger["home.dest"] || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 cursor-pointer rounded disabled:opacity-50">
          ก่อนหน้า
        </button>
        <span>
          หน้า {currentPage} จาก {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 cursor-pointer rounded disabled:opacity-50">
          ถัดไป
        </button>
      </div>
    </div>
  );
}
