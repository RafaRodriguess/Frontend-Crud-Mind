import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { Button, Switch, Input, message } from "antd";
import { onSearch } from "@ant-design/icons";
import ModalCreate from "../../components/modalCreate";
import ModalEdit from "../../components/modalEdit";
import api from "../../services/Api";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import { EditOutlined, DeleteOutlined, LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import { Table } from "antd";
const { Search } = Input;

function CourseTable() {
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState({});
  const [courses, setCourses] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getAllCourses();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredCourses = courses.filter((course) => course.name.toLowerCase().includes(searchText.toLowerCase()));

  const getAllCourses = async (req, res) => {
    try {
      const response = await api.get("/course");
      setCourses(response.data.courses);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCourse = async (id) => {
    const confirmacao = window.confirm("Deseja realmente excluir este curso?");
    if (confirmacao) {
      const response = await api.delete(`/course/${id}`);
      if (response.status === 200) {
        messageApi.open({
          duration: 2,
          type: "success",
          content: response.data.mensagem,
        });
        getAllCourses();
      }
    }
  };

  const showModalEdit = (course) => {
    setSelectedCourse(course);
    setIsModalOpenEdit(true);
  };

  const handleEdit = () => {
    getAllCourses();
    setIsModalOpenEdit(false);
  };

  const handleCloseEdit = () => {
    setSelectedCourse({});
    setIsModalOpenEdit(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setIsModalOpen(false);
    getAllCourses();
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "20%",
    },
    {
      title: "Nome do Curso",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Professor",
      dataIndex: "teacher",
      key: "teacher",
      width: "20%",
    },
    {
      title: "Categoria",
      dataIndex: "category",
      key: "category",
      width: "20%",
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      width: "20%",
      render: (text) => (text?.length > 10 ? `${text.substring(0, 15)}...` : text),
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      width: "20%",
      render: (active) => (active ? "Ativo" : "Inativo"),
    },
    {
      title: "Imagem",
      dataIndex: "image",
      key: "image",
      width: "20%",
      render: (image) => (
        <img
          src={`http://localhost:5000/files/users/${image}`}
          alt="Imagem do Curso"
          style={{ maxWidth: "100px", maxHeight: "100px" }}
        />
      ),
    },
    {
      title: "Ações",
      key: "actions",
      width: "20%",
      render: (text, record) => (
        <span>
          <Button onClick={() => showModalEdit(record)} type="primary" icon={<EditOutlined />} />
          <Button onClick={() => deleteCourse(record.id)} type="primary " danger icon={<DeleteOutlined />} />
        </span>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <ModalEdit
        isModalOpenEdit={isModalOpenEdit}
        handleEdit={handleEdit}
        handleCloseEdit={handleCloseEdit}
        selectedCourse={selectedCourse}
      />

      <ModalCreate isModalOpen={isModalOpen} handleCreate={handleCreate} handleClose={handleClose} />
      <div className="dashboard">
        <div className="btnExit">
          <Button onClick={handleLogout} icon={<LogoutOutlined />} type="primary">
            Sair
          </Button>
        </div>
        <div className="inputSearch">
          <Input.Search onChange={(e) => setSearchText(e.target.value)} width="20px" placeholder="Procure um curso " />
        </div>
        <div className="btnCreate">
          <Button onClick={showModal} className="btnCriarCurso" type="primary" icon={<PlusOutlined />}>
            Criar Curso
          </Button>
        </div>
        <Table
          rowKey="id"
          responsive
          pagination={{ pageSize: 5, className: "pagination" }}
          tableLayout="auto"
          className="tableDashboard"
          dataSource={filteredCourses}
          columns={columns}
        />
      </div>
    </>
  );
}

export default CourseTable;
