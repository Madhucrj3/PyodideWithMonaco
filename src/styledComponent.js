import styled from "styled-components";
export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;

  background-color: rgb(0 0 0 / 88%);
`;
export const PyodideButton = styled.button`
  margin: 0.5rem 0.3rem;
  width: 100px;
  background-color: #8887ef;
  color: #fff;
  cursor: pointer;
  align-self: flex-end;
`;
export const PyodideInput = styled.textarea`
  background-color: #000;
  color: #fff;
  border: none;
  margin: 1rem;
  border-radius: 0;
`;
export const PyodideText = styled.h1`
  color: #fff;
  margin: 0;
  padding: 0;
  padding-left: 1rem;
`;
