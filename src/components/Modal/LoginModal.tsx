import { styled } from 'styled-components';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Modal } from './Modal';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

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

export const LoginModal = ({
  onClose,
  onLogin,
  isLoading,
}: {
  onClose: () => void;
  onLogin: ({ email, password, onClose }: { email: string; password: string; onClose: () => void }) => Promise<void>;
  isLoading: boolean;
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;

            if (!form.email.value || !form.password.value) {
              toast.error('이메일과 비밀번호를 입력해주세요.');
              return;
            }
            onLogin({
              email: form.email.value,
              password: form.password.value,
              onClose,
            });
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <Input name="email" placeholder="이메일" />
            <Input name="password" placeholder="비밀번호" type="password" />
            <Button disabled={isLoading} type="submit">
              로그인
            </Button>
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
