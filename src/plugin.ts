// Import Penpot plugin SDK
penpot.ui.open("Penpot plugin starter template", `?theme=${penpot.theme}`);

penpot.ui.onMessage<string>((message) => {
  if (message.startsWith("add-icon:")) {
    // Extract SVG content from the message
    const svgContent = message.replace("add-icon:", "");

    if (svgContent.includes("<svg")) {
      // Create the shape from SVG content using the Penpot API
      const createdShape = penpot.createShapeFromSvg(svgContent);

      if (createdShape) {
        // Set the position of the newly created shape to the viewport's center
        createdShape.x = penpot.viewport.center.x;
        createdShape.y = penpot.viewport.center.y;

        // Set the created shape as the currently selected element
        penpot.selection = [createdShape];
        console.log("Icon added to the Penpot board.");
      } else {
        console.error("Failed to create the shape from the SVG content.");
      }
    } else {
      console.error("Invalid SVG content received.");
    }
  }
});

// Update the theme in the iframe
penpot.on("themechange", (theme) => {
  penpot.ui.sendMessage({
    source: "penpot",
    type: "themechange",
    theme,
  });
});