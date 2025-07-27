import { TabType } from '@/pages';
import { useState } from 'react';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
  align-items: center;
  gap: 20px;
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ active }) => (active ? '#18181B' : '#9CA3AF')};
  border-bottom: ${({ active }) => (active ? '2px solid #18181B' : '2px solid transparent')};
  cursor: pointer;
  border-radius: 0;
  &:hover {
    color: #18181b;
  }
`;

const TabWrapper = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
`;

const Login = styled.button`
  color: #ffffff;
  background-color: #18181b;
  cursor: pointer;
  height: 32px;
  font-size: 12px;
  padding: 4px 16px;
`;
const Logout = styled.button`
  color: #18181b;
  border: 1px solid #18181b;
  background-color: transparent;
  cursor: pointer;
  height: 32px;
  font-size: 12px;
  padding: 4px 16px;
`;

// 로그인 모달
const Modal = styled.div`
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
`;

const ModalFooter = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  font-size: 12px;
  color: #52525b;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: text;
`;
const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #18181b;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #111111;
  }
`;

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

const LoginModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <Modal>
      <ModalContent>
        <ModalHeader>
          <h2 style={{ margin: '0px' }}>로그인</h2>
          <button
            onClick={onClose}
            style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', color: '#18181b' }}
          >
            <img src="/close.svg" alt="Close" style={{ width: '16px', height: '16px' }} />
          </button>
        </ModalHeader>
        <form>
          <Input placeholder="이메일" />
          <Input placeholder="비밀번호" type="password" />
          <Button type="submit">로그인</Button>
        </form>
        <ModalFooter>
          <SubText>계정이 없으신가요?</SubText>
          <SubText>
            <MailLink>관리자에게 계정 요청</MailLink>을 통해 아이디/비밀번호를 받으셔야 합니다.
          </SubText>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const TabMenu = ({ active, onChange }: { active: TabType; onChange: (tab: TabType) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <Header>
      Climate
      <TabWrapper>
        <Tab active={active === 'inventory'} onClick={() => onChange('inventory')}>
          인벤토리
        </Tab>
        <Tab active={active === 'cardnews'} onClick={() => onChange('cardnews')}>
          카드뉴스
        </Tab>
        <Tab active={active === 'map'} onClick={() => onChange('map')}>
          환경지표
        </Tab>
      </TabWrapper>
      {false ? (
        <>
          <span>신채연님</span>
          <Logout>로그아웃</Logout>
        </>
      ) : (
        <Login onClick={() => setOpen(true)}>로그인</Login>
      )}
      {/* 로그인 모달 컴포넌트 */}
      {open && <LoginModal onClose={() => setOpen(false)} />}
    </Header>
  );
};
