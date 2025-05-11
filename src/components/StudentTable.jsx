// StudentTable.jsx
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./StudentTable.css";

export default function StudentTable({
  students,
  handleDelete,
  updateStudent,
  handleScan, // ✅ New prop
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);
  const [editedStudent, setEditedStudent] = useState({});
  const [studentList, setStudentList] = useState([]);

  // Sync and sort students
  useEffect(() => {
    const sorted = [...students].sort((a, b) =>
      a.registerNumber.localeCompare(b.registerNumber)
    );
    setStudentList(sorted);
  }, [students]);

  const filteredStudents = studentList.filter((student) => {
    const nameMatch = student.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const regMatch = student.registerNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || regMatch;
  });

  const handleEdit = (student) => {
    setEditId(student._id);
    setEditedStudent({ ...student });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (editId) {
      await updateStudent(editId, editedStudent);
      setEditId(null);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = [...studentList];
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setStudentList(reordered);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by Name or Register Number"
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="students">
          {(provided) => (
            <table
              className="student-table"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <thead>
                <tr>
                  <th>SI. No</th>
                  <th>Name</th>
                  <th>Register Number</th>
                  <th>Class/Year</th>
                  <th>Semester</th>
                  <th>Actions</th>
                  <th>Biometric</th> 
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <Draggable
                    key={student._id}
                    draggableId={student._id}
                    index={index}
                  >
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <td>{index + 1}</td>
                        {editId === student._id ? (
                          <>
                            <td>
                              <input
                                type="text"
                                name="name"
                                value={editedStudent.name}
                                onChange={handleChange}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="registerNumber"
                                value={editedStudent.registerNumber}
                                onChange={handleChange}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="classYear"
                                value={editedStudent.classYear}
                                onChange={handleChange}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="semester"
                                value={editedStudent.semester}
                                onChange={handleChange}
                              />
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{student.name}</td>
                            <td>{student.registerNumber}</td>
                            <td>{student.classYear}</td>
                            <td>{student.semester}</td>
                          </>
                        )}

                        <td>
                          {editId === student._id ? (
                            <button className="btn-save" onClick={handleSave}>
                              Save
                            </button>
                          ) : (
                            <button
                              className="btn-edit"
                              onClick={() => handleEdit(student)}
                            >
                              Edit
                            </button>
                          )}
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(student._id)}
                          >
                            Delete
                          </button>
                        </td>

                        <td>
                          <button
                            className="btn-scan"
                            onClick={() => handleScan(student._id)} // ✅ Handle scan
                          >
                            Scan
                          </button>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
