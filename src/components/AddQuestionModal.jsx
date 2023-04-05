import React from 'react';
import { Modal, Button } from 'antd';


const AddQuestionModal = ({
  visible,
  onCancel,
  onAddQuestion,
}) => {
  return (
    <Modal visible={visible} onCancel={onCancel} footer={null}>
      <h3>Select question type:</h3>
      <Button
        onClick={() => onAddQuestion('TEXT')}
        style={{ marginRight: '10px' }}
      >
        Text
      </Button>
      <Button
        onClick={() => onAddQuestion('RADIO')}
        style={{ marginRight: '10px' }}
      >
        Radio
      </Button>
      <Button onClick={() => onAddQuestion('CHECKBOX')}>Checkbox</Button>
    </Modal>
  );
};

export default AddQuestionModal;
