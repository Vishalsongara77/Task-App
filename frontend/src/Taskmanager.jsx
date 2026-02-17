import React, { useEffect, useState } from "react";
import { CreateTask, GetAllTasks, DeleteTask, UpdateTask } from "./api";

const Taskmanager = () => {
  const [tasks, setTasks] = useState([]);
  const [titleInput, setTitleInput] = useState("");
  const [detailInput, setDetailInput] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDetail, setEditDetail] = useState("");

  const fetchAllTasks = async () => {
    try {
      const data = await GetAllTasks();
      console.log("Fetched tasks:", data);
      const tasksArray = Array.isArray(data)
        ? data
        : data.tasks || data.data || [];
      setTasks(tasksArray);
    } catch (err) {
      console.log("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleAddTask = async () => {
    if (!titleInput.trim() || !detailInput.trim()) return;

    const obj = {
      taskTitle: titleInput,
      taskDetails: detailInput,
      isDone: false,
    };

    try {
      const data = await CreateTask(obj);
      console.log("Created task:", data);
      setTitleInput("");
      setDetailInput("");
      await fetchAllTasks();
    } catch (err) {
      console.log("Error creating task:", err);
    }
  };

  const toggleTask = async (task) => {
    const { _id, taskTitle, taskDetails, isDone } = task;
    const obj = {
      taskTitle,
      taskDetails,
      isDone: !isDone,
    };
    try {
      const data = await UpdateTask(_id, obj);
      console.log("Updated task:", data);
      await fetchAllTasks();
    } catch (err) {
      console.log("Error updating task:", err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const data = await DeleteTask(id);
      console.log("Deleted task:", data);
      await fetchAllTasks();
    } catch (err) {
      console.log("Error deleting task:", err);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setEditTitle(task.taskTitle);
    setEditDetail(task.taskDetails);
  };

  const handleUpdateTask = async () => {
    if (!editTitle.trim() || !editDetail.trim()) return;

    const obj = {
      taskTitle: editTitle,
      taskDetails: editDetail,
      isDone: editingTask.isDone,
    };

    try {
      const data = await UpdateTask(editingTask._id, obj);
      console.log("Updated task:", data);
      setEditingTask(null);
      setEditTitle("");
      setEditDetail("");
      await fetchAllTasks();
    } catch (err) {
      console.log("Error updating task:", err);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle("");
    setEditDetail("");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-center mb-8 text-5xl font-bold text-slate-800">
          Tasky
        </h1>

        <div className="space-y-3 mb-6">
          <input
            type="text"
            placeholder="Task Title"
            value={titleInput}
            onChange={(e) => {
              setTitleInput(e.target.value);
            }}
            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl 
                       focus:outline-none focus:border-blue-500 focus:ring-4 
                       focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
          />
          <textarea
            placeholder="Task Details"
            value={detailInput}
            onChange={(e) => {
              setDetailInput(e.target.value);
            }}
            rows="3"
            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl 
                       focus:outline-none focus:border-blue-500 focus:ring-4 
                       focus:ring-blue-500/20 transition-all placeholder:text-slate-400 resize-none"
          />
          <button
            onClick={handleAddTask}
            className="w-full px-6 py-3 rounded-xl font-bold text-lg transition-colors bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add Task
          </button>
        </div>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>No tasks yet</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 
                           transition-all ${
                             task.isDone
                               ? "bg-slate-50 border-slate-100"
                               : "bg-white border-slate-200 hover:border-blue-300"
                           }`}
              >
                <button
                  onClick={() => {
                    toggleTask(task);
                  }}
                  className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                             transition-colors ${
                               task.isDone
                                 ? "bg-blue-600 border-blue-600"
                                 : "border-slate-300 hover:border-blue-500"
                             }`}
                >
                  {task.isDone && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>

                {editingTask?._id === task._id ? (
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-blue-500 rounded-lg 
                                 focus:outline-none text-slate-700 bg-white font-semibold"
                      autoFocus
                    />
                    <textarea
                      value={editDetail}
                      onChange={(e) => {
                        setEditDetail(e.target.value);
                      }}
                      rows="3"
                      className="w-full px-3 py-2 border-2 border-blue-500 rounded-lg 
                                 focus:outline-none text-slate-700 bg-white resize-none text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateTask}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-green-600 text-white hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold text-lg truncate ${task.isDone ? "text-slate-400 line-through" : "text-slate-800"}`}
                      >
                        {task.taskTitle}
                      </h3>
                      <p
                        className={`text-sm mt-1 wrap-break-word ${task.isDone ? "text-slate-300 line-through" : "text-slate-500"}`}
                      >
                        {task.taskDetails}
                      </p>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => {
                          handleEditClick(task);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => {
                          handleDeleteTask(task._id);
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Taskmanager;
