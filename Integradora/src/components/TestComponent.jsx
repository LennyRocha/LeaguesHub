import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const TestComponent = () => {
  const context = useContext(AuthContext);

  return <div>Revisa la consola</div>;
};

export default TestComponent;