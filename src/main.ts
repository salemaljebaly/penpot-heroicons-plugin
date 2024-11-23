import "./style.css";
import { iconNames } from "./icons"; // Import the list of icons

const solidIconDirectory = "/assets/icons/solid/"; // Relative path from the server root

document.addEventListener("DOMContentLoaded", async () => {
  const searchBox = document.getElementById("search-box") as HTMLInputElement;
  const iconContainer = document.getElementById("icon-container") as HTMLElement;

  if (!searchBox || !iconContainer) {
    console.error("Required elements are missing in the DOM.");
    return;
  }

  console.log("DOM fully loaded and parsed.");

  // Load all icons on startup
  loadAllIcons();

  // Add event listener to the search box to filter icons as user types
  searchBox.addEventListener("input", function () {
    const query = searchBox.value.toLowerCase().trim();
    iconContainer.innerHTML = ""; // Clear only the icons

    if (query.length > 0) {
      filterIcons(query);
    } else {
      loadAllIcons();
    }
  });

  // Function to load all icons initially
  function loadAllIcons() {
    console.log("Loading all icons...");
    iconContainer.innerHTML = ""; // Clear icon container before adding new icons
    displayIcons(iconNames);
  }

  // Function to filter and display icons based on search query
  function filterIcons(query: string) {
    console.log(`Searching for icons with query: "${query}"`);
    const matchingIcons = iconNames.filter((iconName) => iconName.includes(query));
    displayIcons(matchingIcons);
  }

  // Function to display a list of icons
  function displayIcons(iconList: string[]) {
    console.log(`Displaying ${iconList.length} icons...`);

    if (iconList.length === 0) {
      console.warn("No icons to display.");
      return;
    }

    iconList.forEach((iconName) => {
      const iconElement = document.createElement("div");
      iconElement.classList.add("icon-item");
      iconElement.setAttribute("title", iconName.replace('.svg', '')); // Tooltip with icon name

      // Create an <img> element to directly reference the SVG file
      const iconImg = document.createElement("img");
      const iconPath = `${solidIconDirectory}${iconName}`;
      console.log(`Setting image source to: ${iconPath}`);

      iconImg.src = iconPath; // Directly set the source to the SVG path
      iconImg.alt = iconName.replace('.svg', '');
      iconImg.style.width = "100%"; // Adjust size as needed
      iconImg.style.height = "100%";

      // Append the image to the icon container
      iconElement.appendChild(iconImg);
      iconContainer.appendChild(iconElement);

      // Add click event to handle inserting the icon into the Penpot board
      iconElement.addEventListener("click", async () => {
        console.log(`Icon selected: ${iconName}`);

        // Fetch the SVG content as text
        try {
          const response = await fetch(iconPath);
          if (!response.ok) {
            throw new Error(`Network response was not ok for ${iconName}`);
          }
          const svgContent = await response.text();

          if (svgContent.includes("<svg")) {
            // Send the SVG content to plugin.ts to be added to the Penpot board
            parent.postMessage(`add-icon:${svgContent}`, "*");
          } else {
            console.error("Invalid SVG content for icon:", iconName);
          }
        } catch (error) {
          console.error("Error fetching SVG content:", error);
        }
      });
    });
  }
});