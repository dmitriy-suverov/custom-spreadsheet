import { $, Dom } from "../../core/dom";
import { resizeAction } from "./table.actions";

export function resizeHandler(
  $root: Dom,
  resizeItem: "col" | "row"
): Promise<ReturnType<typeof resizeAction>["payload"]> {
  return new Promise(resolve => {
    const $resizer = $(event.target as HTMLElement);
    $resizer.css({ opacity: 1, bottom: "-100vh" });
    const resizeAttr = resizeItem === "col" ? "width" : "height";
    const $parent = $resizer.closest('[data-type="resizable"');
    const startCoords = $parent.getCoords();

    const columnSymbol = $parent.$el.dataset["columnIndex"];
    const columnCells = $root.findAll(`[data-col="${columnSymbol}"]`);

    let newValue: string;
    document.onmousemove = (e: MouseEvent) => {
      const delta = Math.floor(
        getEndResizableValue(e, resizeAttr) -
          geStartResizableValue(startCoords, resizeAttr)
      );
      newValue = startCoords[resizeAttr] + delta + "px";
      $resizer.css({
        [resizeAttr === "height" ? "bottom" : "right"]: -delta + "px"
      });
    };

    document.onmouseup = (e: MouseEvent) => {
      document.onmousemove = null;
      document.onmouseup = null;
      $parent.css({ [resizeAttr]: newValue });
      $resizer.css({ opacity: 0, bottom: 0, right: 0 });

      if (resizeItem === "col") {
        columnCells.forEach(($cell: HTMLElement) => {
          $cell.style.width = newValue;
        });
      }

      resolve({
        type: resizeItem,
        value: parseInt(newValue),
        id:
          resizeItem === "col"
            ? +$parent.data.columnIndex
            : +$parent.data.rowIndex
      });
    };
  });
}

function getEndResizableValue(e: MouseEvent, resizeAttr: "width" | "height") {
  return resizeAttr === "height" ? e.pageY : e.pageX;
}

function geStartResizableValue(
  startCoords: ClientRect | DOMRect,
  resizeAttr: "width" | "height"
) {
  return resizeAttr === "height" ? startCoords.bottom : startCoords.right;
}
