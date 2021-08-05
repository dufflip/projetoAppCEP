import React, { useState, useEffect } from "react";
import axios from "axios";

import isValidCep from "@brazilian-utils/is-valid-cep";

// import Search from "./components/Search";

const App = () => {
  // const [searchTerm, setSearchTerm] = useState("");

  const [isLoading, updateIsLoading] = useState(false);
  const [error, updateError] = useState("");

  const [state, setState] = useState({
    cep: "",
    logradouro: "",
    bairro: "",
    localidade: "",
    estado: "",
    loading: false,
  });

  const updateState = (updates) =>
    setState((state) => ({ ...state, ...updates }));

  const updateField = (e) => updateState({ [e.target.name]: e.target.value });

  useEffect(() => {
    if (isValidCep(state.cep)) {
      axios
        .get(`https://viacep.com.br/ws/${state.cep}/json/`)
        .then((resp) => {
          updateState(resp.data);
          updateIsLoading(false);
          console.log(resp.data);
          if (resp.data.erro) {
            return updateState({
              cep: "Local nao consta no banco de dados",
              logradouro: "Local nao consta no banco de dados",
              bairro: "Local nao consta no banco de dados",
              localidade: "Local nao consta no banco de dados",
              uf: "Local nao consta no banco de dados",
            });
          }
        })
        .catch((error) => {
          updateError(error.message);
          updateIsLoading(false);
          setState((state) => ({ ...state, loading: false, error }));
        });
    }
  }, [state.cep]);

  if (isLoading) {
    return <h1>Buscando os datos da localizacao...</h1>;
  }

  return (
    <>
      <label> Pesquisar CEP: </label>
      <input
        type="text"
        name="cep"
        placeholder="CEP"
        value={state.cep}
        disabled={state.loading}
        onChange={updateField}
      />
      <label> Logradouro: </label>
      <input
        type="text"
        name="logradouro"
        placeholder="Logradouro"
        value={state.logradouro}
        disabled={state.loading}
        onChange={updateField}
      />
      <label> Bairro: </label>
      <input
        type="text"
        name="bairro"
        placeholder="Bairro"
        value={state.bairro}
        disabled={state.loading}
        onChange={updateField}
      />
      <label> Local: </label>
      <input
        type="text"
        name="localidade"
        placeholder="Local"
        value={state.localidade}
        disabled={state.loading}
        onChange={updateField}
      />
      <label> Estado: </label>
      <input
        type="text"
        name="uf"
        placeholder="Estado"
        value={state.uf}
        disabled={state.loading}
        onChange={updateField}
      />
    </>
  );
};

export default App;
