import "./style.css";
import { iconNames } from "./icons"; // Import the list of icons

// Directory paths for icons
const iconDirectories = {
  solid: "/assets/icons/solid/",
  outline: "/assets/icons/outline/",
};

// State management for icon mode
let currentIconMode: "solid" | "outline" = "solid";

document.addEventListener("DOMContentLoaded", () => {
  initializePlugin();
});

/**
 * Initializes the plugin UI and loads the necessary event listeners.
 */
function initializePlugin() {
  const searchBox = document.getElementById("search-box") as HTMLInputElement;
  const iconContainer = document.getElementById("icon-container") as HTMLElement;
  const solidTab = document.getElementById("solid-tab") as HTMLElement;
  const outlineTab = document.getElementById("outline-tab") as HTMLElement;

  if (!searchBox || !iconContainer || !solidTab || !outlineTab) {
    console.error("Required elements are missing in the DOM.");
    return;
  }

  // Setup tab switching functionality
  setupTabSwitching(solidTab, outlineTab);

  // Load all icons on startup
  loadAllIcons(iconContainer);

  // Setup search box for icon filtering
  setupSearchBox(searchBox, iconContainer);
}

/**
 * Sets up tab switching between solid and outline icons.
 * @param solidTab The DOM element for the solid tab.
 * @param outlineTab The DOM element for the outline tab.
 */
function setupTabSwitching(solidTab: HTMLElement, outlineTab: HTMLElement) {
  solidTab.addEventListener("click", () => switchIconMode("solid", solidTab, outlineTab));
  outlineTab.addEventListener("click", () => switchIconMode("outline", outlineTab, solidTab));
}

/**
 * Switches the icon mode and updates the UI accordingly.
 * @param mode The icon mode to switch to ('solid' or 'outline').
 * @param activeTab The tab to set as active.
 * @param inactiveTab The tab to set as inactive.
 */
function switchIconMode(mode: "solid" | "outline", activeTab: HTMLElement, inactiveTab: HTMLElement) {
  currentIconMode = mode;
  activeTab.classList.add("active-tab");
  inactiveTab.classList.remove("active-tab");

  const iconContainer = document.getElementById("icon-container") as HTMLElement;
  loadAllIcons(iconContainer);
}

/**
 * Sets up the search box for filtering icons.
 * @param searchBox The search box element.
 * @param iconContainer The container where icons are displayed.
 */
function setupSearchBox(searchBox: HTMLInputElement, iconContainer: HTMLElement) {
  searchBox.addEventListener("input", () => {
    const query = searchBox.value.toLowerCase().trim();
    iconContainer.innerHTML = ""; // Clear the icon container

    if (query.length > 0) {
      filterIcons(query, iconContainer);
    } else {
      loadAllIcons(iconContainer);
    }
  });
}

/**
 * Loads all icons into the icon container.
 * @param iconContainer The container where icons are displayed.
 */
function loadAllIcons(iconContainer: HTMLElement) {
  console.log("Loading all icons...");
  iconContainer.innerHTML = ""; // Clear icon container
  displayIcons(iconNames, iconContainer);
}

/**
 * Filters icons based on a search query and displays the results.
 * @param query The search query to filter icons.
 * @param iconContainer The container where icons are displayed.
 */
function filterIcons(query: string, iconContainer: HTMLElement) {
  console.log(`Searching for icons with query: "${query}"`);
  const matchingIcons = iconNames.filter((iconName) => iconName.includes(query));
  displayIcons(matchingIcons, iconContainer);
}

/**
 * Displays a list of icons in the icon container.
 * @param iconList The list of icon names to display.
 * @param iconContainer The container where icons are displayed.
 */
function displayIcons(iconList: string[], iconContainer: HTMLElement) {
  console.log(`Displaying ${iconList.length} icons...`);

  if (iconList.length === 0) {
    console.warn("No icons to display.");
    return;
  }

  const iconDirectory = iconDirectories[currentIconMode];

  iconList.forEach((iconName) => {
    const iconElement = createIconElement(iconName, iconDirectory);
    iconContainer.appendChild(iconElement);
  });
}

/**
 * Creates an icon element for the given icon name.
 * @param iconName The name of the icon.
 * @param iconDirectory The directory path where the icon is located.
 * @returns The created icon element.
 */
function createIconElement(iconName: string, iconDirectory: string): HTMLElement {
  const iconElement = document.createElement("div");
  iconElement.classList.add("icon-item");
  iconElement.setAttribute("title", iconName.replace(".svg", "")); // Tooltip with icon name

  // Create an <img> element to directly reference the SVG file
  const iconImg = document.createElement("img");
  const iconPath = `${iconDirectory}${iconName}`;
  console.log(`Setting image source to: ${iconPath}`);

  iconImg.src = iconPath;
  iconImg.alt = iconName.replace(".svg", "");
  iconImg.style.width = "100%";
  iconImg.style.height = "100%";

  // Append the image to the icon container
  iconElement.appendChild(iconImg);

  // Add click event to handle inserting the icon into the Penpot board
  iconElement.addEventListener("click", async () => addIconToPenpot(iconPath, iconName));

  return iconElement;
}

/**
 * Sends a message to plugin.ts to add an icon to the Penpot board.
 * @param iconPath The path of the icon to be added.
 * @param iconName The name of the icon.
 */
async function addIconToPenpot(iconPath: string, iconName: string) {
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
}