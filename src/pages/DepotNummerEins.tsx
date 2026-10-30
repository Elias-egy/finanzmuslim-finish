import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { depotNummerEinsZiel } from "@/lib/depotNummerEins";

/** /depot-nummer-1: leitet auf die aktuelle Nummer 1 des Depot-Vergleichs weiter (siehe depotNummerEinsZiel). */
const DepotNummerEins = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(depotNummerEinsZiel(search), { replace: true });
  }, [search, navigate]);

  return <div className="min-h-[50vh] bg-background" aria-hidden />;
};

export default DepotNummerEins;
