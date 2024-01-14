import { ScrollInfo } from "codemirror";
import { CursorType } from "../../types/ot";
import { RemoteClient } from "../../Redux/clientsSlice";

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
  const { username, user_token, ch, line, clientColor } = cursorData;
  if (!editor) return null;
  const { left, top } = editor.charCoords({ ch, line }, "local");
  const linesGutter = editor.getGutterElement().children;
  const lineHeight = editor.defaultTextHeight();
  const editorNavBarHeight =
    document.getElementById("EditorNavBar")?.clientHeight;
  const editorFilesBarHeight =
    document.getElementById("FilesBar")?.clientHeight;
  const adjustedTop =
    top -
    scrollInfo.top +
    (editorNavBarHeight || 0) +
    (editorFilesBarHeight || 0);
  const adjustedLeft = left - scrollInfo.left + linesGutter[0].clientWidth;
  return (
    <div
      id="remote-cursor"
      className={`group absolute w-[1.5px] h-[19.5px] z-10 flex ${
        adjustedTop > window.innerHeight || adjustedLeft > window.innerWidth
          ? "hidden"
          : "visible"
      }`}
      style={{
        left: `${adjustedLeft}px`,
        top: `${adjustedTop}px`,
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
        {username}
      </div>
    </div>
  );
};

export default RemoteCursor;
