interface ModalProps {
  children: React.ReactNode;
  setShowModal: (value: boolean) => void;
}
//TODO title input
const Modal: React.FC<ModalProps> = ({ children, setShowModal }) => {
  return (
    <>
      <div
        className="absolute z-10 h-screen w-screen bg-slate-900 top-0 left-0 opacity-40 "
        onClick={() => setShowModal(false)}
      ></div>
      <div className="absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-2/5 bg-project-beige-500 rounded-2xl">
        {children}
      </div>
    </>
  );
};

export default Modal;
