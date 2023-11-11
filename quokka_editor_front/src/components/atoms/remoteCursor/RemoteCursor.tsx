import { ScrollInfo } from "codemirror";
import { CursorType } from "../../../types/ot";
import { RemoteClient } from "../../../Redux/clientsSlice";

interface RemoteCursorProps {
  cursorData: RemoteClient;
  editor: CodeMirror.Editor | null;
  scrollInfo: ScrollInfo;
}

const RemoteCursor: React.FC<RemoteCursorProps> = ({
  cursorData,
  editor,
  scrollInfo,
}) => {
  const { token, ch, line, clientColor } = cursorData;

  if (!editor) return null;
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
      className={`group absolute w-[1px] h-[19.5px] z-10 flex`}
      style={{
        left: `${left - scrollInfo.left + linesGutter[0].clientWidth}px`,
        top: `${
          top -
          scrollInfo.top +
          (editorNavBarHeight || 0) +
          (editorFilesBarHeight || 0)
        }px`,
        backgroundColor: clientColor,
      }}
    >
      &nbsp;
      <div
        className={` border-2 absolute invisible group-hover:visible text-xs`}
        style={{
          top: `${-lineHeight}px`,
          backgroundColor: clientColor,
          borderColor: clientColor,
        }}
      >
        {token}
      </div>
    </div>
  );
};

export default RemoteCursor;
