interface DocumentButtonProps {
  children?: React.ReactNode;
}

const DocumentButton: React.FC<DocumentButtonProps> = ({ children }) => {
  return (
    <button
      type="button"
      className=" m-1 w-32 h-24 font-semibold text-lg rounded-md bg-project-beige-800 drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] bg-[#20222B] text-white"
      >
      {children}
    </button>
  );
};

export default DocumentButton;
