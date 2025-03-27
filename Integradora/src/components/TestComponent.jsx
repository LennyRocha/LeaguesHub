import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const TestComponent = () => {
  const context = useContext(AuthContext);

  useEffect(() => {
    console.log("Contexto recibido:", context);
    console.log(context.login)
  }, []);

  return <div>Revisa la consola</div>;
};

export default TestComponent;