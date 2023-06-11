interface ButtonProps {
  handler: () => void;
  buttonName: string;
  buttonType: "button" | "submit" | "reset" | undefined;
}

const CRUDButton: React.FC<ButtonProps> = ({
  handler,
  buttonName,
  buttonType,
}) => {
  return (
    <button name={buttonName} type={buttonType} onClick={handler}>
      {buttonName}
    </button>
  );
};

export default CRUDButton;
