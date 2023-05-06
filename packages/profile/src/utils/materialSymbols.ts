export function checkCreateMaterialSymbolsLinkToHead() {
  const href =
    "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0";
  const materialSymbolsLink = document.head.querySelector(
    `link[href="${href}"]`
  );

  if (!materialSymbolsLink) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
}
