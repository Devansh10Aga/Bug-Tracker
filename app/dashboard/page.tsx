"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Trash2, Clock, Edit2 } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Types
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'closed';
  assignee: string;
  dueDate: string;
  timeSpent: number;
  createdAt: string;
}

const defaultTask: Task = {
  id: '',
  title: '',
  description: '',
  priority: 'medium',
  status: 'open',
  assignee: '',
  dueDate: '',
  timeSpent: 0,
  createdAt: ''
};
interface TaskFormProps {
  task: Task;
  onSubmit: (task: Task) => void;
  buttonText: string;
}

const TaskForm = ({ task, onSubmit, buttonText }: TaskFormProps) => {
  const [formData, setFormData] = useState<Task>(task);
  const [date, setDate] = useState<Date | undefined>(
    formData.dueDate ? new Date(formData.dueDate) : undefined
  );
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const adjustedDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
      setFormData({
        ...formData,
        dueDate: adjustedDate.toISOString().split('T')[0]
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: Task['priority']) => setFormData({ ...formData, priority: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: Task['status']) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="assignee">Assignee</Label>
          <Input
            id="assignee"
            value={formData.assignee}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
          />
        </div>
        <div>
          <Label>Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Button onClick={() => onSubmit(formData)} className="w-full">
        <Plus className="w-4 h-4 mr-2" /> {buttonText}
      </Button>
    </div>
  );
};
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const TaskStats = ({ tasks }: { tasks: Task[] }) => {
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
      const statusMatch = statusFilter === 'all' || task.status === statusFilter;
      return priorityMatch && statusMatch;
    });
  }, [tasks, priorityFilter, statusFilter]);

  // Tasks by Due Date
  const tasksByDate = useMemo(() => {
    const dateMap: Record<string, number> = {};
    filteredTasks.forEach(task => {
      const date = new Date(task.dueDate).toLocaleDateString();
      dateMap[date] = (dateMap[date] || 0) + 1;
    });
    return Object.entries(dateMap).map(([date, count]) => ({
      date,
      tasks: count
    }));
  }, [filteredTasks]);

  // Tasks by Time Spent
  const timeSpentDistribution = useMemo(() => {
    const ranges = ['0-2h', '2-4h', '4-8h', '8-16h', '16h+'];
    const distribution = new Array(ranges.length).fill(0);
    
    filteredTasks.forEach(task => {
      const hours = task.timeSpent;
      if (hours <= 2) distribution[0]++;
      else if (hours <= 4) distribution[1]++;
      else if (hours <= 8) distribution[2]++;
      else if (hours <= 16) distribution[3]++;
      else distribution[4]++;
    });

    return ranges.map((range, index) => ({
      range,
      count: distribution[index]
    }));
  }, [filteredTasks]);

  // Tasks by Assignee
  const tasksByAssignee = useMemo(() => {
    const assigneeMap: Record<string, number> = {};
    filteredTasks.forEach(task => {
      assigneeMap[task.assignee] = (assigneeMap[task.assignee] || 0) + 1;
    });
    return Object.entries(assigneeMap).map(([assignee, count]) => ({
      assignee,
      count
    }));
  }, [filteredTasks]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select
          value={priorityFilter}
          onValueChange={setPriorityFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tasks by Due Date */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Due Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tasksByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="tasks" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Time Spent Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Time Spent Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeSpentDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tasks by Assignee */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Assignee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tasksByAssignee}
                    dataKey="count"
                    nameKey="assignee"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {tasksByAssignee.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// TaskFilters Component
const TaskFilters = ({
  filterStatus,
  filterPriority,
  onStatusChange,
  onPriorityChange
}: {
  filterStatus: string;
  filterPriority: string;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
}) => (
  <div className="flex space-x-4">
    <Select value={filterStatus} onValueChange={onStatusChange}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="open">Open</SelectItem>
        <SelectItem value="in-progress">In Progress</SelectItem>
        <SelectItem value="closed">Closed</SelectItem>
      </SelectContent>
    </Select>
    <Select value={filterPriority} onValueChange={onPriorityChange}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Priority</SelectItem>
        <SelectItem value="low">Low</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="high">High</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

// Main Component
const BugTrackerDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>(defaultTask);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isAddingTime, setIsAddingTime] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [timeToAdd, setTimeToAdd] = useState('0');
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [initialLoadingDone, setInitialLoadingDone] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem('bugTrackerTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    setInitialLoadingDone(true);
  }, []);

  useEffect(() => {
    if (!initialLoadingDone) {
      return;
    }
    localStorage.setItem('bugTrackerTasks', JSON.stringify(tasks));
  }, [tasks, initialLoadingDone]);

  const handleCreateTask = (taskData: Task) => {
    const task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, task]);
    setNewTask(defaultTask);
  };

  const handleUpdateTask = (taskData: Task) => {
    setTasks(tasks.map(task =>
      task.id === taskData.id ? taskData : task
    ));
    setIsEditing(false);
    setEditingTask(null);
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsEditing(true);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleAddTime = () => {
    setTasks(tasks.map(task =>
      task.id === selectedTaskId
        ? { ...task, timeSpent: task.timeSpent + parseInt(timeToAdd) }
        : task
    ));
    setIsAddingTime(false);
    setTimeToAdd('0');
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      const statusMatch = filterStatus === 'all' || task.status === filterStatus;
      const priorityMatch = filterPriority === 'all' || task.priority === filterPriority;
      return statusMatch && priorityMatch;
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <TaskStats tasks={tasks} />

      <Card>
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            task={newTask}
            onSubmit={handleCreateTask}
            buttonText="Create Task"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tasks</CardTitle>
          <TaskFilters
            filterStatus={filterStatus}
            filterPriority={filterPriority}
            onStatusChange={setFilterStatus}
            onPriorityChange={setFilterPriority}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Time Spent (hrs)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredTasks().map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                      }`}>
                      {task.priority}
                    </span>
                  </TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>{task.timeSpent}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(task)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setIsAddingTime(true);
                        }}
                      >
                        <Clock className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddingTime} onOpenChange={(open) => setIsAddingTime(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Time</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="number"
              placeholder="Hours"
              value={timeToAdd}
              onChange={(e) => setTimeToAdd(e.target.value)}
            />
            <Button onClick={handleAddTime}>Add Time</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditing} onOpenChange={(open) => {
        setIsEditing(open);
        if (!open) setEditingTask(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              task={editingTask}
              onSubmit={handleUpdateTask}
              buttonText="Update Task"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BugTrackerDashboard;