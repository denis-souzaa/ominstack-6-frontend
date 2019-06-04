import React, { useState } from 'react';
import { Container } from './styles';
import logo from '../../assets/logo.svg';

import api from '~/services/api';

export default function Main() {
  const [state, setState] = useState({
    newBox: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await api.post('boxes', {
      title: state.newBox,
    });
  };

  const handleInputChange = (e) => {
    setState({ newBox: e.target.value });
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="logo" />
        <input placeholder="Criar um box" value={state.newBox} onChange={handleInputChange} />
        <button type="submit">Criar</button>
      </form>
    </Container>
  );
}
