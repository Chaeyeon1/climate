import { styled } from 'styled-components';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Modal } from './Modal';

const SubText = styled.p`
  font-size: 12px;
  margin: 0px;
`;

const MailLink = styled.a`
  color: #18181b;
  text-decoration: underline;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }
`;

export const LoginModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <Modal.ModalContainer>
      <Modal.ModalContent>
        <Modal.ModalHeader>
          <h2 style={{ margin: '0px' }}>로그인</h2>
          <button
            onClick={onClose}
            style={{
              float: 'right',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#18181B',
            }}
          >
            <img src="/close.svg" alt="Close" />
          </button>
        </Modal.ModalHeader>
        <form>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <Input placeholder="이메일" />
            <Input placeholder="비밀번호" type="password" />
            <Button type="submit">로그인</Button>
          </div>
        </form>
        <Modal.ModalFooter>
          <SubText>계정이 없으신가요?</SubText>
          <SubText>
            <MailLink>관리자에게 계정 요청</MailLink>을 통해 아이디/비밀번호를 받으셔야 합니다.
          </SubText>
        </Modal.ModalFooter>
      </Modal.ModalContent>
    </Modal.ModalContainer>
  );
};
