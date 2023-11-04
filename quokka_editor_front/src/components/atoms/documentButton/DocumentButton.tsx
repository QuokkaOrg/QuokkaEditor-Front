interface DocumentButtonProps {
  children?: React.ReactNode;
}

const DocumentButton: React.FC<DocumentButtonProps> = ({ children }) => {
  return (
    <button
      type="button"
      className=" m-1 mb-4 w-32 h-24 font-semibold text-lg rounded-md bg-[#20222B] text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]"
    >
      {children}
    </button>
  );
};

export default DocumentButton;
