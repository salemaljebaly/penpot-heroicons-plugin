import "./style.css";
import { iconNames } from "./icons"; // Import the list of icons

document.addEventListener("DOMContentLoaded", async () => {
  const searchBox = document.getElementById("search-box") as HTMLInputElement;
  const iconContainer = document.getElementById("icon-container") as HTMLElement;

  // Load all icons on startup
  loadAllIcons();

  searchBox.addEventListener("input", function () {
    const query = searchBox.value.toLowerCase().trim();
    iconContainer.innerHTML = ""; // Clear previous icons

    if (query.length > 0) {
      fetchIcons(query);
    } else {
      // Load all icons again if the search box is cleared
      loadAllIcons();
    }
  });

  function loadAllIcons() {
    iconContainer.innerHTML = ""; // Clear the container
    displayIcons(iconNames);
  }

  function fetchIcons(query: string) {
    const matchingIcons = iconNames.filter((iconName) => iconName.includes(query));
    displayIcons(matchingIcons);
  }

  function displayIcons(iconList: string[]) {
    const baseUrl = "https://raw.githubusercontent.com/tailwindlabs/heroicons/refs/heads/master/src/24/solid/";

    iconList.forEach((iconName) => {
      const iconElement = document.createElement("div");
      iconElement.classList.add("icon-item");
      iconElement.setAttribute("title", iconName.replace('.svg', '')); // Tooltip with icon name

      fetch(`${baseUrl}${iconName}`)
        .then((response) => response.text())
        .then((svg) => {
          // Modify the SVG color for visibility in UI
          const modifiedSvg = svg.replace(/fill=".*?"/g, 'fill="#777"'); // Changes color to a lighter gray
          iconElement.innerHTML = modifiedSvg;

          iconElement.addEventListener("click", () => {
            // Send the original SVG content to plugin.ts to insert into the canvas
            parent.postMessage(`insert-icon:${svg}`, "*");
          });

          iconContainer.appendChild(iconElement);
        })
        .catch((error) => {
          console.error(`Error fetching icon "${iconName}":`, error);
        });
    });
  }
});