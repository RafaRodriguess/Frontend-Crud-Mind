import { React, useEffect, useState } from "react";
import { Modal, Input, Typography, Flex, Switch, message, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

import api from "../services/Api";

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

function ModalEdit({ isModalOpenEdit, handleEdit, handleCloseEdit, selectedCourse }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const handleChange = (info) => {
    console.log(info);
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
    setImage(info.fileList[0].originFileObj);
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const [courseData, setCourseData] = useState({
    name: selectedCourse?.name || "",
    teacher: selectedCourse?.teacher || "",
    category: selectedCourse?.category || "",
    description: selectedCourse?.description || "",
    active: selectedCourse?.active || false,
    image: selectedCourse?.image || null,
  });

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append("image", image);

      console.log(formData, image);
      const response = await api.post("/upload-image", formData);

      if (response.status === 200) {
        return response.data;
      }
      return "";
    } catch (error) {
      return "";
    }
  };

  const onChange = (checked) => {
    setCourseData({ ...courseData, active: checked });
    console.log(`switch to ${checked}`);
  };

  useEffect(() => {
    setCourseData({
      name: selectedCourse.name,
      teacher: selectedCourse.teacher,
      category: selectedCourse.category,
      description: selectedCourse.description,
      active: selectedCourse.active,
      image: selectedCourse.image,
    });
  }, [selectedCourse]);

  const editCourse = async () => {
    try {
      const returnImage = await uploadImage();

      const updatedCourseData = {
        name: courseData.name,
        teacher: courseData.teacher,
        category: courseData.category,
        description: courseData.description,
        active: courseData.active,
        image: returnImage.nomeArquivo,
      };

      const response = await api.put(`/course/${selectedCourse.id}`, updatedCourseData);

      if (response.status === 200) {
        messageApi.open({
          duration: 2,
          type: "success",
          content: response.data.mensagem,
        });
      }
      handleEdit();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {contextHolder}
      <Modal destroyOnClose open={isModalOpenEdit} onOk={editCourse} onCancel={handleCloseEdit}>
        <Typography.Title level={3}>Editar Curso</Typography.Title>
        <Flex vertical gap={20}>
          <div>
            <Typography.Title level={5}>Curso</Typography.Title>
            <Input
              onChange={(e) => setCourseData({ ...courseData, name: e.target.value })}
              defaultValue={courseData.name}
              placeholder="Nome do Curso"
            />
          </div>
          <div>
            <Typography.Title level={5}>Professor</Typography.Title>
            <Input
              onChange={(e) => setCourseData({ ...courseData, teacher: e.target.value })}
              defaultValue={courseData.teacher}
              placeholder="Nome do Professor"
            />
          </div>
          <div>
            <Typography.Title level={5}>Categoria</Typography.Title>
            <Input
              onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
              defaultValue={courseData?.category}
              placeholder="Categoria do Curso"
            />
          </div>
          <div>
            <Typography.Title level={5}>Descrição</Typography.Title>
            <Input
              onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
              defaultValue={courseData?.description}
              placeholder="Descrição do Curso"
            />
          </div>
          <div>
            <Upload
              beforeUpload={beforeUpload}
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              onChange={handleChange}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{
                    width: "100%",
                  }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </div>
          <div>
            <Typography.Title level={5}>Status do Curso</Typography.Title>
            <Switch defaultChecked={courseData?.active} onChange={onChange} />
          </div>
        </Flex>
      </Modal>
    </>
  );
}

export default ModalEdit;
