import React, { useState } from "react";
import { Modal, Input, Typography, Flex, Switch, message, Button, Upload } from "antd";
import api from "../services/Api";
import { UploadOutlined } from "@ant-design/icons";
import "./modalCreate.css";

function ModalCreate({ isModalOpen, handleCreate, handleClose }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [endImg] = useState("./icone.jpg");

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await api.post("/upload-image", formData);

      if (response.status === 200) {
        return response.data;
      }
      return "";
    } catch (error) {
      return "";
    }
  };

  const createCourse = async (req, res) => {
    try {
      if (!name || !teacher || !category || !description) {
        messageApi.open({
          duration: 2,
          type: "warning",
          content: "Por favor, preencha todos os campos antes de criar o curso.",
        });
      }

      const returnImage = await uploadImage();
      console.log({ returnImage });
      const infoCourse = {
        name,
        teacher,
        category,
        description,
        active: true,
        image: returnImage.nomeArquivo,
      };

      const response = await api.post("/course", infoCourse);
      if (response.status === 200) {
        messageApi.open({
          duration: 2,
          type: "success",
          content: response.data.mensagem,
        });
        setName("");
        setTeacher("");
        setCategory("");
        setDescription("");
        handleCreate();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal open={isModalOpen} onOk={createCourse} onCancel={handleClose}>
        <Typography.Title level={3}>Criar Curso</Typography.Title>
        <Flex vertical gap={20}>
          <div>
            <Typography.Title level={5}>Curso</Typography.Title>
            <Input placeholder="Nome do Curso" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Typography.Title level={5}>Professor</Typography.Title>
            <Input placeholder="Nome do Professor" value={teacher} onChange={(e) => setTeacher(e.target.value)} />
          </div>
          <div>
            <Typography.Title level={5}>Categoria</Typography.Title>
            <Input placeholder="Categoria do Curso" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div>
            <Typography.Title level={5}>Descrição</Typography.Title>
            <Input placeholder="Descrição do Curso" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="btnUpload">
            <label htmlFor="image"> Click to Upload </label>
            <input type="file" id="image" name="image" onChange={(e) => setImage(e.target.files[0])} />
            {image ? (
              <img className="imgDefault" src={URL.createObjectURL(image)} alt="img" width="50" height="50" />
            ) : (
              <img className="imgDefault" src={endImg} alt="" width="50" height="50" />
            )}
          </div>
        </Flex>
      </Modal>
    </>
  );
}

export default ModalCreate;
