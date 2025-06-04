"use client";

import { FaCalendarDays } from "react-icons/fa6";
import { FiEdit3, FiPlus } from "react-icons/fi";

const EmployeeDashboard = ({ params }) => {
  const { id } = params();
  const [activeTab, setActiveTab] = useState("Detail");

  const tabs = [
    "Employment",
    "Detail",
    "Document",
    "Payroll",
    "Timeoff",
    "Reviews",
    "Settings",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-yellow-500 text-yellow-600 bg-yellow-50"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Basic Information
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Preferred Name :
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    Maria
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">First Name :</span>
                  <span className="text-sm font-medium text-gray-800">
                    Maria
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Name :</span>
                  <span className="text-sm font-medium text-gray-800">
                    Cotton
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Nationality :</span>
                  <span className="text-sm font-medium text-gray-800">
                    American
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Date of Birth :</span>
                  <span className="text-sm font-medium text-gray-800">
                    05 May 1990
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Gender :</span>
                  <span className="text-sm font-medium text-gray-800">
                    Female
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Blood Group :</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">
                      A+
                    </span>
                    <div className="flex gap-1">
                      <button className="w-6 h-6 bg-purple-600 text-white rounded flex items-center justify-center text-xs">
                        <FiPlus />
                      </button>
                      <button className="w-6 h-6 bg-purple-600 text-white rounded flex items-center justify-center text-xs">
                        <FiEdit3 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Contact
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Phone Number :</span>
                  <span className="text-sm font-medium text-gray-800">
                    987654321
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Personal Email :
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    mariacotton@example.com
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Secondary Number :
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    987654321
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Web Site :</span>
                  <span className="text-sm font-medium text-gray-800">
                    www.focustechnology.com
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Linkedin :</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">
                      #mariacotton
                    </span>
                    <div className="flex gap-1">
                      <button className="w-6 h-6 bg-purple-600 text-white rounded flex items-center justify-center text-xs">
                        <FiPlus />
                      </button>
                      <button className="w-6 h-6 bg-purple-600 text-white rounded flex items-center justify-center text-xs">
                        <FiEdit3 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Dates</h3>
                <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
                  New Type
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Start Date :</span>
                  <span className="text-sm font-medium text-gray-800">
                    06 Jun 2017
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Visa Expiry Date :
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">
                      06 Jun 2020
                    </span>
                    <button className="w-6 h-6 bg-purple-600 text-white rounded flex items-center justify-center text-xs">
                      <FiEdit3 />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Dates
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <span className="text-sm text-gray-600">
                      Add Start Date
                    </span>
                    <button className="w-8 h-8 bg-purple-600 text-white rounded flex items-center justify-center">
                      <FaCalendarDays className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <span className="text-sm text-gray-600">
                      Add Visa Expiry Date
                    </span>
                    <button className="w-8 h-8 bg-purple-600 text-white rounded flex items-center justify-center">
                      <FaCalendarDays className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button className="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                  Add A Key Date
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
