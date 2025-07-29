import { styled } from 'styled-components';

// 로그인 모달
const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10000;
`;
const ModalContent = styled.div`
  background-color: #ffffff;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 16px;
  flex-direction: column;
  z-index: 10000;
`;

const ModalFooter = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  font-size: 12px;
  color: #52525b;
`;

export const Modal = {
  ModalContainer,
  ModalHeader,
  ModalContent,
  ModalFooter,
};
