import { useState } from 'react';
import styled from 'styled-components';

const Card = styled.div`
  border-radius: 12px;
  transition: box-shadow 0.2s ease;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
  position: relative;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  }
`;

const Title = styled.h3`
  margin: 0px;
  font-size: 16px;
  font-weight: 600;
  color: #18181b;
`;

const Description = styled.p`
  color: #9e9eaaff;
  margin: 0px;
  font-size: 14px;
`;

const BlackOpacityOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  transition: opacity 0.2s ease;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 200px;
  border-radius: 12px 12px 0 0;
  object-fit: cover;
  object-position: center;
`;

const TitleContainer = styled.div`
  padding: 4px 12px 8px 12px;
`;

export const CardContent = ({ title, description, image }: { title: string; description: string; image: string }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Card onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {hovered && <BlackOpacityOverlay />}
      <Thumbnail src={image} alt={title} />
      <TitleContainer>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </TitleContainer>
    </Card>
  );
};
