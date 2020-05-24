import { DEFAULT_STYLES } from "../../constants";

interface ToolbarButton {
  icon: string;
  isActive: boolean;
  value: {
    textAlign?: "left" | "center" | "right";
    fontWeight?: "bold" | "normal";
    fontStyle?: "italic" | "normal";
    textDecoration?: "underline" | "none";
  };
}

export function createToolbar(state: typeof DEFAULT_STYLES) {
  console.log("createToolbar -> state", state)
  const buttons: ToolbarButton[] = [
    {
      icon: "format_align_left",
      isActive: state["textAlign"] === "left",
      value: {
        textAlign: "left"
      }
    },
    {
      icon: "format_align_center",
      isActive: state["textAlign"] === "center",
      value: {
        textAlign: "center"
      }
    },
    {
      icon: "format_align_right",
      isActive: state["textAlign"] === "right",
      value: {
        textAlign: "right"
      }
    },
    {
      icon: "format_bold",
      isActive: state["fontWeight"] === "bold",
      value: {
        fontWeight: state["fontWeight"] !== "bold" ? "bold" : "normal"
      }
    },
    {
      icon: "format_italic",
      isActive: state["fontStyle"] === "italic",
      value: {
        fontStyle: state["fontStyle"] !== "italic" ? "italic" : "normal"
      }
    },
    {
      icon: "format_underlined",
      isActive: state["textDecoration"] === "underline",
      value: {
        textDecoration:
          state["textDecoration"] !== "underline" ? "underline" : "none"
      }
    }
  ];
  return buttons
    .map(({ icon, isActive, value }) => createButton(icon, isActive, value))
    .join("");
}

function createButton(
  icon: string,
  isActive: boolean,
  value: ToolbarButton["value"]
): string {
  const dataAttrs = `
  data-type="tb-button"
  data-value='${JSON.stringify(value)}'
  `;

  return `
  <div class="button ${isActive && "active"}" ${dataAttrs}>
    <i class="material-icons" ${dataAttrs}>${icon}</i>
  </div>`;
}
