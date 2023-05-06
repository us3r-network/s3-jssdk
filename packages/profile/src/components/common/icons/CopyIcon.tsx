import { checkCreateMaterialSymbolsLinkToHead } from "../../../utils/materialSymbols";

export default function CopyIcon() {
  checkCreateMaterialSymbolsLinkToHead();
  return <span className="material-symbols-outlined">content_copy</span>;
}
