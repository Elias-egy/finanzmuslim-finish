import { Navigate } from "react-router-dom";

/** /tools bleibt als alte URL bestehen und leitet dauerhaft auf /rechner. */
const Tools = () => <Navigate to="/rechner" replace />;

export default Tools;
