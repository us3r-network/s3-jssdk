import { checkCreateMaterialSymbolsLinkToHead } from "../../../utils/materialSymbols";

export default function DeleteIcon() {
  checkCreateMaterialSymbolsLinkToHead();
  return <span className="material-symbols-outlined">delete</span>;
}
