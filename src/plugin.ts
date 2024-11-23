// Import Penpot plugin SDK
penpot.ui.open("Heroicons Plugin", `?theme=${penpot.theme}`);

penpot.ui.onMessage<string>((message) => {
  if (message.startsWith("add-icon:")) {
    const svgContent = message.replace("add-icon:", "");

    addIconToBoard(svgContent);
  }
});

// Event listener for theme change in Penpot
penpot.on("themechange", (theme) => {
  penpot.ui.sendMessage({
    source: "penpot",
    type: "themechange",
    theme,
  });
});

/**
 * Adds an icon to the Penpot board from provided SVG content.
 * @param svgContent The SVG content to create the icon from.
 */
function addIconToBoard(svgContent: string) {
  if (!svgContent.includes("<svg")) {
    console.error("Invalid SVG content received.");
    return;
  }

  const createdShape = penpot.createShapeFromSvg(svgContent);

  if (createdShape) {
    // Set the position to the viewport's center
    createdShape.x = penpot.viewport.center.x;
    createdShape.y = penpot.viewport.center.y;

    // Set the created shape as the currently selected element
    penpot.selection = [createdShape];
    console.log("Icon added to the Penpot board.");
  } else {
    console.error("Failed to create the shape from the SVG content.");
  }
}