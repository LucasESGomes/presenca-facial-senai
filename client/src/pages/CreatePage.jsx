import ClassForm from "../components/forms/ClassForm";
import StudentForm from "../components/forms/StudentForm";
import TeacherForm from "../components/forms/TeacherForm";
import Layout from "../components/layout/Layout";

import { useLocation } from "react-router-dom";

export default function CreatePage() {
  const { pathname } = useLocation();

  const type = pathname.split("/")[1];

  function renderForm() {
    switch (type) {
      case "classes":
        return <ClassForm />;
      case "students":
        return <StudentForm />;
      case "teachers":
        return <TeacherForm />;
      default:
        return <div>Tipo inválido</div>;
    }
  }

  return (
    <Layout>
      <div>{renderForm()}</div>
    </Layout>
  );
}
