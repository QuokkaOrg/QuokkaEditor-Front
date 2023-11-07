import { useState } from "react"

interface DocumentTitleUpdateProps {
    title: string
}

const DocumentTitleUpdate: React.FC<DocumentTitleUpdateProps> = ({title}) => {
    const [isEditable, setIsEditable] = useState<boolean>(false)
    const [newTitle, setNewTitle] = useState<string>(title);

    return (
        <div className={`${isEditable ? "h-screen" : null}`} onClick={() => setIsEditable(currEditable => !currEditable)}>
        {isEditable ? 
            <input 
                className="border-slate-300 text-black" 
                type="text" 
                name="titleInput" 
                value={newTitle} 
                onChange={(e)=> setNewTitle(e.target.value)}
                onSubmit={() =>console.log("enter")}
            /> : 
            <span onClick={() => setIsEditable(currEditable => !currEditable)}>{title}</span>}
        </div>
    )
}

export default DocumentTitleUpdate;