'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  assignedTo: {
    memberId: string;
    name: string;
  };
}

interface TaskPieChartProps {
  tasks: Task[];
  memberColors: { [key: string]: string };
}

export default function TaskPieChart({ tasks, memberColors }: TaskPieChartProps) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#272F31] rounded-lg">
        <p className="text-gray-400 text-lg">No tasks created yet</p>
      </div>
    );
  }

  // Group tasks by member
  const tasksByMember = tasks.reduce((acc, task) => {
    const memberId = task.assignedTo.memberId;
    if (!acc[memberId]) {
      acc[memberId] = {
        name: task.assignedTo.name,
        total: 0,
        completed: 0,
        incomplete: 0
      };
    }
    acc[memberId].total++;
    if (task.completed) {
      acc[memberId].completed++;
    } else {
      acc[memberId].incomplete++;
    }
    return acc;
  }, {} as { [key: string]: { name: string; total: number; completed: number; incomplete: number } });

  // Prepare data for the pie chart
  const data = {
    labels: Object.entries(tasksByMember).map(([_, data]) => data.name),
    datasets: [
      {
        label: 'Completed Tasks',
        data: Object.values(tasksByMember).map(data => data.completed),
        backgroundColor: Object.keys(tasksByMember).map(memberId => 
          memberColors[memberId].replace('0.5', '0.8') // Darker shade for completed tasks
        ),
        borderColor: Object.keys(tasksByMember).map(memberId => 
          memberColors[memberId].replace('0.5', '1') // Solid border
        ),
        borderWidth: 1,
      },
      {
        label: 'Incomplete Tasks',
        data: Object.values(tasksByMember).map(data => data.incomplete),
        backgroundColor: Object.keys(tasksByMember).map(memberId => 
          memberColors[memberId].replace('0.5', '0.3') // Lighter shade for incomplete tasks
        ),
        borderColor: Object.keys(tasksByMember).map(memberId => 
          memberColors[memberId].replace('0.5', '1') // Solid border
        ),
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#9CA3AF',
          padding: 20,
          font: {
            size: 12
          }
        }
      }
    },
    cutout: '60%'
  };

  return (
    <div className="h-64">
      <Pie data={data} options={options} />
    </div>
  );
} 