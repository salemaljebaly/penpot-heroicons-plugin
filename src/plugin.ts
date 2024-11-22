penpot.ui.open("Heroicons", `?theme=${penpot.theme}`);

// Listener for messages from the UI
penpot.ui.onMessage<string>((message) => {
  if (message.startsWith("insert-icon:")) {
    const svgContent = message.split("insert-icon:")[1];
    const iconName = "Heroicon";  // You can also extract a meaningful name if available

    // Create a shape from the SVG content
    const icon = penpot.createShapeFromSvg(svgContent);

    if (icon) {
      // Set the name for the new shape
      icon.name = iconName;

      // Position the icon at the center of the viewport
      icon.x = penpot.viewport.center.x;
      icon.y = penpot.viewport.center.y;

      // Select the newly added icon
      penpot.selection = [icon];
    } else {
      console.error("Failed to create shape from SVG.");
    }
  }
});

// Update the theme in the iframe (as it is)
penpot.on("themechange", (theme) => {
  penpot.ui.sendMessage({
    source: "penpot",
    type: "themechange",
    theme,
  });
});