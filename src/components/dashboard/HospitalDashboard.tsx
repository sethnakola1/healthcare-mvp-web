
export {}
// // src/components/dashboard/HospitalAdminDashboard.tsx
// import React from 'react';
// import { Users, Calendar, Activity, FileText } from 'lucide-react';
// import { useAuth } from '../../hooks/useAuth';

// export const HospitalAdminDashboard: React.FC = () => {
//   const { user } = useAuth();

//   const stats = [
//     { title: 'Total Staff', value: 45, icon: Users, color: 'bg-blue-500' },
//     { title: 'Today\'s Appointments', value: 23, icon: Calendar, color: 'bg-green-500' },
//     { title: 'Active Patients', value: 156, icon: Activity, color: 'bg-yellow-500' },
//     { title: 'Pending Reports', value: 8, icon: FileText, color: 'bg-red-500' },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-white shadow">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//           <h1 className="text-3xl font-bold text-gray-900">Hospital Admin Dashboard</h1>
//           <p className="mt-1 text-sm text-gray-500">
//             Welcome back, {user?.firstName} {user?.lastName}
//           </p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
//           {stats.map((stat, index) => (
//             <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
//               <div className="p-5">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div className={`${stat.color} p-3 rounded-md`}>
//                       <stat.icon className="h-6 w-6 text-white" />
//                     </div>
//                   </div>
//                   <div className="ml-5 w-0 flex-1">
//                     <dl>
//                       <dt className="text-sm font-medium text-gray-500 truncate">
//                         {stat.title}
//                       </dt>
//                       <dd className="text-lg font-medium text-gray-900">
//                         {stat.value}
//                       </dd>
//                     </dl>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HospitalAdminDashboard;