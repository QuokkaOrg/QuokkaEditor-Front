import { ScrollInfo } from "codemirror";
import { CursorType } from "../../../types/ot";

interface RemoteCursorProps {
  cursorData: CursorType;
  editor: CodeMirror.Editor | null;
  scrollInfo: ScrollInfo;
}

const RemoteCursor: React.FC<RemoteCursorProps> = ({
  cursorData,
  editor,
  scrollInfo,
}) => {
  const { token, ch, line } = cursorData;

  if (editor) {
    const { left, top } = editor.charCoords({ ch, line }, "local");
    const linesGutter = editor.getGutterElement().children;
    const lineHeight = editor.defaultTextHeight();
    const editorNavBarHeight =
      document.getElementById("EditorNavBar")?.clientHeight;
    const editorFilesBarHeight =
      document.getElementById("FilesBar")?.clientHeight;
    return (
      <div
        id="remote-cursor"
        className="group absolute w-[1px] h-[19.5px] bg-red-500 z-10 flex"
        style={{
          left: `${left - scrollInfo.left + linesGutter[0].clientWidth}px`,
          top: `${
            top -
            scrollInfo.top +
            (editorNavBarHeight || 0) +
            (editorFilesBarHeight || 0)
          }px`,
        }}
      >
        &nbsp;
        <div
          className=" bg-red-700 border-red-700 border-2 absolute invisible group-hover:visible text-xs"
          style={{ top: `${-lineHeight}px` }}
        >
          {token}
        </div>
      </div>
    );
  }
  return null;
};

export default RemoteCursor;
