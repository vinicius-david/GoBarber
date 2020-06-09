import React from 'react';
import { FiAlertOctagon, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';
import { useTransition } from 'react-spring';

import { ToastMessage, useToast } from '../../hooks/ToastContext';
import { Container, Toast } from './styles';

interface ToastContainerProps {
  messages: ToastMessage[];
};

const icons = {
  info: <FiInfo size={20} />,
  success: <FiCheckCircle size={20} />,
  error: <FiAlertOctagon size={20} />,
};

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const { removeToast } = useToast();

  const animatedMessages = useTransition(
    messages,
    (message) => message.id,
    {
      from: { right: '-10%', opacity: 0, transform: 'rotateZ(180deg)' },
      enter: { right: '0', opacity: 1, transform: 'rotateZ(360deg)' },
      leave: { right: '-10%', opacity: 0, transform: 'rotateZ(180deg)' },
    }
  );

  return (
    <Container>
      {animatedMessages.map(({ item, key, props }) => (
        <Toast key={key} style={props} type={item.type} >
          <div>
            <div>
              {icons[item.type]}
              <strong>{item.title}</strong>
            </div>

            {item.description && <p>{item.description}</p>}
          </div>

          <button type='button' onClick={() => removeToast(item.id)} >
            <FiX size={20} />
          </button>
        </Toast>
      ))}
    </Container>
  );
};

export default ToastContainer;
