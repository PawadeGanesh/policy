import React from 'react';
//import './App.css';
import Modal from './Modal';
import Auditdetails from './Auditdetails'

function Modalmain() {
  const modalRef = React.useRef();

  const openModal = () => {
    modalRef.current.openModal()
  };

  return (
    <div className="App">
      <button onClick={openModal} className="show-audit-details" hidden="true">Show Audit Details</button>
      <Modal ref={modalRef}>
      <button onClick={() => modalRef.current.close()} className="modal-close">x</button>
      <Auditdetails />
      </Modal>
    </div>
  );
}

export default Modalmain;
